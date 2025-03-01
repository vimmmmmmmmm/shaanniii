import { Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./components/Dashboard";
import Explore from "./components/Explore";
import Editor from "./components/Editor";
import PenView from "./components/PenView";
import Profile from "./components/Profile";
import { getCurrentUser, signOut } from "./lib/supabase-client";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { user, error } = await getCurrentUser();
      if (user && !error) {
        setIsAuthenticated(true);
        setUserId(user.id);
        setUsername(
          user.user_metadata.username || user.email?.split("@")[0] || "user",
        );
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    setUserId("");
    setUsername("");
  };

  const handleUpdateProfile = (newUsername: string) => {
    setUsername(newUsername);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
          Loading...
        </div>
      }
    >
      <>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isAuthenticated={isAuthenticated}
                username={username}
                onLogin={(email, password) => {
                  // This is handled by the Navbar component
                  console.log("Login attempt", email, password);
                }}
                onRegister={(email, password, username) => {
                  // This is handled by the Navbar component
                  console.log("Register attempt", email, password, username);
                }}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                isAuthenticated={isAuthenticated}
                username={username}
                userId={userId}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/explore"
            element={
              <Explore
                isAuthenticated={isAuthenticated}
                username={username}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/editor/:id"
            element={
              <Editor
                isAuthenticated={isAuthenticated}
                username={username}
                userId={userId}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/pen/:id"
            element={
              <PenView
                isAuthenticated={isAuthenticated}
                username={username}
                userId={userId}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                isAuthenticated={isAuthenticated}
                username={username}
                userId={userId}
                onLogout={handleLogout}
                onUpdateProfile={handleUpdateProfile}
              />
            }
          />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
