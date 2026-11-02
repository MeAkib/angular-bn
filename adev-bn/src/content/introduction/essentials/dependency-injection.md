<docs-decorative-header title="ডিপেন্ডেন্সি ইনজেকশন" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
আপনার অ্যাপ্লিকেশন ও টেস্ট জুড়ে কোড পুনর্ব্যবহার করুন এবং আচরণ নিয়ন্ত্রণ করুন।
</docs-decorative-header>

যখন কম্পোনেন্টগুলোর মধ্যে লজিক শেয়ার করার প্রয়োজন হয়, Angular [ডিপেন্ডেন্সি ইনজেকশন](guide/di) ডিজাইন প্যাটার্নটি কাজে লাগায়, যার মাধ্যমে আপনি একটি “সার্ভিস” তৈরি করতে পারেন — এটি একটিমাত্র নির্ভরযোগ্য উৎস থেকে পরিচালিত হয়ে কম্পোনেন্টে কোড ইনজেক্ট করার সুযোগ দেয়।

## সার্ভিস কী? {#what-are-services}

সার্ভিস হলো পুনর্ব্যবহারযোগ্য কোডের অংশ, যা ইনজেক্ট করা যায়।

কম্পোনেন্ট সংজ্ঞায়িত করার মতোই, সার্ভিস নিচের অংশগুলো নিয়ে গঠিত:

- একটি **TypeScript ডেকোরেটর**, যা `@Service`-এর মাধ্যমে ক্লাসটিকে Angular সার্ভিস হিসেবে ঘোষণা করে এবং এমন একটি সার্ভিস সংজ্ঞায়িত করার সুযোগ দেয় যা আপনার অ্যাপ্লিকেশনের যেকোনো জায়গা থেকে ব্যবহার করা যায়।
- একটি **TypeScript ক্লাস**, যা সার্ভিসটি ইনজেক্ট করা হলে যে কোড ব্যবহারযোগ্য হবে তা সংজ্ঞায়িত করে

এখানে একটি `Calculator` সার্ভিসের উদাহরণ দেওয়া হলো।

```angular-ts
import {Service} from '@angular/core';

@Service()
export class Calculator {
  add(x: number, y: number) {
    return x + y;
  }
}
```

## সার্ভিস যেভাবে ব্যবহার করবেন {#how-to-use-a-service}

কোনো কম্পোনেন্টে একটি সার্ভিস ব্যবহার করতে চাইলে আপনাকে যা করতে হবে:

1. সার্ভিসটি ইমপোর্ট করুন
2. একটি ক্লাস ফিল্ড ঘোষণা করুন যেখানে সার্ভিসটি ইনজেক্ট হবে। বিল্ট-ইন ফাংশন [`inject`](/api/core/inject)-এর কলের ফলাফল ক্লাস ফিল্ডটিতে অ্যাসাইন করুন, যা সার্ভিসটি তৈরি করে

`Receipt` কম্পোনেন্টে এটি দেখতে যেমন হতে পারে:

```angular-ts
import {Component, inject} from '@angular/core';
import {Calculator} from './calculator';

@Component({
  selector: 'app-receipt',
  template: `<h1>The total is {{ totalCost }}</h1>`,
})
export class Receipt {
  private calculator = inject(Calculator);
  totalCost = this.calculator.add(50, 25);
}
```

এই উদাহরণে, Angular-এর [`inject`](/api/core/inject) ফাংশন কল করে তাতে সার্ভিসটি পাস করার মাধ্যমে `Calculator` ব্যবহার করা হচ্ছে।

## পরবর্তী ধাপ {#next-step}

<docs-pill-row>
  <docs-pill title="মূল ধারণার পরের ধাপ" href="essentials/next-steps" />
  <docs-pill title="ডিপেন্ডেন্সি ইনজেকশনের বিস্তারিত গাইড" href="guide/di" />
</docs-pill-row>
