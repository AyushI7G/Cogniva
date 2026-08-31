# Cogniva

### Enterprise RAG Knowledge Assistant

Cogniva is an AI-powered enterprise chatbot that lets users ask questions about internal company documents and receive grounded answers with source citations.

### Features

- Semantic + BM25 hybrid document search
- Role-Based Access Control (RBAC)
- Document chunking and embeddings
- Grounded answers with citations
- Conversational intent routing
- Gemini model fallback
- RAG pipeline telemetry and debugging tools

### Tech Stack

**Frontend:** React, TypeScript, Vite  
**Backend:** Node.js, Express.js, TypeScript  
**AI:** Gemini API, Embeddings, RAG  
**Search:** Cosine Similarity, BM25

---

### Architecture

```text
Documents
   ↓
Chunking + Embeddings
   ↓
Knowledge Base
   ↓
User Query
   ↓
Hybrid Search
   ↓
RBAC Filtering
   ↓
Relevant Context
   ↓
Gemini
   ↓
Answer + Citations
````
---

### Getting Started

```bash
git clone <repository-url>
cd cogniva
npm install
npm run dev
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key
```

---

**Built with React, TypeScript, Express.js and Gemini.**
