import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import SetupIntentForm from './SetupIntentForm';
const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(publicKey);

interface StripeSetupFormProps {}

const StripeSetupForm: React.FC<StripeSetupFormProps> = () => {
  const [setupIntent, setSetupIntent] = useState({
    id: '',
    clientSecret: ''
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!setupIntent.id.trim()) {
      newErrors.id = 'Setup Intent ID is required';
    } else if (!setupIntent.id.startsWith('seti_')) {
      newErrors.id = 'Invalid Setup Intent ID format';
    }
    
    if (!setupIntent.clientSecret.trim()) {
      newErrors.clientSecret = 'Client Secret is required';
    } else if (!setupIntent.clientSecret.includes('_secret_')) {
      newErrors.clientSecret = 'Invalid Client Secret format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowCheckout(true);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSetupIntent(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBack = () => {
    setShowCheckout(false);
  };

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Setup Payment Method
            </h1>
            <p className="text-gray-600">
              Enter your Stripe setup intent details to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="setupIntentId" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Setup Intent ID
              </label>
              <div className="relative">
                <input
                  id="setupIntentId"
                  type="text"
                  value={setupIntent.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  placeholder="seti_..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.id 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300'
                  }`}
                />
                {errors.id && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.id}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label 
                htmlFor="clientSecret" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Client Secret
              </label>
              <div className="relative">
                <input
                  id="clientSecret"
                  type="password"
                  value={setupIntent.clientSecret}
                  onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                  placeholder="seti_...._secret_..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.clientSecret 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300'
                  }`}
                />
                {errors.clientSecret && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.clientSecret}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
              <Lock className="w-4 h-4 mr-2" />
              <span>Secured by Stripe</span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Continue to Payment Setup
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Your payment information is processed securely by Stripe</p>
        </div>
      </div>
    </div>
  );
};

export default StripeSetupForm;