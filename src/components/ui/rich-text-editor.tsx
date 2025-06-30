
import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Bold, Italic, Underline, List, ListOrdered, Undo, Redo, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className,
  minHeight = "120px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            execCommand('redo');
          } else {
            execCommand('undo');
          }
          break;
      }
    }
  }, [execCommand]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    execCommand('insertText', text);
  }, [execCommand]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // CSS styles for the placeholder
  const placeholderStyles = `
    [contenteditable]:empty:before {
      content: attr(data-placeholder);
      color: #9ca3af;
      pointer-events: none;
    }
  `;

  useEffect(() => {
    // Add styles to document head
    const styleElement = document.createElement('style');
    styleElement.textContent = placeholderStyles;
    document.head.appendChild(styleElement);

    // Cleanup function
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const ToolbarButton = ({ onClick, icon: Icon, title, isActive = false }: {
    onClick: () => void;
    icon: any;
    title: string;
    isActive?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-2 rounded hover:bg-gray-200 transition-colors",
        isActive && "bg-gray-300"
      )}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="border rounded-md">
      {/* Toolbar nâng cấp */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50 flex-wrap">
        {/* Text formatting */}
        <ToolbarButton
          onClick={() => execCommand('bold')}
          icon={Bold}
          title="Đậm (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => execCommand('italic')}
          icon={Italic}
          title="Nghiêng (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => execCommand('underline')}
          icon={Underline}
          title="Gạch chân (Ctrl+U)"
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Font size */}
        <select
          onChange={(e) => execCommand('fontSize', e.target.value)}
          className="text-sm border rounded px-2 py-1 bg-white"
          title="Cỡ chữ"
        >
          <option value="2">Nhỏ</option>
          <option value="3" selected>Bình thường</option>
          <option value="4">Lớn</option>
          <option value="5">Rất lớn</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text alignment */}
        <ToolbarButton
          onClick={() => execCommand('justifyLeft')}
          icon={AlignLeft}
          title="Căn trái"
        />
        <ToolbarButton
          onClick={() => execCommand('justifyCenter')}
          icon={AlignCenter}
          title="Căn giữa"
        />
        <ToolbarButton
          onClick={() => execCommand('justifyRight')}
          icon={AlignRight}
          title="Căn phải"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Lists */}
        <ToolbarButton
          onClick={() => execCommand('insertUnorderedList')}
          icon={List}
          title="Danh sách gạch đầu dòng"
        />
        <ToolbarButton
          onClick={() => execCommand('insertOrderedList')}
          icon={ListOrdered}
          title="Danh sách số thứ tự"
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Text color */}
        <input
          type="color"
          onChange={(e) => execCommand('foreColor', e.target.value)}
          className="w-8 h-8 border rounded cursor-pointer"
          title="Màu chữ"
        />
        
        {/* Background color */}
        <input
          type="color"
          onChange={(e) => execCommand('hiliteColor', e.target.value)}
          className="w-8 h-8 border rounded cursor-pointer"
          title="Màu nền"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Format options */}
        <select
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          className="text-sm border rounded px-2 py-1 bg-white"
          title="Định dạng"
        >
          <option value="div">Đoạn văn</option>
          <option value="h1">Tiêu đề 1</option>
          <option value="h2">Tiêu đề 2</option>
          <option value="h3">Tiêu đề 3</option>
          <option value="h4">Tiêu đề 4</option>
          <option value="blockquote">Trích dẫn</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => execCommand('undo')}
          icon={Undo}
          title="Hoàn tác (Ctrl+Z)"
        />
        <ToolbarButton
          onClick={() => execCommand('redo')}
          icon={Redo}
          title="Làm lại (Ctrl+Shift+Z)"
        />
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onPaste={handlePaste}
        className={cn(
          "p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 prose prose-sm max-w-none",
          className
        )}
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
}
