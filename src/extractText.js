"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractText = void 0;
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const xlsx_1 = __importDefault(require("xlsx"));
const mammoth_1 = __importDefault(require("mammoth"));
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const path_1 = __importDefault(require("path"));
const extractText = async (filePath) => {
    const mimeType = getMimeType(filePath);
    switch (mimeType) {
        case 'application/pdf':
            return extractTextFromPdf(filePath);
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return extractTextFromExcel(filePath);
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return extractTextFromWord(filePath);
        case 'text/plain':
            return extractTextFromTxt(filePath);
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
            return extractTextFromImage(filePath);
        default:
            throw new Error(`Unsupported file type: ${mimeType}`);
    }
};
exports.extractText = extractText;
const getMimeType = (filePath) => {
    if (!filePath) {
        throw new Error('File path is undefined');
    }
    const ext = path_1.default.extname(filePath).toLowerCase();
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
            return 'text/plain';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        default:
            throw new Error(`Unsupported file extension: ${ext}`);
    }
};
const extractTextFromPdf = async (filePath) => {
    const dataBuffer = fs_1.default.readFileSync(filePath);
    const data = await (0, pdf_parse_1.default)(dataBuffer);
    return data.text;
};
const extractTextFromExcel = async (filePath) => {
    const workbook = xlsx_1.default.readFile(filePath);
    let text = '';
    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        text += xlsx_1.default.utils.sheet_to_csv(sheet);
    });
    return text;
};
const extractTextFromWord = async (filePath) => {
    const data = fs_1.default.readFileSync(filePath);
    const result = await mammoth_1.default.extractRawText({ buffer: data });
    return result.value;
};
const extractTextFromTxt = async (filePath) => {
    return fs_1.default.readFileSync(filePath, 'utf8');
};
const extractTextFromImage = async (filePath) => {
    const result = await tesseract_js_1.default.recognize(filePath);
    return result.data.text;
};
