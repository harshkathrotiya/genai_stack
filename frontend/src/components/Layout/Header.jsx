import React from 'react';
import { Play, Settings, Save } from 'lucide-react';

const Header = ({
  onBuildStack,
  onChatWithStack,
  onSaveWorkflow,
  onSettings,
  isWorkflowValid = false,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="GenAI Stack" 
            className="h-8 w-8"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">GenAI Stack</h1>
            <p className="text-sm text-gray-500">Visual Workflow Builder</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onSaveWorkflow}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
          
          <button
            onClick={onBuildStack}
            disabled={!isWorkflowValid}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              isWorkflowValid
                ? 'text-white bg-primary-600 hover:bg-primary-700'
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Build Stack
          </button>
          
          <button
            onClick={onChatWithStack}
            disabled={!isWorkflowValid}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isWorkflowValid
                ? 'text-white bg-green-600 hover:bg-green-700'
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 mr-2" />
            Chat with Stack
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;