# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# GenAI Stack Frontend

React.js frontend application for the GenAI Stack visual workflow builder.

## 🎨 Technology Stack

- **React.js** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Flow** - Node-based editor for workflows
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## 📂 Project Structure

```
src/
├── components/
│   ├── Chat/
│   │   └── ChatModal.jsx          # Chat interface component
│   ├── Layout/
│   │   └── Header.jsx             # Application header
│   ├── Nodes/                     # Custom React Flow nodes
│   │   ├── UserQueryNode.jsx      # User input component
│   │   ├── KnowledgeBaseNode.jsx  # Document search component
│   │   ├── LLMEngineNode.jsx      # AI processing component
│   │   └── OutputNode.jsx         # Response display component
│   ├── ComponentLibrary.jsx       # Draggable component palette
│   ├── ConfigurationPanel.jsx     # Component configuration UI
│   └── WorkflowBuilder.jsx        # Main workspace component
├── constants/
│   └── components.js              # Component definitions and validation
├── utils/
│   └── api.js                     # API client configuration
├── App.jsx                        # Root component
├── main.jsx                       # Application entry point
└── index.css                      # Global styles and Tailwind imports

```


## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

```
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

```


### Environment Configuration

Create a `.env` file in the frontend directory:

```
VITE_API_BASE_URL=http://localhost:8000

```


## 📝 Components Overview

### Core Workflow Components

1. **User Query Component** (`UserQueryNode.jsx`)
   - Entry point for user input
   - Configurable placeholder text
   - Single output connection

2. **Knowledge Base Component** (`KnowledgeBaseNode.jsx`)
   - Document upload and processing
   - Vector search capabilities
   - Configurable embedding models

3. **LLM Engine Component** (`LLMEngineNode.jsx`)
   - AI text generation
   - Multiple LLM provider support
   - Web search integration
   - Configurable parameters (temperature, max tokens)

4. **Output Component** (`OutputNode.jsx`)
   - Response display
   - Chat interface
   - Follow-up conversation support

### UI Components

- **WorkflowBuilder**: Main canvas for building workflows
- **ComponentLibrary**: Drag-and-drop component palette
- **ConfigurationPanel**: Dynamic component configuration
- **ChatModal**: Real-time chat interface

## 🌐 API Integration

The frontend communicates with the FastAPI backend through:

- **Workflow Management**: Create, read, update workflows
- **Document Upload**: File processing and storage
- **Chat Execution**: Real-time workflow execution
- **Configuration**: Component settings and validation

### API Client (`utils/api.js`)

```
import { apiCall } from './utils/api';

// Create workflow
const response = await apiCall('post', '/api/workflows/', workflowData);

// Upload document
const formData = new FormData();
formData.append('file', file);
const uploadResponse = await apiCall('post', '/api/documents/upload', formData);

// Chat with workflow
const chatResponse = await apiCall('post', `/api/workflows/${id}/chat`, { message });

```


## 🎨 Styling and Design

### Tailwind CSS Configuration

Custom design system with:

- **Primary Colors**: Blue palette for main actions
- **Gray Scale**: Comprehensive gray scale for UI elements
- **Typography**: Inter font family
- **Components**: Custom component styles for React Flow nodes

### React Flow Customization

- Custom node types for each component
- Styled connection handles
- Custom edge styling
- Responsive canvas controls

## 🛠 Development

### Adding New Components

1. **Define Component Type** in `constants/components.js`:

   ```
   {
     id: 'new-component',
     type: 'new-component',
     label: 'New Component',
     icon: '🛠',
     description: 'Component description',
     inputs: ['input1'],
     outputs: ['output1'],
     config: { /* default config */ }
   }

   ```


2. **Create Node Component** in `components/Nodes/`:

   ```
   const NewComponentNode = ({ data, selected }) => {
     return (
       <div className={`component-node ${selected ? 'selected' : ''}`}>
         {/* Component UI */}
         <Handle type="target" position={Position.Left} />
         <Handle type="source" position={Position.Right} />
       </div>
     );
   };

   ```


3. **Register Node Type** in `WorkflowBuilder.jsx`:

   ```
   const nodeTypes = {
     'new-component': NewComponentNode,
     // ... other nodes
   };

   ```


### State Management

The application uses React hooks for state management:

- **useNodesState**: React Flow nodes state
- **useEdgesState**: React Flow edges state
- **useState**: Component-level state
- **useCallback**: Performance optimization

### Event Handling

- **Drag and Drop**: Component library to canvas
- **Node Selection**: Configuration panel updates
- **Connection**: Workflow edge creation
- **Validation**: Real-time workflow validation

## 🧪 Testing

### Running Tests

```
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

```


### Testing Strategy

- **Component Tests**: Each component has unit tests
- **Integration Tests**: Workflow building and execution
- **E2E Tests**: Complete user scenarios

## 🚀 Build and Deployment

### Production Build

```
# Create production build
npm run build

# Files generated in dist/ directory
# - index.html
# - assets/index-[hash].js
# - assets/index-[hash].css

```


### Deployment Options

1. **Static Hosting**: Deploy `dist/` folder to Netlify, Vercel, or AWS S3
2. **Docker**: Use provided Dockerfile
3. **CDN**: Upload assets to CDN for better performance

### Environment Variables

- `VITE_API_BASE_URL`: Backend API URL
- `VITE_APP_NAME`: Application name (optional)
- `VITE_VERSION`: App version (optional)

## 🛠 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check backend server is running
   - Verify CORS configuration
   - Check environment variables

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **React Flow Issues**
   - Ensure proper node type registration
   - Check handle positioning
   - Verify connection validation logic

### Debug Mode

Enable debug logging:

```
// In main.jsx or App.jsx
if (import.meta.env.DEV) {
  console.log('Debug mode enabled');
}

```


## 🚀 Performance Optimization

- **Code Splitting**: Lazy load components
- **Memoization**: Use React.memo for expensive components
- **Bundle Analysis**: Use `npm run build -- --analyze`
- **Image Optimization**: Optimize icons and images
- **Caching**: Configure browser caching for static assets

## 🤝 Contributing

When contributing to the frontend:

1. Follow React best practices
2. Use TypeScript for new components (if migrating)
3. Add proper PropTypes validation
4. Include unit tests for new components
5. Update documentation for new features
6. Follow the existing code style

### Code Style

- Use functional components with hooks
- Follow naming conventions (PascalCase for components)
- Use descriptive variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused
