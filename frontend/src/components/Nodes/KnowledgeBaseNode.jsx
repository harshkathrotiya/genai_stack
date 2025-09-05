import React from 'react';
import { Handle, Position } from '@xyflow/react';

const KnowledgeBaseNode = ({ data, selected }) => {
  return (
    <div className={`component-node ${selected ? 'selected' : ''} p-5 min-w-64 bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 border-green-300 shadow-node`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
          <span className="icon-medium text-white">📚</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-green-900 text-base">Knowledge Base</span>
            <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded-full">Search</span>
          </div>
          <div className="text-xs text-green-600 font-medium mt-1">Document Retrieval</div>
        </div>
      </div>
      
      <div className="text-sm text-green-700 mb-4 leading-relaxed font-medium">
        Searches through documents to find relevant context and information
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-200/50 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          <span className="text-xs font-semibold text-green-800">Configuration</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-green-50/50 rounded-lg">
            <span className="text-xs font-medium text-green-800">Embedding Model:</span>
            <span className="text-xs text-green-600 font-semibold">{data.config?.embeddingModel || 'OpenAI'}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-green-50/50 rounded-lg">
            <span className="text-xs font-medium text-green-800">Vector Store:</span>
            <span className="text-xs text-green-600 font-semibold">{data.config?.vectorStore || 'ChromaDB'}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-green-50/50 rounded-lg">
            <span className="text-xs font-medium text-green-800">Supported:</span>
            <span className="text-xs text-green-600 font-semibold">{data.config?.supportedFormats?.join(', ') || 'PDF, TXT, DOCX'}</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Connection Status */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-sm"></div>
          <span className="text-xs font-medium text-green-700">Accepts queries</span>
        </div>
        <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
          <span className="text-xs font-semibold">Context out</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="component-handle !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-blue-300 !shadow-md"
        style={{ left: -8, width: 14, height: 14 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="component-handle !bg-gradient-to-r !from-green-500 !to-green-600 !border-green-300 !shadow-md"
        style={{ right: -8, width: 14, height: 14 }}
      />
    </div>
  );
};

export default KnowledgeBaseNode;