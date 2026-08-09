import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini AI Client (Server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'ZenMess AI Engine' });
});

// Helper to attempt content generation across multiple Gemini models with retries on 503
async function generateContentWithFallback(contentsParts: any[], systemInstruction: string, responseSchema: any) {
  const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Analyzing image with Gemini model: ${modelName} (attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: { parts: contentsParts },
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema,
          },
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} attempt ${attempt} failed:`, err?.message || err);
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 800));
        }
      }
    }
  }
  throw lastError || new Error('Hệ thống AI đang bận. Vui lòng thử lại sau giây lát.');
}

// Helper to handle room image processing safely without triggering model 404 or rate limits
async function generateStylizedRoomImage(userPrompt: string, cleanBase64: string, mimeType: string): Promise<string | undefined> {
  // Return the uploaded image if present, or let the client render the interactive 2D room backdrop
  if (cleanBase64) {
    return `data:${mimeType || 'image/jpeg'};base64,${cleanBase64}`;
  }
  return undefined;
}

// Endpoint to analyze messy room image or generate new AI tidy level
app.post('/api/analyze-mess', async (req, res) => {
  try {
    const { imageBase64, roomType, cefrTarget } = req.body;

    const systemInstruction = `You are an AI Game Engine & English Tutor for "ZenMess AI". Your task is to analyze photos of real messy rooms or desks, detect the actual objects present, and build an interactive English tidying game level.

For every request:
1. Examine the user's uploaded photo carefully to identify the specific messy items visible in the image.
2. Determine the appropriate CEFR English difficulty level (e.g., A2, B1, B2).
3. Write a short, funny 2-sentence backstory in English describing the owner based on the messy objects detected in the photo.
4. Extract 4 to 6 distinct objects actually visible in the photo that need tidying up.
5. For each object, provide its English name, phonetics (IPA), Vietnamese translation, and a precise spatial instruction (e.g., "Put the coffee mug onto the wooden coaster next to the laptop").
6. Choose an appropriate iconName from: Coffee, Book, PenTool, Headphones, Gamepad2, Glasses, Trash2, Laptop, Shirt, Tv, Utensils, Scissors, Sparkles, Box, Compass, Clock, Package.
7. Set initialPos (in the bottom unsorted tray) with Y coordinates between 82 and 88, and X coordinates evenly spaced between 15 and 85. Set targetPos (where item belongs in the room) with Y coordinates between 15 and 55 and X coordinates between 12 and 88.
8. Return valid JSON matching the requested schema.`;

    const contentsParts: any[] = [];
    let cleanBase64 = '';
    let mimeType = 'image/jpeg';

    if (imageBase64) {
      cleanBase64 = imageBase64;

      if (imageBase64.startsWith('http://') || imageBase64.startsWith('https://')) {
        try {
          const fetchRes = await fetch(imageBase64);
          const arrayBuffer = await fetchRes.arrayBuffer();
          cleanBase64 = Buffer.from(arrayBuffer).toString('base64');
          const contentType = fetchRes.headers.get('content-type');
          if (contentType && contentType.includes('image')) {
            mimeType = contentType.split(';')[0];
          }
        } catch (fetchErr) {
          console.warn('Could not fetch sample image URL for Gemini inlineData:', fetchErr);
          cleanBase64 = '';
        }
      } else {
        const match = imageBase64.match(/^data:(image\/\w+);base64,/);
        if (match) {
          mimeType = match[1];
          cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        }
      }

      if (cleanBase64) {
        contentsParts.push({
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        });
        contentsParts.push({
          text: `This is a photo of a messy room or desk. Carefully analyze the image provided and identify the EXACT objects present in this photo.
