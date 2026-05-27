import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

async function run() {
  try {
    const res = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: 'a cat',
      config: { numberOfImages: 1, aspectRatio: '1:1' }
    });
    console.log(res.generatedImages?.[0]?.image?.imageBytes ? "has image" : "no image");
  } catch(e) {
    console.error(e.message);
  }
}
run();
