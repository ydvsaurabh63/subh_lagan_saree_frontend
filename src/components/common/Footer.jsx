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
    <footer className="bg-secondary-dark text-stone-300 pt-16 pb-8 border-t-2 border-gold/40">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-serif text-sm font-semibold">100% Handcrafted</h4>
              <p className="text-xs text-stone-400 mt-0.5">Authentic handloom weaves</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-serif text-sm font-semibold">Complimentary Shipping</h4>
              <p className="text-xs text-stone-400 mt-0.5">Free across India above ₹1,999</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-serif text-sm font-semibold">Cash On Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">Pay at your doorstep safely</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-serif text-sm font-semibold">7-Day Easy Exchange</h4>
              <p className="text-xs text-stone-400 mt-0.5">Hassle-free guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center border-2 border-gold text-gold font-serif font-bold text-lg">
                SL
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                SUBH LAGAN <span className="text-gold">SAREES</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400 max-w-sm">
              Subh Lagan Sarees brings the opulent heritage of Indian royal weddings to life. Every drape is an artisanal masterpiece, spun from pure mulberry silks, authentic zari, and timeless devotion to Indian handloom traditions.
            </p>
            <div className="pt-2 text-xs space-y-2 text-stone-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Heritage Craft Lane, Johari Bazaar, Jaipur, Rajasthan 302003</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+91 98765 43210 / +91 141 2567890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>care@subhlagansarees.com</span>
              </div>
            </div>
          </div>

          {/* Saree Categories */}
          <div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold mb-4">
              Handcrafted Sarees
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?category=banarasi-sarees" className="hover:text-gold transition">Banarasi Sarees</Link></li>
              <li><Link to="/shop?category=kanjivaram-sarees" className="hover:text-gold transition">Kanjivaram Sarees</Link></li>
              <li><Link to="/shop?category=silk-sarees" className="hover:text-gold transition">Pure Silk Sarees</Link></li>
              <li><Link to="/shop?category=bridal-sarees" className="hover:text-gold transition">Bridal Sarees</Link></li>
              <li><Link to="/shop?category=organza-sarees" className="hover:text-gold transition">Organza Sarees</Link></li>
              <li><Link to="/shop?category=chiffon-sarees" className="hover:text-gold transition">Chiffon Sarees</Link></li>
              <li><Link to="/shop?category=georgette-sarees" className="hover:text-gold transition">Georgette Sarees</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold mb-4">
              Explore & Shop
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop" className="hover:text-gold transition">Complete Catalogue</Link></li>
              <li><Link to="/shop?isNewArrival=true" className="hover:text-gold transition">New Arrivals</Link></li>
              <li><Link to="/shop?isBestSeller=true" className="hover:text-gold transition">Best Sellers</Link></li>
              <li><Link to="/shop?isBridal=true" className="hover:text-gold transition">Wedding Trousseau</Link></li>
              <li><Link to="/about" className="hover:text-gold transition">Our Brand Heritage</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition">Boutique Contact</Link></li>
              <li><Link to="/faq" className="hover:text-gold transition">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold mb-4">
              Policies & Help
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shipping-policy" className="hover:text-gold transition">Shipping & Delivery Policy</Link></li>
              <li><Link to="/return-policy" className="hover:text-gold transition">Return & Exchange Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-gold transition">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-gold transition">Terms & Conditions</Link></li>
              <li><Link to="/cart" className="hover:text-gold transition">View Shopping Cart</Link></li>
              <li><Link to="/profile" className="hover:text-gold transition">Track My Order</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-6 border-t border-stone-800 text-center flex flex-col md:flex-row items-center justify-between text-xs text-stone-500">
        <p>&copy; {new Date().getFullYear()} Subh Lagan Sarees. All Rights Reserved. Crafted with royal elegance.</p>
        <p className="mt-2 md:mt-0 text-stone-400">
          Payment Modes Accepted: <span className="text-gold font-medium">Cash on Delivery (COD)</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

