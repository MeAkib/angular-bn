import { resolve } from 'node:path';

export const rootDir = new URL('../../', import.meta.url).pathname;
export const adevBnDir = resolve(rootDir, 'adev-bn');
export const buildDir = resolve(rootDir, 'build');
export const buildOutputDir = resolve(buildDir, 'dist/bin/adev/dist/browser');
