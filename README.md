# GenAI Stack - No-Code AI Workflow Builder

## 🎯 Assignment Overview
**Position**: Full Stack Engineer Internship 2025  
**Company**: AI Planet  
**Submission Date**: 5 September 2025

## 🚀 Live Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📋 Project Summary
GenAI Stack is a comprehensive No-Code/Low-Code web application that enables users to visually create and interact with intelligent AI workflows. Users can drag and drop components to build workflows that handle user input, extract knowledge from documents, interact with language models, and return answers through a chat interface.

## ✅ Assignment Requirements Fulfilled

### Core Components Implemented
- ✅ **User Query Component**: Entry point for user questions
- ✅ **Knowledge Base Component**: Document upload, processing, and vector search
- ✅ **LLM Engine Component**: Multi-LLM support (OpenAI GPT + Google Gemini)
- ✅ **Output Component**: Interactive chat interface

### Tech Stack Requirements Met
- ✅ **Frontend**: React.js with Vite
- ✅ **Backend**: FastAPI
- ✅ **Database**: PostgreSQL
- ✅ **Drag & Drop**: React Flow
- ✅ **Vector Store**: ChromaDB
- ✅ **LLM Integration**: OpenAI GPT + Google Gemini
- ✅ **Web Search**: SerpAPI
- ✅ **Document Processing**: PyMuPDF + python-docx

### Key Features Delivered
- ✅ Visual workflow builder with drag-and-drop interface
- ✅ Real-time chat interface for workflow execution
- ✅ Document upload and vector-based knowledge retrieval
- ✅ Multi-LLM support with web search capabilities
- ✅ Workflow validation and state management
- ✅ Responsive design with Tailwind CSS
- ✅ Complete API with comprehensive error handling

## 🏗 Architecture Overview

### Frontend Architecture
```
React.js Application (Vite)
├── WorkflowBuilder (Main Canvas)
├── ComponentLibrary (Drag Components)
├── ConfigurationPanel (Component Settings)
├── ChatModal (Interaction Interface)
└── Custom Nodes (4 Core Components)
```

### Backend Architecture
```
FastAPI Application
├── Routers (API Endpoints)
├── Services (Business Logic)
├── Models (Database Schema)
├── Schemas (Data Validation)
└── External Integrations (LLM, Vector DB, Search)
```

### Data Flow
```
User Input → Workflow Validation → Component Execution → LLM Processing → Response Display
```

## 🚦 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL (running)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Add your API keys to .env

# Start server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📱 How to Use

1. **Build Workflow**: Drag components from library to canvas
2. **Connect Components**: Draw connections between components
3. **Configure Settings**: Click components to set their parameters
4. **Build Stack**: Validate and prepare workflow for execution
5. **Chat Interface**: Test your workflow with real queries

## 🧪 Testing Examples

### Example Workflow 1: Simple Q&A
```
User Query → LLM Engine → Output
```

### Example Workflow 2: Document-Powered
```
User Query → Knowledge Base → LLM Engine → Output
```

### Example Workflow 3: Web-Enhanced
```
User Query → LLM Engine (with web search) → Output
```

## Component Types

### 1. User Query Component
- **Purpose**: Entry point for user input
- **Configuration**: Input placeholder text
- **Output**: User's question/query

### 2. Knowledge Base Component
- **Purpose**: Search through uploaded documents
- **Configuration**: Document upload, search parameters
- **Output**: Relevant document snippets

### 3. LLM Engine Component
- **Purpose**: Generate responses using AI models
- **Configuration**: Model selection, prompts, parameters
- **Supported Models**: 
  - OpenAI: gpt-4, gpt-3.5-turbo
  - Google: gemini-1.5-flash
- **Features**: Web search integration, custom system prompts

### 4. Output Component
- **Purpose**: Display final results to user
- **Configuration**: Output format, styling
- **Output**: Formatted response

## API Documentation

### Workflows
- `POST /api/workflows/` - Create new workflow
- `GET /api/workflows/{id}` - Get workflow by ID
- `PUT /api/workflows/{id}` - Update workflow
- `POST /api/workflows/{id}/chat` - Execute workflow with user message
- `POST /api/workflows/{id}/validate` - Validate workflow structure

### Documents
- `POST /api/documents/upload` - Upload document for processing
- `GET /api/documents/` - List uploaded documents
- `DELETE /api/documents/{id}` - Delete document

### Chat
- `POST /api/chat/sessions` - Create chat session
- `GET /api/chat/sessions/{id}` - Get chat history
- `POST /api/chat/sessions/{id}/messages` - Add message to session

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Verify database exists

2. **ChromaDB Connection Error**:
   - Check if port 8001 is available
   - Restart the backend server

3. **API Key Errors**:
   - Verify API keys in .env file
   - Check API key validity
   - Ensure proper formatting

4. **Frontend Build Errors**:
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📚 Documentation

- **Architecture Design**: [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md)
- **Code Documentation**: [CODE_DOCUMENTATION.md](CODE_DOCUMENTATION.md)
- **Demo Script**: [DEMO_SCRIPT.md](DEMO_SCRIPT.md)

## 🎯 Assignment Deliverables

- ✅ **Full source code** (frontend + backend)
- ✅ **README with setup instructions**
- ✅ **Clear component structure and modular design**
- ✅ **All four core components implemented**
- ✅ **Document upload and processing**
- ✅ **Vector embeddings and search**
- ✅ **LLM integration (multiple providers)**
- ✅ **Web search integration**
- ✅ **Interactive chat interface**
- ✅ **Workflow validation and execution**
- ✅ **Professional UI with Tailwind CSS**

---

**Built with ❤️ for AI Planet Full Stack Engineer Internship BY Harsh** 🚀
