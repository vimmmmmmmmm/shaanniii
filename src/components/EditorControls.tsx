import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import {
  Save,
  Share2,
  GitFork,
  Settings,
  Download,
  Upload,
  Code,
  Eye,
  Bot,
  Sparkles,
  FileCode,
  Github,
  Globe,
} from "lucide-react";
import { ThemeToggle } from "./ui/theme-toggle";
import AIToggle from "./AIToggle";
import GitHubIntegration from "./GitHubIntegration";
import UrlCloner from "./UrlCloner";
import TemplateSelector from "./TemplateSelector";

interface EditorControlsProps {
  isAuthenticated?: boolean;
  onSave?: () => void;
  onFork?: () => void;
  onShare?: (platform?: string) => void;
  onToggleView?: (view: "editor" | "preview" | "split") => void;
  currentView?: "editor" | "preview" | "split";
  onToggleAI?: () => void;
  isAIOpen?: boolean;
  htmlCode?: string;
  cssCode?: string;
  jsCode?: string;
  title?: string;
  onCodeChange?: (html: string, css: string, js: string) => void;
}

const EditorControls: React.FC<EditorControlsProps> = ({
  isAuthenticated = false,
  onSave = () => {},
  onFork = () => {},
  onShare = () => {},
  onToggleView = () => {},
  currentView = "split",
  onToggleAI = () => {},
  isAIOpen = false,
  htmlCode = "",
  cssCode = "",
  jsCode = "",
  title = "Untitled Pen",
  onCodeChange = () => {},
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  return (
    <div className="w-full h-[50px] bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 transition-colors duration-300">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleView("editor")}
                className={`${currentView === "editor" ? "bg-gray-700" : ""}`}
              >
                <Code size={16} className="mr-1" />
                <span className="hidden sm:inline">Editor</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show editor only</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleView("preview")}
                className={`${currentView === "preview" ? "bg-gray-700" : ""}`}
              >
                <Eye size={16} className="mr-1" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show preview only</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleView("split")}
                className={`${currentView === "split" ? "bg-gray-700" : ""}`}
              >
                <span className="hidden sm:inline">Split</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show both editor and preview</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center space-x-2">
        {isAuthenticated ? (
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Save size={16} className="mr-1" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Pen</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="My Awesome Pen" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="A brief description of your pen"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    onSave();
                    setSaveDialogOpen(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" disabled>
                  <Save size={16} className="mr-1" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign in to save your pen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onFork}>
                <GitFork size={16} className="mr-1" />
                <span className="hidden sm:inline">Fork</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a copy of this pen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Share2 size={16} className="mr-1" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Pen</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="link">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link">Link</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>
              <TabsContent value="link" className="py-4">
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      readOnly
                      value="https://codepen-clone.example.com/pen/abc123"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          "https://codepen-clone.example.com/pen/abc123",
                        );
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="embed" className="w-20">
                      Embed:
                    </Label>
                    <Input
                      id="embed"
                      readOnly
                      className="flex-1"
                      value={
                        '<iframe src="https://codepen-clone.example.com/embed/abc123" style="width: 100%; height: 300px;"></iframe>'
                      }
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="social" className="py-4">
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={() => onShare("twitter")}>
                    Twitter
                  </Button>
                  <Button variant="outline" onClick={() => onShare("facebook")}>
                    Facebook
                  </Button>
                  <Button variant="outline" onClick={() => onShare("linkedin")}>
                    LinkedIn
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <Separator orientation="vertical" className="h-6" />

        <AIToggle isOpen={isAIOpen} onClick={onToggleAI} />

        <Separator orientation="vertical" className="h-6" />

        <GitHubIntegration
          htmlCode={htmlCode}
          cssCode={cssCode}
          jsCode={jsCode}
          title={title}
        />

        <UrlCloner
          onCodeGenerated={(html, css, js) => onCodeChange(html, css, js)}
        />

        <TemplateSelector
          onSelectTemplate={(html, css, js) => onCodeChange(html, css, js)}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <Download size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Editor settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <ThemeToggle />
      </div>
    </div>
  );
};

export default EditorControls;
