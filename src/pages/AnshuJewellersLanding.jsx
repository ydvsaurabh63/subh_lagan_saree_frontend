import React, { useState } from 'react';
import {
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Gem,
  ChevronRight,
  X,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const JEWELLERY_COLLECTIONS = [
  {
    id: 'aj-01',
    name: 'Rajputana Kundan & Polki Choker',
    category: 'Bridal',
    price: '₹1,85,000',
    purity: '22K (916) Hallmark',
    badge: 'Bridal Masterpiece',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
    tag: 'Uncut Polki & Zambian Emerald',
  },
  {
    id: 'aj-02',
    name: 'Kashi 22K Gold Filigree Kadas',
    category: 'Bangles',
    price: '₹1,24,000',
    purity: '22K (916) Hallmark',
    badge: 'Pure 916 Gold',
    image: 'https://images.unsplash.com/photo-1611591475837-775677dffad3?auto=format&fit=crop&w=1000&q=80',
    tag: 'Hand-sculpted Pair',
  },
  {
    id: 'aj-03',
    name: 'Nawabi Basra Pearl & Emerald Haar',
    category: 'Necklaces',
    price: '₹2,45,000',
    purity: '22K Gold & Natural Pearls',
    badge: 'Royal Heritage',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
    tag: '5-Strand Layered Royal Drop',
  },
  {
    id: 'aj-04',
    name: 'VVS1 Solitaire Cut Halo Ring',
    category: 'Rings',
    price: '₹88,000',
    purity: '18K Rose Gold & Diamond',
    badge: 'IGI Certified',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
    tag: 'Brilliant 2-Carat Solitaire',
  },
  {
    id: 'aj-05',
    name: 'Temple Antique Lakshmi Choker',
    category: 'Bridal',
    price: '₹2,10,000',
    purity: '22K Antique Nakshi Gold',
    badge: 'Temple Craft',
    image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1000&q=80',
    tag: 'Auspicious Heritage Finish',
  },
  {
    id: 'aj-06',
    name: 'Emerald Cut Royal Gold Jhumkas',
    category: 'Earrings',
    price: '₹68,500',
    purity: '22K (916) Hallmark',
    badge: 'Bridal Pick',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80',
    tag: 'Carved Gemstones & Pearls',
  },
  {
    id: 'aj-07',
    name: 'Heritage Uncut Polki Matha Patti',
    category: 'Bridal',
    price: '₹92,000',
    purity: '22K Gold Foil Kundan',
    badge: 'Heirloom',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80',
    tag: 'Hand-set Jadau Masterpiece',
  },
  {
    id: 'aj-08',
    name: 'Artisan Diamond Cocktail Cuff',
    category: 'Bangles',
    price: '₹1,45,000',
    purity: '18K Gold & Diamonds',
    badge: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
    tag: 'Natural Brilliant Cut Stones',
  },
];

const CATEGORIES = ['All', 'Bridal', 'Necklaces', 'Bangles', 'Rings', 'Earrings'];

const AnshuJewellersLanding = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [bookVisitOpen, setBookVisitOpen] = useState(false);
  const [visitSubmitted, setVisitSubmitted] = useState(false);
  const [visitForm, setVisitForm] = useState({ name: '', phone: '', date: '' });

  const filteredItems = selectedCategory === 'All'
    ? JEWELLERY_COLLECTIONS
    : JEWELLERY_COLLECTIONS.filter((item) => item.category === selectedCategory);

  const whatsappPhone = '918147540362'; // WhatsApp concierge

  const openWhatsAppEnquiry = (item) => {
    const text = item
      ? `Hello Anshu Jewellers By Uday Jee, I am interested in: ${item.name} (${item.price}, ${item.purity}). Please share design details and pricing.`
      : `Hello Anshu Jewellers By Uday Jee, I would like to enquire about your Jewellery Collections.`;
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleBookVisitSubmit = (e) => {
    e.preventDefault();
    if (!visitForm.name || !visitForm.phone) return;
    setVisitSubmitted(true);
    const msg = `VIP Showroom Visit Booking:%0AName: ${visitForm.name}%0APhone: ${visitForm.phone}%0ADate: ${visitForm.date || 'Flexible'}`;
    setTimeout(() => {
      window.open(`https://wa.me/${whatsappPhone}?text=${msg}`, '_blank');
      setBookVisitOpen(false);
      setVisitSubmitted(false);
      setVisitForm({ name: '', phone: '', date: '' });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#081E1F] text-[#F5F2EB] selection:bg-[#D4AF37]/30 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 1. TOP ANNOUNCEMENT BAR (Dark Teal & Gold Foil)            */}
      {/* ========================================================= */}
      <div className="bg-[#051516] border-b border-[#C5A059]/25 py-2 px-4 text-center text-xs tracking-widest text-[#D4AF37] uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
        <span>100% BIS 916 Hallmarked Gold • Certified Diamonds • By Uday Jee</span>
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse hidden sm:inline" />
      </div>

      {/* ========================================================= */}
      {/* 2. DEDICATED LUXURY NAVBAR                                */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#081E1F]/90 backdrop-blur-md border-b border-[#C5A059]/20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Tagline */}
          <div className="flex flex-col cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span
              className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-[0.18em] uppercase text-[#F5F2EB]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              ANSHU JEWELLERS
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase text-[#D4AF37] -mt-0.5">
              BY UDAY JEE
            </span>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              type="button"
              onClick={() => setBookVisitOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#081E1F] text-xs font-bold uppercase tracking-wider rounded-xs transition-all duration-200 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Visit</span>
            </button>

            <button
              type="button"
              onClick={() => openWhatsAppEnquiry(null)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B89047] text-[#081E1F] hover:brightness-110 text-xs font-black uppercase tracking-wider rounded-xs shadow-lg transition-all duration-200 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. HERO SHOWCASE (Visual Dominant, Very Minimal Text)     */}
      {/* ========================================================= */}
      <section className="relative min-h-[580px] sm:min-h-[660px] flex items-center justify-center overflow-hidden px-4">
        {/* Background Image with Deep Teal Darkening Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1920&q=85"
            alt="Anshu Jewellers By Uday Jee"
            className="w-full h-full object-cover object-center filter brightness-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081E1F] via-[#081E1F]/70 to-[#081E1F]/80"></div>
          {/* Subtle Radial Glow */}
          <div className="absolute inset-0 bg-radial from-[#C5A059]/15 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center py-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/40 bg-[#081E1F]/60 backdrop-blur-sm mb-5">
            <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Royal Bridal & Heritage Collection
            </span>
          </div>

          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-wide text-[#F5F2EB] leading-tight mb-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Pure Gold & Polki
          </h1>

          <p className="text-xs sm:text-sm text-[#D4AF37] uppercase tracking-[0.3em] font-semibold mb-8">
            Curated Heirloom Jewellery By Uday Jee
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('collection-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E6CA65] text-[#081E1F] text-xs sm:text-sm font-black uppercase tracking-[0.2em] rounded-xs shadow-[0_10px_30px_rgba(212,175,55,0.25)] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setBookVisitOpen(true)}
              className="px-6 py-3 border border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[#F5F2EB] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] rounded-xs transition-all cursor-pointer"
            >
              VIP Showroom Visit
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. TRUST STRIP (Minimal Icons & Badges)                  */}
      {/* ========================================================= */}
      <section className="bg-[#051516] border-y border-[#C5A059]/20 py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37] mb-1.5" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5F2EB]">BIS 916 Hallmarked</span>
            <span className="text-[10px] text-[#A68A56]">100% Certified Purity</span>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-6 h-6 text-[#D4AF37] mb-1.5" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5F2EB]">By Uday Jee</span>
            <span className="text-[10px] text-[#A68A56]">Trusted Heritage</span>
          </div>
          <div className="flex flex-col items-center">
            <Gem className="w-6 h-6 text-[#D4AF37] mb-1.5" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5F2EB]">Natural Polki & Diamonds</span>
            <span className="text-[10px] text-[#A68A56]">IGI Authenticated</span>
          </div>
          <div className="flex flex-col items-center">
            <Sparkles className="w-6 h-6 text-[#D4AF37] mb-1.5" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5F2EB]">Bespoke Crafting</span>
            <span className="text-[10px] text-[#A68A56]">Custom Orders Accepted</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. VISUAL GALLERY & PRODUCTS GRID                         */}
      {/* ========================================================= */}
      <section id="collection-grid" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Category Filter Pills (Minimal Text) */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-[#081E1F] shadow-md'
                  : 'bg-[#0D2627] text-stone-300 border border-[#C5A059]/25 hover:border-[#D4AF37] hover:text-[#D4AF37]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4-Column High-Res Luxury Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-[#0D2627] border border-[#C5A059]/25 hover:border-[#D4AF37] rounded-xs overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              {/* Product Image Card */}
              <div
                className="relative aspect-4/5 overflow-hidden bg-stone-900 cursor-pointer"
                onClick={() => setActiveModalItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />
                
                {/* Badge Overlay */}
                <span className="absolute top-3 left-3 bg-[#081E1F]/90 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-xs">
                  {item.badge}
                </span>

                {/* Quick View Button on Hover */}
                <div className="absolute inset-0 bg-[#081E1F]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <span className="px-3.5 py-1.5 bg-[#081E1F]/90 border border-[#D4AF37] text-[#D4AF37] text-xs font-bold uppercase tracking-wider rounded-xs">
                    View Masterpiece
                  </span>
                </div>
              </div>

              {/* Minimal Card Details */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]/80 mb-1">
                    {item.purity}
                  </div>
                  <h3
                    className="text-sm font-bold text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-1"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-stone-400 truncate mb-3">
                    {item.tag}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#C5A059]/15 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-[#D4AF37] tracking-tight">
                      {item.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openWhatsAppEnquiry(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E6CA65] text-[#081E1F] text-xs font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer shadow-xs"
                    title="Enquire on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Enquire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. VIP SHOWROOM EXPERIENCE BANNER                         */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-r from-[#051516] via-[#0D2627] to-[#051516] border-y border-[#C5A059]/30 py-12 px-4 my-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37] block mb-2">
            Personalised Consultation
          </span>
          <h2
            className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide text-[#F5F2EB] mb-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Visit Our Flagship Jewellery Showroom
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto mb-6">
            Experience our 100% BIS Hallmarked bridal sets & handcrafted Polki masterpieces in person with Uday Jee.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setBookVisitOpen(true)}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E6CA65] text-[#081E1F] text-xs sm:text-sm font-black uppercase tracking-[0.2em] rounded-xs transition-all cursor-pointer"
            >
              Book VIP Consultation
            </button>
            <a
              href="tel:+918147540362"
              className="px-6 py-3 border border-[#D4AF37]/60 hover:border-[#D4AF37] text-[#D4AF37] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] rounded-xs transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. DEDICATED LUXURY FOOTER                                */}
      {/* ========================================================= */}
      <footer className="bg-[#051516] border-t border-[#C5A059]/25 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-[#C5A059]/15">
          
          {/* Brand Col */}
          <div>
            <span
              className="text-xl sm:text-2xl font-bold tracking-[0.18em] uppercase text-[#F5F2EB] block"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              ANSHU JEWELLERS
            </span>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#D4AF37] block mt-0.5 mb-4">
              BY UDAY JEE
            </span>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Hallmarked 22K Gold, Uncut Polki, Kundan & Certified Diamond Masterpieces.
            </p>
          </div>

          {/* Showroom Details */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-3">
              Showroom Location
            </span>
            <div className="space-y-2 text-xs text-stone-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Main Jewellery Market, Sutapatti, Muzaffarpur, Bihar 842001</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Mon - Sun: 10:30 AM - 08:30 PM</span>
              </p>
            </div>
          </div>

          {/* Quick Enquiries */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-3">
              Direct Contact
            </span>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => openWhatsAppEnquiry(null)}
                className="w-full sm:w-auto px-4 py-2 bg-[#D4AF37] text-[#081E1F] text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-[#E6CA65]"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Concierge</span>
              </button>
              <a
                href="tel:+918147540362"
                className="block text-xs text-stone-400 hover:text-[#D4AF37] transition-colors"
              >
                +91 81475 40362 / +91 98765 43210
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>© {new Date().getFullYear()} Anshu Jewellers By Uday Jee. All Rights Reserved.</p>
          <p className="text-[#A68A56]">100% Certified Authentic Jewellery</p>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 8. PRODUCT QUICK VIEW MODAL                                */}
      {/* ========================================================= */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2627] border border-[#D4AF37]/60 rounded-xs max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setActiveModalItem(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-[#081E1F]/80 text-stone-300 hover:text-white border border-[#C5A059]/40 z-10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-4/3 w-full bg-stone-900 overflow-hidden">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                {activeModalItem.purity} • {activeModalItem.badge}
              </span>
              <h3
                className="text-lg font-bold text-[#F5F2EB] mb-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {activeModalItem.name}
              </h3>
              <p className="text-xs text-stone-300 mb-4">{activeModalItem.tag}</p>

              <div className="flex items-center justify-between pt-4 border-t border-[#C5A059]/20">
                <span className="text-xl font-black text-[#D4AF37]">{activeModalItem.price}</span>
                <button
                  type="button"
                  onClick={() => {
                    openWhatsAppEnquiry(activeModalItem);
                    setActiveModalItem(null);
                  }}
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E6CA65] text-[#081E1F] text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enquire on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. VIP SHOWROOM VISIT BOOKING MODAL                       */}
      {/* ========================================================= */}
      {bookVisitOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2627] border border-[#D4AF37]/60 rounded-xs max-w-md w-full p-6 shadow-2xl relative animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setBookVisitOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
              VIP Appointment
            </span>
            <h3
              className="text-lg font-bold text-[#F5F2EB] mb-4"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Book Showroom Consultation
            </h3>

            {visitSubmitted ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-[#F5F2EB] font-bold">Booking Request Received!</p>
                <p className="text-[11px] text-stone-400 mt-1">Connecting to Uday Jee on WhatsApp...</p>
              </div>
            ) : (
              <form onSubmit={handleBookVisitSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={visitForm.name}
                    onChange={(e) => setVisitForm({ ...visitForm, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-[#081E1F] border border-[#C5A059]/40 focus:border-[#D4AF37] rounded-xs px-3 py-2 text-xs text-[#F5F2EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={visitForm.phone}
                    onChange={(e) => setVisitForm({ ...visitForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-[#081E1F] border border-[#C5A059]/40 focus:border-[#D4AF37] rounded-xs px-3 py-2 text-xs text-[#F5F2EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={visitForm.date}
                    onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                    className="w-full bg-[#081E1F] border border-[#C5A059]/40 focus:border-[#D4AF37] rounded-xs px-3 py-2 text-xs text-[#F5F2EB] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#E6CA65] text-[#081E1F] font-black text-xs uppercase tracking-widest rounded-xs transition-all cursor-pointer shadow-md mt-2"
                >
                  Confirm VIP Visit
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Direct WhatsApp Button on Landing Page */}
      <button
        type="button"
        onClick={() => openWhatsAppEnquiry(null)}
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
        title="Chat on WhatsApp"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </button>

    </div>
  );
};

export default AnshuJewellersLanding;
