import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  Bot,
  Send,
  X,
  Zap,
  Code,
  Sparkles,
  Lightbulb,
  Copy,
  Image,
  Trash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateContent,
  generateProjectPlan,
  generateImageToCode,
} from "../lib/gemini";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  mode?: string;
}

interface AIMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertCode?: (code: string) => void;
}

const aiModes: AIMode[] = [
  {
    id: "chat",
    name: "Chat",
    description: "General conversation and coding assistance",
    icon: <Bot className="h-4 w-4" />,
    prompt:
      "I'm an AI assistant that can help you with coding questions and general conversation. How can I help you today?",
  },
  {
    id: "agent",
    name: "Agent",
    description: "Project planning and implementation",
    icon: <Zap className="h-4 w-4" />,
    prompt:
      "I'm your AI agent. Describe your project, and I'll create a plan and help you implement it step by step. Just tell me what you want to build, and I'll generate a complete project for you.",
  },
  {
    id: "code",
    name: "Code",
    description: "Code generation and optimization",
    icon: <Code className="h-4 w-4" />,
    prompt:
      "I can generate code based on your requirements or optimize existing code. What would you like me to help with? I can create HTML, CSS, and JavaScript code that you can directly insert into your editor.",
  },
  {
    id: "image",
    name: "Image",
    description: "Convert images to code",
    icon: <Image className="h-4 w-4" />,
    prompt:
      "Upload an image of a UI design, and I'll convert it to HTML and CSS code. Just drag and drop an image or click to upload.",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Ideas and inspiration for your projects",
    icon: <Sparkles className="h-4 w-4" />,
    prompt:
      "Need inspiration? I can help generate creative ideas for your projects. What are you working on? I can suggest UI designs, features, or entire project concepts.",
  },
];

