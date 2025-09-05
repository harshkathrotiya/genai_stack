# GenAI Stack - Demo Video Script

## 📹 Demo Video Structure (8-10 minutes)

### 1. Introduction (1 minute)
**Script**:
"Hello! I'm [Your Name], and I'm excited to present GenAI Stack, my submission for the Full Stack Engineer Internship at AI Planet. This is a comprehensive No-Code AI Workflow Builder that allows users to visually create and interact with intelligent AI workflows."

**What to Show**:
- Your face/introduction
- Application overview screen
- Brief mention of tech stack

### 2. Project Overview (1 minute)
**Script**:
"Let me start by showing you what this application does. GenAI Stack enables users to build AI-powered workflows using four core components: User Query for input, Knowledge Base for document processing, LLM Engine for AI responses, and Output for displaying results."

**What to Show**:
- Main application interface
- Component library on the left
- Empty workflow canvas
- Brief tour of the UI

### 3. Building a Simple Workflow (2 minutes)
**Script**:
"Let's start by building a simple AI chatbot workflow. I'll drag a User Query component, then an LLM Engine, and finally an Output component."

**What to Show**:
- Drag User Query component to canvas
- Drag LLM Engine component
- Drag Output component
- Connect components with lines
- Show workflow validation (green checkmark)

### 4. Component Configuration (1.5 minutes)
**Script**:
"Now let's configure these components. I'll click on the LLM Engine to set it up with Google Gemini, adjust the temperature, and add a custom system prompt."

**What to Show**:
- Click on LLM Engine component
- Configuration panel opens on right
- Change model to "gemini-1.5-flash"
- Adjust temperature slider
- Modify system prompt
- Show real-time updates

### 5. Building & Testing Simple Workflow (1.5 minutes)
**Script**:
"Now I'll build this workflow and test it. Watch as I click 'Build Stack' to validate and prepare the workflow, then 'Chat with Stack' to interact with it."

**What to Show**:
- Click "Build Stack" button
- Show success notification
- Click "Chat with Stack"
- Chat modal opens
- Type a simple question: "Hello, what can you help me with?"
- Show AI response appearing

### 6. Advanced Workflow with Knowledge Base (2 minutes)
**Script**:
"Now let me show you a more advanced workflow with document processing. I'll create a new workflow that includes a Knowledge Base component for document upload and search."

**What to Show**:
- Clear canvas or create new workflow
- Add User Query → Knowledge Base → LLM Engine → Output
- Connect all components
- Click on Knowledge Base component
- Upload a PDF document
- Show document processing status
- Configure embedding model

### 7. Testing Advanced Workflow (1 minute)
**Script**:
"Let's test this document-powered workflow. I'll ask a question related to the uploaded document and show how the system retrieves relevant context."

**What to Show**:
- Build the advanced workflow
- Open chat interface
- Ask document-related question
- Show AI response with document context
- Highlight how knowledge base enhances responses

### 8. Code Walkthrough (30 seconds)
**Script**:
"Let me quickly show you the code structure. The frontend is built with React and React Flow, while the backend uses FastAPI with proper async patterns for LLM integration."

**What to Show**:
- Quick switch to VS Code
- Show project structure
- Highlight key files:
  - WorkflowBuilder.jsx
  - LLMService.py
  - Database models
- Show async/await implementation

### 9. Conclusion (30 seconds)
**Script**:
"This GenAI Stack application demonstrates all the required features: visual workflow building, multi-LLM support, document processing, vector search, and real-time chat. It's built with modern technologies and follows best practices for production-ready applications. Thank you for your time, and I look forward to discussing this further!"

**What to Show**:
- Return to application
- Quick summary of features
- Your contact information
- Thank you slide

## 🎯 Recording Tips

### Preparation
1. **Test Everything**: Ensure all workflows work before recording
2. **Prepare Demo Data**: Have sample documents ready
3. **Clear Browser Cache**: Start with clean state
4. **Close Unnecessary Apps**: Avoid distractions
5. **Good Audio**: Use quality microphone
6. **Stable Internet**: Ensure reliable connection

### Recording Setup
- **Resolution**: 1920x1080 minimum
- **Frame Rate**: 30fps
- **Audio Quality**: Clear, no background noise
- **Screen Recording**: Use OBS, Loom, or similar
- **Zoom Level**: Ensure text is readable

### Demo Questions to Use
- "Hello, what can you help me with?"
- "Explain how workflow builders work"
- "What are the latest developments in AI?" (for web search)
- [Document-specific question based on uploaded file]

### What NOT to Show
- Real API keys (blur if visible)
- Personal information
- Error states (unless intentional)
- Long processing times (edit if needed)

## 📱 Backup Demo Plan

If live demo fails:
1. **Pre-recorded Responses**: Have example responses ready
2. **Screenshots**: Backup images of successful workflows
3. **Alternative Workflows**: Multiple working examples
4. **Explanation Mode**: Explain functionality even if not working

## 🎬 Post-Recording Checklist

1. **Review Full Video**: Watch entire recording
2. **Check Audio Quality**: Ensure clear throughout
3. **Verify All Features Shown**: Confirm completeness
4. **Test Video Playback**: Multiple devices/browsers
5. **Upload to Platform**: YouTube, Loom, or Google Drive
6. **Share Link**: Ensure public accessibility
7. **Backup Copy**: Keep local copy safe

## 📝 Video Description Template

```
GenAI Stack - No-Code AI Workflow Builder Demo

🎯 Assignment Submission for Full Stack Engineer Internship at AI Planet

Features Demonstrated:
✅ Visual workflow building with React Flow
✅ 4 core AI components (User Query, Knowledge Base, LLM Engine, Output)
✅ Multi-LLM support (OpenAI GPT + Google Gemini)
✅ Document upload and vector search
✅ Real-time chat interface
✅ Web search integration
✅ Professional UI with Tailwind CSS

Tech Stack:
- Frontend: React.js + Vite + Tailwind CSS
- Backend: FastAPI + PostgreSQL + ChromaDB
- AI: OpenAI GPT + Google Gemini + SerpAPI

Developer: Harsh Katharotiya
Email: harshkathrotiya2759@gmail.com
GitHub: https://github.com/harshkathrotiya/genai_stack
Documentation: https://docs.google.com/document/d/1LFhjV9dCHb95nzquQsopqV9NiwwqsMhgBNckzj_dmmo/edit?usp=sharing

Timestamps:
0:00 - Introduction
1:00 - Project Overview
2:00 - Building Simple Workflow
4:00 - Component Configuration
5:30 - Testing Workflow
6:30 - Advanced Features
8:00 - Code Walkthrough
9:00 - Conclusion
```