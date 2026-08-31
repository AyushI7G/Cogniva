import express from 'express';
import multer from 'multer';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import mammoth from 'mammoth';
import { ragEngine } from './server/ragEngine';
import { ClassificationLevel, Department, UserRoleId } from './src/types';

// PDF extraction helper function
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const pdf = await import('pdf-parse');
    const parseFn = (pdf as any).default || pdf;
    const data = await parseFn(buffer);
    return data.text || '';
  } catch (err) {
    // If binary pdf-parse has issue, clean text fallback
    const raw = buffer.toString('binary');
    const textBlocks: string[] = [];
    const streamMatches = raw.match(/\(([^)]+)\)\s*Tj/g);
    if (streamMatches) {
      for (const m of streamMatches) {
        const text = m.replace(/^\(/, '').replace(/\)\s*Tj$/, '');
        if (text.length > 1) textBlocks.push(text);
      }
    }
    if (textBlocks.length > 0) {
      return textBlocks.join(' ');
    }
    return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r]/g, ' ');
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB max file size
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // ===================== API ROUTES =====================

  // 1. Health & Status
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      documentsCount: ragEngine.documents.size,
      chunksCount: ragEngine.chunks.size,
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      embeddingModel: process.env.GEMINI_API_KEY ? 'gemini-embedding-2-preview' : '768-D Local Vector Encoder',
      llmModel: process.env.GEMINI_API_KEY ? 'gemini-3.7-flash' : 'Enterprise Local RAG Synthesizer'
    });
  });

  // 2. List Documents
  app.get('/api/documents', (req, res) => {
    const docs = Array.from(ragEngine.documents.values()).map(doc => ({
      ...doc,
      // Omit full raw text from listing for faster payload
      contentPreview: doc.content ? doc.content.substring(0, 300) : ''
    }));
    res.json({ documents: docs, totalChunks: ragEngine.chunks.size });
  });

  // 3. Get Document Chunks
  app.get('/api/documents/:id/chunks', (req, res) => {
    const docId = req.params.id;
    const doc = ragEngine.documents.get(docId);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const chunks = Array.from(ragEngine.chunks.values())
      .filter(c => c.docId === docId)
      .map(c => ({
        ...c,
        embeddingSample: c.embedding ? c.embedding.slice(0, 8) : []
      }));
    res.json({ document: doc, chunks });
  });

  // 4. Upload & Ingest Document (PDF, DOCX, TXT, MD, JSON)
  app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      const department = (req.body.department as Department) || 'Engineering';
      const classification = (req.body.classification as ClassificationLevel) || 'Internal';
      const author = req.body.author || 'Uploaded Document';
      const category = req.body.category || 'Uploaded Assets';
      const customSummary = req.body.summary;
      const tags = req.body.tags ? (typeof req.body.tags === 'string' ? req.body.tags.split(',').map((t: string) => t.trim()) : req.body.tags) : [];

      let extractedText = '';
      let fileType: 'pdf' | 'docx' | 'txt' | 'md' | 'json' = 'txt';
      let fileName = 'document.txt';
      let fileSize = 0;

      if (file) {
        fileName = file.originalname;
        fileSize = file.size;
        const ext = path.extname(fileName).toLowerCase();

        if (ext === '.pdf') {
          fileType = 'pdf';
          extractedText = await extractPdfText(file.buffer);
        } else if (ext === '.docx' || ext === '.doc') {
          fileType = 'docx';
          const docxResult = await mammoth.extractRawText({ buffer: file.buffer });
          extractedText = docxResult.value;
        } else if (ext === '.md' || ext === '.markdown') {
          fileType = 'md';
          extractedText = file.buffer.toString('utf-8');
        } else if (ext === '.json') {
          fileType = 'json';
          try {
            const parsed = JSON.parse(file.buffer.toString('utf-8'));
            extractedText = typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2);
          } catch {
            extractedText = file.buffer.toString('utf-8');
          }
        } else {
          fileType = 'txt';
          extractedText = file.buffer.toString('utf-8');
        }
      } else if (req.body.text) {
        // Direct manual text entry
        extractedText = req.body.text;
        fileName = req.body.name || 'Pasted_Knowledge_Doc.md';
        fileType = (req.body.type as any) || 'md';
        fileSize = Buffer.byteLength(extractedText, 'utf-8');
      } else {
        return res.status(400).json({ error: 'No file uploaded or text provided' });
      }

      // Clean extracted text
      extractedText = extractedText.replace(/\r\n/g, '\n').replace(/\t/g, '  ').trim();

      if (!extractedText || extractedText.length < 15) {
        return res.status(400).json({ error: 'Document does not contain readable text or is empty.' });
      }

      const newDoc = await ragEngine.addDocument(
        fileName,
        fileType,
        extractedText,
        fileSize,
        {
          department,
          classification,
          author,
          category,
          summary: customSummary,
          tags
        }
      );

      res.json({
        success: true,
        document: newDoc,
        message: `Successfully processed "${fileName}" into ${newDoc.chunkCount} vector embeddings.`
      });
    } catch (error) {
      console.error('Error uploading/processing document:', error);
      res.status(500).json({ error: `Failed to process document: ${(error as Error).message}` });
    }
  });

  // 5. Delete Document
  app.delete('/api/documents/:id', (req, res) => {
    const success = ragEngine.deleteDocument(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ success: true, message: 'Document and vector embeddings deleted.' });
  });

  // 6. Reset to Default Enterprise Knowledge Base
  app.post('/api/documents/reset-defaults', async (req, res) => {
    try {
      await ragEngine.initializeDefaultKnowledgeBase();
      res.json({
        success: true,
        message: 'Successfully reloaded default enterprise documents.',
        documentsCount: ragEngine.documents.size,
        chunksCount: ragEngine.chunks.size
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // 7. Execute Full RAG Query
  app.post('/api/rag/query', async (req, res) => {
    try {
      const { query, userRole, selectedDocIds, departmentFilter, customSettings } = req.body;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query string is required' });
      }

      const role: UserRoleId = userRole || 'super_admin';

      const result = await ragEngine.executeRagQuery(query, role, {
        selectedDocIds,
        departmentFilter,
        customSettings
      });

      res.json(result);
    } catch (error) {
      console.error('RAG Query Execution Error:', error);
      res.status(500).json({ error: `RAG Pipeline execution failed: ${(error as Error).message}` });
    }
  });

  // 8. Raw Vector Search (for Pipeline Studio and Vector Vault inspection)
  app.post('/api/rag/vector-search', async (req, res) => {
    try {
      const { query, userRole, topK, similarityThreshold, selectedDocIds, departmentFilter, hybridWeight } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const results = await ragEngine.searchVectorStore(query, {
        userRole: userRole || 'super_admin',
        topK: topK || 6,
        similarityThreshold: similarityThreshold ?? 0.2,
        selectedDocIds,
        departmentFilter,
        hybridWeight: hybridWeight ?? 0.3
      });

      res.json(results);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // 9. Pipeline Telemetry & Stats
  app.get('/api/rag/telemetry', (req, res) => {
    let totalTokens = 0;
    let totalWords = 0;
    ragEngine.chunks.forEach(chunk => {
      totalTokens += chunk.tokenCount;
      totalWords += chunk.text.split(/\s+/).length;
    });

    res.json({
      totalDocuments: ragEngine.documents.size,
      totalChunks: ragEngine.chunks.size,
      totalTokensIndexed: totalTokens,
      totalWordsIndexed: totalWords,
      vectorDimensions: 768,
      embeddingModel: process.env.GEMINI_API_KEY ? 'gemini-embedding-2-preview' : '768-D Vector Encoder',
      llmModel: process.env.GEMINI_API_KEY ? 'gemini-3.7-flash' : 'Enterprise Local RAG Synthesizer',
      auditLogsCount: ragEngine.auditLogs.length,
      currentSettings: ragEngine.defaultSettings
    });
  });

  // 10. Audit Logs
  app.get('/api/rag/audit-logs', (req, res) => {
    res.json({
      logs: ragEngine.auditLogs.slice(0, 100),
      totalLogs: ragEngine.auditLogs.length
    });
  });

  // 11. Update Global Pipeline Settings
  app.post('/api/rag/settings', (req, res) => {
    ragEngine.defaultSettings = {
      ...ragEngine.defaultSettings,
      ...req.body
    };
    res.json({ success: true, settings: ragEngine.defaultSettings });
  });

  // ===================== VITE MIDDLEWARE SETUP =====================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise RAG Assistant Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
