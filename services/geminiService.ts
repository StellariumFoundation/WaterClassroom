
import { GoogleGenAI, GenerateContentResponse, Chat, Part } from "@google/genai";
import { ChatMessage, Lecture, GeminiApiResponse, GroundingMetadata } from '../types';
import { GEMINI_MODEL_TEXT } from '../constants';

// IMPORTANT: This API key should be managed securely and not hardcoded directly in production client-side code.
// It's assumed `process.env.API_KEY` is replaced by the build tool or available in the environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API Key is missing. Please set process.env.API_KEY.");
  // Potentially throw an error or disable AI features if the key is critical for app functionality
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Provide a fallback to avoid crashing GoogleGenAI constructor if API_KEY is undefined

const model = GEMINI_MODEL_TEXT;

export const generateLectureContent = async (topic: string, subjectName: string, targetAudience: string): Promise<Lecture | null> => {
  if (!API_KEY) return Promise.reject("API Key not configured for Gemini Service.");
  try {
    const prompt = `Generate educational content for a lecture on the topic "${topic}" within the subject "${subjectName}". The target audience is "${targetAudience}".
    The content should be engaging, clear, and broken down into logical sections (e.g., Introduction, Key Concepts, Examples, Summary).
    Provide the content as plain text. You can use markdown for basic formatting like headings (#, ##), lists (*, -), and bold text (**text**).
    Do not include any preamble like "Okay, here's the lecture content:". Just provide the content directly.
    Ensure the content is comprehensive enough for a short lecture module.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        // Omit thinkingConfig to use default (enabled) for higher quality educational content
      }
    });
    
    const text = response.text;
    // Basic check if content was generated
    if (!text || text.trim().length < 50) { 
        throw new Error("Generated content seems too short or empty.");
    }

    return {
      id: `lecture_${Date.now()}`,
      title: topic,
      subjectId: subjectName.toLowerCase().replace(/\s+/g, '-'), // simple subjectId generation
      type: 'text',
      content: text,
      aiGenerated: true,
      imagePlaceholderUrl: `https://picsum.photos/seed/${topic.replace(/\s+/g, '-')}/800/300` // Placeholder image for the lecture
    };
  } catch (error) {
    console.error("Error generating lecture content:", error);
    throw error; // Re-throw to be caught by the caller
  }
};


let chatInstance: Chat | null = null;

const getChatInstance = (): Chat => {
  if (!chatInstance) {
    if (!API_KEY) throw new Error("API Key not configured for Gemini Service chat.");
    chatInstance = ai.chats.create({
      model: model,
      config: {
        systemInstruction: "You are 'Aqua', an AI Tutor for the Water Classroom. You are friendly, patient, and encouraging. Your goal is to help students from K-12 to undergraduate levels understand concepts, solve problems, and prepare for exams. Adapt your language and explanations to be age-appropriate if the student provides context. If asked about recent events or information requiring web access, clearly state you will try to find information using Google Search and list any sources found. For general queries, avoid making up facts and admit if you don't know something. Keep responses concise but thorough.",
        // Omit thinkingConfig to use default (enabled) for higher quality tutor responses
      },
    });
  }
  return chatInstance;
};


export const getTutorResponseStream = async (
  history: ChatMessage[], 
  newMessage: string,
  useGoogleSearch: boolean = false
): Promise<AsyncGenerator<GeminiApiResponse, void, undefined>> => {
  if (!API_KEY) throw new Error("API Key not configured for Gemini Service.");
  
  const chat = getChatInstance(); // Use a persistent chat instance
  
  const contents: Part[] = history.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: newMessage }] });

  const config: any = {}; // Start with an empty config
  if (useGoogleSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  // Filter out empty config object if no specific tools are added
  const finalConfig = Object.keys(config).length > 0 ? config : undefined;

  const stream = await chat.sendMessageStream({
    history: contents.slice(0, -1), // Send all but the last message as history
    message: newMessage,
    config: finalConfig
  });

  async function* generateStreamData(): AsyncGenerator<GeminiApiResponse, void, undefined> {
    for await (const chunk of stream) {
      const groundingMetadata: GroundingMetadata | undefined = chunk.candidates?.[0]?.groundingMetadata;
      yield { text: chunk.text, groundingMetadata };
    }
  }
  return generateStreamData();
};


export const analyzeTextForPotentialHarm = async (text: string): Promise<boolean> => {
  // This is a placeholder. Actual safety analysis is complex and typically handled by the Gemini API itself
  // or specialized safety models/services. Gemini API has built-in safety filters.
  // For client-side, you might check for obviously problematic keywords as a basic measure.
  const harmfulKeywords = ['badword1', 'inappropriate_topic']; // Example
  return harmfulKeywords.some(keyword => text.toLowerCase().includes(keyword));
};

export const generateAssessmentQuestions = async (topic: string, subject: string, numQuestions: number = 5, questionType: string = "multiple_choice"): Promise<string> => {
  if (!API_KEY) return Promise.reject("API Key not configured for Gemini Service.");
  try {
    const prompt = `Generate ${numQuestions} ${questionType} assessment questions about "${topic}" for the subject "${subject}". 
    For multiple choice, provide 4 options and indicate the correct answer.
    Format the output as a JSON string. Each question should be an object with "text", "options" (array of strings, if multiple choice), and "correctAnswer" (string) fields.
    The entire response should be a JSON array of these question objects.
    Example for one multiple choice question:
    {
      "text": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4"
    }
    Do not include any preamble like "Okay, here's the JSON:". Just provide the JSON array directly.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    // The response text should be the JSON string.
    return jsonStr;
  } catch (error) {
    console.error("Error generating assessment questions:", error);
    throw error;
  }
};