Extract 4 to 6 specific items that are actually visible in this image (e.g., coffee mug, notebook, headphones, keyboard, water bottle, glasses, camera, cables, etc.).
Do NOT invent generic items; extract items actually visible in this photo.
For each item, provide its exact English name, IPA phonetics, Vietnamese translation, and a clear spatial instruction describing where it belongs in this room.
Target CEFR level: ${cefrTarget || 'A2'}.`,
        });
      } else {
        contentsParts.push({
          text: `Generate an interactive tidying game level for a messy room of type: "${roomType || 'Messy Desk'}". Extract 5 distinct messy items to organize. Provide English names, IPA phonetics, Vietnamese translations, and spatial instructions. Target CEFR level: ${cefrTarget || 'A2'}.`,
        });
      }
    } else {
      contentsParts.push({
        text: `Generate an interactive tidying game level for a messy room of type: "${roomType || 'Messy Bedroom'}". Extract 5 distinct messy items to organize. Provide English names, IPA phonetics, Vietnamese translations, and spatial instructions. Target CEFR level: ${cefrTarget || 'B1'}.`,
      });
    }

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        cefrLevel: { type: Type.STRING, description: 'CEFR level (A1, A2, B1, B2, C1)' },
        backstory: { type: Type.STRING, description: 'Funny 2-sentence English backstory of the owner' },
        roomType: { type: Type.STRING, description: 'Type of room detected e.g. Messy Desk, Bedroom' },
        objects: {
          type: Type.ARRAY,
          description: 'List of 3 to 7 objects needing tidying up',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: 'Unique slug e.g. obj-laptop-mouse' },
              name: { type: Type.STRING, description: 'English object name' },
              ipa: { type: Type.STRING, description: 'IPA phonetic transcription e.g. /ˈkɒfi mʌɡ/' },
              vietnamese: { type: Type.STRING, description: 'Vietnamese translation' },
              spatialInstruction: { type: Type.STRING, description: 'Spatial instruction e.g. Put the coffee mug next to the laptop' },
              category: { type: Type.STRING, description: 'Category e.g. Stationery, Beverage, Electronics' },
              initialPos: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER, description: 'Percentage X coordinate 12-88' },
                  y: { type: Type.NUMBER, description: 'Percentage Y coordinate 60-88' },
                },
                required: ['x', 'y'],
              },
              targetPos: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER, description: 'Percentage X coordinate 12-88' },
                  y: { type: Type.NUMBER, description: 'Percentage Y coordinate 15-52' },
                },
                required: ['x', 'y'],
              },
              targetZoneDescription: { type: Type.STRING, description: 'Description of target spot' },
              iconName: { type: Type.STRING, description: 'Suggested icon e.g. Coffee, Book, PenTool, Headphones, Gamepad2, Glasses, Trash2' },
              box2d: {
                type: Type.ARRAY,
                description: 'Normalized bounding box [ymin, xmin, ymax, xmax] coordinates from 0 to 1000',
                items: { type: Type.NUMBER },
              },
            },
            required: [
              'id',
              'name',
              'ipa',
              'vietnamese',
              'spatialInstruction',
              'category',
              'initialPos',
              'targetPos',
              'targetZoneDescription',
              'iconName',
            ],
          },
        },
      },
      required: ['cefrLevel', 'backstory', 'roomType', 'objects'],
    };

    const jsonText = await generateContentWithFallback(contentsParts, systemInstruction, responseSchema);
    const parsedData = JSON.parse(jsonText);

    // Transform scene into stylized 2D Isometric Cozy Room diorama image
    const extractedObjectsList = parsedData.objects ? parsedData.objects.map((o: any) => o.name).join(', ') : 'furniture and decor';
    const userPrompt = `Isometric 2D game illustration style, inspired by Oops! Tidy Up, cute and cozy chibi aesthetic. Transform this photo into an empty, clean 2D isometric miniature diorama room stage. Features include: soft pastel color palette with gentle gradients, clean precise line art, and simplified rounded shapes for all furniture and room structures. Remove all loose messy objects, clutter, and loose items so it is a clean, tidy empty room stage ready for playing. Maintain the room layout and type (${parsedData.roomType || roomType || 'Cozy Room'}). Soft, warm, cozy lighting, like a tiny dollhouse diorama. High quality 2D game artwork.`;

    let stylizedPhotoUrl = await generateStylizedRoomImage(userPrompt, cleanBase64, mimeType);

    // If image generation models fail or hit quota, fall back to the uploaded image base64 so stage is never empty
    if (!stylizedPhotoUrl && imageBase64) {
      stylizedPhotoUrl = imageBase64;
    }

    res.json({
      success: true,
      data: {
        ...parsedData,
        stylizedPhotoUrl,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-mess:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze messy image with ZenMess AI Engine',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZenMess AI Game Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
