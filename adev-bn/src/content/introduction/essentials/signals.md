<docs-decorative-header title="সিগন্যাল" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
ডাইনামিক ডেটা তৈরি ও পরিচালনা করুন।
</docs-decorative-header>

Angular-এ স্টেট তৈরি ও পরিচালনার জন্য আপনি _সিগন্যাল_ ব্যবহার করেন। সিগন্যাল হলো কোনো ভ্যালুর চারপাশে একটি হালকা মোড়ক।

লোকাল স্টেট ধরে রাখার সিগন্যাল তৈরি করতে `signal` ফাংশনটি ব্যবহার করুন:

```typescript
import {signal} from '@angular/core';

// Create a signal with the `signal` function.
const firstName = signal('Morgan');

// Read a signal value by calling it— signals are functions.
console.log(firstName());

// Change the value of this signal by calling its `set` method with a new value.
firstName.set('Jaime');

// You can also use the `update` method to change the value
// based on the previous value.
firstName.update((name) => name.toUpperCase());
```

সিগন্যাল কোথায় পড়া হচ্ছে এবং কখন আপডেট হচ্ছে, Angular তা ট্র্যাক করে। এই তথ্য ব্যবহার করে ফ্রেমওয়ার্ক অতিরিক্ত কাজ করে, যেমন নতুন স্টেট দিয়ে DOM আপডেট করা। সময়ের সঙ্গে সিগন্যালের ভ্যালু পরিবর্তনে সাড়া দেওয়ার এই সক্ষমতাকে বলা হয় _রিঅ্যাকটিভিটি_।

## Computed এক্সপ্রেশন {#computed-expressions}

`computed` হলো এমন একটি সিগন্যাল, যা অন্যান্য সিগন্যালের ওপর ভিত্তি করে নিজের ভ্যালু তৈরি করে।

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());

console.log(firstNameCapitalized()); // MORGAN
```

`computed` সিগন্যাল শুধু পড়া যায়; এর কোনো `set` বা `update` মেথড নেই। বরং `computed` সিগন্যাল যে সিগন্যালগুলো পড়ে, তাদের কোনোটি পরিবর্তিত হলে এর ভ্যালু স্বয়ংক্রিয়ভাবে পরিবর্তিত হয়:

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());
console.log(firstNameCapitalized()); // MORGAN

firstName.set('Jaime');
console.log(firstNameCapitalized()); // JAIME
```

## কম্পোনেন্টে সিগন্যালের ব্যবহার {#using-signals-in-components}

কম্পোনেন্টের ভেতরে স্টেট তৈরি ও পরিচালনা করতে `signal` এবং `computed` ব্যবহার করুন:

```ts
@Component({
  /* ... */
})
export class UserProfile {
  isTrial = signal(false);
  isTrialExpired = signal(false);
  showTrialDuration = computed(() => this.isTrial() && !this.isTrialExpired());

  activateTrial() {
    this.isTrial.set(true);
  }
}
```

TIP: Angular সিগন্যাল সম্পর্কে আরও জানতে চান? সম্পূর্ণ বিবরণের জন্য [সিগন্যালের বিস্তারিত গাইড](guide/signals) দেখুন।

## পরবর্তী ধাপ {#next-step}

ডাইনামিক ডেটা ঘোষণা ও পরিচালনা করা তো শিখলেন, এবার সেই ডেটা টেমপ্লেটের ভেতরে কীভাবে ব্যবহার করতে হয় তা শেখার সময়।

<docs-pill-row>
  <docs-pill title="টেমপ্লেট দিয়ে ডাইনামিক ইন্টারফেস" href="essentials/templates" />
  <docs-pill title="সিগন্যালের বিস্তারিত গাইড" href="guide/signals" />
</docs-pill-row>
