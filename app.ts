import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { extractText } from './src/extractText';
import { fetchPrompt } from './src/fetchPrompt';

const app = express();
app.use(express.json());

app.post('/detect', async (req: Request, res: Response) => {
  const filePath = req.body.filePath;

  if (!filePath) {
    return res.status(400).json({ error: 'File path not provided' });
  }

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const text = await extractText(filePath);
    console.log(`text extracted: ${text}`);
    const result = await fetchPrompt(text);
    console.log(`Prompt result: ${result}`);

    res.json({ text, result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
