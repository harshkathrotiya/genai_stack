import React from 'react';
import { Handle, Position } from '@xyflow/react';

const OutputNode = ({ data, selected }) => {
  return (
    <div className={`component-node ${selected ? 'selected' : ''} p-5 min-w-64 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100 border-amber-300 shadow-node`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
          <span className="icon-medium text-white">📤</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 text-base">Output</span>
            <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-medium rounded-full">Display</span>
          </div>
          <div className="text-xs text-amber-600 font-medium mt-1">Response Interface</div>
        </div>
      </div>
      
      <div className="text-sm text-amber-700 mb-4 leading-relaxed font-medium">
        Presents AI responses in an interactive chat interface
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h8.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs font-semibold text-amber-800">Display Options</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-amber-50/50 rounded-lg">
            <span className="text-xs font-medium text-amber-800">Format:</span>
            <span className="text-xs text-amber-600 font-semibold bg-amber-100 px-2 py-1 rounded capitalize">{data.config?.displayFormat || 'Chat'}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-amber-50/50 rounded-lg">
            <span className="text-xs font-medium text-amber-800">Timestamp:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-4 rounded-full transition-all duration-300 ${
                data.config?.showTimestamp ? 'bg-green-400' : 'bg-gray-300'
              } relative`}>
                <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                  data.config?.showTimestamp ? 'translate-x-4' : 'translate-x-0.5'
                } shadow-sm`}></div>
              </div>
              <span className={`text-xs font-semibold ${
                data.config?.showTimestamp ? 'text-green-600' : 'text-gray-500'
              }`}>
                {data.config?.showTimestamp ? 'Visible' : 'Hidden'}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center p-2 bg-amber-50/50 rounded-lg">
            <span className="text-xs font-medium text-amber-800">Follow-up:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-4 rounded-full transition-all duration-300 ${
                data.config?.allowFollowUp ? 'bg-green-400' : 'bg-gray-300'
              } relative`}>
                <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                  data.config?.allowFollowUp ? 'translate-x-4' : 'translate-x-0.5'
                } shadow-sm`}></div>
              </div>
              <span className={`text-xs font-semibold ${
                data.config?.allowFollowUp ? 'text-green-600' : 'text-gray-500'
              }`}>
                {data.config?.allowFollowUp ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Connection Status */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-sm"></div>
          <span className="text-xs font-medium text-amber-700">Receives responses</span>
        </div>
        <div className="flex items-center space-x-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
          <span className="text-xs font-semibold">Final display</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
          </svg>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="component-handle !bg-gradient-to-r !from-purple-500 !to-purple-600 !border-purple-300 !shadow-md"
        style={{ left: -8, width: 14, height: 14 }}
      />
    </div>
  );
};

export default OutputNode;