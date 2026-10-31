import React, { useState } from 'react';
import { Mail, Send, Sparkles } from 'lucide-react';
import { newsletterApi } from '../../services/api.js';
import toast from 'react-hot-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await newsletterApi.subscribe(email);
      if (res.success) {
        toast.success(res.message || 'Subscribed successfully!');
        setEmail('');
      }
    } catch (error) {
      toast.error(error.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-cream border-t border-stone-200">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-primary mx-auto mb-3">
          <Mail className="w-5 h-5 text-gold-dark" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-primary">
          Join the Subh Lagan Circle
        </h2>
        <p className="text-xs text-stone-600 mt-1 mb-6">
          Get exclusive early previews of our festive drops and bridal trousseau offers.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-2.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <span>{loading ? 'Joining...' : 'Subscribe'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
