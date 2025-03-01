import React, { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  RefreshCw,
  Maximize2,
  ExternalLink,
  Download,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import ResponsivePreview from "./ResponsivePreview";

interface PreviewPanelProps {
  htmlCode?: string;
  cssCode?: string;
  jsCode?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  htmlCode = '<div class="demo"><h1>Welcome to CodePen Clone</h1><p>Start editing HTML, CSS, and JavaScript to see your changes here!</p></div>',
  cssCode = ".demo { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); } h1 { color: #3b82f6; }",
  jsCode = 'console.log("Preview is working!");',
  isFullscreen = false,
  onToggleFullscreen = () => {},
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"standard" | "responsive">(
    "standard",
  );

  // Create the HTML content for the preview
  const getHtmlContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch (error) {
              console.error('Error in JS execution:', error);
            }
          </script>
        </body>
      </html>
    `;
  };

  const updatePreview = () => {
    setIsLoading(true);

    // Always use the srcDoc approach which is more secure and avoids cross-origin issues
    if (iframeRef.current) {
      iframeRef.current.srcdoc = getHtmlContent();
    }

    // Set a timeout to ensure the loading indicator shows for at least a moment
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Download the HTML, CSS, and JS as a zip file
  const downloadAsHtml = () => {
    const htmlContent = getHtmlContent();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codepen-export.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Open the preview in a new tab
  const openInNewTab = () => {
    const htmlContent = getHtmlContent();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    const newWindow = window.open(blobUrl, "_blank");

    // Make the preview responsive to different screen sizes
    if (newWindow) {
      newWindow.addEventListener("load", () => {
        const style = newWindow.document.createElement("style");
        style.textContent = `
          @media (max-width: 768px) {
            body { font-size: 14px; }
          }
          @media (max-width: 480px) {
            body { font-size: 12px; }
          }
        `;
        newWindow.document.head.appendChild(style);
      });
    }

    // Clean up the blob URL after opening
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  };

  useEffect(() => {
    updatePreview();
  }, [htmlCode, cssCode, jsCode]);

  return (
    <Card
      className={`flex flex-col bg-white ${isFullscreen ? "fixed inset-0 z-50" : "h-full"}`}
    >
      <div className="flex items-center justify-between p-2 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-medium">Preview</h2>
          <div className="flex border rounded overflow-hidden ml-4">
            <Button
              variant={viewMode === "standard" ? "subtle" : "ghost"}
              size="sm"
              className="h-7 rounded-none px-2"
              onClick={() => setViewMode("standard")}
            >
              <Monitor className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Standard</span>
            </Button>
            <Button
              variant={viewMode === "responsive" ? "subtle" : "ghost"}
              size="sm"
              className="h-7 rounded-none px-2"
              onClick={() => setViewMode("responsive")}
            >
              <Smartphone className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Responsive</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={updatePreview}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Preview</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadAsHtml}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download as HTML</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleFullscreen}
                  className="h-8 w-8 p-0"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={openInNewTab}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open in New Tab</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {viewMode === "standard" ? (
        <div className="relative flex-grow overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            title="Code Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
            srcDoc={getHtmlContent()}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      ) : (
        <div className="flex-grow overflow-hidden">
          <ResponsivePreview
            htmlContent={getHtmlContent()}
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        </div>
      )}
    </Card>
  );
};

export default PreviewPanel;
