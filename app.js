"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const extractText_1 = require("./src/extractText");
const fetchPrompt_1 = require("./src/fetchPrompt");
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: 'tmp/' });
app.post('/detect', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = path_1.default.resolve(__dirname, req.file.path);
    console.log(`Uploaded file path: ${filePath}`); // Debug statement
    try {
        const text = await (0, extractText_1.extractText)(filePath);
        const result = await (0, fetchPrompt_1.fetchPrompt)(text);
        res.json({ result });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
    finally {
        try {
            fs_1.default.unlinkSync(filePath);
        }
        catch (unlinkError) {
            if (unlinkError instanceof Error) {
                console.error(`Error deleting file: ${unlinkError.message}`);
            }
            else {
                console.error('Error deleting file: An unknown error occurred');
            }
        }
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
