import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import Navbar from "./Navbar";
import { savePen, getPenById } from "../lib/supabase-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";

interface EditorProps {
  isAuthenticated: boolean;
  username: string;
  userId: string;
  onLogout: () => void;
}

interface LocationState {
  title?: string;
  description?: string;
  html?: string;
  css?: string;
  js?: string;
}

const Editor: React.FC<EditorProps> = ({
  isAuthenticated,
  username,
  userId,
  onLogout,
}) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [htmlCode, setHtmlCode] = useState(state?.html || "");
  const [cssCode, setCssCode] = useState(state?.css || "");
  const [jsCode, setJsCode] = useState(state?.js || "");
  const [title, setTitle] = useState(state?.title || "Untitled Pen");
  const [description, setDescription] = useState(state?.description || "");
  const [loading, setLoading] = useState(id !== "new");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [originalPen, setOriginalPen] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchPen = async () => {
      if (id === "new") {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await getPenById(id!);
        if (error) {
          console.error("Error fetching pen:", error);
          navigate("/dashboard");
          return;
        }

        if (data) {
          setHtmlCode(data.html);
          setCssCode(data.css);
          setJsCode(data.js);
          setTitle(data.title);
          setDescription(data.description);
          setOriginalPen(data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error in fetchPen:", err);
        setLoading(false);
      }
    };

    fetchPen();
  }, [id, isAuthenticated, navigate]);

  useEffect(() => {
    // Check for unsaved changes
    if (originalPen) {
      const hasChanges =
        htmlCode !== originalPen.html ||
        cssCode !== originalPen.css ||
        jsCode !== originalPen.js ||
        title !== originalPen.title ||
        description !== originalPen.description;

      setUnsavedChanges(hasChanges);
    } else if (id === "new") {
      // For new pens, check if there's any content
      const hasContent =
        htmlCode.trim() !== "" || cssCode.trim() !== "" || jsCode.trim() !== "";
      setUnsavedChanges(hasContent);
    }
  }, [htmlCode, cssCode, jsCode, title, description, originalPen, id]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to save your pen");
      return;
    }

    try {
      const penData = {
        title,
        description,
        html: htmlCode,
        css: cssCode,
        js: jsCode,
        user_id: userId,
        id: id !== "new" ? id : undefined,
      };

      const { data, error } = await savePen(penData);

      if (error) {
        console.error("Error saving pen:", error);
        alert("Failed to save pen. Please try again.");
      } else if (data && data[0]) {
        setUnsavedChanges(false);
        if (id === "new") {
          // Redirect to the new pen's edit page
          navigate(`/editor/${data[0].id}`, { replace: true });
        } else {
          // Update the original pen data
          setOriginalPen(data[0]);
        }
        setSaveDialogOpen(false);
      }
    } catch (err) {
      console.error("Error in save operation:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleHtmlChange = (code: string) => {
    setHtmlCode(code);
  };

  const handleCssChange = (code: string) => {
    setCssCode(code);
  };

  const handleJsChange = (code: string) => {
    setJsCode(code);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar
          isAuthenticated={isAuthenticated}
          username={username}
          avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
          onLogout={onLogout}
        />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Loading editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar
        isAuthenticated={isAuthenticated}
        username={username}
        avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
        onLogout={onLogout}
      />

      <div className="flex-grow">
        <CodeEditor
          initialHtmlCode={htmlCode}
          initialCssCode={cssCode}
          initialJsCode={jsCode}
          isAuthenticated={isAuthenticated}
          onSave={() => setSaveDialogOpen(true)}
          onHtmlChange={handleHtmlChange}
          onCssChange={handleCssChange}
          onJsChange={handleJsChange}
        />
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Pen</DialogTitle>
            <DialogDescription>
              Give your pen a title and description before saving.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Pen"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of your pen"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Editor;
