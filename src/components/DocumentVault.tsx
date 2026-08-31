import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  Plus,
  Trash2,
  Layers,
  Search,
  CheckCircle,
  RefreshCw,
  X,
  Eye,
  AlertCircle
} from 'lucide-react';
import {
  ClassificationLevel,
  Department,
  DocumentChunk,
  EnterpriseDocument,
  UserRole
} from '../types';
import { formatFileSize, getClassificationBadgeColor, getDepartmentBadgeColor } from '../utils/ragHelpers';

interface DocumentVaultProps {
  documents: EnterpriseDocument[];
  onUploadDocument: (formData: FormData) => Promise<void>;
  onAddTextDocument: (data: {
    name: string;
    type: 'txt' | 'md' | 'json';
    text: string;
    department: Department;
    classification: ClassificationLevel;
    author: string;
    category: string;
    summary?: string;
  }) => Promise<void>;
  onDeleteDocument: (id: string) => Promise<void>;
  onResetDefaults: () => Promise<void>;
  currentRole: UserRole;
  isUploading: boolean;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents,
  onUploadDocument,
  onAddTextDocument,
  onDeleteDocument,
  onResetDefaults,
  currentRole,
  isUploading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [classificationFilter, setClassificationFilter] = useState<string>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocForChunks, setSelectedDocForChunks] = useState<EnterpriseDocument | null>(null);
  const [docChunks, setDocChunks] = useState<DocumentChunk[]>([]);
  const [loadingChunks, setLoadingChunks] = useState(false);

  // Upload Form State
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('');
  const [docText, setDocText] = useState('');
  const [docType, setDocType] = useState<'txt' | 'md' | 'json'>('md');
  const [docDepartment, setDocDepartment] = useState<Department>('Engineering');
  const [docClassification, setDocClassification] = useState<ClassificationLevel>('Internal');
  const [docAuthor, setDocAuthor] = useState('');
  const [docCategory, setDocCategory] = useState('');
  const [docSummary, setDocSummary] = useState('');

  // Handle Drag & Drop
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadMode === 'file') {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('department', docDepartment);
      formData.append('classification', docClassification);
      formData.append('author', docAuthor || currentRole.name);
      formData.append('category', docCategory || `${docDepartment} Documentation`);
      if (docSummary) formData.append('summary', docSummary);

      await onUploadDocument(formData);
      setIsUploadModalOpen(false);
      resetForm();
    } else {
      if (!docName || !docText) return;
      await onAddTextDocument({
        name: docName.endsWith(`.${docType}`) ? docName : `${docName}.${docType}`,
        type: docType,
        text: docText,
        department: docDepartment,
        classification: docClassification,
        author: docAuthor || currentRole.name,
        category: docCategory || `${docDepartment} Documentation`,
        summary: docSummary
      });
      setIsUploadModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDocName('');
    setDocText('');
    setDocAuthor('');
    setDocCategory('');
    setDocSummary('');
  };

  const fetchDocumentChunks = async (doc: EnterpriseDocument) => {
    setSelectedDocForChunks(doc);
    setLoadingChunks(true);
    try {
      const res = await fetch(`/api/documents/${doc.id}/chunks`);
      const data = await res.json();
      setDocChunks(data.chunks || []);
    } catch (err) {
      console.error('Failed to fetch document chunks:', err);
    } finally {
      setLoadingChunks(false);
    }
  };

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = departmentFilter === 'All' || doc.metadata.department === departmentFilter;
    const matchesClass = classificationFilter === 'All' || doc.metadata.classification === classificationFilter;

    return matchesSearch && matchesDept && matchesClass;
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[rgb(96,60,96)] p-6 rounded-2xl border border-black/15 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-white" />
            Document Knowledge Base
          </h2>
          <p className="text-xs text-white/90 font-medium mt-1">
            Documents parsed, chunked, and indexed with 768-D dense embeddings for sub-second semantic retrieval.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black hover:bg-black/80 text-white text-xs font-semibold border border-white/25 transition-colors cursor-pointer"
            title="Reload verified sample documents"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
            <span>Restore Default Docs</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-black/80 text-white text-xs font-bold shadow-md transition-all cursor-pointer border border-white/20"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Ingest Document</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[rgb(96,60,96)] p-3 rounded-2xl border border-black/15 text-xs shadow-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-white absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search documents by name, summary, tags..."
            className="w-full bg-black border border-white/30 text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-white text-xs font-medium placeholder-white/70"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="bg-black border border-white/30 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-white text-xs font-semibold cursor-pointer"
          >
            <option value="All" className="bg-[rgb(96,60,96)] text-white">All Departments</option>
            <option value="Security" className="bg-[rgb(96,60,96)] text-white">Security</option>
            <option value="Engineering" className="bg-[rgb(96,60,96)] text-white">Engineering</option>
            <option value="HR" className="bg-[rgb(96,60,96)] text-white">Human Resources</option>
            <option value="Sales" className="bg-[rgb(96,60,96)] text-white">Sales</option>
            <option value="Legal" className="bg-[rgb(96,60,96)] text-white">Legal</option>
            <option value="Finance" className="bg-[rgb(96,60,96)] text-white">Finance</option>
            <option value="Executive" className="bg-[rgb(96,60,96)] text-white">Executive</option>
          </select>

          <select
            value={classificationFilter}
            onChange={e => setClassificationFilter(e.target.value)}
            className="bg-black border border-white/30 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-white text-xs font-semibold cursor-pointer"
          >
            <option value="All" className="bg-[rgb(96,60,96)] text-white">All Classifications</option>
            <option value="Public" className="bg-[rgb(96,60,96)] text-white">Public</option>
            <option value="Internal" className="bg-[rgb(96,60,96)] text-white">Internal</option>
            <option value="Confidential" className="bg-[rgb(96,60,96)] text-white">Confidential</option>
            <option value="Restricted" className="bg-[rgb(96,60,96)] text-white">Restricted</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => {
          // Check if current role has clearance for this document
          const isPermitted =
            currentRole.allowedClassifications.includes(doc.metadata.classification) &&
            (currentRole.allowedDepartments.includes('All') ||
              currentRole.allowedDepartments.includes(doc.metadata.department));

          return (
            <div
              key={doc.id}
              className={`p-5 rounded-2xl bg-[rgb(96,60,96)] border transition-all flex flex-col justify-between group shadow-lg ${
                isPermitted
                  ? 'border-black/20 hover:border-black'
                  : 'border-black/10 opacity-75'
              }`}
            >
              <div className="space-y-3">
                {/* Header badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getClassificationBadgeColor(doc.metadata.classification)}`}>
                      {doc.metadata.classification}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border bg-black text-white border-white/20`}>
                      {doc.metadata.department}
                    </span>
                  </div>

                  {!isPermitted && (
                    <span className="text-[10px] font-bold text-white flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-white/20">
                      <AlertCircle className="w-3 h-3" />
                      Locked for {currentRole.name}
                    </span>
                  )}
                </div>

                {/* Doc Title */}
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors flex items-start gap-2 line-clamp-2">
                    <FileText className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    {doc.name}
                  </h3>
                  <p className="text-xs text-white/90 font-medium line-clamp-3 mt-1.5 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                {/* Tags */}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 4).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[9px] px-2 py-0.5 rounded bg-black text-white font-semibold border border-white/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Details */}
              <div className="pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-white font-bold">{doc.chunkCount} Chunks</span>
                  <span className="text-white/60">•</span>
                  <span className="font-semibold">{formatFileSize(doc.size)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => fetchDocumentChunks(doc)}
                    className="p-1.5 rounded-lg hover:bg-black text-white transition-colors cursor-pointer"
                    title="Inspect Vector Chunks"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 rounded-lg hover:bg-black text-white transition-colors cursor-pointer"
                    title="Delete document and vector index"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ingestion Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-[rgb(96,60,96)] border border-black/30 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/20 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-white" />
                  Ingest Document into Vector Knowledge Base
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  Extracted text is automatically chunked, embedded, and tagged for RBAC retrieval.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 rounded-xl text-white hover:bg-black/30 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {/* Tab selector: Upload File vs Paste Text */}
              <div className="flex gap-2 p-1 bg-black rounded-xl border border-white/20 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    uploadMode === 'file'
                      ? 'bg-white text-black shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Upload File (PDF, DOCX, MD, TXT, JSON)
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('text')}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    uploadMode === 'text'
                      ? 'bg-white text-black shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Direct Markdown / Text Editor
                </button>
              </div>

              {uploadMode === 'file' ? (
                /* File Dropzone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    isDragging
                      ? 'border-white bg-black/80'
                      : selectedFile
                      ? 'border-white bg-black/60'
                      : 'border-white/30 hover:border-white bg-black/40'
                  }`}
                >
                  <input
                    type="file"
                    id="doc-file-input"
                    accept=".pdf,.docx,.doc,.txt,.md,.markdown,.json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="doc-file-input" className="cursor-pointer block space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/30 flex items-center justify-center text-white mx-auto shadow-md">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    {selectedFile ? (
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                          <CheckCircle className="w-4 h-4" />
                          {selectedFile.name}
                        </div>
                        <div className="text-xs text-white/80">
                          {formatFileSize(selectedFile.size)} • Ready for embedding extraction
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-white">
                          Click to browse or drag and drop files here
                        </div>
                        <div className="text-xs text-white/80">
                          Supports PDF, Word DOCX, Markdown, Plain Text, and JSON (up to 15MB)
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              ) : (
                /* Text Input */
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      value={docName}
                      onChange={e => setDocName(e.target.value)}
                      placeholder="e.g., Q3_Product_Roadmap_Specs"
                      required
                      className="w-full bg-black border border-white/25 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">
                      Document Body (Markdown formatted with # headers recommended)
                    </label>
                    <textarea
                      rows={6}
                      value={docText}
                      onChange={e => setDocText(e.target.value)}
                      placeholder="# Section Title&#10;Write or paste your company document content here..."
                      required
                      className="w-full bg-black border border-white/25 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-white font-mono resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Metadata Configuration */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">
                    Department Owner
                  </label>
                  <select
                    value={docDepartment}
                    onChange={e => setDocDepartment(e.target.value as Department)}
                    className="w-full bg-black border border-white/30 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-white font-medium cursor-pointer"
                  >
                    <option value="Engineering" className="bg-[rgb(96,60,96)] text-white">Engineering</option>
                    <option value="Security" className="bg-[rgb(96,60,96)] text-white">Security</option>
                    <option value="HR" className="bg-[rgb(96,60,96)] text-white">Human Resources</option>
                    <option value="Sales" className="bg-[rgb(96,60,96)] text-white">Sales</option>
                    <option value="Legal" className="bg-[rgb(96,60,96)] text-white">Legal</option>
                    <option value="Finance" className="bg-[rgb(96,60,96)] text-white">Finance</option>
                    <option value="Executive" className="bg-[rgb(96,60,96)] text-white">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-1">
                    Security Classification (RBAC)
                  </label>
                  <select
                    value={docClassification}
                    onChange={e => setDocClassification(e.target.value as ClassificationLevel)}
                    className="w-full bg-black border border-white/30 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-white font-medium cursor-pointer"
                  >
                    <option value="Public" className="bg-[rgb(96,60,96)] text-white">Public (All users & guests)</option>
                    <option value="Internal" className="bg-[rgb(96,60,96)] text-white">Internal (All active employees)</option>
                    <option value="Confidential" className="bg-[rgb(96,60,96)] text-white">Confidential (Dept & Security only)</option>
                    <option value="Restricted" className="bg-[rgb(96,60,96)] text-white">Restricted (Executive only)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-black hover:bg-black/80 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || (uploadMode === 'file' && !selectedFile) || (uploadMode === 'text' && (!docName || !docText))}
                  className="px-5 py-2 rounded-xl bg-black hover:bg-black/80 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed border border-white/30"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Chunking & Embedding...</span>
                    </>
                  ) : (
                    <span>Extract & Embed Chunks</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chunk Explorer Modal */}
      {selectedDocForChunks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-4xl max-h-[85vh] bg-[rgb(96,60,96)] border border-black/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/20 flex items-start justify-between bg-black/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${getClassificationBadgeColor(selectedDocForChunks.metadata.classification)}`}>
                    {selectedDocForChunks.metadata.classification}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-md border font-medium bg-black text-white border-white/20`}>
                    {selectedDocForChunks.metadata.department}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-white" />
                  {selectedDocForChunks.name}
                </h3>
                <p className="text-xs text-white/80">
                  {docChunks.length} vector chunks indexed into the Vector Store with 768-D representations.
                </p>
              </div>

              <button
                onClick={() => setSelectedDocForChunks(null)}
                className="p-2 rounded-xl text-white hover:bg-black/30 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Chunks List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingChunks ? (
                <div className="text-center py-12 text-white/80 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-white" />
                  <p className="text-xs">Loading chunk vector representations...</p>
                </div>
              ) : (
                docChunks.map((chunk, idx) => (
                  <div
                    key={chunk.id}
                    className="p-4 rounded-xl bg-black/40 border border-white/20 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="px-2 py-0.5 rounded bg-black text-white border border-white/30 font-bold">
                          Chunk #{idx + 1}
                        </span>
                        <span className="text-white font-semibold">
                          § {chunk.sectionHeader}
                        </span>
                      </div>
                      <div className="text-white/80 text-[11px]">
                        Est. Page {chunk.pageNumber} • {chunk.tokenCount} tokens
                      </div>
                    </div>

                    <p className="text-xs text-white whitespace-pre-wrap leading-relaxed font-sans font-normal p-3 rounded-lg bg-black/60 border border-white/15">
                      {chunk.text}
                    </p>

                    {/* Embedding Sample bar */}
                    {chunk.embeddingSample && (
                      <div className="text-[10px] text-white/80 flex items-center gap-2 pt-1">
                        <span className="font-mono">Vector Snapshot (dim 0..7):</span>
                        <div className="flex gap-1 font-mono text-[9px] text-white bg-black px-2 py-0.5 rounded border border-white/20">
                          {chunk.embeddingSample.map(v => v.toFixed(3)).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/20 bg-black/40 flex items-center justify-end">
              <button
                onClick={() => setSelectedDocForChunks(null)}
                className="px-4 py-2 rounded-xl bg-black text-white border border-white/30 hover:bg-black/80 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Chunk Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


