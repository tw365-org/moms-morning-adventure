import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const outputDirectory = resolve(projectRoot, 'dist');

if (!outputDirectory.startsWith(`${projectRoot}${sep}`)) {
  throw new Error('Refusing to prepare Pages files outside the project directory.');
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of ['index.html', 'styles.css', 'favicon.svg', '_headers']) {
  await cp(join(projectRoot, file), join(outputDirectory, file));
}

await cp(join(projectRoot, 'src'), join(outputDirectory, 'src'), { recursive: true });

console.log('Cloudflare Pages 檔案已準備完成：dist/');
