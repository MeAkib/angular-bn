<docs-decorative-header title="টেমপ্লেট" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
ডাইনামিক ইউজার ইন্টারফেস তৈরিতে Angular-এর টেমপ্লেট সিনট্যাক্স ব্যবহার করুন।
</docs-decorative-header>

কম্পোনেন্টের টেমপ্লেট শুধু স্থির HTML নয় — টেমপ্লেট আপনার কম্পোনেন্ট ক্লাসের ডেটা ব্যবহার করতে পারে এবং ব্যবহারকারীর ইন্টারঅ্যাকশনের জন্য হ্যান্ডলার বসাতে পারে।

## ডাইনামিক টেক্সট দেখানো {#showing-dynamic-text}

Angular-এ _বাইন্ডিং_ হলো কম্পোনেন্টের টেমপ্লেট ও তার ডেটার মধ্যে একটি ডাইনামিক সংযোগ। এই সংযোগ নিশ্চিত করে যে কম্পোনেন্টের ডেটা পরিবর্তিত হলে রেন্ডার হওয়া টেমপ্লেট স্বয়ংক্রিয়ভাবে আপডেট হয়।

জোড়া কার্লি-ব্রেস ব্যবহার করে টেমপ্লেটে ডাইনামিক টেক্সট দেখানোর একটি বাইন্ডিং তৈরি করতে পারেন:

```angular-ts
@Component({
  selector: 'user-profile',
  template: `<h1>Profile for {{ userName() }}</h1>`,
})
export class UserProfile {
  userName = signal('pro_programmer_123');
}
```

Angular কম্পোনেন্টটি রেন্ডার করলে আপনি দেখবেন:

```html
<h1>Profile for pro_programmer_123</h1>
```

সিগন্যালের ভ্যালু পরিবর্তিত হলে Angular স্বয়ংক্রিয়ভাবে বাইন্ডিংটি হালনাগাদ রাখে। ওপরের
উদাহরণ ধরে এগোলে, আমরা যদি `userName` সিগন্যালের ভ্যালু আপডেট করি:

```typescript
this.userName.set('cool_coder_789');
```

রেন্ডার হওয়া পেজটি নতুন ভ্যালু দেখাতে আপডেট হয়ে যায়:

```html
<h1>Profile for cool_coder_789</h1>
```

## ডাইনামিক প্রোপার্টি ও অ্যাট্রিবিউট সেট করা {#setting-dynamic-properties-and-attributes}

স্কয়ার ব্র্যাকেট দিয়ে DOM প্রোপার্টিতে ডাইনামিক ভ্যালু বাইন্ড করা Angular সমর্থন করে:

```angular-ts
@Component({
  /*...*/
  // Set the `disabled` property of the button based on the value of `isValidUserId`.
  template: `<button [disabled]="!isValidUserId()">Save changes</button>`,
})
export class UserProfile {
  isValidUserId = signal(false);
}
```

অ্যাট্রিবিউটের নামের আগে `attr.` বসিয়ে HTML _অ্যাট্রিবিউটেও_ বাইন্ড করতে পারেন:

```angular-html
<!-- Bind the `role` attribute on the `<ul>` element to value of `listRole`. -->
<ul [attr.role]="listRole()"></ul>
```

বাইন্ড করা ভ্যালু পরিবর্তিত হলে Angular স্বয়ংক্রিয়ভাবে DOM প্রোপার্টি ও অ্যাট্রিবিউট আপডেট করে।

## ব্যবহারকারীর ইন্টারঅ্যাকশন সামলানো {#handling-user-interaction}

প্যারেনথেসিস দিয়ে টেমপ্লেটের কোনো এলিমেন্টে ইভেন্ট লিসেনার যোগ করার সুযোগ Angular দেয়:

```angular-ts
@Component({
  /*...*/
  // Add an 'click' event handler that calls the `cancelSubscription` method.
  template: `<button (click)="cancelSubscription()">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription() {
    /* Your event handling code goes here. */
  }
}
```

লিসেনারে [ইভেন্ট](https://developer.mozilla.org/docs/Web/API/Event) অবজেক্টটি পাস করার প্রয়োজন হলে, ফাংশন কলের ভেতরে Angular-এর বিল্ট-ইন `$event` ভেরিয়েবল ব্যবহার করতে পারেন:

```angular-ts
@Component({
  /*...*/
  // Add an 'click' event handler that calls the `cancelSubscription` method.
  template: `<button (click)="cancelSubscription($event)">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription(event: Event) {
    /* Your event handling code goes here. */
  }
}
```

## `@if` ও `@for` দিয়ে কন্ট্রোল ফ্লো {#control-flow-with-if-and-for}

Angular-এর `@if` ব্লক দিয়ে টেমপ্লেটের অংশবিশেষ শর্তসাপেক্ষে দেখাতে বা লুকাতে পারেন:

```angular-html
<h1>User profile</h1>

@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
}
```

`@if` ব্লকের সঙ্গে একটি ঐচ্ছিক `@else` ব্লকও ব্যবহার করা যায়:

```angular-html
<h1>User profile</h1>

@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
} @else {
  <h2>User settings</h2>
  <!-- ... -->
}
```

Angular-এর `@for` ব্লক দিয়ে টেমপ্লেটের একটি অংশ একাধিকবার পুনরাবৃত্তি করতে পারেন:

```angular-html
<h1>User profile</h1>

<ul class="user-badge-list">
  @for (badge of badges(); track badge.id) {
    <li class="user-badge">{{ badge.name }}</li>
  }
</ul>
```

ওপরের উদাহরণে দেখানো `track` কিওয়ার্ডটি Angular ব্যবহার করে `@for`-এর তৈরি DOM এলিমেন্টের সঙ্গে ডেটা যুক্ত করতে। আরও জানতে দেখুন [_Why is track in @for blocks important?_](guide/templates/control-flow#why-is-track-in-for-blocks-important)।

TIP: Angular টেমপ্লেট সম্পর্কে আরও জানতে চান? সম্পূর্ণ বিবরণের জন্য [টেমপ্লেটের বিস্তারিত গাইড](guide/templates) দেখুন।

## পরবর্তী ধাপ {#next-step}

অ্যাপ্লিকেশনে ডাইনামিক ডেটা ও টেমপ্লেট তো হলো, এবার নির্দিষ্ট এলিমেন্ট শর্তসাপেক্ষে দেখানো-লুকানো, এলিমেন্টের ওপর লুপ চালানোসহ টেমপ্লেটকে আরও সমৃদ্ধ করার কৌশল শেখার সময়।

<docs-pill-row>
  <docs-pill title="সিগন্যাল দিয়ে ফর্ম" href="essentials/signal-forms" />
  <docs-pill title="টেমপ্লেটের বিস্তারিত গাইড" href="guide/templates" />
</docs-pill-row>
