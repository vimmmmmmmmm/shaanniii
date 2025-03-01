import React from "react";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AIToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

const AIToggle: React.FC<AIToggleProps> = ({ isOpen, onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isOpen ? "default" : "outline"}
            size="sm"
            onClick={onClick}
            className={`relative ${isOpen ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          >
            <Bot className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">AI Assistant</span>
            {!isOpen && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isOpen ? "Close AI Assistant" : "Open AI Assistant"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AIToggle;
