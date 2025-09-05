import React from 'react';
import { Handle, Position } from '@xyflow/react';

const UserQueryNode = ({ data, selected }) => {
  return (
    <div className={`component-node ${selected ? 'selected' : ''} p-5 min-w-64 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 border-blue-300 shadow-node`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <span className="icon-medium text-white">💬</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-900 text-base">User Query</span>
            <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-medium rounded-full">Input</span>
          </div>
          <div className="text-xs text-blue-600 font-medium mt-1">Workflow Entry Point</div>
        </div>
      </div>
      
      <div className="text-sm text-blue-700 mb-4 leading-relaxed font-medium">
        Captures user questions and initiates the AI workflow
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs font-semibold text-blue-800">Input Preview</span>
        </div>
        <div className="text-sm text-blue-700 italic bg-blue-50/50 rounded-lg p-2 border border-blue-100">
          "{data.config?.placeholder || 'Enter your question...'}"
        </div>
      </div>
      
      {/* Enhanced Connection Status */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
          <span className="text-xs font-medium text-blue-700">Ready to connect</span>
        </div>
        <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          <span className="text-xs font-semibold">1 output</span>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="component-handle !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-blue-300 !shadow-md"
        style={{ right: -8, width: 14, height: 14 }}
      />
    </div>
  );
};

export default UserQueryNode;