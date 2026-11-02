<docs-decorative-header title="ইনস্টলেশন" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

Angular দিয়ে দ্রুত শুরু করুন — অনলাইন স্টার্টার দিয়ে, অথবা টার্মিনাল ব্যবহার করে লোকালি।

## অনলাইনে খেলে দেখুন {#play-online}

প্রজেক্ট সেটআপ না করেই যদি শুধু ব্রাউজারে Angular নিয়ে একটু নাড়াচাড়া করতে চান, আমাদের অনলাইন স্যান্ডবক্স ব্যবহার করতে পারেন:

<docs-card title="প্লেগ্রাউন্ড" href="/playground" link="প্লেগ্রাউন্ডে খুলুন" iconImgSrc="adev/src/assets/icons/playground.svg" titleInline>
Angular অ্যাপ নিয়ে খেলে দেখার দ্রুততম উপায়। কোনো সেটআপ লাগে না।
</docs-card>

## লোকালি নতুন প্রজেক্ট সেট আপ করুন {#set-up-a-new-project-locally}

নতুন প্রজেক্ট শুরু করলে সম্ভবত আপনি একটি লোকাল প্রজেক্টই তৈরি করতে চাইবেন, যাতে Git-এর মতো টুল ব্যবহার করতে পারেন।

### পূর্বশর্ত {#prerequisites}

- **Node.js** - [v22.22.3 বা নতুন](/reference/versions)
- **টেক্সট এডিটর** - আমাদের পরামর্শ [Visual Studio Code](https://code.visualstudio.com/)
- **টার্মিনাল** - [Angular CLI](/tools/cli) কমান্ড চালানোর জন্য প্রয়োজন
- **ডেভেলপমেন্ট টুল** - ডেভেলপমেন্ট ওয়ার্কফ্লো উন্নত করতে আমাদের পরামর্শ [Angular ল্যাঙ্গুয়েজ সার্ভিস](/tools/language-service)

### নির্দেশনা {#instructions}

নিচের গাইডটি একটি লোকাল Angular প্রজেক্ট সেট আপ করার পুরো পথ দেখাবে।

#### Angular CLI ইনস্টল করুন {#install-angular-cli}

একটি টার্মিনাল খুলুন ([Visual Studio Code](https://code.visualstudio.com/) ব্যবহার করলে [ইন্টিগ্রেটেড টার্মিনাল](https://code.visualstudio.com/docs/editor/integrated-terminal) খুলতে পারেন) এবং নিচের কমান্ডটি চালান:

<docs-code-multifile>
  <docs-code
    header="npm"
    language="shell"
    >
    npm install -g @angular/cli
    </docs-code>
  <docs-code
    header="pnpm"
    language="shell"
    >
    pnpm install -g @angular/cli
    </docs-code>
  <docs-code
    header="yarn"
    language="shell"
    >
    yarn global add @angular/cli
    </docs-code>
  <docs-code
    header="bun"
    language="shell"
    >
    bun install -g @angular/cli
    </docs-code>
</docs-code-multifile>

Windows বা Unix-এ এই কমান্ড চালাতে সমস্যা হলে আরও তথ্যের জন্য [CLI ডকুমেন্টেশন](/tools/cli/setup-local#install-the-angular-cli) দেখুন।

#### নতুন প্রজেক্ট তৈরি করুন {#create-a-new-project}

টার্মিনালে, পছন্দের প্রজেক্টের নাম দিয়ে CLI কমান্ড [`ng new`](cli/new) চালান। নিচের উদাহরণগুলোতে আমরা উদাহরণ হিসেবে `my-first-angular-app` প্রজেক্ট নামটি ব্যবহার করব।

```shell
ng new <project-name>
```

আপনার প্রজেক্টের জন্য কিছু কনফিগারেশন অপশন দেখানো হবে। অ্যারো ও এন্টার কি ব্যবহার করে পছন্দের অপশনগুলো বেছে নিন।

কোনো বিশেষ পছন্দ না থাকলে শুধু এন্টার চাপুন — ডিফল্ট অপশন নিয়ে সেটআপ এগিয়ে যাবে।

কনফিগারেশন অপশন বাছাইয়ের পর CLI সেটআপ শেষ করলে আপনি নিচের বার্তাটি দেখতে পাবেন:

```text
✔ Packages installed successfully.
    Successfully initialized git.
```

ব্যস, এবার আপনি প্রজেক্টটি লোকালি চালাতে প্রস্তুত!

#### নতুন প্রজেক্টটি লোকালি চালানো {#running-your-new-project-locally}

টার্মিনালে আপনার নতুন Angular প্রজেক্টের ডিরেক্টরিতে যান।

```shell
cd my-first-angular-app
```

এই পর্যায়ে আপনার সব ডিপেন্ডেন্সি ইনস্টল হয়ে থাকার কথা (প্রজেক্টে `node_modules` ফোল্ডার আছে কি না দেখে যা যাচাই করতে পারেন), তাই এই কমান্ড চালিয়ে প্রজেক্ট শুরু করতে পারেন:

```shell
npm start
```

সব ঠিক থাকলে টার্মিনালে এ রকম একটি নিশ্চিতকরণ বার্তা দেখতে পাবেন:

```text
Watch mode enabled. Watching for file changes...
NOTE: Raw file sizes do not reflect development server per-request transformations.
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help
```

এবার `Local`-এ দেখানো ঠিকানায় (যেমন `http://localhost:4200`) গিয়ে আপনার অ্যাপ্লিকেশনটি দেখতে পারেন। শুভ কোডিং! 🎉

### ডেভেলপমেন্টে AI-এর ব্যবহার {#using-ai-for-development}

আপনার পছন্দের AI-চালিত IDE-তে তৈরি শুরু করতে [Angular-এর প্রম্পট রুল ও সেরা চর্চাগুলো দেখুন](/ai/develop-with-ai)।

## পরবর্তী ধাপ {#next-steps}

Angular প্রজেক্ট তো তৈরি হলো, এবার আমাদের [মূল ধারণা গাইডে](/essentials) Angular সম্পর্কে আরও জানতে পারেন, অথবা বিস্তারিত গাইড থেকে পছন্দের বিষয় বেছে নিতে পারেন!
