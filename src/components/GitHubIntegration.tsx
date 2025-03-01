import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Github, GitBranch, GitCommit, GitPullRequest } from "lucide-react";
import { Textarea } from "./ui/textarea";

interface GitHubIntegrationProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  title: string;
}

const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({
  htmlCode,
  cssCode,
  jsCode,
  title,
}) => {
  const [githubToken, setGithubToken] = useState(
    localStorage.getItem("github-token") || "",
  );
  const [repoName, setRepoName] = useState("");
  const [commitMessage, setCommitMessage] = useState(
    `Update ${title || "CodePen"}`,
  );
  const [branch, setBranch] = useState("main");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSaveToken = () => {
    localStorage.setItem("github-token", githubToken);
    setSuccess("GitHub token saved successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const createGitHubRepo = async () => {
    if (!githubToken) {
      setError("Please enter a GitHub token first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create repository
      const createRepoResponse = await fetch(
        "https://api.github.com/user/repos",
        {
          method: "POST",
          headers: {
            Authorization: `token ${githubToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: repoName,
            description: `CodePen clone project: ${title}`,
            private: false,
            auto_init: true,
          }),
        },
      );

      if (!createRepoResponse.ok) {
        const errorData = await createRepoResponse.json();
        throw new Error(errorData.message || "Failed to create repository");
      }

      const repoData = await createRepoResponse.json();

      // Create files
      const files = {
        "index.html": {
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || "CodePen Project"}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${htmlCode}
  <script src="script.js"></script>
</body>
</html>`,
        },
        "styles.css": {
          content: cssCode,
        },
        "script.js": {
          content: jsCode,
        },
        "README.md": {
          content: `# ${title || "CodePen Project"}

This project was created with CodePen Clone.

## Files

- index.html - HTML structure
- styles.css - CSS styles
- script.js - JavaScript functionality
`,
        },
      };

      // Create commit with files
      for (const [filename, { content }] of Object.entries(files)) {
        const createFileResponse = await fetch(
          `https://api.github.com/repos/${repoData.owner.login}/${repoName}/contents/${filename}`,
          {
            method: "PUT",
            headers: {
              Authorization: `token ${githubToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Add ${filename}`,
              content: btoa(content),
              branch,
            }),
          },
        );

        if (!createFileResponse.ok) {
          const errorData = await createFileResponse.json();
          throw new Error(errorData.message || `Failed to create ${filename}`);
        }
      }

      setSuccess(
        `Repository created successfully! View at: ${repoData.html_url}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const pushToExistingRepo = async () => {
    if (!githubToken) {
      setError("Please enter a GitHub token first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get repo info to check if it exists
      const [owner, repo] = repoName.split("/");
      if (!owner || !repo) {
        throw new Error(
          "Please enter a valid repository name in the format 'username/repo'",
        );
      }

      const repoResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
          },
        },
      );

      if (!repoResponse.ok) {
        throw new Error("Repository not found or access denied");
      }

      // Get the current commit SHA for the branch
      const branchResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
          },
        },
      );

      if (!branchResponse.ok) {
        throw new Error(`Branch '${branch}' not found`);
      }

      const branchData = await branchResponse.json();
      const latestCommitSha = branchData.object.sha;

      // Get the tree of the latest commit
      const treeResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
          },
        },
      );

      const treeData = await treeResponse.json();
      const treeSha = treeData.tree.sha;

      // Create a new tree with our files
      const files = [
        {
          path: "index.html",
          mode: "100644",
          type: "blob",
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || "CodePen Project"}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${htmlCode}
  <script src="script.js"></script>
</body>
</html>`,
        },
        {
          path: "styles.css",
          mode: "100644",
          type: "blob",
          content: cssCode,
        },
        {
          path: "script.js",
          mode: "100644",
          type: "blob",
          content: jsCode,
        },
      ];

      const newTreeResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${githubToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            base_tree: treeSha,
            tree: files,
          }),
        },
      );

      const newTreeData = await newTreeResponse.json();

      // Create a new commit
      const newCommitResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/commits`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${githubToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: commitMessage,
            tree: newTreeData.sha,
            parents: [latestCommitSha],
          }),
        },
      );

      const newCommitData = await newCommitResponse.json();

      // Update the reference
      const updateRefResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `token ${githubToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sha: newCommitData.sha,
            force: false,
          }),
        },
      );

      if (!updateRefResponse.ok) {
        throw new Error("Failed to update branch reference");
      }

      setSuccess(`Changes pushed successfully to ${owner}/${repo}:${branch}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <Github className="h-4 w-4 mr-2" />
          GitHub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>GitHub Integration</DialogTitle>
          <DialogDescription>
            Push your code to GitHub to share or collaborate
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="token" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="token">Token</TabsTrigger>
            <TabsTrigger value="new">New Repo</TabsTrigger>
            <TabsTrigger value="existing">Push</TabsTrigger>
          </TabsList>

          <TabsContent value="token" className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-token">GitHub Personal Access Token</Label>
              <Input
                id="github-token"
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              />
              <p className="text-xs text-gray-500">
                Create a token with 'repo' scope at{" "}
                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  GitHub Settings
                </a>
              </p>
            </div>
            <Button onClick={handleSaveToken} className="w-full">
              Save Token
            </Button>
          </TabsContent>

          <TabsContent value="new" className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repo-name">Repository Name</Label>
              <Input
                id="repo-name"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="my-codepen-project"
              />
            </div>
            <Button
              onClick={createGitHubRepo}
              disabled={isLoading || !githubToken || !repoName}
              className="w-full"
            >
              {isLoading ? "Creating..." : "Create Repository"}
            </Button>
          </TabsContent>

          <TabsContent value="existing" className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="existing-repo">Repository</Label>
              <Input
                id="existing-repo"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="username/repository"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commit-message">Commit Message</Label>
              <Textarea
                id="commit-message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Update code"
                rows={2}
              />
            </div>
            <Button
              onClick={pushToExistingRepo}
              disabled={isLoading || !githubToken || !repoName}
              className="w-full"
            >
              {isLoading ? "Pushing..." : "Push to GitHub"}
            </Button>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 text-red-800 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-2 p-2 bg-green-100 border border-green-300 text-green-800 rounded text-sm">
            {success}
          </div>
        )}

        <DialogFooter className="mt-4">
          <div className="flex items-center text-xs text-gray-500">
            <GitBranch className="h-3 w-3 mr-1" />
            <span>Requires a GitHub personal access token with repo scope</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubIntegration;
