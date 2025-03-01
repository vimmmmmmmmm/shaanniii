import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { getPenById, forkPen, likePen } from "../lib/supabase-client";
import { Edit, Heart, GitFork, Share2, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "./Navbar";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface PenViewProps {
  isAuthenticated: boolean;
  username: string;
  userId: string;
  onLogout: () => void;
}

interface PenData {
  id: string;
  title: string;
  description: string;
  html: string;
  css: string;
  js: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  likes: number;
  views: number;
}

const PenView: React.FC<PenViewProps> = ({
  isAuthenticated,
  username,
  userId,
  onLogout,
}) => {
  const { id } = useParams<{ id: string }>();
  const [pen, setPen] = useState<PenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPen = async () => {
      if (!id) return;

      setLoading(true);
      const { data, error } = await getPenById(id);
      if (error) {
        console.error("Error fetching pen:", error);
        setError("Failed to load pen. It may have been deleted or is private.");
      } else if (data) {
        setPen(data as PenData);
        setShareUrl(window.location.href);
      }
      setLoading(false);
    };

    fetchPen();
  }, [id]);

  const getHtmlContent = () => {
    if (!pen) return "";

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>${pen.css}</style>
        </head>
        <body>
          ${pen.html}
          <script>
            try {
              ${pen.js}
            } catch (error) {
              console.error('Error in JS execution:', error);
            }
          </script>
        </body>
      </html>
    `;
  };

  const handleFork = async () => {
    if (!isAuthenticated) {
      // Prompt user to sign in
      alert("Please sign in to fork this pen");
      return;
    }

    if (!id) return;

    try {
      const { data, error } = await forkPen(id, userId);
      if (error) {
        console.error("Error forking pen:", error);
        alert("Failed to fork pen. Please try again.");
      } else if (data && data[0]) {
        // Navigate to the editor with the forked pen
        navigate(`/editor/${data[0].id}`);
      }
    } catch (err) {
      console.error("Error in fork operation:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      // Prompt user to sign in
      alert("Please sign in to like this pen");
      return;
    }

    if (!id) return;

    try {
      const { error } = await likePen(id, userId);
      if (error) {
        console.error("Error liking pen:", error);
        alert("Failed to like pen. Please try again.");
      } else {
        // Toggle like state and update count
        setIsLiked(!isLiked);
        if (pen) {
          setPen({
            ...pen,
            likes: isLiked ? pen.likes - 1 : pen.likes + 1,
          });
        }
      }
    } catch (err) {
      console.error("Error in like operation:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
    setShareDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Loading pen...</span>
        </div>
      </div>
    );
  }

  if (error || !pen) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar
          isAuthenticated={isAuthenticated}
          username={username}
          avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
          onLogout={onLogout}
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Pen Not Found</h2>
          <p className="text-gray-400 mb-8">
            {error || "This pen does not exist or has been removed."}
          </p>
          <Button asChild>
            <Link to="/explore">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Explore
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar
        isAuthenticated={isAuthenticated}
        username={username}
        avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
        onLogout={onLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{pen.title}</h1>
            {pen.description && (
              <p className="text-gray-400 mt-1">{pen.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Created {formatDate(pen.created_at)} • Last updated{" "}
              {formatDate(pen.updated_at)}
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={`${isLiked ? "bg-red-900/20 text-red-500 border-red-800" : ""}`}
            >
              <Heart
                className={`h-4 w-4 mr-1 ${isLiked ? "fill-red-500" : ""}`}
              />
              {pen.likes}
            </Button>

            <Button variant="outline" size="sm" onClick={handleFork}>
              <GitFork className="h-4 w-4 mr-1" /> Fork
            </Button>

            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share this Pen</DialogTitle>
                  <DialogDescription>
                    Copy the link below to share this pen with others.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-4">
                  <Input value={shareUrl} readOnly className="flex-1" />
                  <Button onClick={copyShareLink}>Copy</Button>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Embed</p>
                  <Input
                    value={`<iframe src="${window.location.origin}/embed/${pen.id}" style="width: 100%; height: 400px; border: none;"></iframe>`}
                    readOnly
                  />
                </div>
              </DialogContent>
            </Dialog>

            {isAuthenticated && pen.user_id === userId && (
              <Button asChild>
                <Link to={`/editor/${pen.id}`}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Link>
              </Button>
            )}
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="w-full h-[calc(100vh-250px)] bg-white rounded-md overflow-hidden">
          <iframe
            ref={iframeRef}
            title="Pen Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
            srcDoc={getHtmlContent()}
          />
        </div>
      </div>
    </div>
  );
};

export default PenView;
