import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { getAssetsPath } from '../utils/pathHelper';

const uploadDir = path.join(getAssetsPath(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const shortId = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    cb(null, `${shortId}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

const copyToAllAssetCandidates = (filename: string, sourcePath: string) => {
  const candidates = [
    path.resolve(__dirname, '../../assets'),
    path.resolve(__dirname, 'assets'),
    path.resolve(__dirname, '../public_html/assets'),
    path.resolve(__dirname, '../../public_html/assets'),
    path.resolve(process.cwd(), '../public_html/assets'),
    path.resolve(process.cwd(), '../../public_html/assets'),
    path.resolve(process.cwd(), 'backednya/assets'),
    path.resolve(process.cwd(), 'assets'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const targetDir = path.join(candidate, 'uploads');
      if (!fs.existsSync(targetDir)) {
        try {
          fs.mkdirSync(targetDir, { recursive: true });
        } catch (e) {
          console.error(`Failed to create directory ${targetDir}:`, e);
        }
      }
      const targetPath = path.join(targetDir, filename);
      if (path.resolve(sourcePath) !== path.resolve(targetPath)) {
        try {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`Successfully synced asset to: ${targetPath}`);
        } catch (e) {
          console.error(`Failed to sync asset to ${targetPath}:`, e);
        }
      }
    }
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || '';

  if (!privateKey || !urlEndpoint) {
    const fileUrl = `assets/uploads/${req.file.filename}`;
    copyToAllAssetCandidates(req.file.filename, req.file.path);
    return res.json({ url: fileUrl, message: 'File uploaded locally (No ImageKit configuration)' });
  }

  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64File = fileBuffer.toString('base64');
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    const payload = JSON.stringify({
      file: `data:${req.file.mimetype};base64,${base64File}`,
      fileName: req.file.filename,
      useUniqueFileName: true
    });

    const https = require('https');
    const url = new URL('https://upload.imagekit.io/api/v1/files/upload');
    
    const options = {
      method: 'POST',
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const reqUpload = https.request(options, (resUpload: any) => {
      let chunks = '';
      resUpload.on('data', (chunk: any) => {
        chunks += chunk;
      });

      resUpload.on('end', () => {
        try {
          const parsed = JSON.parse(chunks);
          if (resUpload.statusCode === 200 && parsed.url) {
            // Delete local file after upload
            fs.unlinkSync(req.file!.path);
            return res.json({ url: parsed.url, message: 'File uploaded successfully to ImageKit CDN' });
          } else {
            console.error('ImageKit upload error response:', parsed);
            const fileUrl = `assets/uploads/${req.file!.filename}`;
            copyToAllAssetCandidates(req.file!.filename, req.file!.path);
            return res.json({ url: fileUrl, message: 'Uploaded locally (ImageKit failed)' });
          }
        } catch (e) {
          console.error('ImageKit parse error:', e);
          const fileUrl = `assets/uploads/${req.file!.filename}`;
          copyToAllAssetCandidates(req.file!.filename, req.file!.path);
          return res.json({ url: fileUrl, message: 'Uploaded locally (ImageKit parse error)' });
        }
      });
    });

    reqUpload.on('error', (error: any) => {
      console.error('ImageKit upload request error:', error);
      const fileUrl = `assets/uploads/${req.file!.filename}`;
      copyToAllAssetCandidates(req.file!.filename, req.file!.path);
      return res.json({ url: fileUrl, message: 'Uploaded locally (ImageKit request error)' });
    });

    reqUpload.write(payload);
    reqUpload.end();

  } catch (err: any) {
    console.error('Upload handler error:', err);
    const fileUrl = `assets/uploads/${req.file.filename}`;
    copyToAllAssetCandidates(req.file.filename, req.file.path);
    return res.json({ url: fileUrl, message: 'Uploaded locally (catch)' });
  }
};

export const uploadFiles = async (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || '';

  const results: any[] = [];

  for (const file of req.files as Express.Multer.File[]) {
    if (!privateKey || !urlEndpoint) {
      const fileUrl = `assets/uploads/${file.filename}`;
      copyToAllAssetCandidates(file.filename, file.path);
      results.push({ url: fileUrl, message: 'File uploaded locally (No ImageKit configuration)' });
      continue;
    }

    try {
      const fileBuffer = fs.readFileSync(file.path);
      const base64File = fileBuffer.toString('base64');
      const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

      const payload = JSON.stringify({
        file: `data:${file.mimetype};base64,${base64File}`,
        fileName: file.filename,
        useUniqueFileName: true
      });

      const https = require('https');
      const url = new URL('https://upload.imagekit.io/api/v1/files/upload');
      
      const options = {
        method: 'POST',
        hostname: url.hostname,
        path: url.pathname,
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const result = await new Promise<any>((resolve, reject) => {
        const reqUpload = https.request(options, (resUpload: any) => {
          let chunks = '';
          resUpload.on('data', (chunk: any) => {
            chunks += chunk;
          });

          resUpload.on('end', () => {
            try {
              const parsed = JSON.parse(chunks);
              if (resUpload.statusCode === 200 && parsed.url) {
                // Delete local file after upload
                fs.unlinkSync(file.path);
                resolve({ url: parsed.url, message: 'File uploaded successfully to ImageKit CDN' });
              } else {
                console.error('ImageKit upload error response:', parsed);
                const fileUrl = `assets/uploads/${file.filename}`;
                copyToAllAssetCandidates(file.filename, file.path);
                resolve({ url: fileUrl, message: 'Uploaded locally (ImageKit failed)' });
              }
            } catch (e) {
              console.error('ImageKit parse error:', e);
              const fileUrl = `assets/uploads/${file.filename}`;
              copyToAllAssetCandidates(file.filename, file.path);
              resolve({ url: fileUrl, message: 'Uploaded locally (ImageKit parse error)' });
            }
          });
        });

        reqUpload.on('error', (error: any) => {
          console.error('ImageKit upload request error:', error);
          const fileUrl = `assets/uploads/${file.filename}`;
          copyToAllAssetCandidates(file.filename, file.path);
          resolve({ url: fileUrl, message: 'Uploaded locally (ImageKit request error)' });
        });

        reqUpload.write(payload);
        reqUpload.end();
      });

      results.push(result);
    } catch (err: any) {
      console.error('Upload handler error:', err);
      const fileUrl = `assets/uploads/${file.filename}`;
      copyToAllAssetCandidates(file.filename, file.path);
      results.push({ url: fileUrl, message: 'Uploaded locally (catch)' });
    }
  }

  return res.json({ 
    urls: results.map(r => r.url),
    message: 'Files processed successfully',
    results 
  });
};
