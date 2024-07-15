import fs from 'fs';
import pdf from 'pdf-parse';
import xlsx from 'xlsx';
import mammoth from 'mammoth';
import tesseract from 'tesseract.js';
import path from 'path';
import mime from 'mime-types';

export const extractText = async (filePath: string): Promise<string> => {
  const mimeType = getMimeType(filePath);
  console.log(`Mime type: ${mimeType}`); // Debug statement

  try {
    switch (mimeType) {
      case 'application/pdf':
        return await extractTextFromPdf(filePath);
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return await extractTextFromExcel(filePath);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await extractTextFromWord(filePath);
      case 'text/plain':
        return await extractTextFromTxt(filePath);
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return await extractTextFromImage(filePath);
      default:
        throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error extracting text: ${error.message}`);
    } else {
      console.error('Error extracting text:', error);
    }
    throw error;
  }
};

const getMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  console.log(`File path: ${filePath}`); // Debug statement
  console.log(`File extension: ${ext}`); // Debug statement

  switch (ext) {
    case '.pdf':
      return 'application/pdf';
    case '.xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case '.txt':
      console.log(`txt: ${ext}`); 
      return 'text/plain';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return mime.lookup(filePath) || 'application/octet-stream';
  }
};

const extractTextFromPdf = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
};

const extractTextFromExcel = async (filePath: string): Promise<string> => {
  const workbook = xlsx.readFile(filePath);
  let text = '';
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    text += xlsx.utils.sheet_to_csv(sheet);
  });
  return text;
};

const extractTextFromWord = async (filePath: string): Promise<string> => {
  const data = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer: data });
  return result.value;
};

const extractTextFromTxt = async (filePath: string): Promise<string> => {
  return fs.readFileSync(filePath, 'utf8');
};

const extractTextFromImage = async (filePath: string): Promise<string> => {
  const result = await tesseract.recognize(filePath);
  return result.data.text;
};
