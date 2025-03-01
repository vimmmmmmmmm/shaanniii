import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { supabase } from "../lib/supabase-client";
import Navbar from "./Navbar";
import { Loader2, Save, User } from "lucide-react";

interface ProfileProps {
  isAuthenticated: boolean;
  username: string;
  userId: string;
  onLogout: () => void;
  onUpdateProfile: (username: string) => void;
}

interface ProfileData {
  username: string;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
}

const Profile: React.FC<ProfileProps> = ({
  isAuthenticated,
  username,
  userId,
  onLogout,
  onUpdateProfile,
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    username: username,
    avatar_url: null,
    bio: null,
    website: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else if (data) {
          setProfile({
            username: data.username,
            avatar_url: data.avatar_url,
            bio: data.bio,
            website: data.website,
          });
        }
      } catch (err) {
        console.error("Error in fetchProfile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isAuthenticated, navigate]);

  const handleSaveProfile = async () => {
    if (!isAuthenticated) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          bio: profile.bio,
          website: profile.website,
        })
        .eq("id", userId);

      if (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      } else {
        alert("Profile updated successfully!");
        onUpdateProfile(profile.username);
      }
    } catch (err) {
      console.error("Error in save operation:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
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
          <span className="ml-2">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar
        isAuthenticated={isAuthenticated}
        username={profile.username}
        avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
        onLogout={onLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                  />
                  <AvatarFallback className="bg-blue-600 text-2xl">
                    {profile.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-gray-400 text-center mb-4">
                  Your avatar is automatically generated based on your username.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="account">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) =>
                          setProfile({ ...profile, username: e.target.value })
                        }
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself"
                        className="bg-gray-700 border-gray-600 min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profile.website || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, website: e.target.value })
                        }
                        placeholder="https://yourwebsite.com"
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
