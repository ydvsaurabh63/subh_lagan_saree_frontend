import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
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
    <section className="py-16 bg-cream border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-primary mx-auto mb-4">
          <Mail className="w-5 h-5 text-gold-dark" />
        </div>
        <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
          Privileged Access
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-primary mt-2">
          Join the Subh Lagan Inner Circle
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mt-3 mb-4"></div>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto mb-8">
          Receive exclusive early previews of our festive handloom drops, private bridal consultations, and curated saree styling notes.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;

