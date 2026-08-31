import React, { useState } from 'react';
import { Sliders, Save, RefreshCw, Sparkles, Check, Database, Cpu } from 'lucide-react';
import { PipelineSettings } from '../types';

interface SettingsViewProps {
  settings: PipelineSettings;
  onSaveSettings: (newSettings: PipelineSettings) => Promise<void>;
  onResetDefaults: () => void;
  telemetryStats?: {
    totalDocuments: number;
    totalChunks: number;
    totalTokensIndexed: number;
    totalWordsIndexed: number;
    vectorDimensions: number;
    embeddingModel: string;
    llmModel: string;
  };
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetDefaults,
  telemetryStats
}) => {
  const [formSettings, setFormSettings] = useState<PipelineSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(formSettings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[rgb(96,60,96)] p-6 rounded-2xl border border-black/15 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-white" />
            RAG Pipeline & Hyperparameters Config
          </h2>
          <p className="text-xs text-white/90 font-medium mt-1">
            Tune chunking granularity, dense-to-lexical hybrid weighting, similarity thresholds, and grounded system instructions.
          </p>
        </div>

        {telemetryStats && (
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3.5 py-1.5 rounded-xl bg-black border border-white/25 text-white font-mono">
              <span className="text-white/80">Dimensions:</span> <strong className="text-white">{telemetryStats.vectorDimensions}-D</strong>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Retrieval & Vector Hyperparameters */}
        <div className="p-6 rounded-2xl bg-[rgb(96,60,96)] border border-black/15 shadow-xl space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-white" />
            Vector Search & Retrieval Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top-K Chunks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-white">
                  Top-K Retrieved Context Chunks
                </label>
                <span className="font-mono text-white font-bold px-2 py-0.5 bg-black rounded-lg border border-white/20">
                  {formSettings.topK} Chunks
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={formSettings.topK}
                onChange={e => setFormSettings({ ...formSettings, topK: Number(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
              <p className="text-[11px] text-white/80 font-medium">
                Number of most relevant document sections injected into the LLM synthesis context.
              </p>
            </div>

            {/* Minimum Similarity Threshold */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-white">
                  Cosine Similarity Cutoff Threshold
                </label>
                <span className="font-mono text-white font-bold px-2 py-0.5 bg-black rounded-lg border border-white/20">
                  {formSettings.similarityThreshold.toFixed(2)} Min Score
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.8}
                step={0.05}
                value={formSettings.similarityThreshold}
                onChange={e => setFormSettings({ ...formSettings, similarityThreshold: Number(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
              <p className="text-[11px] text-white/80 font-medium">
                Minimum vector similarity score required for a chunk to be considered relevant.
              </p>
            </div>

            {/* Hybrid Search Balance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-white">
                  Hybrid Search Balance (Dense vs Lexical)
                </label>
                <span className="font-mono text-white font-bold px-2 py-0.5 bg-black rounded-lg border border-white/20">
                  {((1 - formSettings.hybridSearchWeight) * 100).toFixed(0)}% Dense / {(formSettings.hybridSearchWeight * 100).toFixed(0)}% Lexical
                </span>
              </div>
              <input
                type="range"
                min={0.0}
                max={0.7}
                step={0.05}
                value={formSettings.hybridSearchWeight}
                onChange={e => setFormSettings({ ...formSettings, hybridSearchWeight: Number(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
              <p className="text-[11px] text-white/80 font-medium">
                Mixes 768-D semantic vector similarity with BM25 exact keyword matching for technical terms and codes.
              </p>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-white">
                  LLM Synthesis Temperature
                </label>
                <span className="font-mono text-white font-bold px-2 py-0.5 bg-black rounded-lg border border-white/20">
                  {formSettings.temperature.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.0}
                max={0.8}
                step={0.05}
                value={formSettings.temperature}
                onChange={e => setFormSettings({ ...formSettings, temperature: Number(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
              <p className="text-[11px] text-white/80 font-medium">
                Lower values (0.0 - 0.2) ensure strictly deterministic, grounded answers without creative hallucination.
              </p>
            </div>
          </div>
        </div>

        {/* Chunking Engine Settings */}
        <div className="p-6 rounded-2xl bg-[rgb(96,60,96)] border border-black/15 shadow-xl space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-white" />
            Document Ingestion & Chunking Granularity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-white">
                  Default Target Chunk Size
                </label>
                <span className="font-mono text-white font-bold px-2 py-0.5 bg-black rounded-lg border border-white/20">
                  {formSettings.chunkSize} chars (~{Math.ceil(formSettings.chunkSize / 4)} tokens)
                </span>
              </div>
              <input
                type="range"
                min={250}
                max={1200}
                step={50}
                value={formSettings.chunkSize}
                onChange={e => setFormSettings({ ...formSettings, chunkSize: Number(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
              <p className="text-[11px] text-white/80 font-medium">
                Maximum characters per vector section slice. Applied when ingesting new documents.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-white">
                  Sliding Window Chunk Overlap
                </label>
                <span className="font-mono text-white font-bold px-2 py-0.5 bg-black rounded-lg border border-white/20">
                  {formSettings.chunkOverlap} chars
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={200}
                step={10}
                value={formSettings.chunkOverlap}
                onChange={e => setFormSettings({ ...formSettings, chunkOverlap: Number(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
              <p className="text-[11px] text-white/80 font-medium">
                Consecutive overlap between adjoining chunk boundaries to prevent loss of context across sentences.
              </p>
            </div>
          </div>
        </div>

        {/* System Prompt Grounding */}
        <div className="p-6 rounded-2xl bg-[rgb(96,60,96)] border border-black/15 shadow-xl space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            Grounded System Instructions & Citation Directives
          </h3>
          <p className="text-xs text-white/90 font-medium">
            Defines the LLM's persona, strict anti-hallucination constraints, and citation formatting instructions.
          </p>
          <textarea
            rows={7}
            value={formSettings.systemPrompt}
            onChange={e => setFormSettings({ ...formSettings, systemPrompt: e.target.value })}
            className="w-full bg-black border border-white/30 text-white rounded-xl p-4 text-xs font-mono leading-relaxed focus:outline-none focus:border-white resize-none placeholder-white/60 font-medium"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetDefaults}
            className="px-4 py-2 rounded-xl bg-black hover:bg-black/80 text-white text-xs font-bold border border-white/25 transition-colors cursor-pointer"
          >
            Reset Default Values
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-black hover:bg-black/80 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed border border-white/30"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Hyperparameters Saved!</span>
              </>
            ) : isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Saving Pipeline Config...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-white" />
                <span>Save Pipeline Hyperparameters</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


