Perfect 👍 I’ll prepare it as a **GitHub-ready `README.md`** file — clean, structured, and with code blocks.

Here’s the **Markdown text** you can paste directly into `README.md` on your repo:

````markdown
# Stripe Setup Form

A React component for setting up payment methods with **Stripe Setup Intents** using  
[Stripe Elements](https://stripe.com/docs/stripe-js/react), [TailwindCSS](https://tailwindcss.com/), and [Lucide React](https://lucide.dev/).

---

## ✨ Features

- 🔑 Collect **Stripe Setup Intent ID** and **Client Secret**
- ✅ Client-side validation
- 🎨 Modern TailwindCSS UI
- 🔒 Secure integration with Stripe Elements
- ⚡ Built with Vite + React

---

## 📦 Installation

Install the required dependencies:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js lucide-react
````

---

## 🔑 Environment Setup

Add your Stripe **Publishable Key** in `.env`:

```bash
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key_here
```

---

## 🚀 Usage

```tsx
import StripeSetupForm from './StripeSetupForm';

function App() {
  return (
    <div className="App">
      <StripeSetupForm />
    </div>
  );
}

export default App;
```

---

## 🖼️ Flow

1. User enters:

   * **Setup Intent ID** (`seti_...`)
   * **Client Secret** (`..._secret_...`)
2. Form validates input and shows inline errors.
3. If valid:

   * Loads Stripe Elements with `clientSecret`.
   * Renders `SetupIntentForm` for payment method setup.
4. User can return to edit input if needed.

---

## ✅ Validation Rules

* **Setup Intent ID**

  * Required
  * Must start with `seti_`

* **Client Secret**

  * Required
  * Must contain `_secret_`

---

## 📂 File Structure

```plaintext
components/
│── StripeSetupForm.tsx   # This component
│── SetupIntentForm.tsx   # Handles Stripe setup confirmation
```

---

## 🎨 Styling

* TailwindCSS based UI
* Stripe Elements custom theme:

  * Primary: `#3B82F6`
  * Text: `#1f2937`
  * Danger: `#ef4444`

---

## 🔒 Security

* PCI-compliant payment handling with Stripe
* `"Secured by Stripe"` indicator
* No sensitive data stored locally

---

## 📜 Source Code

> Full source of `StripeSetupForm.tsx` is included inside this repo.
> Here’s the main component for reference:

```tsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import SetupIntentForm from './SetupIntentForm';

const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(publicKey);

const StripeSetupForm: React.FC = () => {
  const [setupIntent, setSetupIntent] = useState({ id: '', clientSecret: '' });
  const [showCheckout, setShowCheckout] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!setupIntent.id.trim()) newErrors.id = 'Setup Intent ID is required';
    else if (!setupIntent.id.startsWith('seti_')) newErrors.id = 'Invalid Setup Intent ID format';
    if (!setupIntent.clientSecret.trim()) newErrors.clientSecret = 'Client Secret is required';
    else if (!setupIntent.clientSecret.includes('_secret_')) newErrors.clientSecret = 'Invalid Client Secret format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) setShowCheckout(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setSetupIntent(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleBack = () => setShowCheckout(false);

  if (showCheckout) {
    return (
      <Elements 
        stripe={stripePromise}
        options={{
          clientSecret: setupIntent.clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#3B82F6',
              colorBackground: '#ffffff',
              colorText: '#1f2937',
              colorDanger: '#ef4444',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px'
            }
          }
        }}
      >
        <SetupIntentForm 
          onBack={handleBack}
          setupIntentId={setupIntent.id}
        />
      </Elements>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Payment Method</h1>
            <p className="text-gray-600">Enter your Stripe setup intent details to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="setupIntentId" className="block text-sm font-medium text-gray-700 mb-2">
                Setup Intent ID
              </label>
              <input
                id="setupIntentId"
                type="text"
                value={setupIntent.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                placeholder="seti_..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.id ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              {errors.id && <p className="text-red-600 text-sm mt-2">{errors.id}</p>}
            </div>
            <div>
              <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700 mb-2">
                Client Secret
              </label>
              <input
                id="clientSecret"
                type="password"
                value={setupIntent.clientSecret}
                onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                placeholder="seti_...._secret_..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.clientSecret ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              {errors.clientSecret && <p className="text-red-600 text-sm mt-2">{errors.clientSecret}</p>}
            </div>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Lock className="w-4 h-4 mr-2" />
              <span>Secured by Stripe</span>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
            >
              Continue to Payment Setup
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-sm text-gray-500">
          Your payment information is processed securely by Stripe
        </p>
      </div>
    </div>
  );
};

export default StripeSetupForm;
```

---

## 📖 License

MIT © 2025

```

---

👉 Do you also want me to add **badges** (like `Stripe`, `React`, `Vite`, `Tailwind`) at the top for GitHub style, or keep it clean?
```
