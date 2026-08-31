import React from 'react';
import { X, FileText, CheckCircle, Hash, Sparkles, BookOpen } from 'lucide-react';
import { Citation, EnterpriseDocument } from '../types';
import { getClassificationBadgeColor, getDepartmentBadgeColor } from '../utils/ragHelpers';

interface CitationDrawerProps {
  citation: Citation | null;
  document: EnterpriseDocument | null;
  onClose: () => void;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({
  citation,
  document,
  onClose
}) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl h-full bg-[rgb(96,60,96)] border-l border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250 text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/20 flex items-start justify-between bg-black/40">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-black text-white border border-white/30 text-xs font-mono font-bold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-white" />
                Citation Source
              </span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getClassificationBadgeColor(citation.classification)}`}>
                {citation.classification}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium border bg-black text-white border-white/20`}>
                {citation.department}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug flex items-center gap-2">
              <FileText className="w-5 h-5 text-white shrink-0" />
              {citation.docName}
            </h2>
            <div className="text-xs text-white/80 flex items-center gap-3">
              <span>Section: <strong className="text-white">{citation.sectionHeader}</strong></span>
              <span>•</span>
              <span>Page: <strong className="text-white">{citation.pageNumber}</strong></span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white hover:bg-black/30 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Similarity & Retrieval Relevance Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/20 space-y-2 shadow-md">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-white" />
                Hybrid Semantic Similarity Score
              </span>
              <span className="text-white font-mono font-bold px-2 py-0.5 rounded bg-black border border-white/25">
                {citation.similarityScore.toFixed(3)}
              </span>
            </div>
            <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/20">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, citation.similarityScore * 100))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/80">
              <span>Chunk ID: {citation.chunkId}</span>
              <span className="text-white font-semibold">Passes Grounding Threshold</span>
            </div>
          </div>

          {/* Extracted Exact Chunk Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-white" />
                Retrieved Context Chunk (Fed into LLM)
              </h3>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/20 text-white text-sm leading-relaxed whitespace-pre-wrap font-sans font-normal selection:bg-black selection:text-white">
              {citation.fullText}
            </div>
          </div>

          {/* Document Metadata Details */}
          {document && (
            <div className="space-y-3 pt-4 border-t border-white/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Document Manifest & Metadata
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/20">
                  <div className="text-white/70 text-[11px]">Author / Custodian</div>
                  <div className="text-white font-medium mt-0.5">{document.metadata.author || 'Corporate Vault'}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/20">
                  <div className="text-white/70 text-[11px]">Category</div>
                  <div className="text-white font-medium mt-0.5">{document.metadata.category || 'Standard Knowledge'}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/20">
                  <div className="text-white/70 text-[11px]">Total Chunks Indexed</div>
                  <div className="text-white font-medium mt-0.5">{document.chunkCount} Vector Chunks</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/20">
                  <div className="text-white/70 text-[11px]">Word Count</div>
                  <div className="text-white font-medium mt-0.5">{document.wordCount} words</div>
                </div>
              </div>

              {document.summary && (
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/20 text-xs">
                  <div className="text-white text-[11px] mb-1 font-bold">Document Executive Summary</div>
                  <p className="text-white/90 leading-relaxed font-medium">{document.summary}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/20 bg-black/40 flex items-center justify-between text-xs text-white/90">
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <CheckCircle className="w-4 h-4 text-white" />
            Cryptographically Grounded Reference
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-black text-white border border-white/30 hover:bg-black/80 font-bold transition-colors cursor-pointer"
          >
            Close Source View
          </button>
        </div>
      </div>
    </div>
  );
};


