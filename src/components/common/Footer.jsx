import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary-dark text-stone-300 pt-12 pb-8 border-t-2 border-gold/40">
      {/* Brand Value Pillars with prominent icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-stone-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-serif text-xs font-bold uppercase tracking-wider">100% Handcrafted</h4>
              <p className="text-[11px] text-stone-400">Silk Mark certified</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-serif text-xs font-bold uppercase tracking-wider">Free Shipping</h4>
              <p className="text-[11px] text-stone-400">Orders &gt; ₹1,999</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-serif text-xs font-bold uppercase tracking-wider">Cash On Delivery</h4>
              <p className="text-[11px] text-stone-400">Doorstep payment</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-serif text-xs font-bold uppercase tracking-wider">7-Day Exchange</h4>
              <p className="text-[11px] text-stone-400">Doorstep pickup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-gold text-gold font-serif font-bold text-base">
                SL
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                SUBH LAGAN <span className="text-gold">SAREES</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400 max-w-sm">
              Authentic Banarasi, Kanjivaram, and pure silk sarees.
            </p>
            <div className="pt-1 text-xs space-y-2 text-stone-400">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Shubh+Lagan+Saree+near+Maharaja+sweets+Sutapatti+Muzaffarpur+Bihar+842001"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-2 hover:text-gold transition group"
                title="Open Boutique Location on Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">
                  Near Maharaja Sweets, Sutapatti, Muzaffarpur, Bihar 842001
                </span>
              </a>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>care@subhlagansarees.com</span>
              </div>
            </div>
          </div>

          {/* Saree Categories */}
          <div>
            <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-gold mb-3">
              Collections
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/shop?category=banarasi-sarees" className="hover:text-gold transition">Banarasi Sarees</Link></li>
              <li><Link to="/shop?category=kanjivaram-sarees" className="hover:text-gold transition">Kanjivaram Sarees</Link></li>
              <li><Link to="/shop?category=silk-sarees" className="hover:text-gold transition">Pure Silk Sarees</Link></li>
              <li><Link to="/shop?category=bridal-sarees" className="hover:text-gold transition">Bridal Sarees</Link></li>
              <li><Link to="/shop?category=organza-sarees" className="hover:text-gold transition">Organza Sarees</Link></li>
              <li><Link to="/shop?category=georgette-sarees" className="hover:text-gold transition">Georgette Sarees</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-gold mb-3">
              Explore
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/shop" className="hover:text-gold transition">All Sarees</Link></li>
              <li><Link to="/shop?isNewArrival=true" className="hover:text-gold transition">New Arrivals</Link></li>
              <li><Link to="/shop?isBestSeller=true" className="hover:text-gold transition">Best Sellers</Link></li>
              <li><Link to="/about" className="hover:text-gold transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition">Contact Boutique</Link></li>
              <li><Link to="/faq" className="hover:text-gold transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-gold mb-3">
              Customer Care
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/shipping-policy" className="hover:text-gold transition">Shipping Policy</Link></li>
              <li><Link to="/return-policy" className="hover:text-gold transition">Return & Exchange</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-gold transition">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-gold transition">Terms of Service</Link></li>
              <li><Link to="/profile?tab=orders" className="hover:text-gold transition">Track Order</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-stone-800 text-center flex flex-col md:flex-row items-center justify-between text-xs text-stone-500">
        <p>&copy; {new Date().getFullYear()} Subh Lagan Sarees. All Rights Reserved.</p>
        <p className="mt-2 md:mt-0 text-stone-400">
          Payment Mode: <strong className="text-gold">Cash on Delivery (COD)</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
