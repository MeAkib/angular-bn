import { watch } from 'chokidar';
import { consola } from 'consola';
import { $ } from 'execa';
import { globby as glob } from 'globby';
import { resolve } from 'node:path';
import { debounceTime, from, mergeMap, Observable } from 'rxjs';
import { cpRf, replaceAllInFile } from './fsutils';
import { generateSitemap } from './sitemap';
import { adevBnDir, buildDir, buildOutputDir, rootDir } from './workspace';

export async function applyPatches() {
  const sh = $({ cwd: buildDir, verbose: 'short' });
  const patches = await glob('tools/adev-patches/*.patch', { cwd: rootDir });
  for (const patch of patches) {
    const path = resolve(rootDir, patch);
    await sh`git apply -p1 --ignore-whitespace ${path}`;
  }
}

/**
 * Patterns for localized files.
 * Files matching these patterns are copied into the build directory.
 */
const localizedFilePatterns = ['**/*', '!**/*.en.*', '!**/*.old'];

/**
 * Copies localized files into the build directory.
 */
async function copyLocalizedFile(file: string) {
  const src = resolve(adevBnDir, file);
  const dest = resolve(buildDir, 'adev', file);
  return cpRf(src, dest);
}

export async function copyLocalizedFiles() {
  const jaFiles = await glob(localizedFilePatterns, {
    cwd: adevBnDir,
  });
  await Promise.all(jaFiles.map(copyLocalizedFile));
}

export function watchLocalizedFiles() {
  const sub = new Observable<string>((subscriber) => {
    const watcher = watch(localizedFilePatterns, {
      cwd: adevBnDir,
      awaitWriteFinish: true,
    });
    watcher.on('change', (file) => {
      consola.info(`File changed: ${file}`);
      subscriber.next(file);
    });

    return async () => {
      await watcher.close();
    };
  })
    .pipe(
      // Copy changed files into the build directory
      mergeMap((file) => from(copyLocalizedFile(file))),
      // Batch changes within one second
      debounceTime(1000)
    )
    .subscribe();
  return {
    cancel: () => sub.unsubscribe(),
  };
}

/**
 * Modify adev build artifacts after build.
 */
export async function modifyBuildOutput() {
  // Bazel outputs are symlinks and may be read-only.
  // Follow symlinks with find and make both files and directories writable.
  // -L follows symbolic links.
  const sh = $({ verbose: 'short' });
  await sh`find -L ${buildOutputDir} -type f -exec chmod +w {} +`;
  await sh`find -L ${buildOutputDir} -type d -exec chmod +w {} +`;

  consola.start('Copy static files...');
  await copyStaticFiles();
  consola.start('Replace GitHub edit links...');
  await replaceAdevGitHubEditLinks();
  consola.start('Generate sitemap...');
  await generateSitemap(resolve(buildOutputDir, 'sitemap.xml'));
}

/**
 * Copy static files into build output directory
 */
async function copyStaticFiles() {
  const files: string[] = [];
  for (const file of files) {
    const src = resolve(adevBnDir, file);
    const dest = resolve(buildOutputDir, file);
    await cpRf(src, dest);
  }
}

/**
 * Replace all links to GitHub edit page for adev contents.
 */
async function replaceAdevGitHubEditLinks() {
  const contentFiles = await glob(['**/*.html'], { cwd: buildOutputDir });
  const from = 'https://github.com/angular/angular/edit/main/adev/';
  const to = 'https://github.com/MeAkib/angular-bn/edit/main/adev-bn/';
  await Promise.all(
    contentFiles.map(async (file) => {
      const path = resolve(buildOutputDir, file);
      await replaceAllInFile(path, from, to);
    })
  );
}
