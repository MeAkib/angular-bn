<docs-decorative-header title="সিগন্যাল দিয়ে ফর্ম" imgSrc="adev/src/assets/images/signals.svg"> </docs-decorative-header>

Signal Forms ফর্মের স্টেট পরিচালনা করে Angular সিগন্যাল ব্যবহার করে, যাতে আপনার ডেটা মডেল ও UI-এর মধ্যে স্বয়ংক্রিয় সিঙ্ক্রোনাইজেশন পাওয়া যায়।

এই গাইডটি Signal Forms দিয়ে ফর্ম তৈরির মূল ধারণাগুলো ধাপে ধাপে দেখাবে। এটি যেভাবে কাজ করে:

## আপনার প্রথম ফর্ম তৈরি {#creating-your-first-form}

### ১. `signal()` দিয়ে একটি ফর্ম মডেল তৈরি করুন {#1-create-a-form-model-with-signal}

প্রতিটি ফর্ম শুরু হয় এমন একটি সিগন্যাল তৈরির মাধ্যমে, যা ফর্মের ডেটা মডেল ধারণ করে:

```ts
interface LoginData {
  email: string;
  password: string;
}

const loginModel = signal<LoginData>({
  email: '',
  password: '',
});
```

### ২. `FieldTree` তৈরি করতে ফর্ম মডেলটি `form()`-এ পাস করুন {#2-pass-the-form-model-to-form-to-create-a-fieldtree}

এরপর ফর্ম মডেলটি `form()` ফাংশনে পাস করে একটি **ফিল্ড ট্রি** তৈরি করুন - এটি এমন একটি অবজেক্ট কাঠামো, যা আপনার মডেলের আকৃতির প্রতিফলন এবং ডট নোটেশনে ফিল্ডে প্রবেশের সুযোগ দেয়।

রুট ফর্ম অবজেক্ট এবং এর নেস্টেড প্রোপার্টি — দুটোই `FieldTree` নোড:

```ts
const loginForm = form(loginModel);

loginForm; // is a FieldTree
loginForm.email; // is also a FieldTree
```

### ৩. `[formField]` ডিরেক্টিভ দিয়ে HTML ইনপুট বাইন্ড করুন {#3-bind-html-inputs-with-formfield-directive}

এরপর `[formField]` ডিরেক্টিভ ব্যবহার করে HTML ইনপুটগুলো ফর্মের সঙ্গে বাইন্ড করুন, যা উভয়ের মধ্যে টু-ওয়ে বাইন্ডিং তৈরি করে:

```html
<input type="email" [formField]="loginForm.email" />
<input type="password" [formField]="loginForm.password" />
```

ফলে ব্যবহারকারীর পরিবর্তন (যেমন ফিল্ডে টাইপ করা) স্বয়ংক্রিয়ভাবে ফর্মটি আপডেট করে।

NOTE: `[formField]` ডিরেক্টিভ প্রয়োজন অনুযায়ী `required`, `disabled`, `readonly`-এর মতো অ্যাট্রিবিউটের ফিল্ড স্টেটও সিঙ্ক করে।

### ৪. `FieldTree` সিগন্যাল দিয়ে স্টেট পড়ুন {#4-read-state-with-fieldtree-signals}

ট্রির যেকোনো অংশের স্টেট পেতে `FieldTree` নোডটিকে ফাংশনের মতো কল করুন। এটি একটি স্টেট অবজেক্ট ফেরত দেয়, যাতে ভ্যালু, ভ্যালিডেশন স্ট্যাটাস ও ইন্টারঅ্যাকশন স্টেটের রিঅ্যাকটিভ সিগন্যাল থাকে:

```ts
loginForm(); // Returns state for the whole form
loginForm.email(); // Returns state for the email field
```

বর্তমান ভ্যালু পড়তে `value()` সিগন্যালটি ব্যবহার করুন:

```html
<!-- Render values that update automatically as user types -->
<p>Form value: {{ loginForm().value() | json }}</p>
<p>Email: {{ loginForm.email().value() }}</p>
```

```ts
// Get the current value
const currentEmail = loginForm.email().value();
```

### ৫. `set()` দিয়ে ভ্যালু আপডেট করুন {#5-update-values-with-set}

যেকোনো নোডের `value.set()` মেথড দিয়ে প্রোগ্রাম থেকে ভ্যালু আপডেট করতে পারেন। এটি `FieldTree` এবং এর পেছনের মডেল সিগন্যাল — দুটোই আপডেট করে:

```ts
// Update the value programmatically
loginForm.email().value.set('alice@wonderland.com');
```

ফলে ফিল্ডের ভ্যালু ও মডেল সিগন্যাল — দুটোই স্বয়ংক্রিয়ভাবে আপডেট হয়:

