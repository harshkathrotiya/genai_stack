import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ComponentLibrary from './ComponentLibrary';
import ConfigurationPanel from './ConfigurationPanel';
import ChatModal from './Chat/ChatModal';
import { COMPONENT_TYPES, validateWorkflowConnections } from '../constants/components';
import { apiCall } from '../utils/api';
import toast from 'react-hot-toast';

// Custom node types
import UserQueryNode from './Nodes/UserQueryNode';
import KnowledgeBaseNode from './Nodes/KnowledgeBaseNode';
import LLMEngineNode from './Nodes/LLMEngineNode';
import OutputNode from './Nodes/OutputNode';

const nodeTypes = {
  'user-query': UserQueryNode,
  'knowledge-base': KnowledgeBaseNode,
  'llm-engine': LLMEngineNode,
  'output': OutputNode,
};

const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);
  const [savedWorkflow, setSavedWorkflow] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const reactFlowWrapper = useRef(null);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event, node) => {
      setSelectedNode(node);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const component = COMPONENT_TYPES.find(c => c.type === type);

      if (!component || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: component.label,
          componentType: component.type,
          config: { ...component.config },
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const updateNodeConfig = useCallback(
    (nodeId, newConfig) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, config: newConfig } }
            : node
        )
      );
    },
    [setNodes]
  );

  const validateWorkflow = useCallback(() => {
    return validateWorkflowConnections(nodes, edges);
  }, [nodes, edges]);

  const handleBuildStack = useCallback(async () => {
    if (!validateWorkflow()) {
      toast.error('Please create a valid workflow with proper connections');
      return;
    }
    
    try {
      setIsSaving(true);
      
      let currentWorkflowId = workflowId;
      let workflowData = null;
      
      // If no saved workflow, create a new one
      if (!savedWorkflow) {
        const createResponse = await apiCall('post', '/api/workflows/', {
          name: `Workflow ${new Date().toLocaleString()}`,
          description: 'Auto-generated workflow',
          nodes: nodes,
          edges: edges
        });
        
        if (createResponse.success === false) {
          throw new Error(createResponse.error || 'Failed to create workflow');
        }
        
        currentWorkflowId = createResponse.data.workflow_id;
        workflowData = { workflow_id: currentWorkflowId, ...createResponse.data };
        setSavedWorkflow(workflowData);
      } else {
        // Update existing workflow
        const updateResponse = await apiCall('put', `/api/workflows/${savedWorkflow.workflow_id}`, {
          nodes: nodes,
          edges: edges
        });
        
        if (updateResponse.success === false) {
          throw new Error(updateResponse.error || 'Failed to update workflow');
        }
        
        currentWorkflowId = savedWorkflow.workflow_id;
      }
      
      // Validate the workflow on the backend
      const validateResponse = await apiCall('post', `/api/workflows/${currentWorkflowId}/validate`);
      
      if (validateResponse.success === false) {
        throw new Error(validateResponse.error || 'Failed to validate workflow');
      }
      
      if (validateResponse.data && validateResponse.data.is_valid) {
        setWorkflowId(currentWorkflowId);
        toast.success('Workflow built and validated successfully!');
      } else {
        toast.error('Workflow validation failed on the backend');
      }
      
    } catch (error) {
      console.error('Build stack error:', error);
      toast.error(error.message || 'Failed to build workflow');
    } finally {
      setIsSaving(false);
    }
  }, [validateWorkflow, nodes, edges, workflowId, savedWorkflow]);

  const handleChatWithStack = useCallback(() => {
    if (!workflowId) {
      toast.error('Please build the stack first');
      return;
    }
    setShowChat(true);
  }, [workflowId]);

  const handleSaveWorkflow = useCallback(async () => {
    try {
      setIsSaving(true);
      
      if (!savedWorkflow) {
        // Create new workflow
        const response = await apiCall('post', '/api/workflows/', {
          name: `Workflow ${new Date().toLocaleString()}`,
          description: 'Custom AI workflow',
          nodes: nodes,
          edges: edges
        });
        
        if (response.success !== false) {
          const workflowData = { workflow_id: response.data.workflow_id, ...response.data };
          setSavedWorkflow(workflowData);
          toast.success('Workflow saved successfully!');
        } else {
          throw new Error(response.error || 'Failed to save workflow');
        }
      } else {
        // Update existing workflow
        const response = await apiCall('put', `/api/workflows/${savedWorkflow.workflow_id}`, {
          nodes: nodes,
          edges: edges
        });
        
        if (response.success !== false) {
          toast.success('Workflow updated successfully!');
        } else {
          throw new Error(response.error || 'Failed to update workflow');
        }
      }
    } catch (error) {
      console.error('Save workflow error:', error);
      toast.error(error.message || 'Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  }, [nodes, edges, savedWorkflow]);

  const isValid = validateWorkflow();

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Component Library */}
      <div className="w-80 workspace-sidebar overflow-y-auto">
        <ComponentLibrary />
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <div className="workspace-header h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="GenAI Stack" className="h-8 w-8 rounded-lg" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">GenAI Stack</h2>
                <p className="text-xs text-gray-500">Visual Workflow Builder</p>
              </div>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Workflow Status:</span>
              <span className={isValid ? 'status-valid' : 'status-invalid'}>
                {isValid ? '✓ Valid Workflow' : '⚠ Invalid Workflow'}
              </span>
              {savedWorkflow && (
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Saved (ID: {savedWorkflow.workflow_id})
                </span>
              )}
              {workflowId && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Built & Ready
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveWorkflow}
              disabled={isSaving}
              className={isSaving ? 'btn-disabled' : 'btn-secondary'}
            >
              {isSaving ? (
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleBuildStack}
              disabled={!isValid || isSaving}
              className={isValid && !isSaving ? 'btn-primary' : 'btn-disabled'}
            >
              {isSaving ? (
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {isSaving ? 'Building...' : 'Build Stack'}
            </button>
            <button
              onClick={handleChatWithStack}
              disabled={!workflowId}
              className={workflowId ? 'btn-success' : 'btn-disabled'}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat with Stack
            </button>
          </div>
        </div>

        {/* Enhanced Canvas */}
        <div className="flex-1 workspace-canvas" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gradient-to-br from-gray-50 to-blue-50"
          >
            <Controls className="bg-white border border-gray-200 rounded-xl shadow-component" />
            <MiniMap 
              className="bg-white border border-gray-200 rounded-xl shadow-component"
              nodeStrokeColor={(n) => {
                if (n.data?.componentType === 'user-query') return '#3b82f6';
                if (n.data?.componentType === 'knowledge-base') return '#10b981';
                if (n.data?.componentType === 'llm-engine') return '#8b5cf6';
                if (n.data?.componentType === 'output') return '#f59e0b';
                return '#6b7280';
              }}
              nodeColor={(n) => {
                if (n.data?.componentType === 'user-query') return '#dbeafe';
                if (n.data?.componentType === 'knowledge-base') return '#d1fae5';
                if (n.data?.componentType === 'llm-engine') return '#ede9fe';
                if (n.data?.componentType === 'output') return '#fef3c7';
                return '#f3f4f6';
              }}
            />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="opacity-30" />
          </ReactFlow>
          
          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Workflow</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Drag components from the library to create your AI-powered workflow. 
                  Connect them to build intelligent automation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Configuration Panel */}
      {selectedNode && (
        <div className="w-80 workspace-sidebar border-l border-gray-200 overflow-y-auto animate-slide-in">
          <ConfigurationPanel
            node={selectedNode}
            onUpdateConfig={(config) => updateNodeConfig(selectedNode.id, config)}
            workflowId={workflowId}
          />
        </div>
      )}

      {/* Enhanced Chat Modal */}
      {showChat && workflowId && (
        <ChatModal
          workflowId={workflowId}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default WorkflowBuilder;