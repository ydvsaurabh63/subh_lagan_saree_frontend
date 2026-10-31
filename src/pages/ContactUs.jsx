import React, { useState } from 'react';
import { contactApi } from '../services/api.js';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await contactApi.submitContact(formData);
      if (res.success) {
        toast.success(res.message || 'Enquiry submitted successfully!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Contact Boutique' }]} />

        <div className="text-center py-10 max-w-2xl mx-auto">
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold">
            We Are At Your Service
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mt-1">
            Connect With Our Saree Stylists
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-3"></div>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Whether you need bridal trousseau styling advice, custom blouse guidance, or order assistance, our dedicated concierge is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Contact Details Card */}
          <div className="bg-primary text-white p-8 rounded-3xl space-y-6 shadow-luxury">
            <h2 className="font-serif text-xl font-bold text-gold-light border-b border-primary-light pb-3">
              Heritage Boutique
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Flagship Boutique</h4>
                  <p className="text-stone-300 mt-0.5 leading-relaxed">
                    Heritage Craft Lane, Johari Bazaar, Jaipur, Rajasthan 302003, India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Direct Phone & WhatsApp</h4>
                  <p className="text-stone-300 mt-0.5">+91 98765 43210</p>
                  <p className="text-stone-300">+91 141 2567890</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Customer Care Email</h4>
                  <p className="text-stone-300 mt-0.5">care@subhlagansarees.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Boutique Timings</h4>
                  <p className="text-stone-300 mt-0.5">Mon – Sat: 10:30 AM – 8:30 PM</p>
                  <p className="text-stone-300">Sunday: 11:00 AM – 7:00 PM</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-primary-light">
              <p className="text-[11px] text-gold-light/90">
                Cash on Delivery (COD) is available on all phone & website orders nationwide.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-primary mb-2">
              Send An Enquiry or Request Bridal Consultation
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              Fill out the form below and one of our master saree stylists will respond within 4 business hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-stone-600 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Radhika Singhania"
                    required
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-600 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-stone-600 block mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-600 block mb-1">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Bridal Trousseau Enquiry"
                    required
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-600 block mb-1">Your Message *</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share details about the saree collection, occasion date, or question you have..."
                  required
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold uppercase tracking-wider rounded-lg shadow-md transition flex items-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Sending Enquiry...' : 'Submit Message'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