```ts
// The model signal is also updated
console.log(loginModel().email); // 'alice@wonderland.com'
```

### সম্পূর্ণ উদাহরণ {#complete-example}

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.css"/>
</docs-code-multifile>

## মৌলিক ব্যবহার {#basic-usage}

`[formField]` ডিরেক্টিভ সব স্ট্যান্ডার্ড HTML ইনপুট টাইপের সঙ্গে কাজ করে। সবচেয়ে প্রচলিত প্যাটার্নগুলো এখানে:

### টেক্সট ইনপুট {#text-inputs}

টেক্সট ইনপুট নানা রকম `type` অ্যাট্রিবিউট ও textarea-র সঙ্গে কাজ করে:

```html
<!-- Text and email -->
<input type="text" [formField]="form.name" />
<input type="email" [formField]="form.email" />
```

#### সংখ্যা {#numbers}

নাম্বার ইনপুট স্ট্রিং ও সংখ্যার মধ্যে স্বয়ংক্রিয়ভাবে রূপান্তর করে:

```html
<!-- Number - automatically converts to number type -->
<input type="number" [formField]="form.age" />
```

#### তারিখ ও সময় {#date-and-time}

ডেট ইনপুট ভ্যালু রাখে `YYYY-MM-DD` স্ট্রিং হিসেবে, আর টাইম ইনপুট ব্যবহার করে `HH:mm` ফরম্যাট:

```html
<!-- Date and time - stores as ISO format strings -->
<input type="date" [formField]="form.eventDate" />
<input type="time" [formField]="form.eventTime" />
```

তারিখের স্ট্রিংকে Date অবজেক্টে রূপান্তরের প্রয়োজন হলে, ফিল্ডের ভ্যালুটি `Date()`-এ পাস করেই তা করতে পারেন:

```ts
const dateObject = new Date(form.eventDate().value());
```

#### একাধিক লাইনের টেক্সট {#multiline-text}

Textarea টেক্সট ইনপুটের মতোই কাজ করে:

```html
<!-- Textarea -->
<textarea [formField]="form.message" rows="4"></textarea>
```

### চেকবক্স {#checkboxes}

চেকবক্স বুলিয়ান ভ্যালুতে বাইন্ড হয়:

```html
<!-- Single checkbox -->
<label>
  <input type="checkbox" [formField]="form.agreeToTerms" />
  I agree to the terms
</label>
```

#### একাধিক চেকবক্স {#multiple-checkboxes}

একাধিক অপশনের জন্য প্রতিটির আলাদা বুলিয়ান `formField` তৈরি করুন:

```html
<label>
  <input type="checkbox" [formField]="form.emailNotifications" />
  Email notifications
</label>
<label>
  <input type="checkbox" [formField]="form.smsNotifications" />
  SMS notifications
</label>
```

### রেডিও বাটন {#radio-buttons}

রেডিও বাটন চেকবক্সের মতোই কাজ করে। রেডিও বাটনগুলো একই `[formField]` ভ্যালু ব্যবহার করলে Signal Forms স্বয়ংক্রিয়ভাবে সবগুলোতে একই `name` অ্যাট্রিবিউট বাইন্ড করবে:

```html
<label>
  <input type="radio" value="free" [formField]="form.plan" />
  Free
</label>
<label>
  <input type="radio" value="premium" [formField]="form.plan" />
  Premium
</label>
```

ব্যবহারকারী কোনো রেডিও বাটন নির্বাচন করলে, সেই রেডিও বাটনের `value` অ্যাট্রিবিউটের ভ্যালুটিই ফর্মের `formField`-এ সংরক্ষিত হয়। যেমন, "Premium" নির্বাচন করলে `form.plan().value()` হয় `"premium"`।

### সিলেক্ট ড্রপডাউন {#select-dropdowns}

সিলেক্ট এলিমেন্ট স্থির ও ডাইনামিক — দুই ধরনের অপশনের সঙ্গেই কাজ করে:

```angular-html
<!-- Static options -->
<select [formField]="form.country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<!-- Dynamic options with @for -->
<select [formField]="form.productId">
  <option value="">Select a product</option>
  @for (product of products; track product.id) {
    <option [value]="product.id">{{ product.name }}</option>
  }
</select>
```

NOTE: মাল্টিপল সিলেক্ট (`<select multiple>`) এই মুহূর্তে `[formField]` ডিরেক্টিভে সমর্থিত নয়।

## ভ্যালিডেশন ও স্টেট {#validation-and-state}

Signal Forms বিল্ট-ইন ভ্যালিডেটর দেয়, যা আপনি ফর্মের ফিল্ডে প্রয়োগ করতে পারেন। ভ্যালিডেশন যোগ করতে `form()`-এর দ্বিতীয় আর্গুমেন্ট হিসেবে একটি স্কিমা ফাংশন পাস করুন:

