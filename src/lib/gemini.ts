import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
// In production, this should be stored in environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Initialize the API client
const genAI = new GoogleGenerativeAI(API_KEY);

// Available models
export const MODELS = {
  GEMINI_PRO: "gemini-1.5-flash",
  GEMINI_PRO_VISION: "gemini-2.0-flash",
};

// Function to generate content using Gemini AI
export async function generateContent(
  prompt: string,
  model = MODELS.GEMINI_PRO,
) {
  try {
    if (!API_KEY) {
      return {
        error:
          "API key is not configured. Please add your Gemini API key to the environment variables.",
        content: null,
      };
    }

    // For text-only input
    const geminiModel = genAI.getGenerativeModel({ model });

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { content: text, error: null };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      content: null,
    };
  }
}

// Function to generate a project plan
export async function generateProjectPlan(description: string) {
  const prompt = `
    Create a detailed project plan for the following project description:
    
    ${description}
    
    Format your response as a JSON object with the following structure:
    {
      "title": "Project Title",
      "overview": "Brief overview of the project",
      "steps": [
        {
          "id": 1,
          "name": "Step name",
          "description": "Detailed description of the step",
          "estimatedTime": "Estimated time to complete this step",
          "codeFiles": [
            {
              "filename": "example.js",
              "language": "javascript",
              "purpose": "Brief description of what this file does"
            }
          ]
        },
        ...
      ],
      "technologies": ["List", "of", "technologies", "to", "use"]
    }
    
    Make sure to include all necessary steps to complete the project from start to finish. Be comprehensive and detailed in your planning.
  `;

  const { content, error } = await generateContent(prompt);

  if (error) {
    return { plan: null, error };
  }

  try {
    // Extract the JSON object from the response
    const jsonMatch = content?.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonMatch) {
      return {
        plan: null,
        error: "Could not parse the response as JSON",
      };
    }

    const plan = JSON.parse(jsonMatch);
    return { plan, error: null };
  } catch (jsonError) {
    console.error("Error parsing JSON:", jsonError, content);
    return {
      plan: null,
      error: "Failed to parse the AI response as JSON",
    };
  }
}

// Function to generate code based on a plan
export async function generateCode(plan: any, step: number) {
  if (!plan || !plan.steps || !plan.steps[step - 1]) {
    return { code: null, error: "Invalid plan or step" };
  }

  const currentStep = plan.steps[step - 1];
  const technologies = plan.technologies.join(", ");

  const prompt = `
    Generate code for the following step in my project:
    
    Project: ${plan.title}
    Technologies: ${technologies}
    
    Step ${currentStep.id}: ${currentStep.name}
    Description: ${currentStep.description}
    
    Please provide complete, working code with comments explaining key parts.
    If this involves multiple files, clearly indicate the file name before each code block.
    Format your response with proper markdown code blocks using triple backticks and language identifiers.
    For example: \`\`\`html, \`\`\`css, \`\`\`javascript
    
    Make sure the code is fully functional, well-structured, and follows best practices.
    Include detailed comments to explain complex parts of the code.
    
    For HTML, CSS, and JavaScript code, please provide separate code blocks for each language type.
    For example:
    
    \`\`\`html
    <!-- HTML code here -->
    \`\`\`
    
    \`\`\`css
    /* CSS code here */
    \`\`\`
    
    \`\`\`javascript
    // JavaScript code here
    \`\`\`
  `;

  return await generateContent(prompt);
}

// Function to generate code from an image
export async function generateImageToCode(imageFile: File) {
  try {
    if (!API_KEY) {
      return {
        error:
          "API key is not configured. Please add your Gemini API key to the environment variables.",
        content: null,
      };
    }

    // Convert the image file to a base64 string
    const imageData = await fileToGenerativePart(imageFile);

    // Use the vision model for image processing
    const model = genAI.getGenerativeModel({ model: MODELS.GEMINI_PRO_VISION });

    const prompt =
      "Convert this UI design image to HTML and CSS code. Provide the complete code that would recreate this design as closely as possible. Format your response with proper markdown code blocks using triple backticks and language identifiers for HTML and CSS. Make sure to separate the HTML and CSS into different code blocks.";

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    return { content: text, error: null };
  } catch (error) {
    console.error("Error generating code from image:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      content: null,
    };
  }
}

// Helper function to convert a file to a generative part
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  const base64EncodedData = await base64EncodedDataPromise;
  const mimeType = file.type;

  return {
    inlineData: {
      data: base64EncodedData.split(",")[1],
      mimeType,
    },
  };
}
