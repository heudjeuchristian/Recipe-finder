
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonFromMarkdown = <T,>(text: string): T => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);

  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonStr);
    throw new Error("The AI returned a response in an unexpected format.");
  }
};


export const findRecipes = async (ingredients: string, dietaryPreference: string): Promise<Recipe[]> => {
  const dietaryInstruction = dietaryPreference !== 'None' 
    ? `All recipes must be strictly ${dietaryPreference}.`
    : 'Provide a diverse range of recipes.';

  const prompt = `
    You are an expert chef. Based on the ingredients provided, generate 3 diverse recipes.
    The user has the following ingredients: ${ingredients}.
    ${dietaryInstruction}

    For each recipe, provide a response in a strict JSON format. The response should be an array of JSON objects.
    Each object must have the following structure:
    {
      "title": "Recipe Title",
      "description": "A short, mouth-watering description of the dish (2-3 sentences).",
      "cookTime": "Approximate cooking time (e.g., '30 minutes')",
      "difficulty": "Easy, Medium, or Hard",
      "ingredients": {
        "used": ["list of ingredients from the user's list that are in this recipe"],
        "missing": ["list of other essential ingredients needed for this recipe"]
      },
      "instructions": [
        "Step-by-step cooking instruction 1.",
        "Step-by-step cooking instruction 2.",
        "..."
      ],
      "cuisine": "The cuisine style (e.g., Italian, Mexican, Indian)."
    }

    Ensure the "used" ingredients are a subset of what the user provided. Do not invent ingredients for the "used" list.
    Ensure the "difficulty" is one of 'Easy', 'Medium', or 'Hard'.
    The entire response MUST be a single, valid JSON array of objects, and nothing else. Do not add any commentary or extra text.
  `;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
        // Disable thinking to encourage a more direct, clean JSON output without extra commentary.
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const recipes = parseJsonFromMarkdown<Recipe[]>(response.text);
    if (!Array.isArray(recipes)) {
        // Sometimes the API might return a single object instead of an array
        if (typeof recipes === 'object' && recipes !== null && 'title' in recipes) {
            return [recipes as Recipe];
        }
        throw new Error("AI response is not an array of recipes.");
    }
    return recipes;

  } catch (error) {
    console.error("Error finding recipes:", error);
    throw new Error("Failed to fetch recipes from the AI. Please try again later.");
  }
};


export const generateRecipeImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate an image for the recipe.");
  }
};