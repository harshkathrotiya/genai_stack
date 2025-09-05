import React from 'react';
import { COMPONENT_TYPES } from '../constants/components';

const ComponentLibrary = () => {
  const onDragStart = (event, componentType) => {
    event.dataTransfer.setData('application/reactflow', componentType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const getComponentColor = (type) => {
    const colors = {
      'user-query': 'border-blue-200 hover:border-blue-300 bg-blue-50/50',
      'knowledge-base': 'border-green-200 hover:border-green-300 bg-green-50/50',
      'llm-engine': 'border-purple-200 hover:border-purple-300 bg-purple-50/50',
      'output': 'border-amber-200 hover:border-amber-300 bg-amber-50/50',
    };
    return colors[type] || 'border-gray-200 hover:border-gray-300 bg-gray-50/50';
  };

  const getIconColor = (type) => {
    const colors = {
      'user-query': 'text-blue-600',
      'knowledge-base': 'text-green-600',
      'llm-engine': 'text-purple-600',
      'output': 'text-amber-600',
    };
    return colors[type] || 'text-gray-600';
  };

  return (
    <div className="p-6 h-full">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4l2 2m0 0l-2 2m2-2H9m10 4v6a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-heading">Component Library</h3>
            <p className="text-caption">Drag & drop to build workflows</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 border border-primary-100">
          <p className="text-sm text-primary-700 leading-relaxed">
            ✨ Build powerful AI workflows by connecting these components together
          </p>
        </div>
      </div>

      {/* Enhanced Component Grid */}
      <div className="space-y-4">
        {COMPONENT_TYPES.map((component) => (
          <div
            key={component.id}
            className={`library-component group ${getComponentColor(component.type)}`}
            draggable
            onDragStart={(event) => onDragStart(event, component.type)}
          >
            <div className="flex items-start space-x-4">
              <div className={`${getIconColor(component.type)} transition-transform duration-200 group-hover:scale-110 flex-shrink-0`}>
                <span className="icon-large block w-8 h-8 flex items-center justify-center">{component.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-base font-semibold text-gray-900 group-hover:${getIconColor(component.type).replace('text-', 'text-')} transition-colors`}>
                    {component.label}
                  </h4>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {component.description}
                </p>
                
                {/* Enhanced Connection Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {component.inputs.length > 0 && (
                      <div className="flex items-center space-x-1.5">
                        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-500">
                          {component.inputs.length} input{component.inputs.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {component.outputs.length > 0 && (
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-medium text-gray-500">
                          {component.outputs.length} output{component.outputs.length > 1 ? 's' : ''}
                        </span>
                        <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getComponentColor(component.type).includes('blue') ? 'bg-blue-100 text-blue-700' : getComponentColor(component.type).includes('green') ? 'bg-green-100 text-green-700' : getComponentColor(component.type).includes('purple') ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                    Ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Instructions */}
      <div className="mt-8 bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 rounded-xl p-5 border border-primary-200/50 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-primary-900 mb-3 flex items-center">
              <span>Quick Start Guide</span>
              <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">4 Steps</span>
            </h4>
            <div className="grid gap-2">
              <div className="flex items-start space-x-3 p-2 bg-white/60 rounded-lg border border-primary-100/50">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span className="text-xs text-primary-800 font-medium">Drag components to canvas</span>
              </div>
              <div className="flex items-start space-x-3 p-2 bg-white/60 rounded-lg border border-primary-100/50">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span className="text-xs text-primary-800 font-medium">Connect outputs to inputs</span>
              </div>
              <div className="flex items-start space-x-3 p-2 bg-white/60 rounded-lg border border-primary-100/50">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span className="text-xs text-primary-800 font-medium">Click nodes to configure</span>
              </div>
              <div className="flex items-start space-x-3 p-2 bg-white/60 rounded-lg border border-primary-100/50">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                <span className="text-xs text-primary-800 font-medium">Build & test workflow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Component Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-primary-600 mb-1">{COMPONENT_TYPES.length}</div>
          <div className="text-xs font-medium text-gray-600">Components</div>
          <div className="mt-2 flex justify-center">
            <div className="flex -space-x-1">
              {COMPONENT_TYPES.slice(0, 3).map((component, index) => (
                <div key={index} className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border border-white flex items-center justify-center text-white" style={{ zIndex: 3 - index }}>
                  <span className="icon-small">{component.icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-green-600 mb-1">∞</div>
          <div className="text-xs font-medium text-gray-600">Possibilities</div>
          <div className="mt-2 text-xs text-green-600 font-medium">
            Unlimited creativity
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;