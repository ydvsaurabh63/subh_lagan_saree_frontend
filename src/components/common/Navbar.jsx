import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  UserCheck,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import LoginModal from './LoginModal.jsx';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { totalQuantity } = useCart();
  const { wishlist } = useWishlist();
  const { store, isBoutiqueStore, isJewelleryStore, isHairStore, isSareeStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-close dropdowns and mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  // Click outside listener for logged-in user menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchTarget = isBoutiqueStore
        ? `/store/${store.slug}/shop?search=${encodeURIComponent(searchQuery.trim())}`
        : `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      navigate(searchTarget);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const getNavLinks = () => {
    if (!isBoutiqueStore) {
      return [
        { name: 'Home', path: '/' },
        { name: 'All Sarees', path: '/shop' },
        { name: 'Banarasi', path: '/shop?category=banarasi-sarees' },
        { name: 'Kanjivaram', path: '/shop?category=kanjivaram-sarees' },
        { name: 'Bridal Couture', path: '/shop?isBridal=true' },
        { name: 'Pure Silk', path: '/shop?fabric=Pure+Katan+Silk' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ];
    }

    if (isJewelleryStore) {
      return [
        { name: 'Home', path: `/store/${store.slug}` },
        { name: 'All Jewellery', path: `/store/${store.slug}/shop` },
        { name: 'Necklaces', path: `/store/${store.slug}/shop?category=necklaces` },
        { name: 'Bangles & Kadas', path: `/store/${store.slug}/shop?category=bangles` },
        { name: 'Rings', path: `/store/${store.slug}/shop?category=rings` },
        { name: 'Earrings', path: `/store/${store.slug}/shop?category=earrings` },
        { name: 'Bridal Sets', path: `/store/${store.slug}/shop?isBridal=true` },
        { name: 'About Us', path: `/store/${store.slug}/about` },
        { name: 'Contact', path: `/store/${store.slug}/contact` },
      ];
    }

    if (isHairStore) {
      return [
        { name: 'Home', path: `/store/${store.slug}` },
        { name: 'All Hair Care', path: `/store/${store.slug}/shop` },
        { name: 'Extensions', path: `/store/${store.slug}/shop?category=extensions` },
        { name: 'Wigs & Toppers', path: `/store/${store.slug}/shop?category=wigs` },
        { name: 'Serums & Oils', path: `/store/${store.slug}/shop?category=serums` },
        { name: 'Styling Tools', path: `/store/${store.slug}/shop?category=tools` },
        { name: 'About Us', path: `/store/${store.slug}/about` },
        { name: 'Contact', path: `/store/${store.slug}/contact` },
      ];
    }

    return [
      { name: 'Home', path: `/store/${store.slug}` },
      { name: 'All Sarees', path: `/store/${store.slug}/shop` },
      { name: 'Banarasi', path: `/store/${store.slug}/shop?category=banarasi-sarees` },
      { name: 'Kanjivaram', path: `/store/${store.slug}/shop?category=kanjivaram-sarees` },
      { name: 'Bridal Couture', path: `/store/${store.slug}/shop?isBridal=true` },
      { name: 'Pure Silk', path: `/store/${store.slug}/shop?fabric=Pure+Katan+Silk` },
      { name: 'About Us', path: `/store/${store.slug}/about` },
      { name: 'Contact', path: `/store/${store.slug}/contact` },
    ];
  };

  const navLinks = getNavLinks();

  const isLinkActive = (path) => {
    if (path === '/' || path === `/store/${store?.slug}`) {
      return location.pathname === path;
    }
    return location.pathname + location.search === path;
  };

  return (
    <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-stone-200/70 shadow-sm transition-all duration-200">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single Compact Top Row Header matching logo height */}
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          
          {/* Left Side: Brand Logo & Mobile Menu (Shifted to Left) */}
          <div className="flex items-center h-full space-x-1 sm:space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-brandText hover:text-primary hover:bg-cream transition focus:outline-none lg:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {isBoutiqueStore ? (
              <Link
                to={`/store/${store.slug}`}
                className="inline-flex items-center space-x-2.5 h-full group py-1"
                title={store.name}
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#681B2C] to-[#3a0a16] border border-gold/60 flex items-center justify-center text-gold shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                  <Store className="w-5 h-5 text-gold" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  {(() => {
                    const rawName = (store.name || '').trim();
                    const words = rawName.split(/\s+/);
                    if (words.length <= 1) {
                      return (
                        <span className="font-serif font-black text-sm sm:text-base lg:text-lg tracking-wider text-primary uppercase group-hover:text-primary-dark transition-colors leading-tight">
                          {rawName}
                        </span>
                      );
                    }
                    const line1 = words.length === 3 ? words[0] : words.slice(0, Math.ceil(words.length / 2)).join(' ');
                    const line2 = words.length === 3 ? `${words[1]} ${words[2]}` : words.slice(Math.ceil(words.length / 2)).join(' ');
                    return (
                      <>
                        <span className="font-serif font-black text-sm sm:text-base lg:text-lg tracking-wider text-primary uppercase group-hover:text-primary-dark transition-colors leading-tight">
                          {line1}
                        </span>
                        <span className="font-serif font-black text-xs sm:text-sm lg:text-base tracking-widest text-primary uppercase group-hover:text-primary-dark transition-colors leading-tight">
                          {line2}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </Link>
            ) : (
              <Link to="/" className="inline-flex items-center h-full group py-0.5" title="Subh Lagan Sarees">
                <img
                  src="/logo.png"
                  alt="Subh Lagan Sarees"
                  className="h-full max-h-12 sm:max-h-16 lg:max-h-20 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            )}
          </div>

          {/* Desktop Navigation Links (Bold, readable, clean Roboto typography) */}
          <nav className="hidden lg:flex items-center space-x-2.5 xl:space-x-4 2xl:space-x-6 text-[11px] xl:text-xs 2xl:text-[13px] font-bold uppercase tracking-wider text-stone-800 whitespace-nowrap">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`py-1.5 transition-colors duration-150 relative ${
                    active
                      ? 'text-primary font-black'
                      : 'hover:text-primary text-stone-700'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Icons: Search Icon, User Dropdown, Wishlist, Cart */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Search Icon (All screens) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-1.5 sm:p-2 rounded-full transition ${
                searchOpen
                  ? 'bg-primary text-white'
                  : 'text-stone-700 hover:text-primary hover:bg-cream'
              }`}
              title="Search Sarees"
              aria-label="Search"
            >
              {searchOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Search className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* User Account / Login Button */}
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-gold/70 bg-white hover:bg-gold/10 text-stone-900 hover:text-primary transition font-bold text-xs sm:text-sm shadow-xs cursor-pointer"
                title="Login with Mobile OTP"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-dark" />
                <span>Login</span>
              </button>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded-full hover:bg-cream text-stone-800 transition cursor-pointer border border-stone-200"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[11px]">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold max-w-[80px] truncate text-stone-800">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 text-xs select-none">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="font-bold text-stone-800 truncate">{user?.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono">{user?.phone || user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-cream font-medium text-stone-700"
                    >
                      My Profile & Orders
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 font-semibold cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Link (Hidden on mobile/tablet because MobileBottomNav already has it) */}
            <Link
              to="/wishlist"
              className="hidden lg:flex relative p-2 rounded-full hover:bg-cream text-stone-700 hover:text-primary transition items-center justify-center"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-gold text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Link (Hidden on mobile/tablet because MobileBottomNav already has it) */}
            <Link
              to="/cart"
              className="hidden lg:flex relative p-2 rounded-full bg-primary/5 hover:bg-primary/10 text-primary transition items-center justify-center"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-primary" />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Expandable Clean Search Bar (Appears when Search icon is clicked) */}
        {searchOpen && (
          <div className="py-3 border-t border-stone-100 animate-in fade-in slide-in-from-top-1 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Banarasi, Kanjivaram, Silk Sarees, Colors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-cream/70 border border-gold/40 rounded-full focus:outline-none focus:ring-1 focus:ring-gold focus:bg-white transition"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu with Backdrop Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-14 sm:top-16 z-50 lg:hidden">
          {/* Backdrop overlay (click outside to close) */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Drawer */}
          <div className="relative bg-white border-b border-stone-200 px-5 pt-3 pb-6 space-y-4 shadow-2xl max-h-[calc(100vh-56px)] sm:max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 text-xs font-bold rounded-lg transition ${
                      active
                        ? 'bg-primary text-white font-extrabold shadow-sm'
                        : 'text-stone-700 hover:text-primary hover:bg-cream'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-stone-100 pt-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-bold text-white bg-primary rounded-md flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-white" />
                      Admin Control Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-semibold text-stone-700 hover:text-primary hover:bg-cream rounded-md"
                  >
                    My Profile ({user?.name})
                  </Link>
                  <Link
                    to="/profile?tab=orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-semibold text-stone-700 hover:text-primary hover:bg-cream rounded-md"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-md"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-lg shadow-sm hover:from-amber-700 hover:to-amber-600 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <User className="w-4 h-4" />
                    <span>Login with Mobile OTP</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile OTP Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </header>
  );
};

export default Navbar;
