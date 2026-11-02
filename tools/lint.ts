import { consola } from 'consola';
import { $ } from 'execa';
import { extname } from 'node:path';
import { parseArgs } from 'node:util';
import { glob } from './lib/fsutils';
import { rootDir } from './lib/workspace';

/**
 * Runs textlint on Markdown files in the adev-bn directory,
 * limited to files that have already been translated.
 */
async function main() {
  const args = parseArgs({
    options: { fix: { type: 'boolean', default: false } },
  });
  const { fix } = args.values;

  const $$ = $({
    cwd: rootDir,
    stdin: 'inherit',
    stdout: 'pipe',
    reject: false,
  });
  process.env.FORCE_COLOR = '1';

  const files = await getTranslatedFiles();
  if (files.length === 0) {
    consola.info('No translated files yet; nothing to lint.');
    return;
  }
  const { stdout, failed } = await $$`textlint ${fix ? ['--fix'] : []} ${files}`;
  consola.log(stdout.replace('textlint --fix [file]', 'npm run lint -- --fix'));

  if (failed) {
    process.exit(1);
  }
}

/**
 * Returns the list of Markdown files that have a corresponding `.en.*` file (= already translated).
 */
async function getTranslatedFiles() {
  const files = await glob('adev-bn/**/*.en.md', {
    cwd: rootDir,
    caseSensitiveMatch: true,
  });
  const translatedFiles = files.map((file) => {
    const ext = extname(file);
    return file.replace(`.en${ext}`, ext);
  });
  return translatedFiles;
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
