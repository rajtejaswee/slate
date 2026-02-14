import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/index.js',
  // formatting this to ensure @repo/db is INCLUDED in the bundle
  external: ['@prisma/client', 'express', 'ws'], 
  plugins: [],
}).catch(() => process.exit(1));