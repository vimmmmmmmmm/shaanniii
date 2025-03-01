import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getUserPens, deletePen } from "../lib/supabase-client";
import {
  Pen,
  PlusCircle,
  Trash2,
  Edit,
  ExternalLink,
  Heart,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Skeleton } from "./ui/skeleton";
import Navbar from "./Navbar";

interface PenData {
  id: string;
  title: string;
  description: string;
  html: string;
  css: string;
  js: string;
  created_at: string;
  updated_at: string;
  likes: number;
  views: number;
}

interface DashboardProps {
  userId: string;
  username: string;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userId,
  username,
  isAuthenticated,
  onLogout,
}) => {
  const [pens, setPens] = useState<PenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPenTitle, setNewPenTitle] = useState("");
  const [newPenDescription, setNewPenDescription] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [penToDelete, setPenToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchPens = async () => {
      setLoading(true);
      const { data, error } = await getUserPens(userId);
      if (error) {
        console.error("Error fetching pens:", error);
      } else if (data) {
        setPens(data as PenData[]);
      }
      setLoading(false);
    };

    fetchPens();
  }, [userId, isAuthenticated, navigate]);

  const handleCreatePen = () => {
    // Create a new pen with default code and navigate to the editor
    navigate("/editor/new", {
      state: {
        title: newPenTitle || "Untitled Pen",
        description: newPenDescription,
        html: '<div class="container">\n  <h1>Hello CodePen!</h1>\n  <p>Start editing to see some magic happen</p>\n</div>',
        css: ".container {\n  font-family: sans-serif;\n  text-align: center;\n  padding: 20px;\n}\n\nh1 {\n  color: #3b82f6;\n}\n\np {\n  color: #666;\n}",
        js: 'console.log("Hello from JavaScript!");',
      },
    });
    setCreateDialogOpen(false);
  };

  const handleDeletePen = async () => {
    if (!penToDelete) return;

    const { error } = await deletePen(penToDelete);
    if (error) {
      console.error("Error deleting pen:", error);
    } else {
      // Remove the deleted pen from the state
      setPens(pens.filter((pen) => pen.id !== penToDelete));
    }

    setPenToDelete(null);
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar
        isAuthenticated={isAuthenticated}
        username={username}
        avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
        onLogout={onLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="h-4 w-4 mr-2" /> Create New Pen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Pen</DialogTitle>
                <DialogDescription>
                  Give your pen a title and description to get started.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="My Awesome Pen"
                    value={newPenTitle}
                    onChange={(e) => setNewPenTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="A brief description of your pen"
                    value={newPenDescription}
                    onChange={(e) => setNewPenDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreatePen}>Create Pen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="your-pens" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="your-pens">Your Pens</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="your-pens" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 bg-gray-700" />
                      <Skeleton className="h-4 w-1/2 bg-gray-700" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full bg-gray-700" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-4 w-1/3 bg-gray-700" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : pens.length === 0 ? (
              <div className="text-center py-12">
                <Pen className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">
                  No Pens Yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Create your first pen to get started!
                </p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Create New Pen
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pens.map((pen) => (
                  <Card
                    key={pen.id}
                    className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span className="truncate">{pen.title}</span>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                            onClick={() => {
                              setPenToDelete(pen.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription className="text-gray-400 truncate">
                        {pen.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-32 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 pointer-events-none" />
                      <div className="text-xs font-mono text-gray-300 overflow-hidden">
                        <div className="mb-2">
                          <span className="text-blue-400">HTML</span>
                          <pre className="mt-1 text-gray-400 line-clamp-2">
                            {pen.html}
                          </pre>
                        </div>
                        <div className="mb-2">
                          <span className="text-pink-400">CSS</span>
                          <pre className="mt-1 text-gray-400 line-clamp-2">
                            {pen.css}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
                      <div className="text-xs text-gray-400">
                        Updated {formatDate(pen.updated_at)}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-gray-300 hover:text-white"
                          asChild
                        >
                          <Link to={`/editor/${pen.id}`}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-gray-300 hover:text-white"
                          asChild
                        >
                          <Link to={`/pen/${pen.id}`}>
                            <ExternalLink className="h-4 w-4 mr-1" /> View
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked" className="space-y-4">
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No Liked Pens
              </h3>
              <p className="text-gray-400 mb-6">
                Pens you like will appear here
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/explore">
                  <ExternalLink className="h-4 w-4 mr-2" /> Explore Pens
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="text-center py-12">
              <Pen className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No Recent Activity
              </h3>
              <p className="text-gray-400 mb-6">
                Your recent activity will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pen</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this pen? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePen}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
