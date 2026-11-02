import consola from 'consola';
import assert from 'node:assert';
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cli } from 'textlint';
import { globby } from 'globby';
import pLimit from 'p-limit';
import {
  cpRf,
  exists,
  getEnFilePath,
  getLocalizedFilePath,
} from '../lib/fsutils';
import { MarkdownTranslator } from './translate';

/**
 * CLI argument types
 */
interface CliArgs {
  pattern: string;
  write?: boolean;
  concurrency?: number;
  force?: boolean;
  help?: boolean;
}

/**
 * Validates the environment variables required for translation.
 */
function validateEnvironment(): { googleApiKey: string; geminiModel?: string } {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL;

  assert(googleApiKey, 'The GOOGLE_API_KEY environment variable is not set.');

  return { googleApiKey, geminiModel };
}

/**
 * Prints CLI usage.
 */
function showHelp(): void {
  console.log(`
Usage: npx tsx tools/translator/main.ts [options] <pattern>

Translates Markdown files into Bangla.

Options:
  -w, --write            Save results without confirmation
  -c, --concurrency <n>  Number of parallel translations (default: 2)
  --force                Re-translate already translated files
  -h, --help             Show this help message

Arguments:
  <pattern>  Path or glob pattern of Markdown files to translate

Environment variables:
  GOOGLE_API_KEY  Google AI API key (required)
  GEMINI_MODEL    Gemini model to use (optional)

Examples:
  npx tsx tools/translator/main.ts example.md
  npx tsx tools/translator/main.ts -w "adev-bn/src/content/guide/*.md"
  npx tsx tools/translator/main.ts -w -c 5 "adev-bn/src/content/**/*.md"
  npx tsx tools/translator/main.ts -w --force "adev-bn/src/content/guide/*.md"
`);
}

/**
 * Parses and validates command line arguments.
 */
function parseCliArgs(): CliArgs {
  const args = parseArgs({
    options: {
      write: { type: 'boolean', default: false, short: 'w' },
      concurrency: { type: 'string', default: '2', short: 'c' },
      force: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false, short: 'h' },
    },
    allowPositionals: true,
  });

  const { write, help, force } = args.values;
  const concurrency = parseInt(args.values.concurrency || '2', 10);
  const [pattern] = args.positionals;

  if (help) {
    showHelp();
    process.exit(0);
  }

  if (!pattern) {
    showHelp();
    throw new Error('Specify a file path or glob pattern.');
  }

  if (isNaN(concurrency) || concurrency < 1) {
    throw new Error('Concurrency must be an integer of 1 or more.');
  }

  return { write, pattern, concurrency, force, help };
}

/**
 * Collects the file list from a glob pattern.
 */
async function collectFiles(pattern: string, force: boolean): Promise<string[]> {
  const files = await globby(pattern, {
    ignore: ['**/*.en.md', '**/*.en.ts', '**/*.en.json'],
  });

  if (files.length === 0) {
    throw new Error(`No files match the pattern: ${pattern}`);
  }

  // Unless forced, skip files that are already translated
  if (!force) {
    const untranslatedFiles: string[] = [];
    for (const file of files) {
      const enFile = getEnFilePath(file);
      if (!(await exists(enFile))) {
        untranslatedFiles.push(file);
      }
    }
    return untranslatedFiles;
  }

  return files;
}

/**
 * Translates a single file's contents.
 */
async function translateFile(
  file: string,
  googleApiKey: string,
  geminiModel?: string
): Promise<string> {
  const translator = new MarkdownTranslator(googleApiKey, geminiModel);
  const content = await readFile(file, 'utf-8');
  return translator.translate(content);
}

/**
 * Creates the English snapshot file if it does not exist yet.
 */
async function ensureEnglishFile(originalFile: string): Promise<void> {
  const enFile = getEnFilePath(originalFile);
  if (!(await exists(enFile))) {
    consola.warn(
      `English snapshot not found. Copying the input file to ${enFile}.`
    );
    await cpRf(originalFile, enFile);
  }
}

/**
 * Asks the user to confirm saving.
 */
