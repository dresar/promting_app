import { query } from '../db';
import fs from 'fs';
import path from 'path';
import { getAssetsPath } from './pathHelper';

export const getLocalAssetRelativePath = (url: string | null | undefined): string | null => {
  if (!url) return null;
  let parsedPath = url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const u = new URL(url);
      parsedPath = u.pathname;
    } catch (_) {
      return null;
    }
  }
  parsedPath = parsedPath.replace(/\\/g, '/');
  parsedPath = parsedPath.replace(/^\/+/, '');
  
  let resolvedPath = '';
  if (parsedPath.startsWith('assets/')) {
    resolvedPath = path.join(getAssetsPath(), parsedPath.substring('assets/'.length));
  } else {
    resolvedPath = path.join(getAssetsPath(), parsedPath);
  }
  return resolvedPath;
};

export const isAssetReferenced = async (filePath: string): Promise<boolean> => {
  const relativeFromAssets = path.relative(getAssetsPath(), filePath).replace(/\\/g, '/');
  const searchPaths = [
    relativeFromAssets,
    `assets/${relativeFromAssets}`,
    `/assets/${relativeFromAssets}`,
    path.basename(filePath)
  ];

  const tablesAndColumns = [
    { table: 'characters', column: 'imageUrl' },
    { table: 'design_styles', column: 'imageUrl' },
    { table: 'prompt_histories', column: 'imageUrl' },
    { table: 'prompt_histories', column: 'sourceImageUrl' },
    { table: 'users', column: 'avatarUrl' },
    { table: 'templates', column: 'thumbnailUrl' },
    { table: 'uploaded_images', column: 'url' }
  ];

  for (const searchPath of searchPaths) {
    const likePattern = `%${searchPath}%`;
    for (const tc of tablesAndColumns) {
      try {
        const sql = `SELECT COUNT(*) as count FROM ${tc.table} WHERE ${tc.column} LIKE ?`;
        const result = await query(sql, [likePattern]);
        const count = parseInt(result.rows[0]?.count || '0', 10);
        if (count > 0) {
          return true;
        }
      } catch (err) {
        // Table or column might not exist yet
      }
    }
  }
  return false;
};

export const cleanUnusedAsset = async (imageUrl: string | null | undefined): Promise<boolean> => {
  if (!imageUrl) return false;
  const filePath = getLocalAssetRelativePath(imageUrl);
  if (filePath && fs.existsSync(filePath)) {
    const referenced = await isAssetReferenced(filePath);
    if (!referenced) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Auto-deleted unused local asset file: ${filePath}`);
        return true;
      } catch (err) {
        console.error(`Failed to delete local asset file: ${filePath}`, err);
      }
    }
  }
  return false;
};

export const cleanAllUnusedAssets = async (): Promise<number> => {
  let deletedCount = 0;
  const uploadsDir = path.join(getAssetsPath(), 'uploads');
  const charactersDir = path.join(getAssetsPath(), 'images/characters');
  const stylesDir = path.join(getAssetsPath(), 'images/styles');

  const directories = [uploadsDir, charactersDir, stylesDir];
  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          const referenced = await isAssetReferenced(filePath);
          if (!referenced) {
            try {
              fs.unlinkSync(filePath);
              deletedCount++;
              console.log(`General cleanup: Deleted unused asset file: ${filePath}`);
            } catch (err) {
              console.error(`General cleanup: Failed to delete: ${filePath}`, err);
            }
          }
        }
      }
    }
  }
  return deletedCount;
};