```ts
const loginForm = form(loginModel, (schemaPath) => {
  debounce(schemaPath.email, 500);
  required(schemaPath.email);
  email(schemaPath.email);
});
```

স্কিমা ফাংশনটি একটি **স্কিমা পাথ** প্যারামিটার পায়, যা ভ্যালিডেশন রুল কনফিগার করার জন্য আপনার ফিল্ডগুলোর পাথ সরবরাহ করে।

প্রচলিত ভ্যালিডেটরগুলোর মধ্যে রয়েছে:

- **`required()`** - ফিল্ডে ভ্যালু আছে কি না তা নিশ্চিত করে
- **`email()`** - ইমেইল ফরম্যাট যাচাই করে
- **`min()`** / **`max()`** - সংখ্যার সীমা যাচাই করে
- **`minLength()`** / **`maxLength()`** - স্ট্রিং বা কালেকশনের দৈর্ঘ্য যাচাই করে
- **`pattern()`** - রেগুলার এক্সপ্রেশন প্যাটার্নের বিপরীতে যাচাই করে

ভ্যালিডেটরের দ্বিতীয় আর্গুমেন্ট হিসেবে একটি অপশন অবজেক্ট পাস করে এরর মেসেজও নিজের মতো সাজাতে পারেন:

```ts
required(schemaPath.email, {message: 'Email is required'});
email(schemaPath.email, {message: 'Please enter a valid email address'});
```

`FieldTree`-র প্রতিটি নোড তার ভ্যালিডেশন ও ইন্টারঅ্যাকশন স্টেট রিঅ্যাকটিভ সিগন্যালের মাধ্যমে প্রকাশ করে।

### FieldTree স্টেট সিগন্যাল {#fieldtree-state-signals}

রুট ফর্ম অবজেক্টসহ ট্রির প্রতিটি নোড তার স্টেট ট্র্যাক করার একই সিগন্যালগুলো দেয়। প্রতিটি নোডই যেহেতু `FieldTree`, তাই ভ্যালিডিটি ও ইন্টারঅ্যাকশন পর্যবেক্ষণের API প্রতিটি স্তরেই অভিন্ন।

| স্টেট        | বিবরণ                                                                            |
| ------------ | ------------------------------------------------------------------------------- |
| `valid()`    | নোডটি সব ভ্যালিডেশন রুলে উত্তীর্ণ হলে `true` ফেরত দেয়                            |
| `invalid()`  | ভ্যালিডেশন এরর থাকলে `true` ফেরত দেয়                                            |
| `pending()`  | অ্যাসিনক্রোনাস ভ্যালিডেশন চলমান থাকলে `true` ফেরত দেয়                            |
| `touched()`  | ব্যবহারকারী ফিল্ডটি বা এর কোনো চাইল্ড ফিল্ডে ফোকাস করে ব্লার করলে `true` ফেরত দেয় |
| `dirty()`    | ব্যবহারকারী ভ্যালু পরিবর্তন করে থাকলে `true` ফেরত দেয়                            |
| `disabled()` | নোডটি নিষ্ক্রিয় থাকলে `true` ফেরত দেয়                                           |
| `readonly()` | নোডটি কেবল পড়ার যোগ্য হলে `true` ফেরত দেয়                                       |
| `errors()`   | `kind` ও `message` প্রোপার্টিসহ ভ্যালিডেশন এররের একটি অ্যারে ফেরত দেয়            |

### সম্পূর্ণ উদাহরণ {#complete-example-validation}

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.css"/>
</docs-code-multifile>

## পরবর্তী ধাপ {#next-steps}

Signal Forms ও এর কাজের ধরন সম্পর্কে আরও জানতে বিস্তারিত গাইডগুলো দেখুন:

- [সারসংক্ষেপ](guide/forms/signals/overview) - Signal Forms-এর পরিচিতি এবং কখন এটি ব্যবহার করবেন
- [ফর্ম মডেল](guide/forms/signals/models) - সিগন্যাল দিয়ে ফর্মের ডেটা তৈরি ও পরিচালনা
- [ফিল্ড স্টেট ব্যবস্থাপনা](guide/forms/signals/field-state-management) - ভ্যালিডেশন স্টেট, ইন্টারঅ্যাকশন ট্র্যাকিং ও ফিল্ডের দৃশ্যমানতা নিয়ে কাজ
- [ভ্যালিডেশন](guide/forms/signals/validation) - বিল্ট-ইন ভ্যালিডেটর, কাস্টম ভ্যালিডেশন রুল ও অ্যাসিনক্রোনাস ভ্যালিডেশন

<docs-pill-row>
  <docs-pill title="ডিপেন্ডেন্সি ইনজেকশন দিয়ে মডুলার ডিজাইন" href="essentials/dependency-injection" />
</docs-pill-row>
