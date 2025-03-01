import React, { useState, useEffect } from "react";
import EditorPanel from "./EditorPanel.jsx";
import PreviewPanel from "./PreviewPanel";
import EditorControls from "./EditorControls";
import AIChat from "./AIChat";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { motion, AnimatePresence } from "framer-motion";

interface CodeEditorProps {
  initialHtmlCode?: string;
  initialCssCode?: string;
  initialJsCode?: string;
  isAuthenticated?: boolean;
  onSave?: () => void;
  onFork?: () => void;
  onShare?: (platform?: string) => void;
  onHtmlChange?: (code: string) => void;
  onCssChange?: (code: string) => void;
  onJsChange?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialHtmlCode = '<div class="container">\n  <h1>Hello CodePen!</h1>\n  <p>Start editing to see some magic happen</p>\n</div>',
  initialCssCode = ".container {\n  font-family: sans-serif;\n  text-align: center;\n  padding: 20px;\n}\n\nh1 {\n  color: #3b82f6;\n}\n\np {\n  color: #666;\n}",
  initialJsCode = 'console.log("Hello from JavaScript!");',
  isAuthenticated = false,
  onSave = () => {},
  onFork = () => {},
  onShare = () => {},
  onHtmlChange,
  onCssChange,
  onJsChange,
}) => {
  const [htmlCode, setHtmlCode] = useState(initialHtmlCode);
  const [cssCode, setCssCode] = useState(initialCssCode);
  const [jsCode, setJsCode] = useState(initialJsCode);
  const [currentView, setCurrentView] = useState<
    "editor" | "preview" | "split"
  >("split");
  const [expandedPanel, setExpandedPanel] = useState<
    "html" | "css" | "js" | null
  >(null);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [lastAICode, setLastAICode] = useState<{
    html?: string;
    css?: string;
    js?: string;
  } | null>(null);

  // Initialize with props
  useEffect(() => {
    setHtmlCode(initialHtmlCode);
    setCssCode(initialCssCode);
    setJsCode(initialJsCode);
  }, [initialHtmlCode, initialCssCode, initialJsCode]);

  const handleHtmlChange = (code: string) => {
    setHtmlCode(code);
    if (onHtmlChange) onHtmlChange(code);
  };

  const handleCssChange = (code: string) => {
    setCssCode(code);
    if (onCssChange) onCssChange(code);
  };

  const handleJsChange = (code: string) => {
    setJsCode(code);
    if (onJsChange) onJsChange(code);
  };

  const handleToggleView = (view: "editor" | "preview" | "split") => {
    setCurrentView(view);
  };

  const handleToggleExpand = (panel: "html" | "css" | "js") => {
    setExpandedPanel(expandedPanel === panel ? null : panel);
  };

  const handleTogglePreviewFullscreen = () => {
    setPreviewFullscreen(!previewFullscreen);
  };

  const handleSave = () => {
    onSave();
  };

  const handleFork = () => {
    onFork();
  };

  const handleShare = (platform?: string) => {
    onShare(platform);
  };

  const handleToggleAI = () => {
    setIsAIOpen(!isAIOpen);
  };

  const handleInsertCode = (code: string) => {
    // Store the current code before inserting new code
    setLastAICode({
      html: htmlCode,
      css: cssCode,
      js: jsCode,
    });

    // Extract HTML, CSS, and JS from the code
    const htmlMatch = code.match(/```html([\s\S]*?)```/i);
    const cssMatch = code.match(/```css([\s\S]*?)```/i);
    const jsMatch = code.match(/```(?:javascript|js)([\s\S]*?)```/i);

    // If we have specific language blocks, use them
    if (htmlMatch || cssMatch || jsMatch) {
      if (htmlMatch && htmlMatch[1]) {
        handleHtmlChange(htmlMatch[1].trim());
      }

      if (cssMatch && cssMatch[1]) {
        handleCssChange(cssMatch[1].trim());
      }

      if (jsMatch && jsMatch[1]) {
        handleJsChange(jsMatch[1].trim());
      }
      return;
    }

    // If no specific language blocks, try to determine the type of code
    if (code.includes("<html") || code.includes("<!DOCTYPE")) {
      // Full HTML document - extract body content
      const bodyMatch = code.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        handleHtmlChange(bodyMatch[1].trim());
      } else {
        handleHtmlChange(code);
      }
    } else if (code.includes("<") && code.includes(">")) {
      handleHtmlChange(code);
    } else if (
      code.includes("{") &&
      code.includes("}") &&
      !code.includes("function") &&
      !code.includes("addEventListener") &&
      !code.includes("console.log")
    ) {
      handleCssChange(code);
    } else {
      handleJsChange(code);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-900 transition-colors duration-300">
      <EditorControls
        isAuthenticated={isAuthenticated}
        onSave={handleSave}
        onFork={handleFork}
        onShare={handleShare}
        onToggleView={handleToggleView}
        currentView={currentView}
        onToggleAI={handleToggleAI}
        isAIOpen={isAIOpen}
        htmlCode={htmlCode}
        cssCode={cssCode}
        jsCode={jsCode}
        title="CodePen Project"
        onCodeChange={(html, css, js) => {
          handleHtmlChange(html);
          handleCssChange(css);
          handleJsChange(js);
        }}
      />

      <AIChat
        isOpen={isAIOpen}
        onClose={handleToggleAI}
        onInsertCode={handleInsertCode}
      />

      {currentView === "preview" ? (
        <div className="flex-grow">
          <PreviewPanel
            htmlCode={htmlCode}
            cssCode={cssCode}
            jsCode={jsCode}
            isFullscreen={previewFullscreen}
            onToggleFullscreen={handleTogglePreviewFullscreen}
          />
        </div>
      ) : currentView === "editor" ? (
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-2 p-2 overflow-hidden">
          <EditorPanel
            language="html"
            code={htmlCode}
            onChange={handleHtmlChange}
            expanded={expandedPanel === "html"}
            onToggleExpand={() => handleToggleExpand("html")}
          />
          <EditorPanel
            language="css"
            code={cssCode}
            onChange={handleCssChange}
            expanded={expandedPanel === "css"}
            onToggleExpand={() => handleToggleExpand("css")}
          />
          <EditorPanel
            language="javascript"
            code={jsCode}
            onChange={handleJsChange}
            expanded={expandedPanel === "js"}
            onToggleExpand={() => handleToggleExpand("js")}
          />
        </div>
      ) : (
        <ResizablePanelGroup
          direction="vertical"
          className="flex-grow overflow-hidden bg-gray-950 p-2 rounded-md"
        >
          <ResizablePanel
            defaultSize={50}
            minSize={20}
            className="resizable-panel"
          >
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel
                defaultSize={33}
                minSize={20}
                className="resizable-panel"
              >
                <EditorPanel
                  language="html"
                  code={htmlCode}
                  onChange={handleHtmlChange}
                  expanded={expandedPanel === "html"}
                  onToggleExpand={() => handleToggleExpand("html")}
                />
              </ResizablePanel>
              <ResizableHandle className="resizable-handle" withHandle />
              <ResizablePanel
                defaultSize={33}
                minSize={20}
                className="resizable-panel"
              >
                <EditorPanel
                  language="css"
                  code={cssCode}
                  onChange={handleCssChange}
                  expanded={expandedPanel === "css"}
                  onToggleExpand={() => handleToggleExpand("css")}
                />
              </ResizablePanel>
              <ResizableHandle className="resizable-handle" withHandle />
              <ResizablePanel
                defaultSize={33}
                minSize={20}
                className="resizable-panel"
              >
                <EditorPanel
                  language="javascript"
                  code={jsCode}
                  onChange={handleJsChange}
                  expanded={expandedPanel === "js"}
                  onToggleExpand={() => handleToggleExpand("js")}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle className="resizable-handle" withHandle />
          <ResizablePanel
            defaultSize={50}
            minSize={20}
            className="resizable-panel"
          >
            <PreviewPanel
              htmlCode={htmlCode}
              cssCode={cssCode}
              jsCode={jsCode}
              isFullscreen={previewFullscreen}
              onToggleFullscreen={handleTogglePreviewFullscreen}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Global styles to ensure scrolling works properly */
        .monaco-editor .monaco-scrollable-element {
          overflow: visible !important;
        }
        .monaco-editor .scrollbar {
          opacity: 1 !important;
          background: rgba(50, 50, 50, 0.4) !important;
        }
        .monaco-editor .scrollbar .slider {
          background: rgba(100, 100, 100, 0.8) !important;
        }
        
        /* Improve resizable panels */
        .resizable-panel {
          background: #1a1a1a;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .resizable-handle {
          background: rgba(80, 80, 80, 0.4);
          transition: background 0.2s;
        }
        
        .resizable-handle:hover {
          background: rgba(100, 100, 100, 0.6);
        }
      `,
        }}
      />
    </div>
  );
};

export default CodeEditor;
