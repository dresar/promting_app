import path from 'path';
import fs from 'fs';

export const getAssetsPath = () => {
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
  const assetsPath = candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
  if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath, { recursive: true });
  }
  return assetsPath;
};
