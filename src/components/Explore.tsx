import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { getPopularPens } from "../lib/supabase-client";
import { Eye, Heart, ExternalLink, Search, Code } from "lucide-react";
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
  profiles: {
    username: string;
  };
}

interface ExploreProps {
  isAuthenticated: boolean;
  username: string;
  onLogout: () => void;
}

const Explore: React.FC<ExploreProps> = ({
  isAuthenticated,
  username,
  onLogout,
}) => {
  const [pens, setPens] = useState<PenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPens, setFilteredPens] = useState<PenData[]>([]);

  useEffect(() => {
    const fetchPens = async () => {
      setLoading(true);
      const { data, error } = await getPopularPens(24);
      if (error) {
        console.error("Error fetching pens:", error);
      } else if (data) {
        setPens(data as PenData[]);
        setFilteredPens(data as PenData[]);
      }
      setLoading(false);
    };

    fetchPens();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPens(pens);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = pens.filter(
        (pen) =>
          pen.title.toLowerCase().includes(query) ||
          pen.description.toLowerCase().includes(query) ||
          pen.profiles.username.toLowerCase().includes(query),
      );
      setFilteredPens(filtered);
    }
  }, [searchQuery, pens]);

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Explore</h1>
            <p className="text-gray-400 mt-1">
              Discover amazing creations from the community
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search pens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
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
        ) : filteredPens.length === 0 ? (
          <div className="text-center py-12">
            <Code className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No Pens Found
            </h3>
            <p className="text-gray-400 mb-6">
              Try a different search term or check back later
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPens.map((pen) => (
              <Card
                key={pen.id}
                className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors"
              >
                <CardHeader>
                  <CardTitle className="truncate">{pen.title}</CardTitle>
                  <CardDescription className="text-gray-400 truncate">
                    by {pen.profiles.username}
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
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1 text-red-500" />
                      <span>{pen.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1 text-blue-500" />
                      <span>{pen.views}</span>
                    </div>
                  </div>
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
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
