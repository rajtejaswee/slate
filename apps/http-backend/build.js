import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node25', // Matches your log's Node version
  outfile: 'dist/index.js',
  external: ['@prisma/client'], 
  alias: {
    '@repo/common': '../../packages/common/src/index.ts',
    '@repo/db': '../../packages/db/src/index.ts'
  }
}).catch(() => process.exit(1));