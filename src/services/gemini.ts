import { GoogleGenAI, Type } from "@google/genai";
import { JobRequirements, Candidate } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeCV(
  file: File,
  requirements: JobRequirements
): Promise<Partial<Candidate>> {
  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;

    const prompt = `
      You are an expert HR Recruiter. Analyze the provided CV against the following job requirements:
      - Required Years of Experience: ${requirements.experienceYears}
      - Field/Specialization: ${requirements.field}
      - Core Skills: ${requirements.skills.join(", ")}
      
      The scoring should be weighted as follows:
      - Technical Skills: ${requirements.weights.skills}%
      - Experience: ${requirements.weights.experience}%
      - Education: ${requirements.weights.education}%

      Provide a detailed analysis of the candidate's fit for the role.
      Score the candidate from 0 to 10 based on how well they match the requirements and the provided weights.
      Extract their name, current or most relevant job title, a short summary of their experience (2-3 sentences), their key strengths (as a list of tags), and their total years of experience.
      Also, identify any missing skills from the core skills list, and any red flags (e.g., employment gaps, job hopping).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Candidate's full name" },
            jobTitle: { type: Type.STRING, description: "Candidate's current or most relevant job title" },
            score: { type: Type.NUMBER, description: "Score from 0 to 10 based on match with requirements" },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of key strengths, skills, or tags (e.g., React, Leadership, 4 Years Experience)",
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of required skills that the candidate is missing",
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of red flags such as employment gaps or job hopping",
            },
            summary: { type: Type.STRING, description: "A short summary of their experience (2-3 sentences)" },
            experienceYears: { type: Type.NUMBER, description: "Total years of professional experience" },
          },
          required: ["name", "jobTitle", "score", "strengths", "missingSkills", "redFlags", "summary", "experienceYears"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini");
    }

    const result = JSON.parse(resultText);
    return result;
  } catch (error) {
    console.error("Error analyzing CV:", error);
    throw error;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
