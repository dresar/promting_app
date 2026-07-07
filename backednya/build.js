const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'app.js',
  external: ['bcrypt', 'express', 'mysql2', 'jsonwebtoken', 'cors', 'dotenv', 'uuid'],
  minify: false,
  sourcemap: false,
}).then(() => {
  console.log('Build completed successfully!');
}).catch(() => process.exit(1));
