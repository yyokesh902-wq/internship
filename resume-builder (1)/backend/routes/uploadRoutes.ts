import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, AuthRequest } from '../middleware/auth.ts';

const router = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const uniqueName = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

router.post('/', authenticateToken, upload.single('photo'), (req: AuthRequest, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No photo uploaded or unsupported file format.' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Read as base64 data url as well so clients can use it for PDF generation without CORS / path issues
    const fileBuffer = fs.readFileSync(req.file.path);
    const mime = req.file.mimetype;
    const dataUrl = `data:${mime};base64,${fileBuffer.toString('base64')}`;

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      fileUrl,
      dataUrl,
    });
  } catch (err: any) {
    console.error('Upload processing error:', err);
    res.status(500).json({ success: false, message: err.message || 'File upload failed' });
  }
});

export default router;
