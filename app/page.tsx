"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, Scissors, RotateCw, Download, Image, Lock, X, CheckCircle } from 'lucide-react';

import { type LucideIcon } from 'lucide-react';

type ToolId = 'merge' | 'split' | 'compress' | 'convert' | 'rotate' | 'protect';

interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  acceptMultiple: boolean;
}

interface ProcessResult {
  name: string;
  size: number;
  type: string;
  multiple?: boolean;
  count?: number;
  compressionRatio?: number;
  format?: 'PNG' | 'JPG';
  rotation?: string;
  protected?: boolean;
}

const PDFTools = () => {
  const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools: Tool[] = [
    {
      id: 'merge',
      name: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
      acceptMultiple: true
    },
    {
      id: 'split',
      name: 'Split PDF',
      description: 'Split a PDF into separate pages or ranges',
      icon: Scissors,
      color: 'bg-green-500 hover:bg-green-600',
      acceptMultiple: false
    },
    {
      id: 'compress',
      name: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      icon: FileText,
      color: 'bg-orange-500 hover:bg-orange-600',
      acceptMultiple: false
    },
    {
      id: 'convert',
      name: 'Convert to Images',
      description: 'Convert PDF pages to JPG or PNG images',
      icon: Image,
      color: 'bg-purple-500 hover:bg-purple-600',
      acceptMultiple: false
    },
    {
      id: 'rotate',
      name: 'Rotate Pages',
      description: 'Rotate PDF pages clockwise or counterclockwise',
      icon: RotateCw,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      acceptMultiple: false
    },
    {
      id: 'protect',
      name: 'Password Protect',
      description: 'Add password protection to your PDF',
      icon: Lock,
      color: 'bg-red-500 hover:bg-red-600',
      acceptMultiple: false
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const tool = tools.find(t => t.id === selectedTool);

    if (tool && !tool.acceptMultiple && selectedFiles.length > 1) {
      alert('This tool only accepts one file at a time.');
      return;
    }

    setFiles(selectedFiles);
    setResult(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.type === 'application/pdf'
    );

    if (droppedFiles.length === 0) {
      alert('Please drop PDF files only.');
      return;
    }

    const tool = tools.find(t => t.id === selectedTool);
    if (tool && !tool.acceptMultiple && droppedFiles.length > 1) {
      alert('This tool only accepts one file at a time.');
      return;
    }

    setFiles(droppedFiles);
    setResult(null);
  };

  const simulateProcessing = async (toolId: string) => {
    setIsProcessing(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    const fileName = files[0]?.name || 'document.pdf';
    const baseName = fileName.replace('.pdf', '');

    let resultFile: ProcessResult;
    switch (toolId) {
      case 'merge':
        resultFile = {
          name: 'merged_document.pdf',
          size: files.reduce((sum, file) => sum + file.size, 0),
          type: 'application/pdf'
        };
        break;
      case 'split':
        resultFile = {
          name: `${baseName}_pages.zip`,
          size: files[0].size * 0.8,
          type: 'application/zip',
          multiple: true,
          count: Math.floor(Math.random() * 10) + 2
        };
        break;
      case 'compress':
        resultFile = {
          name: `${baseName}_compressed.pdf`,
          size: files[0].size * (0.3 + Math.random() * 0.4),
          type: 'application/pdf',
          compressionRatio: Math.floor((1 - (0.3 + Math.random() * 0.4)) * 100)
        };
        break;
      case 'convert':
        resultFile = {
          name: `${baseName}_images.zip`,
          size: files[0].size * 1.2,
          type: 'application/zip',
          multiple: true,
          format: 'PNG',
          count: Math.floor(Math.random() * 20) + 1
        };
        break;
      case 'rotate':
        resultFile = {
          name: `${baseName}_rotated.pdf`,
          size: files[0].size,
          type: 'application/pdf',
          rotation: '90° clockwise'
        };
        break;
      case 'protect':
        resultFile = {
          name: `${baseName}_protected.pdf`,
          size: files[0].size * 1.01,
          type: 'application/pdf',
          protected: true
        };
        break;
      default:
        resultFile = {
          name: `${baseName}_processed.pdf`,
          size: files[0].size,
          type: 'application/pdf'
        };
    }

    setResult(resultFile);
    setIsProcessing(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetTool = () => {
    setSelectedTool(null);
    setFiles([]);
    setResult(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectedToolData = tools.find(t => t.id === selectedTool);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">PDF Tools</h1>
          </div>
          <p className="text-lg text-gray-600">
            Professional PDF processing tools for all your document needs
          </p>
        </div>

        {!selectedTool ? (
          /* Tool Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl border border-gray-200"
                >
                  <div className={`w-16 h-16 ${tool.color} rounded-lg flex items-center justify-center mb-4 transition-colors duration-200`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600">
                    {tool.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* Selected Tool Interface */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Tool Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${selectedToolData?.color} rounded-lg flex items-center justify-center mr-4`}>
                    {selectedToolData && <selectedToolData.icon className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedToolData?.name}
                    </h2>
                    <p className="text-gray-600">
                      {selectedToolData?.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetTool}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* File Upload Area */}
              {files.length === 0 && !result && (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors duration-200"
                >
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {selectedToolData?.acceptMultiple
                      ? 'Upload PDF files or drag & drop'
                      : 'Upload a PDF file or drag & drop'
                    }
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {selectedToolData?.acceptMultiple
                      ? 'You can select multiple PDF files'
                      : 'Only one PDF file is allowed'
                    }
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    multiple={selectedToolData?.acceptMultiple}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Choose Files
                  </button>
                </div>
              )}

              {/* File List */}
              {files.length > 0 && !result && (
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Selected Files:
                  </h3>
                  {files.map((file, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-red-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800">{file.name}</p>
                          <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      if (selectedTool) {
                        simulateProcessing(selectedTool);
                      }
                    }}
                    disabled={isProcessing}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Process Files'
                    )}
                  </button>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold text-green-800">
                      Processing Complete!
                    </h3>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Download className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800">{result.name}</p>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(result.size)}
                            {result.multiple && ` • ${result.count} files`}
                            {result.compressionRatio && ` • ${result.compressionRatio}% smaller`}
                            {result.format && ` • ${result.format} format`}
                            {result.rotation && ` • Rotated ${result.rotation}`}
                            {result.protected && ' • Password protected'}
                          </p>
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={resetTool}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                    >
                      Process New Files
                    </button>
                    <button
                      onClick={() => {
                        setFiles([]);
                        setResult(null);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      Use Same Tool
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Footer */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Secure Processing</h4>
              <p className="text-sm text-gray-600">Your files are processed securely and deleted after processing</p>
            </div>
            <div className="text-center">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Fast & Efficient</h4>
              <p className="text-sm text-gray-600">Quick processing with optimized compression algorithms</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">High Quality</h4>
              <p className="text-sm text-gray-600">Maintain document quality while reducing file size</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTools;
