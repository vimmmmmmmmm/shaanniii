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
import { Loader2, Globe } from "lucide-react";
import { generateContent } from "../lib/gemini";

interface UrlClonerProps {
  onCodeGenerated: (html: string, css: string, js: string) => void;
}

const UrlCloner: React.FC<UrlClonerProps> = ({ onCodeGenerated }) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleCloneWebsite = async () => {
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use Gemini to generate code based on the URL
      const prompt = `Create a simplified clone of the website at this URL: ${url}. 
Please provide the complete HTML, CSS, and JavaScript code needed to recreate a simplified version of this website. 
The code should be well-structured and responsive. 
Return your response in the following format with clear code blocks:

\`\`\`html
<!-- HTML code here -->
\`\`\`

\`\`\`css
/* CSS code here */
\`\`\`

\`\`\`javascript
// JavaScript code here
\`\`\`

Focus on capturing the main layout, colors, and functionality. Don't worry about making it pixel-perfect.`;

      const { content, error } = await generateContent(prompt);

      if (error || !content) {
        throw new Error(error || "Failed to generate code");
      }

      // Extract HTML, CSS, and JS from the response
      const htmlMatch = content.match(/```html([\s\S]*?)```/i);
      const cssMatch = content.match(/```css([\s\S]*?)```/i);
      const jsMatch = content.match(/```(?:javascript|js)([\s\S]*?)```/i);

      const html = htmlMatch && htmlMatch[1] ? htmlMatch[1].trim() : "";
      const css = cssMatch && cssMatch[1] ? cssMatch[1].trim() : "";
      const js = jsMatch && jsMatch[1] ? jsMatch[1].trim() : "";

      // Pass the generated code back to the parent component
      onCodeGenerated(html, css, js);
      setIsOpen(false);
    } catch (err) {
      console.error("Error cloning website:", err);
      setError(err instanceof Error ? err.message : "Failed to clone website");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          Clone URL
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clone Website from URL</DialogTitle>
          <DialogDescription>
            Enter a website URL to generate code that mimics its appearance and
            functionality.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="website-url">Website URL</Label>
            <Input
              id="website-url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>

        <DialogFooter>
          <Button onClick={handleCloneWebsite} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Clone Website"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UrlCloner;