// Simple function to format markdown-like text to HTML
const formatMessage = (text: string) => {
  // Replace code blocks
  let formattedText = text.replace(
    /```([\s\S]*?)```/g,
    '<pre class="bg-gray-700 p-2 rounded my-2 overflow-x-auto"><code>$1</code></pre>',
  );

  // Replace inline code
  formattedText = formattedText.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>',
  );

  // Replace headers
  formattedText = formattedText.replace(
    /^# (.+)$/gm,
    '<h1 class="text-xl font-bold mb-2">$1</h1>',
  );
  formattedText = formattedText.replace(
    /^## (.+)$/gm,
    '<h2 class="text-lg font-bold mb-2">$1</h2>',
  );
  formattedText = formattedText.replace(
    /^### (.+)$/gm,
    '<h3 class="text-md font-bold mb-2">$1</h3>',
  );

  // Replace bold and italic
  formattedText = formattedText.replace(
    /\*\*([^*]+)\*\*/g,
    "<strong>$1</strong>",
  );
  formattedText = formattedText.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Replace lists
  formattedText = formattedText.replace(/^- (.+)$/gm, "<li>$1</li>");
  formattedText = formattedText.replace(
    /(<li>.+<\/li>\n)+/g,
    '<ul class="list-disc pl-5 mb-3">$&</ul>',
  );

  // Replace paragraphs (must be done last)
  formattedText = formattedText.replace(
    /^([^<].+)$/gm,
    '<p class="mb-2">$1</p>',
  );

  return formattedText;
};

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, onInsertCode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<AIMode>(aiModes[0]);
  const [projectPlan, setProjectPlan] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert date strings back to Date objects
        Object.keys(parsedHistory).forEach((mode) => {
          parsedHistory[mode] = parsedHistory[mode].map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        });
        setChatHistory(parsedHistory);
      } catch (error) {
        console.error("Error parsing chat history:", error);
      }
    }
  }, []);

  // Initialize chat with the selected mode's prompt or load from history
  useEffect(() => {
    if (chatHistory[currentMode.id]?.length > 0) {
      setMessages(chatHistory[currentMode.id]);
      // If in agent mode, try to restore project plan
      if (currentMode.id === "agent") {
        const planMessage = chatHistory[currentMode.id].find(
          (msg) =>
            msg.sender === "ai" &&
            msg.content.includes("# ") &&
            msg.content.includes("## Project Plan"),
        );
        if (planMessage) {
          try {
            // Extract plan from message content
            const planMatch = planMessage.content.match(/# ([^\n]+)/);
            if (planMatch) {
              const title = planMatch[1];
              const overview = planMessage.content.split("\n\n")[1];
              const stepsMatch = planMessage.content.match(
                /## Project Plan\n\n([\s\S]*?)\n\n## Technologies/,
              );
              const techMatch = planMessage.content.match(
                /## Technologies\n\n([\s\S]*?)\n\nWould you like/,
              );

              if (stepsMatch && techMatch) {
                const stepsText = stepsMatch[1];
                const techText = techMatch[1];

                const steps = stepsText
                  .split("\n\n")
                  .map((step, index) => {
                    const stepMatch = step.match(
                      /### Step (\d+): ([^\n]+)\n([^\n]+)\n\*Estimated time: ([^\*]+)\*/,
                    );
                    if (stepMatch) {
                      return {
                        id: parseInt(stepMatch[1]),
                        name: stepMatch[2],
                        description: stepMatch[3],
                        estimatedTime: stepMatch[4],
                      };
                    }
                    return null;
                  })
                  .filter(Boolean);

                const technologies = techText
                  .split("\n")
                  .map((tech) => tech.replace("- ", ""));

                setProjectPlan({
                  title,
                  overview,
                  steps,
                  technologies,
                });

                // Find the last step that was implemented
                const implementedSteps = chatHistory[currentMode.id].filter(
                  (msg) => msg.content.includes("Implementation for Step"),
                );
                if (implementedSteps.length > 0) {
                  const lastStepMatch = implementedSteps[
                    implementedSteps.length - 1
                  ].content.match(/Implementation for Step (\d+)/);
                  if (lastStepMatch) {
                    setCurrentStep(parseInt(lastStepMatch[1]) + 1);
                  }
                }
              }
            }
          } catch (error) {
            console.error("Error restoring project plan:", error);
          }
        }
      }
    } else {
      setMessages([
        {
          id: "welcome",
          content: currentMode.prompt,
          sender: "ai",
          timestamp: new Date(),
          mode: currentMode.id,
        },
      ]);
    }

    // Reset project plan and current step when changing modes
    if (currentMode.id !== "agent") {
      setProjectPlan(null);
      setCurrentStep(1);
    }

    // Reset image state when not in image mode
    if (currentMode.id !== "image") {
      setImageFile(null);
      setImagePreview(null);
    }
  }, [currentMode.id]);

  // Save messages to chat history when they change
  useEffect(() => {
    if (messages.length > 0) {
      setChatHistory((prev) => ({
        ...prev,
        [currentMode.id]: messages,
      }));
    }
  }, [messages]);

  // Save chat history to localStorage when it changes
  useEffect(() => {
    if (Object.keys(chatHistory).length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if ((!input.trim() && !imageFile) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: imageFile ? `[Image Upload: ${imageFile.name}]` : input,
      sender: "user",
      timestamp: new Date(),
      mode: currentMode.id,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Handle image-to-code mode
      if (currentMode.id === "image" && imageFile) {
        const loadingMessage: Message = {
          id: Date.now().toString() + "-loading",
          content: "Analyzing your image and generating code...",
          sender: "ai",
          timestamp: new Date(),
          mode: currentMode.id,
        };

        setMessages((prev) => [...prev, loadingMessage]);

        const { content, error } = await generateImageToCode(imageFile);

        if (error || !content) {
          throw new Error(error || "Failed to generate code from image");
        }

        const aiResponse: Message = {
          id: Date.now().toString(),
          content: `## Image to Code Result\n\nHere's the code that represents your image:\n\n${content}\n\nYou can insert this code into the editor using the button below.`,
          sender: "ai",
          timestamp: new Date(),
          mode: currentMode.id,
        };

        // Remove the loading message and add the real response
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== loadingMessage.id).concat(aiResponse),
        );
        setImageFile(null);
        setImagePreview(null);

        // Auto-insert the code
        if (onInsertCode) {
          const code = extractCodeBlock(content);
          if (code) {
            onInsertCode(content);
          }
        }
      }
      // Handle agent mode - project planning
      else if (currentMode.id === "agent" && !projectPlan) {
        // Generate project plan in agent mode
        const { plan, error } = await generateProjectPlan(input);

        if (error || !plan) {
          throw new Error(error || "Failed to generate project plan");
        }

        setProjectPlan(plan);

        const aiResponse: Message = {
          id: Date.now().toString(),
          content: `# ${plan.title}\n\n${plan.overview}\n\n## Project Plan\n\n${plan.steps
            .map(
              (step: any) =>
                `### Step ${step.id}: ${step.name}\n${step.description}\n*Estimated time: ${step.estimatedTime}*`,
            )
            .join("\n\n")}\n\n## Technologies\n\n${plan.technologies
            .map((tech: string) => `- ${tech}`)
            .join(
              "\n",
            )}\n\nWould you like me to start implementing this plan? Say "yes" to begin with Step 1.`,
          sender: "ai",
          timestamp: new Date(),
          mode: currentMode.id,
        };

        setMessages((prev) => [...prev, aiResponse]);
      }
      // Handle agent mode - implementation
      else if (
        currentMode.id === "agent" &&
        projectPlan &&
        (input.toLowerCase().includes("yes") ||
          input.toLowerCase().includes("build") ||
          input.toLowerCase().includes("implement") ||
          input.toLowerCase().includes("create") ||
          input.toLowerCase().includes("generate") ||
          input.toLowerCase().includes("start") ||
          input.toLowerCase().includes("go ahead") ||
          input.toLowerCase().includes("proceed") ||
          input.toLowerCase().includes("next") ||
          input.toLowerCase().includes("continue"))
      ) {
        // Implement the current step in the plan
        const step = projectPlan.steps[currentStep - 1];

        const aiResponse: Message = {
          id: Date.now().toString(),
          content: `I'll now implement **Step ${currentStep}: ${step.name}**. Please wait while I generate the code...`,
          sender: "ai",
          timestamp: new Date(),
          mode: currentMode.id,
        };

        setMessages((prev) => [...prev, aiResponse]);

        // Generate code for the current step
        const { content, error } = await generateContent(
          `Generate code for the following step in my project:\n\nProject: ${projectPlan.title}\nStep ${step.id}: ${step.name}\nDescription: ${step.description}\n\nProvide complete, working code with comments explaining key parts. Format your response with proper markdown code blocks using triple backticks and language identifiers (html, css, javascript). Make sure the code is fully functional and ready to use. Include all necessary HTML, CSS, and JavaScript code to implement this feature completely.`,
        );

        if (error || !content) {
          throw new Error(error || "Failed to generate code");
        }

        const codeResponse: Message = {
          id: Date.now().toString() + "-code",
          content: `## Implementation for Step ${currentStep}: ${step.name}\n\n${content}\n\nWould you like to move to the next step?`,
          sender: "ai",
          timestamp: new Date(),
          mode: currentMode.id,
        };

        setMessages((prev) => [...prev, codeResponse]);

        // Auto-insert the code
        if (onInsertCode) {
          onInsertCode(content);
        }

        if (currentStep < projectPlan.steps.length) {
          setCurrentStep(currentStep + 1);
        }
      }
      // Regular chat mode or code mode
      else {
        // Regular chat mode
        const { content, error } = await generateContent(input);

        if (error || !content) {
          throw new Error(error || "Failed to generate response");
        }

        const aiResponse: Message = {
          id: Date.now().toString(),
          content: content,
          sender: "ai",
          timestamp: new Date(),
          mode: currentMode.id,
        };

        setMessages((prev) => [...prev, aiResponse]);

        // Auto-insert code if it contains code blocks
        if (onInsertCode && extractCodeBlock(content)) {
          onInsertCode(content);
        }
      }
    } catch (error) {
      console.error("Error in AI response:", error);

      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again or check your API key configuration.`,
        sender: "ai",
        timestamp: new Date(),
        mode: currentMode.id,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleModeChange = (modeId: string) => {
    const newMode = aiModes.find((mode) => mode.id === modeId) || aiModes[0];
    setCurrentMode(newMode);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome",
        content: currentMode.prompt,
        sender: "ai",
        timestamp: new Date(),
        mode: currentMode.id,
      },
    ]);

    // Update chat history
    setChatHistory((prev) => ({
      ...prev,
      [currentMode.id]: [],
    }));

    // Reset project plan if in agent mode
    if (currentMode.id === "agent") {
      setProjectPlan(null);
      setCurrentStep(1);
    }

    // Reset image if in image mode
    if (currentMode.id === "image") {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const extractCodeBlock = (message: string) => {
    // First try to match code blocks with language identifiers
    const codeBlockRegex = /```(?:html|css|jsx?|tsx?)?([\s\S]*?)```/g;
    const matches = [];
    let match;

    while ((match = codeBlockRegex.exec(message)) !== null) {
      matches.push(match[1].trim());
    }

    // If no matches with language identifiers, try without
    if (matches.length === 0) {
      const simpleCodeBlockRegex = /```([\s\S]*?)```/g;
      while ((match = simpleCodeBlockRegex.exec(message)) !== null) {
        matches.push(match[1].trim());
      }
    }

    return matches.length > 0 ? matches[0] : null;
  };

  const handleInsertCode = (message: Message) => {
    const code = extractCodeBlock(message.content);
    if (code && onInsertCode) {
      onInsertCode(message.content);
      // Don't close the chat so users can continue the conversation
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3 }}
        className="fixed right-0 top-0 z-50 h-screen w-80 md:w-96 bg-gray-900 border-l border-gray-800 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2 bg-blue-600">
              <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=gemini" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium text-white">AI Assistant</h3>
              <p className="text-xs text-gray-400">{currentMode.name} Mode</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearHistory}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
              title="Clear chat history"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue={currentMode.id} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-5 p-1 m-2 bg-gray-800">
            {aiModes.map((mode) => (
              <TabsTrigger
                key={mode.id}
                value={mode.id}
                onClick={() => handleModeChange(mode.id)}
                className="data-[state=active]:bg-gray-700"
              >
                {mode.icon}
                <span className="sr-only">{mode.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {aiModes.map((mode) => (
            <TabsContent
              key={mode.id}
              value={mode.id}
              className="flex-1 flex flex-col p-0 m-0"
            >
              <div className="p-2 bg-gray-800 border-t border-b border-gray-700">
                <Badge variant="outline" className="bg-gray-700 text-xs">
                  {mode.name}
                </Badge>
                <p className="text-xs text-gray-400 mt-1">{mode.description}</p>
              </div>

              <div
                ref={messagesContainerRef}
                className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                style={{
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 250px)",
                  scrollbarWidth: "thin",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {messages
                  .filter((msg) => !msg.mode || msg.mode === mode.id)
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${message.sender === "user" ? "ml-4" : "mr-4"}`}
                    >
                      <div
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender === "ai" && (
                          <Avatar className="h-8 w-8 mr-2 bg-blue-600 flex-shrink-0">
                            <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=gemini" />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg p-3 max-w-[85%] ${message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"}`}
                        >
                          <div className="prose prose-sm prose-invert max-w-none">
                            {/* Using dangerouslySetInnerHTML instead of ReactMarkdown */}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: formatMessage(message.content),
                              }}
                            />
                          </div>
                          {message.sender === "ai" &&
                            extractCodeBlock(message.content) && (
                              <div className="flex space-x-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleInsertCode(message)}
                                  className="text-xs"
                                >
                                  Insert Code
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const code = extractCodeBlock(
                                      message.content,
                                    );
                                    if (code) {
                                      navigator.clipboard.writeText(code);
                                    }
                                  }}
                                  className="text-xs"
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </Button>
                              </div>
                            )}
                        </div>
                        {message.sender === "user" && (
                          <Avatar className="h-8 w-8 ml-2 bg-gray-700 flex-shrink-0">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                            <AvatarFallback>You</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div
                        className={`text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 mb-4 mr-4">
                    <Avatar className="h-8 w-8 mr-2 bg-blue-600">
                      <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=gemini" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-800 rounded-lg p-3 text-gray-100">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {mode.id === "image" && (
                <div className="p-4 border-t border-gray-800 bg-gray-850">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="mb-4">
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full rounded-md border border-gray-700"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        className="w-full mt-2"
                        onClick={handleSendMessage}
                        disabled={isLoading}
                      >
                        Generate Code from Image
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-dashed border-2 py-8 flex flex-col items-center justify-center"
                      onClick={triggerImageUpload}
                    >
                      <Image className="h-8 w-8 mb-2 text-gray-400" />
                      <span>Click to upload an image</span>
                      <span className="text-xs text-gray-500 mt-1">
                        or drag and drop
                      </span>
                    </Button>
                  )}
                </div>
              )}

              <div className="p-4 border-t border-gray-800">
                {mode.id !== "image" && (
                  <div className="flex items-center space-x-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Message ${mode.name}...`}
                      disabled={isLoading}
                      className="flex-1 bg-gray-800 border-gray-700 text-white"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {mode.id === "agent" && projectPlan && (
                  <div className="mt-2">
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-xs text-gray-400">
                          Project: {projectPlan.title}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Step {currentStep} of {projectPlan.steps.length}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChat;
