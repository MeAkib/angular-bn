import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  Runnable,
  RunnableBranch,
  RunnableLambda,
  RunnableSequence,
} from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { createLinter, loadLinterFormatter, loadTextlintrc } from 'textlint';

// https://ai.google.dev/gemini-api/docs/models#model-variations
const defaultGeminiModel = 'gemini-2.5-flash';

export type TranslationAgentInput = {
  text: string;
};

export async function createTranslationAgent(input: {
  googleApiKey: string;
  translationModelName?: string;
  proofreaderModelName?: string;
}): Promise<Runnable<TranslationAgentInput, string>> {
  const { googleApiKey, translationModelName, proofreaderModelName } = input;

  // Translation model
  const translator = new ChatGoogleGenerativeAI({
    apiKey: googleApiKey,
    model: translationModelName ?? defaultGeminiModel,
    temperature: 0.2, // favor consistency
    cache: false,
  });
  const translatorPrompt = PromptTemplate.fromTemplate(
    translatorPromptTemplate
  );

  // Proofreading model
  const proofreader = new ChatGoogleGenerativeAI({
    apiKey: googleApiKey,
    model: proofreaderModelName ?? defaultGeminiModel,
    temperature: 0.8, // allow flexibility when fixing errors
    cache: false,
  });
  const proofreaderPrompt = PromptTemplate.fromTemplate(
    proofreaderPromptTemplate
  );

  const textlint = await createTextlintRunnable();

  return RunnableSequence.from([
    // { text: string } -> PromptTemplate<'text'> -> AIMessageChunk -> string
    translatorPrompt.pipe(translator).pipe(new StringOutputParser()),
    // string -> { fixedText: string, diagnostics: string }
    textlint,
    RunnableBranch.from([
      // Proofread only when textlint reports errors
      [
        (result) => !!result.diagnostics,
        // { fixedText: string, diagnostics: string } -> PromptTemplate<'text' | 'diagnostics'> -> AIMessageChunk -> string
        proofreaderPrompt.pipe(proofreader).pipe(new StringOutputParser()),
      ],
      // { fixedText: string, diagnostics: string } -> string
      RunnableLambda.from((result) => result.text),
    ]),
  ]);
}

type TextlintRunnableOutput = { text: string; diagnostics: string | null };

export async function createTextlintRunnable(): Promise<
  Runnable<string, TextlintRunnableOutput>
> {
  const descriptor = await loadTextlintrc();
  const linter = await createLinter({ descriptor });
  const linterFormatter = await loadLinterFormatter({ formatterName: 'unix' });

  return RunnableLambda.from(async (text: string) => {
    // Auto-fix what textlint can, then re-lint for remaining diagnostics.
    const { output: fixedText } = await linter.fixText(text, 'temp.md');
    const result = await linter.lintText(fixedText, 'temp.md');
    if (result.messages.length === 0) {
      return { text: fixedText, diagnostics: null };
    }
    return { text: fixedText, diagnostics: linterFormatter.format([result]) };
  });
}

const translatorPromptTemplate =
  `You are an expert translator of technical documentation. Translate the following Markdown text into Bangla (Bengali, bn).

## Important rules

- **Do NOT wrap the whole text in a code block.**
- **Never change the Markdown structure.**
- **Never change the number of lines** — input and output must have exactly the same line count.
- **Do not translate the contents of code blocks.**
- **Do not translate URLs, file names, or identifiers.**
- **Preserve HTML tags and special symbols.**
- **Preserve list nesting and markers (\\*, -, +, 1., etc.).**
- **Do not change heading levels (the number of #).**
- **Keep empty lines empty.**
- **Preserve indentation and spacing.**
- **Keep framework/product names in Latin script (Angular, TypeScript, JavaScript); transliterate common technical terms into Bangla script (component → কম্পোনেন্ট, template → টেমপ্লেট) rather than inventing literal translations.**
- **Use the formal register (আপনি), never তুমি.**
- **Never change special prefixes.**
  - e.g. NOTE/TIP/HELPFUL/IMPORTANT/QUESTION/TLDR/CRITICAL
  - OK: "NOTE: এটি গুরুত্বপূর্ণ তথ্য।"
  - NG: "নোট: এটি গুরুত্বপূর্ণ তথ্য।"
- For headings at "<h2>" level and below, **append an anchor ID made from the lower-cased original heading**:
  - e.g. "# Security" → "# নিরাপত্তা" (no anchor ID for "<h1>")
  - e.g. "## How to use Angular" → "## Angular যেভাবে ব্যবহার করবেন {{#how-to-use-angular}}"
  - e.g. "### How to use Angular" → "### Angular যেভাবে ব্যবহার করবেন {{#how-to-use-angular}}"
  - e.g. "### \`foo.bar\`" → "### \`foo.bar\` {{#foobar}}" (drop all symbols except hyphens)

Return only the translated text. Do not include any explanation or additional text.

## Text to translate

{text}
` as const;

const proofreaderPromptTemplate =
  `You are an expert proofreader of Bangla (Bengali) documents. Proofreading errors were detected in the following Markdown text. Return the text with the reported errors fixed.

## Important rules

1. **Never change the Markdown structure.**
2. **Never change the number of lines** — input and output must have exactly the same line count.
3. **Do not change the contents of code blocks.**
4. **Do not change URLs, file names, or identifiers.**
5. **Preserve HTML tags and special symbols.**
6. **Preserve list nesting and markers (*, -, +, 1., etc.).**
7. **Do not change heading levels (the number of #).**
8. **Keep empty lines empty.**
9. **Preserve indentation and spacing.**
10. **Fix only the reported errors.**

Return only the corrected text. Do not include any explanation or additional text.

## Proofreading errors

{diagnostics}

## Text to fix (\`temp.md\`)

{text}
` as const;
