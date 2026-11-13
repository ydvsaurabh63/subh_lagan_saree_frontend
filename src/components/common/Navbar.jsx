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
  ChevronRight,
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
import { triggerGoogleAuth } from '../../utils/googleAuth.js';
import toast from 'react-hot-toast';
import LoginModal from './LoginModal.jsx';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);

  const { user, isAuthenticated, logout, loginWithGoogle } = useAuth();
  const { totalQuantity } = useCart();
  const { wishlist } = useWishlist();
  const { store, isBoutiqueStore, isJewelleryStore, isHairStore, isSareeStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleSignIn = async () => {
    try {
      setUserMenuOpen(false);
      toast.loading('Opening Google Sign-In...', { id: 'nav-google-login' });
      const authResult = await triggerGoogleAuth();
      toast.loading('Signing in...', { id: 'nav-google-login' });
      const res = await loginWithGoogle(authResult);
      if (res?.success) {
        toast.success(`Welcome, ${res.user?.name || 'Customer'}! ✨`, { id: 'nav-google-login' });
      } else {
        toast.error(res?.message || 'Google Sign-In failed', { id: 'nav-google-login' });
      }
    } catch (err) {
      if (err.message && (err.message.includes('closed') || err.message.includes('popup_closed'))) {
        toast.dismiss('nav-google-login');
      } else {
        toast.error(err.message || 'Could not complete Google Sign-In', { id: 'nav-google-login' });
      }
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'SL';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Auto-close dropdowns and mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  // Click outside listener for user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
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

            {/* ========================================================= */}
            {/* USER / PROFILE ACCOUNT DROPDOWN (Luxury Dark Card)       */}
            {/* ========================================================= */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className={`p-1.5 sm:p-2 rounded-full transition cursor-pointer relative ${
                  userMenuOpen
                    ? 'bg-primary text-white'
                    : 'text-stone-700 hover:text-primary hover:bg-cream'
                }`}
                title={isAuthenticated ? `Account (${user?.name})` : "Account & Login"}
                aria-label="User Account"
                aria-expanded={userMenuOpen}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                {isAuthenticated && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                )}
              </button>

              {/* Luxury Customer Account Dropdown Card */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2.5 z-50 w-72 sm:w-80 bg-gradient-to-b from-[#141C18] to-[#0A0F0D] border border-gold/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-4 text-white animate-in fade-in slide-in-from-top-2 duration-150 select-none overflow-hidden ring-1 ring-gold/15">
                  
                  {/* Golden Top Accent Line */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full" />

                  {/* ========================================= */}
                  {/* UNAUTHENTICATED STATE                     */}
                  {/* ========================================= */}
                  {!isAuthenticated ? (
                    <div className="pb-3 border-b border-white/10 space-y-2.5">
                      <div className="text-center pb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] block">
                          Subh Lagan Sarees
                        </span>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Access your royal saree orders & wishlist
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setLoginModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 text-center text-xs font-bold uppercase tracking-[0.15em] text-stone-950 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:brightness-105 rounded-xl transition-all shadow-md cursor-pointer active:scale-98"
                      >
                        Sign In
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full py-2 px-3 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 border border-stone-200"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </button>
                    </div>
                  ) : (
                    /* ========================================= */
                    /* AUTHENTICATED STATE: LUXURY USER HEADER   */
                    /* ========================================= */
                    <div className="p-3 bg-white/[0.04] rounded-xl border border-white/10 mb-2 flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {user?.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-gold/60 shadow-md"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] text-stone-950 font-bold font-serif text-sm flex items-center justify-center ring-2 ring-gold/40 shadow-md">
                            {getUserInitials(user?.name)}
                          </div>
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#141C18]" />
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#D4AF37] bg-gold/10 px-1.5 py-0.5 rounded-sm">
                            {user?.role === 'superadmin'
                              ? 'SuperAdmin'
                              : user?.role === 'admin'
                              ? 'Admin'
                              : user?.role === 'client'
                              ? 'Store Partner'
                              : 'Customer'}
                          </span>
                        </div>
                        <p className="font-serif text-sm font-bold text-white truncate mt-0.5 capitalize">
                          {user?.name || 'Customer'}
                        </p>
                        <p className="text-[11px] text-stone-400 font-mono truncate">
                          {user?.phone ? `+91 ${user.phone}` : user?.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ========================================= */}
                  {/* MENU LINKS LIST                           */}
                  {/* ========================================= */}
                  <div className="space-y-1 pt-1 text-sm font-sans">
                    {/* Staff Portal Shortcuts */}
                    {user?.role === 'superadmin' && (
                      <Link
                        to="/superadmin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-purple-200 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-all group"
                      >
                        <span className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                          <span>SuperAdmin Portal</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-purple-400/60 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}

                    {['admin', 'superadmin'].includes(user?.role) && (
                      <Link
                        to="/admin-portal"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-amber-200 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/20 transition-all group"
                      >
                        <span className="flex items-center gap-2.5">
                          <Store className="w-4 h-4 text-amber-400" />
                          <span>Admin Portal</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400/60 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}

                    {user?.role === 'client' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-amber-200 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/20 transition-all group"
                      >
                        <span className="flex items-center gap-2.5">
                          <Store className="w-4 h-4 text-amber-400" />
                          <span>Store Dashboard</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400/60 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}

                    {/* Standard User Links */}
                    <Link
                      to={isAuthenticated ? "/profile" : "/login"}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] text-stone-200 hover:text-white hover:bg-white/[0.06] transition-all group"
                    >
                      <span className="flex items-center gap-2.5 font-medium">
                        <User className="w-4 h-4 text-[#D4AF37]/80 group-hover:text-[#D4AF37] transition-colors" />
                        <span>My Account</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    <Link
                      to={isAuthenticated ? "/profile?tab=orders" : "/login"}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] text-stone-200 hover:text-white hover:bg-white/[0.06] transition-all group"
                    >
                      <span className="flex items-center gap-2.5 font-medium">
                        <Package className="w-4 h-4 text-[#D4AF37]/80 group-hover:text-[#D4AF37] transition-colors" />
                        <span>Orders</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] text-stone-200 hover:text-white hover:bg-white/[0.06] transition-all group"
                    >
                      <span className="flex items-center gap-2.5 font-medium">
                        <Heart className="w-4 h-4 text-[#D4AF37]/80 group-hover:text-[#D4AF37] transition-colors" />
                        <span>Wishlist</span>
                      </span>
                      {wishlist.length > 0 ? (
                        <span className="text-[10px] bg-gold/20 text-[#D4AF37] border border-gold/40 font-bold px-2 py-0.5 rounded-full">
                          {wishlist.length}
                        </span>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-400 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </Link>

                    <Link
                      to="/cart"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] text-stone-200 hover:text-white hover:bg-white/[0.06] transition-all group"
                    >
                      <span className="flex items-center gap-2.5 font-medium">
                        <ShoppingBag className="w-4 h-4 text-[#D4AF37]/80 group-hover:text-[#D4AF37] transition-colors" />
                        <span>Cart</span>
                      </span>
                      {totalQuantity > 0 ? (
                        <span className="text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded-full shadow-xs">
                          {totalQuantity}
                        </span>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-400 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </Link>
                  </div>

                  {/* ========================================= */}
                  {/* LOGOUT BUTTON (MODERN REFINED STYLING)   */}
                  {/* ========================================= */}
                  {isAuthenticated && (
                    <div className="pt-2.5 mt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

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
