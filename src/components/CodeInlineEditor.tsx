import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Check, X, Copy } from "lucide-react";

interface CodeInlineEditorProps {
  initialCode: string;
  language: "html" | "css" | "javascript";
  onSave: (code: string) => void;
  onCancel: () => void;
}

const CodeInlineEditor: React.FC<CodeInlineEditorProps> = ({
  initialCode,
  language,
  onSave,
  onCancel,
}) => {
  const [code, setCode] = useState(initialCode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(0, 0);
      // Auto-resize the textarea to fit content
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    // Auto-resize the textarea to fit content
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSave = () => {
    onSave(code);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const getLanguageClass = () => {
    switch (language) {
      case "html":
        return "border-blue-500 bg-blue-500/10";
      case "css":
        return "border-pink-500 bg-pink-500/10";
      case "javascript":
        return "border-yellow-500 bg-yellow-500/10";
      default:
        return "border-gray-500 bg-gray-500/10";
    }
  };

  return (
    <div className={`rounded-md border-l-4 ${getLanguageClass()} p-4 mb-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium uppercase">{language}</div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100/10"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-100/10"
            onClick={handleSave}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Textarea
        ref={textareaRef}
        value={code}
        onChange={handleChange}
        className="font-mono text-sm resize-none min-h-[100px] bg-transparent border-gray-700 focus:border-gray-600 focus:ring-0"
        placeholder={`Enter your ${language} code here...`}
        onKeyDown={(e) => {
          // Save on Ctrl+Enter or Cmd+Enter
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleSave();
          }
          // Cancel on Escape
          if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
      />
      <div className="flex justify-end mt-2 space-x-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default CodeInlineEditor;
