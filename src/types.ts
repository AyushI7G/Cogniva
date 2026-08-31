export type ClassificationLevel = 'Public' | 'Internal' | 'Confidential' | 'Restricted';

export type Department = 'All' | 'Engineering' | 'HR' | 'Legal' | 'Finance' | 'Security' | 'Executive' | 'Sales';

export interface DocumentMetadata {
  department: Department;
  classification: ClassificationLevel;
  author?: string;
  category?: string;
  version?: string;
}

export interface DocumentChunk {
  id: string;
  docId: string;
  docName: string;
  chunkIndex: number;
  totalChunks: number;
  text: string;
  sectionHeader: string;
  pageNumber: number;
  tokenCount: number;
  embedding?: number[];
  embeddingSample?: number[];
  metadata: DocumentMetadata;
}

export interface EnterpriseDocument {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'md' | 'json';
  size: number;
  uploadDate: string;
  chunkCount: number;
  wordCount: number;
  summary: string;
  tags: string[];
  metadata: DocumentMetadata;
  status: 'ready' | 'indexing' | 'error';
  content?: string;
}

export type UserRoleId = 'super_admin' | 'security_officer' | 'hr_director' | 'eng_lead' | 'sales_rep' | 'guest';

export interface UserRole {
  id: UserRoleId;
  name: string;
  title: string;
  department: Department;
  allowedClassifications: ClassificationLevel[];
  allowedDepartments: Department[];
  avatar: string;
  color: string;
  description: string;
}

export interface Citation {
  id: string;
  docId: string;
  docName: string;
  sectionHeader: string;
  pageNumber: number;
  chunkId: string;
  similarityScore: number;
  snippet: string;
  fullText: string;
  department: Department;
  classification: ClassificationLevel;
}

export interface RagStageLatencies {
  intentDetectionMs: number;
  queryEmbeddingMs: number;
  vectorRetrievalMs: number; // Qdrant / Vector retrieval
  bm25HybridMs: number;      // BM25 / Lexical scoring
  rbacFilterMs: number;      // RBAC clearance & department filter
  rerankingMs: number;       // Deduplication & overlap suppression
  contextAssemblyMs: number; // Prompt & context compression
  llmRequestMs: number;      // LLM generation / synthesis
  totalLatencyMs: number;    // End-to-end total
}

export interface RagTelemetry {
  retrievalLatencyMs: number;
  generationLatencyMs: number;
  totalLatencyMs: number;
  stageLatencies?: RagStageLatencies;
  topKChunksRetrieved: number;
  filteredChunksCount?: number;
  deduplicatedChunksCount?: number;
  topKChunksUsed: number;
  deniedChunksCount?: number;
  similarityScores: {
    chunkId: string;
    docName: string;
    section: string;
    score: number;
    denseScore?: number;
    lexicalScore?: number;
    textPreview: string;
    passedFilter: boolean;
  }[];
  promptTokens: number;
  completionTokens: number;
  totalTokens?: number;
  embeddingModel: string;
  llmModel: string;
  assembledPrompt?: string;
  queryVectorSample?: number[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Citation[];
  telemetry?: RagTelemetry;
  error?: string;
  userRole?: UserRoleId;
  selectedDocs?: string[];
  queryRewritten?: string;
}

export interface PipelineSettings {
  topK: number;
  similarityThreshold: number;
  chunkSize: number;
  chunkOverlap: number;
  temperature: number;
  hybridSearchWeight: number; // 0 (pure dense) to 1 (pure lexical), default 0.25 (hybrid dense-heavy)
  enableQueryRewriting: boolean;
  systemPrompt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userRole: UserRoleId;
  action: 'query' | 'conversation' | 'document_upload' | 'document_delete' | 'chunk_access';
  queryText?: string;
  docsAccessed: string[];
  chunksMatched: number;
  status: 'allowed' | 'partially_filtered' | 'denied';
  deniedReasons?: string[];
}
