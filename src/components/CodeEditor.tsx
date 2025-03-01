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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  FileCode,
  Terminal,
  Play,
  Settings,
  Layout,
  PanelLeft,
  PanelRight,
} from "lucide-react";

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
    <div className="flex flex-col w-full h-full bg-[#1e1e1e] transition-all duration-300">
      <div className="flex items-center bg-[#252526] border-b border-[#3c3c3c] px-2 py-1">
        <div className="flex items-center space-x-2 mr-4">
          <FileCode className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-gray-300">CodePen Project</span>
        </div>

        <Tabs defaultValue={currentView} className="flex-1">
          <TabsList className="bg-[#2d2d2d]">
            <TabsTrigger
              value="editor"
              onClick={() => handleToggleView("editor")}
            >
              <PanelLeft className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="split"
              onClick={() => handleToggleView("split")}
            >
              <Layout className="h-4 w-4 mr-2" />
              Split
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              onClick={() => handleToggleView("preview")}
            >
              <PanelRight className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2 ml-4">
          <Button variant="ghost" size="sm" onClick={handleToggleAI}>
            <Settings className="h-4 w-4 mr-2" />
            AI
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Play className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

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
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-0 overflow-hidden bg-[#1e1e1e]">
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
          className="flex-grow overflow-hidden bg-[#1e1e1e]"
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
        /* VSCode-like styles */
        body {
          background-color: #1e1e1e;
          color: #d4d4d4;
        }
        
        /* Improve resizable panels */
        .resizable-panel {
          background-color: #1e1e1e;
          transition: box-shadow 0.3s ease;
        }
        
        .resizable-handle {
          background: #3c3c3c;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .resizable-handle:hover {
          background: #5a5a5a;
        }
        
        .resizable-handle:active {
          background: #007fd4;
        }
        
        .resizable-handle[data-orientation="horizontal"]::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 20px;
          background-color: #5a5a5a;
          border-radius: 2px;
        }
        
        .resizable-handle[data-orientation="vertical"]::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 4px;
          background-color: #5a5a5a;
          border-radius: 2px;
        }
        
        /* Tab styling */
        [data-state="active"][data-orientation="horizontal"] {
          background-color: #1e1e1e;
          color: #ffffff;
          border-bottom: 2px solid #007fd4;
        }
        
        /* Editor container */
        .editor-container {
          width: 100% !important;
          height: 100% !important;
        }
        
        /* Monaco editor */
        .monaco-editor .monaco-scrollable-element {
          overflow: visible !important;
        }
        
        .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input {
          background-color: #1e1e1e !important;
        }
      `,
        }}
      />
    </div>
  );
};

export default CodeEditor;
