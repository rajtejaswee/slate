import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/index.js',
  // External packages that we DO NOT want to bundle (node_modules)
  external: ['express', 'ws', 'bcryptjs', 'jsonwebtoken', 'cors', 'axios', 'dotenv'],
  // Resolve workspace packages manually to ensure they are bundled
  alias: {
    '@repo/common': '../../packages/common/src/index.ts',
    '@repo/db': '../../packages/db/src/index.ts'
  }
}).catch(() => process.exit(1));