async function promptForSave(outputFile: string): Promise<boolean> {
  return consola.prompt(`Save the translation?\nDestination: ${outputFile}`, {
    type: 'confirm',
    initial: false,
  });
}

/**
 * Saves the translation result.
 */
async function saveTranslation(
  file: string,
  content: string,
  forceWrite: boolean
): Promise<string | null> {
  const outputFile = getLocalizedFilePath(file);
  const shouldSave = forceWrite || (await promptForSave(outputFile));

  if (!shouldSave) {
    consola.info('The translation was not saved.');
    return null;
  }

  await ensureEnglishFile(file);
  await writeFile(outputFile, content);
  consola.success(`Saved translation: ${outputFile}`);
  return outputFile;
}

/**
 * Validates that the translated file has the same line count as the original.
 */
async function validateLineCount(
  originalFile: string,
  translatedFile: string
): Promise<void> {
  async function getLineCount(filePath: string) {
    const content = await readFile(filePath, 'utf-8');
    return content.split('\n').length;
  }

  const [originalLines, translatedLines] = await Promise.all([
    getLineCount(originalFile),
    getLineCount(translatedFile),
  ]);

  const lineDiff = Math.abs(originalLines - translatedLines);

  if (lineDiff === 0) {
    consola.success(`Line count check: OK`);
  } else {
    consola.warn(
      `Line count check: WARNING - original: ${originalLines} lines, translated: ${translatedLines} lines (diff: ${lineDiff} lines)`
    );
  }
}

/**
 * Runs textlint on the translated file.
 */
async function runTextlint(file: string): Promise<void> {
  const ok = await cli.execute(`${file}`).then((code) => code === 0);
  if (ok) {
    consola.success(`textlint: OK`);
  } else {
    consola.warn(
      `textlint: errors were detected. Fix them before submitting.`
    );
  }
}

/**
 * Translates a single file, including error handling.
 */
async function processSingleFile(
  file: string,
  googleApiKey: string,
  geminiModel: string | undefined,
  forceWrite: boolean
): Promise<{ file: string; success: boolean; error?: Error }> {
  try {
    consola.start(`Translating: ${file}`);

    const translated = await translateFile(file, googleApiKey, geminiModel);
    const savedFile = await saveTranslation(file, translated, forceWrite);

    if (!savedFile) {
      return { file, success: false };
    }

    // Analyze the translation result
    await validateLineCount(getEnFilePath(savedFile), savedFile);
    await runTextlint(savedFile);

    consola.success(`Done: ${file}`);
    return { file, success: true };
  } catch (error) {
    consola.warn(`Failed: ${file}`);
    return { file, success: false, error: error as Error };
  }
}

/**
 * Main entry point.
 */
async function main() {
  const { write, pattern, concurrency, force } = parseCliArgs();
  const { googleApiKey, geminiModel } = validateEnvironment();

  const files = await collectFiles(pattern, !!force);

  if (files.length === 0) {
    consola.warn('There are no files to translate.');
    return;
  }

  consola.info(`Translating ${files.length} file(s) (concurrency: ${concurrency})`);

  const limit = pLimit(concurrency!);
  const results = await Promise.all(
    files.map((file) =>
      limit(() => processSingleFile(file, googleApiKey, geminiModel, !!write))
    )
  );

  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  // Save error details to a temporary log file
  let errorLogPath: string | null = null;
  if (failed.length > 0) {
    errorLogPath = join(tmpdir(), `translate-errors-${Date.now()}.log`);
    const errorDetails = failed
      .map((r) => {
        const errorStack = r.error?.stack || r.error?.message || 'Unknown error';
        return `\n${'='.repeat(80)}\nFile: ${r.file}\n${'='.repeat(80)}\n${errorStack}\n`;
      })
      .join('\n');

    await writeFile(errorLogPath, errorDetails, 'utf-8');
  }

  if (failed.length === 0) {
    consola.success('Translation finished');
  } else {
    consola.warn('Translation finished (some files failed)');
  }

  consola.info(`Succeeded: ${succeeded.length}`);
  consola.info(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed files:');
    failed.forEach((r) => console.log(r.file));
  }

  if (errorLogPath) {
    consola.info(`Error details: ${errorLogPath}`);
  }

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
