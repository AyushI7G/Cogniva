import React, { useState } from 'react';
import {
  Activity,
  Sparkles,
  Database,
  ShieldCheck,
  Zap,
  Code2,
  CheckCircle2,
  XCircle,
  Send,
  Search
} from 'lucide-react';
import { Citation, EnterpriseDocument, PipelineSettings, RagTelemetry, UserRole } from '../types';
import { getClassificationBadgeColor, getDepartmentBadgeColor } from '../utils/ragHelpers';

interface PipelineInspectorProps {
  currentRole: UserRole;
  documents: EnterpriseDocument[];
  settings: PipelineSettings;
  onRunTestQuery: (query: string) => Promise<{
    answer: string;
    citations: Citation[];
    telemetry: RagTelemetry;
    deniedWarning?: string;
  }>;
}

export const PipelineInspector: React.FC<PipelineInspectorProps> = ({
  currentRole,
  documents,
  settings,
  onRunTestQuery
}) => {
  const [testQuery, setTestQuery] = useState('What are our SOC 2 encryption and TLS requirements?');
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [lastResult, setLastResult] = useState<{
    answer: string;
    citations: Citation[];
    telemetry: RagTelemetry;
    deniedWarning?: string;
  } | null>(null);

  const handleExecute = async () => {
    if (!testQuery.trim() || isRunning) return;
    setIsRunning(true);
    try {
      const res = await onRunTestQuery(testQuery.trim());
      setLastResult(res);
      setActiveStep(6);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[rgb(96,60,96)] p-6 rounded-2xl border border-black/15 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-white" />
            RAG Pipeline Studio & Vector Telemetry
          </h2>
          <p className="text-xs text-white/90 font-medium mt-1">
            Real-time interactive laboratory demonstrating the 6-stage Enterprise RAG lifecycle from embedding projection to grounded generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-black border border-white/25 text-xs text-white">
            Active Role: <strong className="text-white font-bold">{currentRole.name}</strong> ({currentRole.department})
          </div>
        </div>
      </div>

      {/* Query Bar */}
      <div className="bg-[rgb(96,60,96)] p-4 rounded-2xl border border-black/15 shadow-lg space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-white" />
          Test Inquiry for Pipeline Trace
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={e => setTestQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleExecute()}
            placeholder="Type any test query..."
            className="flex-1 bg-black border border-white/30 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white font-medium placeholder-white/70"
          />
          <button
            onClick={handleExecute}
            disabled={isRunning || !testQuery.trim()}
            className="px-6 py-2.5 rounded-xl bg-black hover:bg-black/80 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed border border-white/25"
          >
            {isRunning ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-white" />
                <span>Tracing Pipeline...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                <span>Execute RAG Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2 text-xs flex-wrap pt-1">
          <span className="text-white text-[11px] font-bold">Quick Traces:</span>
          {[
            'What are our SOC 2 encryption and TLS requirements?',
            'What is the parental leave policy in 2026?',
            'What are the Kubernetes timeout and circuit breaker limits?',
            'What approval is required for a 30% contract discount?'
          ].map((preset, pIdx) => (
            <button
              key={pIdx}
              onClick={() => setTestQuery(preset)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-black hover:bg-black/80 text-white border border-white/20 transition-colors cursor-pointer font-medium"
            >
              {preset.slice(0, 32)}...
            </button>
          ))}
        </div>
      </div>

      {/* 9-Stage Visual Flow Tracker */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
        {[
          { step: 1, name: '1. Intent', icon: Search },
          { step: 2, name: '2. Embed', icon: Zap },
          { step: 3, name: '3. Qdrant', icon: Database },
          { step: 4, name: '4. BM25', icon: Database },
          { step: 5, name: '5. RBAC', icon: ShieldCheck },
          { step: 6, name: '6. Rerank', icon: CheckCircle2 },
          { step: 7, name: '7. Context', icon: Code2 },
          { step: 8, name: '8. LLM', icon: Sparkles },
          { step: 9, name: '9. Citations', icon: CheckCircle2 }
        ].map(stage => {
          const isCurrent = activeStep === stage.step;
          const Icon = stage.icon;

          return (
            <button
              key={stage.step}
              onClick={() => setActiveStep(stage.step)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 shadow-md cursor-pointer ${
                isCurrent
                  ? 'bg-black text-white border-white font-bold'
                  : 'bg-[rgb(96,60,96)] border-white/20 text-white hover:border-white/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-3.5 h-3.5 text-white" />
                {lastResult && (
                  <span className="font-mono text-[9px] text-white/90 font-bold">
                    {stage.step === 1 ? `${lastResult.telemetry.stageLatencies?.intentDetectionMs ?? 0}ms` :
                     stage.step === 2 ? `${lastResult.telemetry.stageLatencies?.queryEmbeddingMs ?? 0}ms` :
                     stage.step === 3 ? `${lastResult.telemetry.stageLatencies?.vectorRetrievalMs ?? 0}ms` :
                     stage.step === 4 ? `${lastResult.telemetry.stageLatencies?.bm25HybridMs ?? 0}ms` :
                     stage.step === 5 ? `${lastResult.telemetry.stageLatencies?.rbacFilterMs ?? 0}ms` :
                     stage.step === 6 ? `${lastResult.telemetry.stageLatencies?.rerankingMs ?? 0}ms` :
                     stage.step === 7 ? `${lastResult.telemetry.stageLatencies?.contextAssemblyMs ?? 0}ms` :
                     stage.step === 8 ? `${lastResult.telemetry.stageLatencies?.llmRequestMs ?? lastResult.telemetry.generationLatencyMs}ms` :
                     `${lastResult.citations.length} cites`}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold leading-tight truncate">{stage.name}</span>
            </button>
          );
        })}
      </div>

      {/* Step Visualizer Panel */}
      <div className="p-6 rounded-2xl bg-[rgb(96,60,96)] border border-black/15 shadow-xl space-y-6">
        {activeStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-white" />
              Stage 1: User Query Ingestion & Preprocessing
            </h3>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              The incoming query is normalized, sanitized, and prepared for embedding computation and lexical tokenization.
            </p>
            <div className="p-4 rounded-xl bg-black border border-white/20 text-sm font-mono text-white font-semibold">
              "{testQuery}"
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black border border-white/20">
                <div className="text-white/80 text-[11px] font-medium">Character Length</div>
                <div className="text-white font-mono font-bold mt-0.5">{testQuery.length} chars</div>
              </div>
              <div className="p-3 rounded-xl bg-black border border-white/20">
                <div className="text-white/80 text-[11px] font-medium">Estimated Tokens</div>
                <div className="text-white font-mono font-bold mt-0.5">{Math.ceil(testQuery.length / 4)} tokens</div>
              </div>
              <div className="p-3 rounded-xl bg-black border border-white/20">
                <div className="text-white/80 text-[11px] font-medium">Hybrid Search Weight</div>
                <div className="text-white font-mono font-bold mt-0.5">{(1 - settings.hybridSearchWeight) * 100}% Dense / {settings.hybridSearchWeight * 100}% Lexical</div>
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-white" />
              Stage 2: Vector Embedding Generation (768 Dimensions)
            </h3>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              The text is mapped onto a high-dimensional continuous semantic space where semantic proximity corresponds to conceptual relevance.
            </p>

            {lastResult?.telemetry.queryVectorSample ? (
              <div className="space-y-3">
                <div className="text-xs text-white font-bold">
                  Sample Dimensional Projections (16 of 768 dimensions):
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {lastResult.telemetry.queryVectorSample.map((val, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-black border border-white/20 text-center font-mono text-[10px]"
                    >
                      <span className="text-white/70 block text-[8px]">dim_{idx}</span>
                      <span className="font-bold text-white">
                        {val.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Dimensional Heatmap Representation */}
                <div className="p-4 rounded-xl bg-black border border-white/20 space-y-2">
                  <div className="text-xs text-white font-bold">Embedding Energy Heatmap</div>
                  <div className="flex gap-1 h-6 w-full rounded overflow-hidden">
                    {lastResult.telemetry.queryVectorSample.map((val, idx) => {
                      const opacity = Math.min(1, Math.max(0.2, Math.abs(val) * 3));
                      return (
                        <div
                          key={idx}
                          className="flex-1 bg-white transition-all"
                          style={{ opacity }}
                          title={`Dimension ${idx}: ${val.toFixed(4)}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-white bg-black rounded-xl border border-white/20 font-medium">
                Execute a pipeline trace above to view the live mathematical vector projections.
              </div>
            )}
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-white" />
              Stage 3: Qdrant Vector Store Dense Similarity Retrieval
            </h3>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              Calculates cosine similarity dot products between the query vector and all chunk vectors in the Qdrant Vector Engine.
            </p>

            {lastResult?.telemetry.similarityScores ? (
              <div className="space-y-2">
                {lastResult.telemetry.similarityScores.map((score, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3.5 rounded-xl bg-black border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-black text-white border border-white/30 font-mono text-[10px] font-bold">
                          Rank #{sIdx + 1}
                        </span>
                        <strong className="text-white">{score.docName}</strong>
                        <span className="text-white/40">•</span>
                        <span className="text-white/80">§ {score.section}</span>
                      </div>
                      <p className="text-white/80 text-[11px] line-clamp-1 italic">
                        "{score.textPreview}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 bg-white/20 rounded-full h-2 overflow-hidden border border-white/20">
                        <div
                          className="bg-white h-full rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, (score.denseScore ?? score.score) * 100))}%` }}
                        />
                      </div>
                      <span className="font-mono text-white text-xs font-bold w-16 text-right">
                        Dense: {(score.denseScore ?? score.score).toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-white bg-black rounded-xl border border-white/20 font-medium">
                Execute a pipeline trace above to view matched similarity ranks.
              </div>
            )}
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-white" />
              Stage 4: BM25 Lexical Keyword & Hybrid Search
            </h3>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              Computes term frequency-inverse document frequency (BM25) scores to balance semantic vector proximity with exact keyword accuracy.
            </p>

            {lastResult?.telemetry.similarityScores ? (
              <div className="space-y-2">
                {lastResult.telemetry.similarityScores.map((score, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3.5 rounded-xl bg-black border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{score.docName}</strong>
                        <span className="text-white/40">•</span>
                        <span className="text-white/80">§ {score.section}</span>
                      </div>
                      <p className="text-white/80 text-[11px] line-clamp-1 italic">
                        "{score.textPreview}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-white text-xs font-bold w-20 text-right">
                        BM25: {(score.lexicalScore ?? 0).toFixed(3)}
                      </span>
                      <span className="font-mono text-white text-xs font-bold px-2 py-0.5 rounded bg-white/10 border border-white/20">
                        Hybrid: {score.score.toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-white bg-black rounded-xl border border-white/20 font-medium">
                Execute a pipeline trace above to view BM25 lexical scoring.
              </div>
            )}
          </div>
        )}

        {activeStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white" />
              Stage 5: Role-Based Access Control (RBAC) Security Pre-Filtering
            </h3>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              Every candidate chunk is evaluated against the authenticated user role's allowed clearance classifications and department boundaries before context assembly.
            </p>

            <div className="p-4 rounded-xl bg-black border border-white/20 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <span className="text-white/80">Current Role Profile:</span>
                <span className="text-white font-bold">{currentRole.name} ({currentRole.title})</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <span className="text-white/80">Allowed Document Classifications:</span>
                <div className="flex gap-1.5">
                  {currentRole.allowedClassifications.map(c => (
                    <span key={c} className={`text-[10px] px-2 py-0.5 rounded border ${getClassificationBadgeColor(c)}`}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Allowed Departments:</span>
                <div className="flex gap-1.5">
                  {currentRole.allowedDepartments.map(d => (
                    <span key={d} className={`text-[10px] px-2 py-0.5 rounded border bg-black text-white border-white/25 font-semibold`}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {lastResult?.deniedWarning && (
              <div className="p-3.5 rounded-xl bg-black border border-white text-white text-xs flex items-center gap-2 font-semibold">
                <XCircle className="w-4 h-4 shrink-0 text-white" />
                <span>{lastResult.deniedWarning}</span>
              </div>
            )}
          </div>
        )}

        {activeStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              Stage 6: Reranking & Overlap Suppression (Deduplication)
            </h3>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              Suppresses redundant chunks with &gt;45% text overlap caused by sliding windows, retaining only the highest-diversity, top-ranked passages.
            </p>

            {lastResult?.telemetry ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black border border-white/20">
                    <div className="text-white/80 text-[11px] font-medium">Candidate Chunks</div>
                    <div className="text-white font-mono font-bold mt-0.5">{lastResult.telemetry.filteredChunksCount ?? lastResult.telemetry.topKChunksRetrieved} chunks</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-white/20">
                    <div className="text-white/80 text-[11px] font-medium">Deduplicated Chunks</div>
                    <div className="text-white font-mono font-bold mt-0.5">{lastResult.telemetry.deduplicatedChunksCount ?? lastResult.telemetry.topKChunksUsed} chunks</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-white/20">
                    <div className="text-white/80 text-[11px] font-medium">Redundancy Suppressed</div>
                    <div className="text-white font-mono font-bold mt-0.5">
                      {Math.max(0, (lastResult.telemetry.filteredChunksCount ?? lastResult.telemetry.topKChunksRetrieved) - (lastResult.telemetry.deduplicatedChunksCount ?? lastResult.telemetry.topKChunksUsed))} redundant
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-white bg-black rounded-xl border border-white/20 font-medium">
                Execute a pipeline trace above to view reranking and deduplication.
              </div>
            )}
          </div>
        )}

        {activeStep === 7 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-white" />
              Stage 7: Grounded Context Assembly & Token Budgeting
            </h3>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              Retrieved deduplicated chunks are structured into concise context blocks with clear citation anchors and minimal token overhead.
            </p>

            {lastResult?.telemetry.assembledPrompt ? (
              <div className="p-4 rounded-xl bg-black border border-white/20 font-mono text-xs text-white whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed selection:bg-black selection:text-white">
                {lastResult.telemetry.assembledPrompt}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-white bg-black rounded-xl border border-white/20 font-medium">
                Execute a pipeline trace above to inspect the exact compiled prompt sent to the LLM.
              </div>
            )}
          </div>
        )}

        {activeStep === 8 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              Stage 8: LLM Generation & Token Breakdown
            </h3>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              The LLM synthesizes an authoritative, grounded response using the instruction-dense prompt and context.
            </p>

            {lastResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black border border-white/20">
                    <div className="text-white/80 text-[11px] font-medium">LLM Model</div>
                    <div className="text-white font-bold mt-0.5 truncate">{lastResult.telemetry.llmModel}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-white/20">
                    <div className="text-white/80 text-[11px] font-medium">Prompt Tokens</div>
                    <div className="text-white font-mono font-bold mt-0.5">{lastResult.telemetry.promptTokens}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-white/20">
                    <div className="text-white/80 text-[11px] font-medium">Completion Tokens</div>
                    <div className="text-white font-mono font-bold mt-0.5">{lastResult.telemetry.completionTokens}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-white/20">
                    <div className="text-white/80 text-[11px] font-medium">Total Tokens Used</div>
                    <div className="text-white font-mono font-bold mt-0.5">{lastResult.telemetry.totalTokens ?? (lastResult.telemetry.promptTokens + lastResult.telemetry.completionTokens)}</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black border border-white/20 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-white">Generated Response</div>
                  <div className="text-sm text-white whitespace-pre-wrap leading-relaxed font-medium">
                    {lastResult.answer}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-white bg-black rounded-xl border border-white/20 font-medium">
                Execute a pipeline trace above to view LLM synthesis and token telemetry.
              </div>
            )}
          </div>
        )}

        {activeStep === 9 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              Stage 9: Grounded Citations & Audit Verification
            </h3>

            {lastResult ? (
              <div className="space-y-4">
                {/* Citations list */}
                {lastResult.citations.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-white">
                      Verified Citations ({lastResult.citations.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lastResult.citations.map((cite, cIdx) => (
                        <div
                          key={cite.id}
                          className="p-3 rounded-xl bg-black border border-white/20 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">
                              [[{cIdx + 1}]] {cite.docName}
                            </span>
                            <span className="font-mono text-white text-[11px] font-bold px-1.5 py-0.5 rounded bg-white/10 border border-white/20">
                              Sim: {cite.similarityScore.toFixed(3)}
                            </span>
                          </div>
                          <div className="text-white/80 text-[11px]">
                            Section: {cite.sectionHeader} (Page {cite.pageNumber})
                          </div>
                          <p className="text-white/70 text-[10px] line-clamp-2">
                            "{cite.snippet}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-black border border-white/20 text-xs text-white">
                    No document citations were required or accessible for this query.
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-white bg-black rounded-xl border border-white/20 font-medium">
                Execute a pipeline trace above to view the synthesized answer and extracted citation points.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

