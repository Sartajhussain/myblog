import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const apiKey = process.env.GEMINI_API_KEY;

console.log(
  "Gemini API:",
  apiKey ? "Configured" : "Missing"
);

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
    })
  : null;

export const generateBlogContent = async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is not configured on server",
      });
    }

    const {
      prompt,
      title = "",
      subtitle = "",
      category = "",
    } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "AI prompt is required",
      });
    }

    const finalPrompt = `
You are a professional SEO blog writer.

Write an original, useful, engaging, and highly readable blog article based on the information below.

BLOG DETAILS:
Title: ${title}
Subtitle: ${subtitle}
Category: ${category}

USER REQUEST:
${prompt}

REQUIREMENTS:
1. Act as a professional SEO blog writer.
2. Generate a complete article suitable for direct publishing.
3. Include a strong introduction.
4. Use meaningful H2 and H3 headings.
5. Use paragraphs, lists, and examples where appropriate.
6. Use bold and italic formatting where useful.
7. End with a useful conclusion.
8. Write original content that follows the user request exactly.
9. Do not mention that AI wrote the article.
10. Do not include filler or generic fluff.
11. Do not use Markdown.
12. Do not wrap the answer in code fences.
13. Do not include <html>, <head>, or <body> tags.
14. Return only valid HTML for a JoditEditor.
15. Use tags such as <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <pre>, and <code> when appropriate.

Return ONLY the final article HTML.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: finalPrompt,
    });

    let generatedContent = response.text || "";

    generatedContent = generatedContent
      .replace(/```html/gi, "")
      .replace(/```/g, "")
      .trim();

    if (!generatedContent) {
      return res.status(500).json({
        success: false,
        message: "AI did not return any content",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog content generated successfully",
      content: generatedContent,
    });
  } catch (error) {
    console.error("AI BLOG GENERATION ERROR:", error);
    console.error("Gemini error:", {
      message: error?.message,
      name: error?.name,
      status: error?.status,
    });

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to generate blog content",
    });
  }
};