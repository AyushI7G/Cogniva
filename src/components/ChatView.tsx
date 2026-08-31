import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
  Filter,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileText,
  Clock,
  Zap,
  RefreshCw,
  Sliders,
  Layers,
  ArrowRight,
  ShieldAlert,
  Download,
  Trash2
} from 'lucide-react';
import {
  ChatMessage,
  Citation,
  Department,
  EnterpriseDocument,
  PipelineSettings,
  UserRole
} from '../types';
import { getClassificationBadgeColor, getDepartmentBadgeColor } from '../utils/ragHelpers';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (query: string, options?: { selectedDocIds?: string[]; departmentFilter?: Department }) => Promise<void>;
  isLoading: boolean;
  documents: EnterpriseDocument[];
  currentRole: UserRole;
  onOpenCitation: (citation: Citation) => void;
  onOpenSettings: () => void;
  settings: PipelineSettings;
  onClearChat: () => void;
}

const SAMPLE_QUESTIONS = [
  {
    title: 'SOC 2 & Encryption Standards',
    query: 'What are our data encryption standards for data at rest and data in transit under SOC 2?',
    dept: 'Security' as Department,
    badge: 'Confidential'
  },
  {
    title: 'HR Parental Leave & Stipends',
    query: 'What is our parental leave duration in 2026 and what monthly stipends or allowances are provided?',
    dept: 'HR' as Department,
    badge: 'Internal'
  },
  {
    title: 'Kubernetes Reliability & Circuit Breakers',
    query: 'What are the microservices timeout limits and circuit breaker retry standards?',
    dept: 'Engineering' as Department,
    badge: 'Internal'
  },
  {
    title: 'Enterprise Pricing & Discount Authority',
    query: 'What are the subscription tier prices and what approval is required for a 25% discount?',
    dept: 'Sales' as Department,
    badge: 'Restricted'
  },
  {
    title: 'GDPR Data Subject Access & Erasure',
    query: 'What is the SLA and process for completing a DSAR right-to-be-forgotten erasure request?',
    dept: 'Legal' as Department,
    badge: 'Confidential'
  }
];

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  documents,
  currentRole,
  onOpenCitation,
  onOpenSettings,
  settings,
  onClearChat
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<Department>('All');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [docFilterOpen, setDocFilterOpen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [expandedTelemetryIds, setExpandedTelemetryIds] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const q = inputQuery.trim();
    setInputQuery('');
    onSendMessage(q, {
      selectedDocIds: selectedDocIds.length > 0 ? selectedDocIds : undefined,
      departmentFilter: selectedDeptFilter !== 'All' ? selectedDeptFilter : undefined
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const toggleTelemetry = (msgId: string) => {
    setExpandedTelemetryIds(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleExportChat = () => {
    const json = JSON.stringify(messages, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enterprise-rag-chat-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  // Filter accessible documents based on current active role
  const accessibleDocs = documents.filter(doc => {
    const hasClass = currentRole.allowedClassifications.includes(doc.metadata.classification);
    const hasDept = currentRole.allowedDepartments.includes('All') || currentRole.allowedDepartments.includes(doc.metadata.department);
    return hasClass && hasDept;
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-80px)] max-w-7xl mx-auto w-full px-4 py-6">
      {/* Search Scope Filter Bar */}
      <div className="bg-[rgb(96,60,96)] rounded-2xl border border-white/20 p-3 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-bold flex items-center gap-1.5 pl-1">
            <Filter className="w-3.5 h-3.5 text-white" />
            Scope Filter:
          </span>

          {/* Department Filter */}
          <select
            value={selectedDeptFilter}
            onChange={e => setSelectedDeptFilter(e.target.value as Department)}
            className="bg-black text-white border border-white/30 rounded-xl px-3 py-1.5 focus:outline-none focus:border-white transition-colors font-semibold cursor-pointer"
          >
            <option value="All" className="bg-[rgb(96,60,96)] text-white">All Departments</option>
            <option value="Security" className="bg-[rgb(96,60,96)] text-white">Security & Compliance</option>
            <option value="HR" className="bg-[rgb(96,60,96)] text-white">Human Resources</option>
            <option value="Engineering" className="bg-[rgb(96,60,96)] text-white">Engineering</option>
            <option value="Sales" className="bg-[rgb(96,60,96)] text-white">Sales & Commercial</option>
            <option value="Legal" className="bg-[rgb(96,60,96)] text-white">Legal & Privacy</option>
            <option value="Finance" className="bg-[rgb(96,60,96)] text-white">Finance</option>
            <option value="Executive" className="bg-[rgb(96,60,96)] text-white">Executive</option>
          </select>

          {/* Document Multi-Select Toggle */}
          <div className="relative">
            <button
              onClick={() => setDocFilterOpen(!docFilterOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black border border-white/30 hover:bg-black/80 text-white font-semibold transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>
                {selectedDocIds.length === 0
                  ? `All Docs (${accessibleDocs.length} accessible)`
                  : `${selectedDocIds.length} Selected`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-white ml-0.5" />
            </button>

            {docFilterOpen && (
              <div
                className="absolute left-0 mt-2 w-72 bg-[rgb(96,60,96)] border border-white/30 rounded-2xl shadow-2xl p-2 z-30 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setDocFilterOpen(false)}
              >
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/20 px-2 text-[11px] font-bold text-white">
                  <span>Scope to Specific Documents</span>
                  {selectedDocIds.length > 0 && (
                    <button
                      onClick={() => setSelectedDocIds([])}
                      className="text-white hover:underline underline-offset-2 font-semibold cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
                {accessibleDocs.map(doc => {
                  const isChecked = selectedDocIds.includes(doc.id);
                  return (
                    <label
                      key={doc.id}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-black/40 text-white cursor-pointer text-xs transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedDocIds(selectedDocIds.filter(id => id !== doc.id));
                          } else {
                            setSelectedDocIds([...selectedDocIds, doc.id]);
                          }
                        }}
                        className="rounded border-white/40 text-black focus:ring-black bg-white accent-black"
                      />
                      <span className="truncate flex-1 font-semibold">{doc.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-black/80 text-white font-semibold border border-white/25 transition-colors cursor-pointer"
            title="Adjust RAG hyperparameters"
          >
            <Sliders className="w-3.5 h-3.5 text-white" />
            <span>Top-K: {settings.topK}</span>
          </button>

          {messages.length > 0 && (
            <>
              <button
                onClick={handleExportChat}
                className="p-2 rounded-xl bg-black hover:bg-black/80 text-white border border-white/20 transition-colors cursor-pointer"
                title="Export conversation history"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onClearChat}
                className="p-2 rounded-xl bg-black hover:bg-black/80 text-white border border-white/20 transition-colors cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
        {messages.length === 0 ? (
          /* Empty State / Welcome Screen on White Background */
          <div className="h-full flex flex-col justify-center max-w-7xl w-full mx-auto space-y-4">
            {/* Quick Test Prompt Cards */}
            <div className="w-full space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-black/80 text-left pl-1">
                Suggested Questions
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                {SAMPLE_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputQuery(item.query);
                      onSendMessage(item.query);
                    }}
                    className="p-4 rounded-2xl bg-[rgb(96,60,96)] hover:bg-[rgb(110,70,110)] border border-black/20 hover:border-black text-left transition-all duration-200 group relative overflow-hidden cursor-pointer shadow-md"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-white transition-colors">
                        {item.title}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getClassificationBadgeColor(item.badge as any)}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-white/90 font-medium line-clamp-2 leading-relaxed">
                      "{item.query}"
                    </p>
                    <div className="mt-2.5 flex items-center gap-1 text-[11px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Query Vector Store</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Message List with Modern Aesthetic */
          messages.map(message => {
            const isUser = message.role === 'user';
            const isExpanded = expandedTelemetryIds[message.id];

            return (
              <div
                key={message.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                {/* Avatar for Assistant */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[rgb(96,60,96)] border border-white/30 flex items-center justify-center text-white shrink-0 shadow-md mt-1 font-bold">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`max-w-3xl space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl ${
                      isUser
                        ? 'bg-[rgb(96,60,96)] text-white rounded-tr-sm shadow-lg border border-white/25 font-semibold text-sm'
                        : 'bg-[rgb(96,60,96)] border border-white/20 text-white rounded-tl-sm shadow-xl'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-sm whitespace-pre-wrap font-medium leading-relaxed">{message.content}</p>
                    ) : (
                      <div className="space-y-4">
                        {/* Markdown Content */}
                        <div className="prose prose-invert prose-sm max-w-none text-white leading-relaxed font-sans font-normal prose-headings:text-white prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-4 prose-p:my-2 prose-p:leading-relaxed prose-ul:my-2 prose-li:my-0.5 prose-strong:text-white prose-strong:font-bold prose-code:text-white prose-code:bg-black/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>

                        {/* Interactive Citations Bar */}
                        {message.citations && message.citations.length > 0 && (
                          <div className="pt-3 border-t border-white/20 space-y-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-white" />
                              Grounded Citations ({message.citations.length})
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {message.citations.map((cite, cIdx) => (
                                <button
                                  key={cite.id}
                                  onClick={() => onOpenCitation(cite)}
                                  className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black hover:bg-black/80 border border-white/25 hover:border-white text-left transition-all shadow-sm cursor-pointer"
                                >
                                  <span className="w-4 h-4 rounded-full bg-white text-black font-mono text-[10px] flex items-center justify-center font-bold">
                                    {cIdx + 1}
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-white group-hover:text-white truncate max-w-[170px]">
                                      {cite.docName}
                                    </span>
                                    <span className="text-[10px] text-white/80 font-medium truncate max-w-[170px]">
                                      § {cite.sectionHeader}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-white ml-1 px-1.5 py-0.5 rounded bg-white/10 border border-white/20">
                                    Sim: {cite.similarityScore.toFixed(2)}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Assistant Footer & Telemetry Accordion */}
                  {!isUser && (
                    <div className="space-y-2 pl-1">
                      <div className="flex items-center gap-3 text-[11px] text-black/80 font-medium">
                        {/* Copy button */}
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="flex items-center gap-1 hover:underline text-black transition-colors cursor-pointer"
                        >
                          {copiedMessageId === message.id ? (
                            <>
                              <Check className="w-3 h-3 text-black" />
                              <span className="text-black font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Answer</span>
                            </>
                          )}
                        </button>

                        {/* Telemetry Toggle */}
                        {message.telemetry && (
                          <button
                            onClick={() => toggleTelemetry(message.id)}
                            className="flex items-center gap-1 text-black hover:underline transition-colors font-bold cursor-pointer"
                          >
                            <Zap className="w-3 h-3" />
                            <span>
                              RAG Telemetry ({message.telemetry.totalLatencyMs}ms)
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Expanded Telemetry Box */}
                      {isExpanded && message.telemetry && (
                        <div className="p-4 rounded-2xl bg-[rgb(96,60,96)] border border-white/20 text-xs space-y-4 animate-in fade-in duration-150 shadow-xl">
                          {/* Summary Row */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                            <div className="p-2.5 rounded-xl bg-black border border-white/20">
                              <span className="text-white/80 block text-[10px] font-semibold">Total Request Latency</span>
                              <span className="font-mono text-white text-sm font-bold">
                                {message.telemetry.totalLatencyMs} ms
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black border border-white/20">
                              <span className="text-white/80 block text-[10px] font-semibold">Retrieval / LLM Latency</span>
                              <span className="font-mono text-white text-xs font-bold">
                                {message.telemetry.retrievalLatencyMs}ms / {message.telemetry.generationLatencyMs}ms
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black border border-white/20">
                              <span className="text-white/80 block text-[10px] font-semibold">Token Usage (In / Out / Total)</span>
                              <span className="font-mono text-white text-xs font-bold">
                                {message.telemetry.promptTokens} / {message.telemetry.completionTokens} ({message.telemetry.totalTokens || (message.telemetry.promptTokens + message.telemetry.completionTokens)})
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black border border-white/20">
                              <span className="text-white/80 block text-[10px] font-semibold">LLM Engine</span>
                              <span className="text-white text-xs font-bold truncate block">
                                {message.telemetry.llmModel}
                              </span>
                            </div>
                          </div>

                          {/* 9-Stage Latency Breakdown */}
                          {message.telemetry.stageLatencies && (
                            <div className="space-y-2 pt-2 border-t border-white/20">
                              <div className="flex items-center justify-between text-[11px] font-bold text-white">
                                <span>9-Stage Latency & Token Pipeline Breakdown</span>
                                <span className="text-[10px] text-white/80 font-normal font-mono">
                                  Total: {message.telemetry.totalLatencyMs}ms
                                </span>
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-1.5 text-[10px]">
                                <div className="p-2 rounded-lg bg-black border border-white/20 text-center">
                                  <span className="text-white/70 block truncate text-[9px]">1. Intent</span>
                                  <span className="font-mono font-bold text-white">{message.telemetry.stageLatencies.intentDetectionMs}ms</span>
                                </div>
                                <div className="p-2 rounded-lg bg-black border border-white/20 text-center">
                                  <span className="text-white/70 block truncate text-[9px]">2. Embed</span>
                                  <span className="font-mono font-bold text-white">{message.telemetry.stageLatencies.queryEmbeddingMs}ms</span>
                                </div>
                                <div className="p-2 rounded-lg bg-black border border-white/20 text-center">
                                  <span className="text-white/70 block truncate text-[9px]">3. Qdrant</span>
                                  <span className="font-mono font-bold text-white">{message.telemetry.stageLatencies.vectorRetrievalMs}ms</span>
                                </div>
                                <div className="p-2 rounded-lg bg-black border border-white/20 text-center">
                                  <span className="text-white/70 block truncate text-[9px]">4. BM25</span>
                                  <span className="font-mono font-bold text-white">{message.telemetry.stageLatencies.bm25HybridMs}ms</span>
                                </div>
                                <div className="p-2 rounded-lg bg-black border border-white/20 text-center">
                                  <span className="text-white/70 block truncate text-[9px]">5. RBAC</span>
                                  <span className="font-mono font-bold text-white">{message.telemetry.stageLatencies.rbacFilterMs}ms</span>
                                </div>
                                <div className="p-2 rounded-lg bg-black border border-white/20 text-center">
                                  <span className="text-white/70 block truncate text-[9px]">6. Rerank</span>
                                  <span className="font-mono font-bold text-white">{message.telemetry.stageLatencies.rerankingMs}ms</span>
                                </div>
                                <div className="p-2 rounded-lg bg-black border border-white/20 text-center">
                                  <span className="text-white/70 block truncate text-[9px]">7. Assembly</span>
                                  <span className="font-mono font-bold text-white">{message.telemetry.stageLatencies.contextAssemblyMs}ms</span>
                                </div>
                                <div className="p-2 rounded-lg bg-black border border-white/20 text-center">
                                  <span className="text-white/70 block truncate text-[9px]">8. LLM Gen</span>
                                  <span className="font-mono font-bold text-white">{message.telemetry.stageLatencies.llmRequestMs}ms</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Chunk Flow & Redundancy Reduction Indicator */}
                          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-black border border-white/20 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="text-white/80">Chunk Pipeline:</span>
                              <span className="font-mono text-white font-bold">
                                {message.telemetry.topKChunksRetrieved} retrieved &rarr; {message.telemetry.filteredChunksCount ?? message.telemetry.topKChunksUsed} RBAC-passed &rarr; {message.telemetry.topKChunksUsed} deduplicated chunks sent to LLM
                              </span>
                            </div>
                            {message.telemetry.deniedChunksCount !== undefined && message.telemetry.deniedChunksCount > 0 && (
                              <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20 text-[10px]">
                                {message.telemetry.deniedChunksCount} Restricted Chunks Withheld
                              </span>
                            )}
                          </div>

                          {/* Similarity Scores Breakdown */}
                          {message.telemetry.similarityScores.length > 0 && (
                            <div className="space-y-1.5 pt-1 border-t border-white/20">
                              <div className="text-[11px] font-bold text-white">
                                Ranked Vector Similarity Scores
                              </div>
                              <div className="space-y-1">
                                {message.telemetry.similarityScores.map((score, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="flex items-center justify-between p-2 rounded-lg bg-black text-[11px]"
                                  >
                                    <span className="text-white font-medium truncate max-w-[280px]">
                                      {score.docName} › {score.section}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 bg-white/20 rounded-full h-1.5 overflow-hidden">
                                        <div
                                          className="bg-white h-full rounded-full"
                                          style={{ width: `${Math.min(100, Math.max(0, score.score * 100))}%` }}
                                        />
                                      </div>
                                      <span className="font-mono text-white text-[10px] w-12 text-right font-bold">
                                        {score.score.toFixed(3)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Avatar for User */}
                {isUser && (
                  <img
                    src={currentRole.avatar}
                    alt={currentRole.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-black/30 mt-1"
                  />
                )}
              </div>
            );
          })
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex gap-3.5 justify-start animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-full bg-[rgb(96,60,96)] border border-white/30 flex items-center justify-center text-white shrink-0 shadow-md animate-pulse mt-1 font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[rgb(96,60,96)] border border-white/20 rounded-tl-sm text-white text-sm space-y-2.5 max-w-md shadow-xl">
              <div className="flex items-center gap-2 text-xs text-white font-semibold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Searching Knowledge Base & Synthesizing Grounded Answer...</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-3 bg-black/40 rounded-full w-full animate-pulse" />
                <div className="h-3 bg-black/40 rounded-full w-4/5 animate-pulse" />
                <div className="h-3 bg-black/40 rounded-full w-2/3 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Box */}
      <div className="relative bg-[rgb(96,60,96)] rounded-2xl border border-black/20 shadow-2xl p-2.5 focus-within:border-white focus-within:ring-1 focus-within:ring-white transition-all">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask a question across company docs as ${currentRole.title}... (Shift+Enter for newline)`}
            className="flex-1 bg-transparent text-white placeholder-white/70 font-medium text-sm px-3 py-2 focus:outline-none resize-none min-h-[44px] max-h-32"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 rounded-xl bg-black hover:bg-black/80 disabled:opacity-30 text-white font-bold shadow-md transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};


