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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchInputRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { totalQuantity } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-close dropdowns and mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Sarees', path: '/shop' },
    { name: 'Banarasi', path: '/shop?category=banarasi-sarees' },
    { name: 'Kanjivaram', path: '/shop?category=kanjivaram-sarees' },
    { name: 'Bridal Couture', path: '/shop?isBridal=true' },
    { name: 'Pure Silk', path: '/shop?fabric=Pure+Katan+Silk' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isLinkActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/shop') return location.pathname === '/shop' && !location.search;
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

            <Link to="/" className="inline-flex items-center h-full group py-0.5" title="Subh Lagan Sarees">
              <img
                src="/logo.png"
                alt="Subh Lagan Sarees"
                className="h-full max-h-12 sm:max-h-16 lg:max-h-20 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
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

          {/* Right Icons: Search Icon, User Account, Wishlist, Cart */}
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

            {/* User Account Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 p-1.5 rounded-full hover:bg-cream text-brandText hover:text-primary transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center border border-primary/20">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:inline-block text-xs font-medium max-w-[80px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:inline-block" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      onMouseLeave={() => setUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-stone-100 py-2 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="font-semibold text-brandText truncate">{user?.name}</p>
                        <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                      </div>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 mx-2 my-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white transition rounded-lg text-xs font-bold shadow-xs"
                        >
                          <ShieldCheck className="w-4 h-4 text-gold" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-cream text-stone-700 hover:text-primary transition text-xs font-medium"
                      >
                        <UserCheck className="w-4 h-4 text-gold" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-cream text-stone-700 hover:text-primary transition text-xs font-medium"
                      >
                        <Package className="w-4 h-4 text-gold" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-cream text-stone-700 hover:text-primary transition text-xs font-medium"
                      >
                        <Heart className="w-4 h-4 text-gold" />
                        <span>My Wishlist</span>
                      </Link>
                      <div className="border-t border-stone-100 my-1"></div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-rose-50 text-rose-700 transition text-left text-xs font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 p-2 rounded-full hover:bg-cream text-stone-700 hover:text-primary transition"
                  title="Account Sign In"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden xl:inline-block text-xs font-medium">Sign In</span>
                </Link>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-cream text-stone-700 hover:text-primary transition"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-gold text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Link */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-primary/5 hover:bg-primary/10 text-primary transition"
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
                      className="block px-3 py-2 text-xs font-bold text-cream bg-primary rounded-md flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-gold" />
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
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-semibold uppercase tracking-wider text-primary border border-primary rounded-md hover:bg-cream"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-semibold uppercase tracking-wider text-white bg-primary rounded-md hover:bg-primary-light"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
