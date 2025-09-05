import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import { apiCall } from '../utils/api';
import toast from 'react-hot-toast';

const ConfigurationPanel = ({ node, onUpdateConfig, workflowId }) => {
  const [config, setConfig] = useState(node.data.config || {});
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setConfig(node.data.config || {});
    // Fetch uploaded documents for knowledge base components
    if (node.data.componentType === 'knowledge-base') {
      fetchDocuments();
    }
  }, [node]);

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdateConfig(newConfig);
  };

  const fetchDocuments = async () => {
    try {
      // Fetch documents for the specific workflow if workflowId exists
      const url = workflowId 
        ? `/api/documents/?workflow_id=${workflowId}`
        : '/api/documents/';
      
      const response = await apiCall('get', url);
      if (response.success !== false) {
        // Handle both direct array response and wrapped response
        const documents = Array.isArray(response) ? response : (response.data || []);
        setUploadedDocuments(documents);
      } else {
        console.error('Error fetching documents:', response.error);
        setUploadedDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setUploadedDocuments([]);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = config.supportedFormats || ['pdf', 'txt', 'docx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast.error(`File type .${fileExtension} not supported. Allowed: ${allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size (default 10MB)
    const maxSize = config.maxFileSize || '10MB';
    const maxSizeBytes = maxSize === '10MB' ? 10 * 1024 * 1024 : 10 * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds ${maxSize} limit`);
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      if (workflowId) {
        formData.append('workflow_id', workflowId.toString());
      }
      
      const response = await fetch('http://localhost:8000/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok && result.success !== false) {
        toast.success('Document uploaded successfully!');
        fetchDocuments(); // Refresh document list
        event.target.value = ''; // Reset file input
      } else {
        throw new Error(result.error || result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      const response = await apiCall('delete', `/api/documents/${documentId}`);
      if (response.success !== false) {
        toast.success('Document deleted successfully');
        fetchDocuments(); // Refresh document list
      } else {
        throw new Error(response.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete document');
    }
  };

  const renderConfigField = (key, value, type = 'text') => {
    const commonProps = {
      value: value || '',
      onChange: (e) => handleConfigChange(key, e.target.value),
      className: 'form-input'
    };

    switch (type) {
      case 'textarea':
        return <textarea {...commonProps} rows={4} className="form-textarea" />;
      case 'number':
        return <input type="number" step="0.1" {...commonProps} />;
      case 'select':
        return (
          <select {...commonProps} className="form-select">
            {getSelectOptions(key).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleConfigChange(key, e.target.checked)}
            className="form-checkbox"
          />
        );
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  const getSelectOptions = (key) => {
    switch (key) {
      case 'model':
        return [
          { value: 'gpt-4', label: 'GPT-4' },
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
          { value: 'gemini-pro', label: 'Gemini Pro' },
        ];
      case 'embeddingModel':
        return [
          { value: 'openai', label: 'OpenAI Embeddings' },
          { value: 'gemini', label: 'Gemini Embeddings' },
        ];
      case 'searchEngine':
        return [
          { value: 'serpapi', label: 'SerpAPI' },
          { value: 'brave', label: 'Brave Search' },
        ];
      case 'displayFormat':
        return [
          { value: 'chat', label: 'Chat Interface' },
          { value: 'markdown', label: 'Markdown' },
        ];
      default:
        return [];
    }
  };

  const getFieldType = (key) => {
    const typeMap = {
      systemPrompt: 'textarea',
      temperature: 'number',
      maxTokens: 'number',
      model: 'select',
      embeddingModel: 'select',
      searchEngine: 'select',
      displayFormat: 'select',
      webSearch: 'checkbox',
      required: 'checkbox',
      showTimestamp: 'checkbox',
      allowFollowUp: 'checkbox',
    };
    return typeMap[key] || 'text';
  };

  const getFieldLabel = (key) => {
    const labelMap = {
      placeholder: 'Placeholder Text',
      required: 'Required Field',
      supportedFormats: 'Supported Formats',
      maxFileSize: 'Max File Size',
      embeddingModel: 'Embedding Model',
      vectorStore: 'Vector Store',
      model: 'LLM Model',
      temperature: 'Temperature',
      maxTokens: 'Max Tokens',
      systemPrompt: 'System Prompt',
      webSearch: 'Enable Web Search',
      searchEngine: 'Search Engine',
      displayFormat: 'Display Format',
      showTimestamp: 'Show Timestamp',
      allowFollowUp: 'Allow Follow-up',
    };
    return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getFieldDescription = (key) => {
    const descriptions = {
      placeholder: 'Text shown when input is empty',
      temperature: 'Controls randomness (0.0 = focused, 1.0 = creative)',
      maxTokens: 'Maximum length of generated response',
      systemPrompt: 'Instructions that guide the AI\'s behavior',
      webSearch: 'Enable real-time web search for current information',
      embeddingModel: 'Model used to create document embeddings',
      supportedFormats: 'File types that can be uploaded',
    };
    return descriptions[key];
  };

  return (
    <div className="panel h-full overflow-y-auto">
      <div className="p-6">
        {/* Enhanced Header */}
        <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-heading mb-1">
              Configure {node.data.label}
            </h3>
            <p className="text-caption">Customize component behavior and settings</p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-600">Configuration Active</span>
            </div>
          </div>
        </div>

        {/* Enhanced Configuration Fields */}
        <div className="space-y-8">
          {/* Document Upload Section for Knowledge Base */}
          {node.data.componentType === 'knowledge-base' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Upload className="w-5 h-5 text-green-600" />
                  <h4 className="text-sm font-semibold text-green-900">Document Upload</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-300 border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-white/80 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-green-600">Uploading...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-green-500" />
                            <p className="mb-2 text-sm text-green-700 font-medium">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-green-600">
                              {(config.supportedFormats || ['pdf', 'txt', 'docx']).map(format => `.${format}`).join(', ')}
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        accept={`${(config.supportedFormats || ['pdf', 'txt', 'docx']).map(format => `.${format}`).join(',')}`}
                      />
                    </label>
                  </div>
                  
                  {/* Document List */}
                  {uploadedDocuments.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold text-green-800 mb-2">Uploaded Documents ({uploadedDocuments.length})</h5>
                      <div className="max-h-32 overflow-y-auto space-y-2">
                        {uploadedDocuments.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                                  {doc.original_filename || doc.filename}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {doc.file_type} • {Math.round(doc.file_size / 1024)}KB
                                  {doc.processed && <span className="ml-2 text-green-600">✓ Processed</span>}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-1 text-red-400 hover:text-red-600 transition-colors"
                              title="Delete document"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {uploadedDocuments.length === 0 && (
                    <div className="text-center py-4">
                      <AlertCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-sm text-green-600">No documents uploaded yet</p>
                      <p className="text-xs text-green-500 mt-1">Upload documents to enable knowledge base search</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Regular Configuration Fields */}
          {Object.entries(config).map(([key, value]) => {
            if (key === 'supportedFormats' && Array.isArray(value)) {
              return (
                <div key={key} className="space-y-3">
                  <label className="block text-sm font-semibold text-subheading">
                    {getFieldLabel(key)}
                  </label>
                  <input
                    type="text"
                    value={value.join(', ')}
                    onChange={(e) => handleConfigChange(key, e.target.value.split(', '))}
                    className="form-input"
                    placeholder="pdf, txt, docx"
                  />
                  <p className="text-xs text-caption">Separate formats with commas</p>
                </div>
              );
            }

            const fieldType = getFieldType(key);
            
            return (
              <div key={key} className="space-y-3">
                <label className="block text-sm font-semibold text-subheading">
                  {getFieldLabel(key)}
                </label>
                
                <div className="relative">
                  {fieldType === 'checkbox' ? (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value || false}
                          onChange={(e) => handleConfigChange(key, e.target.checked)}
                          className="form-checkbox"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {getFieldLabel(key)}
                        </span>
                      </div>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors ${
                        value 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {value ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      {renderConfigField(key, value, fieldType)}
                      {fieldType === 'number' && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Enhanced Field descriptions */}
                {getFieldDescription(key) && (
                  <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-blue-700 leading-relaxed">{getFieldDescription(key)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Component Info Card */}
        <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Component Details</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-mono text-gray-800">{node.data.componentType}</span>
                </div>
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-mono text-gray-800">{node.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Position:</span>
                  <span className="font-mono text-gray-800">({Math.round(node.position.x)}, {Math.round(node.position.y)})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button className="btn-primary flex-1">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Apply Changes
          </button>
          <button className="btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;