
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, FileText, Upload } from 'lucide-react';

interface FileAttachment {
  id: string;
  name: string;
  file?: File;
  url?: string;
}

interface FileAttachmentsProps {
  attachments: FileAttachment[];
  onAttachmentsChange: (attachments: FileAttachment[]) => void;
}

export function FileAttachments({ attachments, onAttachmentsChange }: FileAttachmentsProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const newAttachments: FileAttachment[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      file
    }));
    
    onAttachmentsChange([...attachments, ...newAttachments]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter(att => att.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Tệp đính kèm</h3>
      
      {/* Display existing attachments */}
      {attachments.length > 0 && (
        <div className="space-y-2 mb-4">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium">{attachment.name}</div>
                  {attachment.file && (
                    <div className="text-sm text-gray-500">
                      {formatFileSize(attachment.file.size)}
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAttachment(attachment.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* File upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">Kéo thả file hoặc click để chọn</p>
        <p className="text-xs text-gray-500 mb-3">PDF, DOC, DOCX, XLS, XLSX (Max 10MB mỗi file)</p>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <Button type="button" variant="outline" size="sm" asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            Chọn tệp
          </label>
        </Button>
      </div>
    </div>
  );
}
