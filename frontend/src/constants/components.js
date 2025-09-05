export const COMPONENT_TYPES = [
  {
    id: 'user-query',
    type: 'user-query',
    label: 'User Query',
    icon: '💬',
    description: 'Accepts user queries and serves as the entry point for workflows',
    inputs: [],
    outputs: ['query'],
    config: {
      placeholder: 'Enter your question...',
      required: true,
    },
  },
  {
    id: 'knowledge-base',
    type: 'knowledge-base',
    label: 'Knowledge Base',
    icon: '📚',
    description: 'Upload documents, extract text, and retrieve relevant context',
    inputs: ['query'],
    outputs: ['context'],
    config: {
      supportedFormats: ['pdf', 'txt', 'docx'],
      maxFileSize: '10MB',
      embeddingModel: 'openai',
      vectorStore: 'chromadb',
    },
  },
  {
    id: 'llm-engine',
    type: 'llm-engine',
    label: 'LLM Engine',
    icon: '🤖',
    description: 'Process queries with LLM and optionally search the web',
    inputs: ['query', 'context'],
    outputs: ['response'],
    config: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: 'You are a helpful AI assistant.',
      webSearch: false,
      searchEngine: 'serpapi',
    },
  },
  {
    id: 'output',
    type: 'output',
    label: 'Output',
    icon: '📤',
    description: 'Display final responses in a chat interface',
    inputs: ['response'],
    outputs: [],
    config: {
      displayFormat: 'chat',
      showTimestamp: true,
      allowFollowUp: true,
    },
  },
];

export const getComponentByType = (type) => {
  return COMPONENT_TYPES.find(component => component.type === type);
};

export const validateWorkflowConnections = (nodes, edges) => {
  // Basic validation: check if workflow has valid start and end points
  const hasUserQuery = nodes.some(node => node.data.componentType === 'user-query');
  const hasOutput = nodes.some(node => node.data.componentType === 'output');
  
  if (!hasUserQuery || !hasOutput) {
    return false;
  }
  
  // Check if all nodes are connected properly
  const nodeIds = nodes.map(node => node.id);
  const connectedNodes = new Set();
  
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });
  
  // All nodes should be connected except standalone user-query might be acceptable
  return nodeIds.every(id => connectedNodes.has(id) || 
    nodes.find(node => node.id === id)?.data.componentType === 'user-query'
  );
};