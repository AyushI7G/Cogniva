import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { DocumentVault } from './components/DocumentVault';
import { PipelineInspector } from './components/PipelineInspector';
import { AuditView } from './components/AuditView';
import { SettingsView } from './components/SettingsView';
import { CitationDrawer } from './components/CitationDrawer';
import { ENTERPRISE_ROLES } from './data/roles';
import {
  ChatMessage,
  Citation,
  Department,
  EnterpriseDocument,
  PipelineSettings,
  RagTelemetry,
  UserRoleId
} from './types';

const INITIAL_SETTINGS: PipelineSettings = {
  topK: 4,
  similarityThreshold: 0.35,
  chunkSize: 500,
  chunkOverlap: 80,
  temperature: 0.2,
  hybridSearchWeight: 0.3,
  enableQueryRewriting: true,
  systemPrompt: `You are Cogniva, an enterprise intelligence assistant.
Your core mission is to provide accurate, concise, and verifiable answers strictly grounded in the provided documents.`
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'vault' | 'pipeline' | 'audit' | 'settings'>('chat');
  const [currentRoleId, setCurrentRoleId] = useState<UserRoleId>('super_admin');
  const [documents, setDocuments] = useState<EnterpriseDocument[]>([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [settings, setSettings] = useState<PipelineSettings>(INITIAL_SETTINGS);
  const [telemetryStats, setTelemetryStats] = useState<any>(null);

  const currentRole = ENTERPRISE_ROLES[currentRoleId] || ENTERPRISE_ROLES.super_admin;

  // Fetch initial documents and status
  const loadData = async () => {
    try {
      const [healthRes, docsRes, telemRes] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/documents'),
        fetch('/api/rag/telemetry')
      ]);

      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setHasGeminiKey(healthData.hasGeminiKey);
      }

      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.documents || []);
        setTotalChunks(docsData.totalChunks || 0);
      }

      if (telemRes.ok) {
        const telemData = await telemRes.json();
        setTelemetryStats(telemData);
        if (telemData.currentSettings) {
          setSettings(telemData.currentSettings);
        }
      }
    } catch (error) {
      console.error('Error fetching initial RAG system data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Send Message & Execute RAG
  const handleSendMessage = async (
    query: string,
    options: { selectedDocIds?: string[]; departmentFilter?: Department } = {}
  ) => {
    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
      userRole: currentRoleId,
      selectedDocs: options.selectedDocIds
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userRole: currentRoleId,
          selectedDocIds: options.selectedDocIds,
          departmentFilter: options.departmentFilter,
          customSettings: settings
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      let answerText = data.answer || 'No response generated.';
      if (data.deniedWarning) {
        answerText += `\n\n> ⚠️ *${data.deniedWarning}*`;
      }

      const assistantMessage: ChatMessage = {
        id: `msg_assistant_${Date.now()}`,
        role: 'assistant',
        content: answerText,
        timestamp: new Date().toISOString(),
        citations: data.citations || [],
        telemetry: data.telemetry
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to execute query:', error);
      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `❌ **Error querying RAG Pipeline**: ${(error as Error).message}\n\nPlease verify server connectivity or check Vector Vault configuration.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload Document File
  const handleUploadDocument = async (formData: FormData) => {
    setIsUploading(true);
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to upload document');
      }
      await loadData();
    } catch (error) {
      alert(`Upload error: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Add Manual Text Document
  const handleAddTextDocument = async (data: any) => {
    setIsUploading(true);
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save text document');
      }
      await loadData();
    } catch (error) {
      alert(`Error saving text document: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Document
  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document and remove its vector embeddings?')) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  // Reset to Default Knowledge Base
  const handleResetDefaults = async () => {
    if (!confirm('Reload default verified enterprise policies and architecture documents?')) return;
    try {
      const res = await fetch('/api/documents/reset-defaults', { method: 'POST' });
      if (res.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Failed to reset documents:', error);
    }
  };

  // Save Settings
  const handleSaveSettings = async (newSettings: PipelineSettings) => {
    setSettings(newSettings);
    try {
      await fetch('/api/rag/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (err) {
      console.error('Failed to update server settings:', err);
    }
  };

  // Test Query runner for Pipeline Studio
  const handleRunTestQuery = async (query: string) => {
    const res = await fetch('/api/rag/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        userRole: currentRoleId,
        customSettings: settings
      })
    });
    if (!res.ok) {
      throw new Error(`Pipeline execution failed with status ${res.status}`);
    }
    return await res.json();
  };

  const activeCitationDoc = activeCitation
    ? documents.find(d => d.id === activeCitation.docId) || null
    : null;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-[rgb(96,60,96)] selection:text-white relative overflow-x-hidden">
      {/* Subtle organic ambient glow in rgb(96, 60, 96) on white */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0 overflow-hidden">
        <svg className="w-full h-full object-cover" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="150" r="300" fill="rgb(96,60,96)" fillOpacity="0.4"/>
          <circle cx="1250" cy="650" r="350" fill="rgb(96,60,96)" fillOpacity="0.35"/>
          <path d="M-100 300C200 200 400 500 800 350C1200 200 1300 450 1600 400V1000H-100V300Z" fill="rgb(96,60,96)" fillOpacity="0.15"/>
        </svg>
      </div>

      {/* Top Header with Floating Dropdown Support */}
      <div className="relative z-50">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentRole={currentRole}
          onSelectRole={setCurrentRoleId}
          docsCount={documents.length}
          chunksCount={totalChunks}
          hasGeminiKey={hasGeminiKey}
        />
      </div>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col relative z-10">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            documents={documents}
            currentRole={currentRole}
            onOpenCitation={setActiveCitation}
            onOpenSettings={() => setActiveTab('settings')}
            settings={settings}
            onClearChat={() => setMessages([])}
          />
        )}

        {activeTab === 'vault' && (
          <DocumentVault
            documents={documents}
            onUploadDocument={handleUploadDocument}
            onAddTextDocument={handleAddTextDocument}
            onDeleteDocument={handleDeleteDocument}
            onResetDefaults={handleResetDefaults}
            currentRole={currentRole}
            isUploading={isUploading}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineInspector
            currentRole={currentRole}
            documents={documents}
            settings={settings}
            onRunTestQuery={handleRunTestQuery}
          />
        )}

        {activeTab === 'audit' && (
          <AuditView currentRole={currentRole} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onResetDefaults={() => setSettings(INITIAL_SETTINGS)}
            telemetryStats={telemetryStats}
          />
        )}
      </main>

      {/* Citation Inspector Side Drawer */}
      <CitationDrawer
        citation={activeCitation}
        document={activeCitationDoc}
        onClose={() => setActiveCitation(null)}
      />
    </div>
  );
}
