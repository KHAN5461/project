import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateGameDescription = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating game description:', error);
    throw new Error('Failed to generate game description');
  }
};

export const generateGameAssets = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating game assets:', error);
    throw new Error('Failed to generate game assets');
  }
};

export const improveGameLogic = async (gameLogic: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Improve this game logic and suggest optimizations:\n${gameLogic}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error improving game logic:', error);
    throw new Error('Failed to improve game logic');
  }
};