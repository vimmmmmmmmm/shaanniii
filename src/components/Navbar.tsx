import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Code, Menu, Plus, User, Bot, Sparkles } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  username?: string;
  avatarUrl?: string;
  onLogin?: (email: string, password: string) => void;
  onRegister?: (email: string, password: string, username: string) => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated = false,
  username = "user",
  avatarUrl = "",
  onLogin = () => {},
  onRegister = () => {},
  onLogout = () => {},
}) => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form state for login/register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
    setAuthDialogOpen(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(email, password, registerUsername);
    setAuthDialogOpen(false);
  };

  return (
    <nav className="w-full h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <Code className="h-6 w-6 text-blue-500 mr-2" />
          <span className="text-white font-bold text-xl">CodePen Clone</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard" className="text-gray-300 hover:text-white">
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/explore" className="text-gray-300 hover:text-white">
                Explore
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              asChild
            >
              <Link to="/editor/new">
                <Plus className="h-4 w-4 mr-1" /> Create
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={username} />
                    <AvatarFallback className="bg-blue-600">
                      {username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/explore" className="text-gray-300 hover:text-white">
                Explore
              </Link>
            </Button>
            <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Authentication</DialogTitle>
                  <DialogDescription>
                    Sign in to your account or create a new one
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="login" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="py-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Sign In
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="register" className="py-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-username">Username</Label>
                        <Input
                          id="register-username"
                          type="text"
                          placeholder="username"
                          value={registerUsername}
                          onChange={(e) => setRegisterUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Create Account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 md:hidden z-50">
          <div className="flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded-md">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={username} />
                    <AvatarFallback className="bg-blue-600">
                      {username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white">{username}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/explore"
                  className="text-gray-300 hover:text-white p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link
                  to="/editor/new"
                  className="text-gray-300 hover:text-white p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create New
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/explore"
                  className="text-gray-300 hover:text-white p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explore
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAuthDialogOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
