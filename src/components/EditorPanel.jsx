import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Maximize2,
  Minimize2,
  Code,
  Settings,
  Copy,
  Download,
  Wand2,
  Sparkles,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { generateContent } from "../lib/gemini";
import AIQuickEdit from "./AIQuickEdit";
import { useToast } from "./ui/use-toast"; // Import useToast for better notifications

function EditorPanel({
  language = "html",
  code = "",
  onChange = () => {},
  expanded = false,
  onToggleExpand = () => {},
}) {
  const [editorCode, setEditorCode] = useState(code);
  const [activeTab, setActiveTab] = useState("code");
  const [useMonaco, setUseMonaco] = useState(true);
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAIEditing, setIsAIEditing] = useState(false);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const { toast } = useToast(); // Initialize useToast for notifications

  useEffect(() => {
    onChange(editorCode);
  }, [editorCode, onChange]);

  useEffect(() => {
    setEditorCode(code);
  }, [code]);

  // Get code with fallback to empty string instead of default code
  const getCode = () => {
    return editorCode || code || "";
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    // Configure editor for better scrolling
    editor.updateOptions({
      scrollbar: {
        vertical: "visible",
        horizontal: "visible",
        verticalScrollbarSize: 15,
        horizontalScrollbarSize: 15,
        verticalHasArrows: true,
        horizontalHasArrows: true,
        arrowSize: 15,
        useShadows: true,
      },
      overviewRulerBorder: false,
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
    });
  };

  const handleCodeChange = (value) => {
    if (value !== undefined) {
      setEditorCode(value);
    }
  };

  const handleTextareaChange = (e) => {
    setEditorCode(e.target.value);
  };

  const getLanguageTitle = () => {
    switch (language) {
      case "html":
        return "HTML";
      case "css":
        return "CSS";
      case "javascript":
        return "JavaScript";
      default:
        return language.toUpperCase();
    }
  };

  const getMonacoLanguage = () => {
    switch (language) {
      case "html":
        return "html";
      case "css":
        return "css";
      case "javascript":
        return "javascript";
      default:
        return "plaintext";
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCode());
    toast({
      title: "Code copied to clipboard!",
    });
  };

  const downloadCode = () => {
    const content = getCode();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${language === "javascript" ? "js" : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Code downloaded!",
    });
  };

  const enhanceCode = async () => {
    const currentCode = getCode();
    setIsEnhancing(true);

    try {
      const prompt = `I have the following ${language.toUpperCase()} code that needs to be enhanced, optimized, and fixed for any bugs or errors. Please improve it while maintaining its core functionality and structure. Do not add any comments or explanations, just return the improved code.\n\n${currentCode}`;

      const { content, error } = await generateContent(prompt);

      if (error || !content) {
        throw new Error(error || "Failed to enhance code");
      }

      // Extract just the code from the response (remove any markdown or explanations)
      let enhancedCode = content;

      // If the response contains a code block, extract just the code
      const codeBlockMatch = content.match(/```(?:[a-z]*)?\n([\s\S]*?)\n```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        enhancedCode = codeBlockMatch[1];
      }

      setEditorCode(enhancedCode);
      toast({
        title: "Code enhanced successfully!",
      });
    } catch (error) {
      console.error("Error enhancing code:", error);
      toast({
        title: "Failed to enhance code.",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col border rounded-md overflow-hidden bg-gray-900 ${
        expanded ? "w-full h-full" : "w-full h-[450px]"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-white">
            {getLanguageTitle()}
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 h-7 text-gray-300 hover:text-white hover:bg-blue-600 border-blue-600 flex items-center"
                  onClick={() => setIsAIEditing(true)}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">AI Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit with AI Assistant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={enhanceCode}
                  disabled={isEnhancing}
                >
                  {isEnhancing ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enhance Code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={downloadCode}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={onToggleExpand}
                >
                  {expanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{expanded ? "Minimize" : "Maximize"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsList className="px-4 py-1 bg-gray-800 border-b border-gray-700">
          <TabsTrigger
            value="code"
            className="data-[state=active]:bg-gray-700"
            onClick={() => setActiveTab("code")}
          >
            <Code className="h-4 w-4 mr-2" />
            Code
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-gray-700"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 p-0 m-0 overflow-hidden">
          {isAIEditing ? (
            <AIQuickEdit
              initialCode={getCode()}
              language={language}
              onApplyChanges={(newCode) => {
                setEditorCode(newCode);
                setIsAIEditing(false);
              }}
              onCancel={() => setIsAIEditing(false)}
              isOpen={isAIEditing}
            />
          ) : useMonaco ? (
            <div className="h-full w-full overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage={getMonacoLanguage()}
                language={getMonacoLanguage()}
                value={getCode()}
                onChange={handleCodeChange}
                onMount={handleEditorDidMount}
                theme={theme}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  scrollbar: {
                    vertical: "visible",
                    horizontal: "visible",
                    verticalScrollbarSize: 15,
                    horizontalScrollbarSize: 15,
                    verticalHasArrows: true,
                    horizontalHasArrows: true,
                    arrowSize: 15,
                    useShadows: true,
                  },
                  fixedOverflowWidgets: true,
                  overviewRulerBorder: false,
                }}
                className="editor-container"
              />
            </div>
          ) : (
            <textarea
              className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
              value={getCode()}
              onChange={handleTextareaChange}
              placeholder="Enter your code here..."
              spellCheck="false"
              style={{ overflowY: "auto", overflowX: "auto" }}
            />
          )}
        </TabsContent>

        <TabsContent
          value="settings"
          className="flex-1 p-4 bg-gray-900 text-gray-100 overflow-auto"
        >
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Editor Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Editor Type</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={useMonaco ? "default" : "outline"}
                    onClick={() => setUseMonaco(true)}
                  >
                    Monaco
                  </Button>
                  <Button
                    size="sm"
                    variant={!useMonaco ? "default" : "outline"}
                    onClick={() => setUseMonaco(false)}
                  >
                    Simple
                  </Button>
                </div>
              </div>

              {useMonaco && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Theme</span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={theme === "vs-dark" ? "default" : "outline"}
                        onClick={() => setTheme("vs-dark")}
                      >
                        Dark
                      </Button>
                      <Button
                        size="sm"
                        variant={theme === "light" ? "default" : "outline"}
                        onClick={() => setTheme("light")}
                      >
                        Light
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Font Size</span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                      >
                        -
                      </Button>
                      <span className="flex items-center px-2">
                        {fontSize}px
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Syntax Highlighting</span>
                  <span className="text-xs text-gray-400">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Auto-completion</span>
                  <span className="text-xs text-gray-400">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Line Numbers</span>
                  <span className="text-xs text-gray-400">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .editor-container {
          overflow: auto !important;
        }
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
      `,
        }}
      />
    </div>
  );
}

export default EditorPanel;
