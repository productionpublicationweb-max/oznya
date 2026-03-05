import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const uploadDir = '/home/z/my-project/upload';
const files = [
  'Capture d\'écran 03-03-2026 15.05.58.png',
  'Capture d\'écran 02-03-2026 16.13.36.png',
  'Capture d\'écran 02-03-2026 16.14.44.png',
  'Capture d\'écran 02-03-2026 14.04.29.png'
];

async function analyzeImage(filePath) {
  const zai = await ZAI.create();
  
  const imageBuffer = fs.readFileSync(filePath);
  const base64Image = imageBuffer.toString('base64');
  
  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: "Décris cette capture d'écran en détail. Y a-t-il un message d'erreur 404 visible? Si oui, quelle est l'URL concernée et le message exact? Décris tout ce que tu vois."
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${base64Image}`
            }
          }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  });
  
  return response.choices[0]?.message?.content;
}

async function main() {
  for (const file of files) {
    const filePath = path.join(uploadDir, file);
    console.log(`\n=== ${file} ===`);
    try {
      const result = await analyzeImage(filePath);
      console.log(result);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

main().catch(console.error);
