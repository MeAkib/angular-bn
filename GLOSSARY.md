# Glossary / পরিভাষা

The single source of truth for how technical terms are written in the Bangla
translation. When you decide a new term, add it here (and, if it has common
misspellings, add a prh rule in [prh.yml](./prh.yml) so CI enforces it).

## General rules

1. **Framework, language, and product names stay in Latin script:** Angular,
   TypeScript, JavaScript, RxJS, Node.js, npm, CLI, API, HTML, CSS, DOM.
2. **Code identifiers are never translated or transliterated:** `signal()`,
   `@Component`, `inject()`, `ngFor` stay exactly as in code.
3. **Widely-used technical terms are transliterated** (Bangla script, English
   pronunciation) rather than translated, matching how Bangladeshi developers
   actually speak: কম্পোনেন্ট, টেমপ্লেট, সার্ভিস, মডিউল, ডিরেক্টিভ.
4. **Everyday words are translated**, not transliterated: "application" →
   অ্যাপ্লিকেশন is fine, but "build" (verb) → তৈরি করা, "learn" → শেখা.
5. **Register:** formal আপনি, never তুমি/তুই. Modern চলিত ভাষা, not সাধু.
6. **Digits:** use Western digits (123) in prose and code contexts for consistency
   with code samples.

## Terms

| English | বাংলা | Notes |
| --- | --- | --- |
| component | কম্পোনেন্ট | transliterate |
| template | টেমপ্লেট | transliterate |
| directive | ডিরেক্টিভ | transliterate |
| service | সার্ভিস | transliterate |
| module | মডিউল | transliterate |
| signal | সিগন্যাল | transliterate |
| dependency injection | ডিপেন্ডেন্সি ইনজেকশন | transliterate |
| injector | ইনজেক্টর | transliterate |
| binding | বাইন্ডিং | transliterate |
| event | ইভেন্ট | transliterate |
| routing / router | রাউটিং / রাউটার | transliterate |
| form | ফর্ম | transliterate |
| pipe | পাইপ | transliterate |
| lifecycle | লাইফসাইকেল | transliterate |
| change detection | চেঞ্জ ডিটেকশন | transliterate |
| hydration | হাইড্রেশন | transliterate |
| server-side rendering (SSR) | সার্ভার-সাইড রেন্ডারিং (SSR) | transliterate + keep abbreviation |
| build (verb) | বিল্ড করা | |
| run (verb) | চালানো | |
| install | ইনস্টল করা | |
| overview | সারসংক্ষেপ | translate |
| guide | গাইড | transliterate |
| tutorial | টিউটোরিয়াল | transliterate |
| getting started | শুরু করা | translate |
| error | এরর | transliterate (ত্রুটি only in formal prose) |
| documentation | ডকুমেন্টেশন | transliterate |
| Essentials (guide name) | মূল ধারণা | first mention: মূল ধারণা (Essentials) |
| in-depth guide | বিস্তারিত গাইড | translate |
| next step(s) | পরবর্তী ধাপ | translate |
| state | স্টেট | transliterate |
| value | ভ্যালু | transliterate |
| reactivity | রিঅ্যাকটিভিটি | transliterate |
| validation / validator | ভ্যালিডেশন / ভ্যালিডেটর | transliterate |
| playground | প্লেগ্রাউন্ড | transliterate |
| dynamic | ডাইনামিক | transliterate |
| framework | ফ্রেমওয়ার্ক | transliterate |

Unsure about a term? Open an issue — deciding it once here is cheaper than three
PRs using three spellings.
