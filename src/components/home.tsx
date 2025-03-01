import React, { useState } from "react";
import Navbar from "./Navbar";
import CodeEditor from "./CodeEditor";

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (email: string, password: string) => {
    // Mock authentication - in a real app, this would call an API
    console.log("Login attempt with:", email, password);
    setIsAuthenticated(true);
    setUsername(email.split("@")[0]); // Use part of email as username for demo
  };

  const handleRegister = (
    email: string,
    password: string,
    username: string,
  ) => {
    // Mock registration - in a real app, this would call an API
    console.log("Register attempt with:", email, password, username);
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-900">
      <Navbar
        isAuthenticated={isAuthenticated}
        username={username}
        avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />
      <main className="flex-grow overflow-hidden">
        <CodeEditor
          isAuthenticated={isAuthenticated}
          initialHtmlCode='<div class="container">\n  <h1>Welcome to CodePen Clone</h1>\n  <p>Start editing HTML, CSS, and JavaScript to see your changes in real-time!</p>\n</div>'
          initialCssCode=".container {\n  font-family: system-ui, sans-serif;\n  max-width: 800px;\n  margin: 2rem auto;\n  padding: 2rem;\n  border-radius: 8px;\n  background-color: white;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n  text-align: center;\n}\n\nh1 {\n  color: #3b82f6;\n  margin-bottom: 1rem;\n}\n\np {\n  color: #4b5563;\n  line-height: 1.5;\n}"
          initialJsCode='// Your JavaScript code here\nconsole.log("Welcome to CodePen Clone!");\n\n// Example: Change text color on click\ndocument.querySelector("h1").addEventListener("click", function() {\n  this.style.color = `hsl(${Math.random() * 360}, 100%, 50%)";\n});'
        />
      </main>
    </div>
  );
};

export default Home;
