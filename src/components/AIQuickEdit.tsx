import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Loader2, Sparkles } from "lucide-react";
import { generateContent } from "../lib/gemini";

interface AIQuickEditProps {
  initialCode: string;
  language: string;
  onApplyChanges: (newCode: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const AIQuickEdit: React.FC<AIQuickEditProps> = ({
  initialCode,
  language,
  onApplyChanges,
  onCancel,
  isOpen,
}) => {
  const [instruction, setInstruction] = useState("");
  const [modifiedCode, setModifiedCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateChanges = async () => {
    if (!instruction.trim()) {
      setError("Please enter an instruction for modifying the code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const prompt = `I have the following ${language} code:\n\n${initialCode}\n\nI want to: ${instruction}\n\nPlease modify the code according to these instructions. Return ONLY the complete modified code without any explanations or markdown formatting.`;

      const { content, error } = await generateContent(prompt);

      if (error || !content) {
        throw new Error(error || "Failed to generate code modifications");
      }

      // Clean up the response to extract just the code
      let cleanedCode = content;

      // Remove any markdown code blocks if present
      const codeBlockMatch = content.match(/```(?:[a-z]*)?\n([\s\S]*?)\n```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        cleanedCode = codeBlockMatch[1];
      }

      setModifiedCode(cleanedCode);
    } catch (err) {
      console.error("Error generating code modifications:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    onApplyChanges(modifiedCode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI Quick Edit
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="instruction" className="text-sm font-medium">
              What would you like to change in the code?
            </label>
            <Textarea
              id="instruction"
              placeholder="E.g., Add error handling, optimize the loop, add comments, etc."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="min-h-[80px]"
            />
            <Button
              onClick={handleGenerateChanges}
              disabled={isLoading || !instruction.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Changes
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <label htmlFor="modified-code" className="text-sm font-medium">
              Modified Code
            </label>
            <Textarea
              id="modified-code"
              value={modifiedCode}
              onChange={(e) => setModifiedCode(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              spellCheck="false"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIQuickEdit;
