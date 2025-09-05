import React from 'react';
import { Handle, Position } from '@xyflow/react';

const LLMEngineNode = ({ data, selected }) => {
  return (
    <div className={`component-node ${selected ? 'selected' : ''} p-5 min-w-72 bg-gradient-to-br from-purple-50 via-purple-100 to-violet-100 border-purple-300 shadow-node`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <span className="icon-medium text-white">🤖</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-900 text-base">LLM Engine</span>
            <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-medium rounded-full">AI Core</span>
          </div>
          <div className="text-xs text-purple-600 font-medium mt-1">Intelligent Processing</div>
        </div>
      </div>
      
      <div className="text-sm text-purple-700 mb-4 leading-relaxed font-medium">
        Advanced AI model that processes queries with context awareness
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200/50 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-xs font-semibold text-purple-800">Model Settings</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-purple-50/50 rounded-lg">
            <span className="text-xs font-medium text-purple-800">Model:</span>
            <span className="text-xs text-purple-600 font-mono bg-purple-100 px-2 py-1 rounded">{data.config?.model || 'GPT-4'}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-purple-50/50 rounded-lg">
            <span className="text-xs font-medium text-purple-800">Temperature:</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-1.5 bg-purple-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-300" 
                  style={{ width: `${(data.config?.temperature || 0.7) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-purple-600 font-semibold">{data.config?.temperature || 0.7}</span>
            </div>
          </div>
          <div className="flex justify-between items-center p-2 bg-purple-50/50 rounded-lg">
            <span className="text-xs font-medium text-purple-800">Web Search:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-4 rounded-full transition-all duration-300 ${
                data.config?.webSearch ? 'bg-green-400' : 'bg-gray-300'
              } relative`}>
                <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                  data.config?.webSearch ? 'translate-x-4' : 'translate-x-0.5'
                } shadow-sm`}></div>
              </div>
              <span className={`text-xs font-semibold ${
                data.config?.webSearch ? 'text-green-600' : 'text-gray-500'
              }`}>
                {data.config?.webSearch ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Connection Status */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-sm"></div>
            <span className="text-xs font-medium text-purple-700">Query</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
            <span className="text-xs font-medium text-purple-700">Context</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
          <span className="text-xs font-semibold">Response</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        id="query"
        className="component-handle !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-blue-300 !shadow-md"
        style={{ left: -8, top: '35%', width: 14, height: 14 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="context"
        className="component-handle !bg-gradient-to-r !from-green-500 !to-green-600 !border-green-300 !shadow-md"
        style={{ left: -8, top: '65%', width: 14, height: 14 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="component-handle !bg-gradient-to-r !from-purple-500 !to-purple-600 !border-purple-300 !shadow-md"
        style={{ right: -8, width: 14, height: 14 }}
      />
    </div>
  );
};

export default LLMEngineNode;