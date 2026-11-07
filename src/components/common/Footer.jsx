import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

const Footer = () => {
  const { store, isBoutiqueStore } = useStore();

  const getLink = (path) => {
    if (!isBoutiqueStore) return path;
    if (path.startsWith('/shop')) {
      return path.includes('?')
        ? `/store/${store.slug}/shop${path.substring(5)}`
        : `/store/${store.slug}/shop`;
    }
    return path;
  };

  return (
    <footer className="bg-secondary-dark text-stone-200 pt-8 pb-8 border-t-2 border-gold/40">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            {isBoutiqueStore ? (
              <div className="space-y-2">
                <Link to={`/store/${store.slug}`} className="inline-flex items-center space-x-2.5 group">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/50 flex items-center justify-center text-gold shadow-md">
                    <Store className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-white uppercase group-hover:text-gold-light transition">
                      {store.name}
                    </h2>
                  </div>
                </Link>
                <p className="text-xs leading-relaxed text-stone-200 max-w-sm">
                  {store.tagline || 'Authentic Banarasi, Kanjivaram, and pure silk sarees.'}
                </p>
              </div>
            ) : (
              <>
                <Link to="/" className="inline-block group" title="Subh Lagan Sarees">
                  <img
                    src="/logo.png"
                    alt="Subh Lagan Sarees"
                    className="h-16 sm:h-20 lg:h-24 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <p className="text-xs leading-relaxed text-stone-200 max-w-sm">
                  Authentic Banarasi, Kanjivaram, and pure silk sarees.
                </p>
              </>
            )}

            <div className="pt-1 text-xs space-y-2 text-stone-200">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {store.address || 'Near Maharaja Sweets, Sutapatti, Muzaffarpur, Bihar 842001'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>{store.phone || store.whatsapp || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>{store.ownerEmail || 'care@subhlagansarees.com'}</span>
              </div>
            </div>
          </div>

          {/* Saree Categories */}
          <div>
            <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-white mb-3">
              Collections
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-200">
              <li><Link to={getLink('/shop?category=banarasi-sarees')} className="hover:text-white transition">Banarasi Sarees</Link></li>
              <li><Link to={getLink('/shop?category=kanjivaram-sarees')} className="hover:text-white transition">Kanjivaram Sarees</Link></li>
              <li><Link to={getLink('/shop?category=silk-sarees')} className="hover:text-white transition">Pure Silk Sarees</Link></li>
              <li><Link to={getLink('/shop?category=bridal-sarees')} className="hover:text-white transition">Bridal Sarees</Link></li>
              <li><Link to={getLink('/shop?category=organza-sarees')} className="hover:text-white transition">Organza Sarees</Link></li>
              <li><Link to={getLink('/shop?category=georgette-sarees')} className="hover:text-white transition">Georgette Sarees</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-white mb-3">
              Explore
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-200">
              <li><Link to={isBoutiqueStore ? `/store/${store.slug}/about` : '/about'} className="hover:text-white transition">About Our Brand</Link></li>
              <li><Link to={getLink('/shop?sort=bestseller')} className="hover:text-white transition">Bestsellers</Link></li>
              <li><Link to={getLink('/shop?isBridal=true')} className="hover:text-white transition">Bridal Edit</Link></li>
              <li><Link to={getLink('/shop?sort=newest')} className="hover:text-white transition">New Arrivals</Link></li>
              <li><Link to={isBoutiqueStore ? `/store/${store.slug}/contact` : '/contact'} className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-white mb-3">
              Customer Care
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-200">
              <li><Link to="/shipping-policy" className="hover:text-white transition">Shipping Policy</Link></li>
              <li><Link to="/return-policy" className="hover:text-white transition">Return & Exchange</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/profile?tab=orders" className="hover:text-white transition">Track Order</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-stone-800 text-center flex flex-col md:flex-row items-center justify-between text-xs text-stone-300">
        <p>&copy; {new Date().getFullYear()} {store.name}. All Rights Reserved.</p>
        <p className="mt-2 md:mt-0 text-stone-200">
          Payment Mode: <strong className="text-white">Cash on Delivery (COD)</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
