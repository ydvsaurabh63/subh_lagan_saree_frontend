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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all shadow-sm">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single Compact Top Row Header */}
        <div className="flex items-center justify-between h-16 lg:h-18">
          
          {/* Mobile Menu & Search Icon (Small screens) */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-brandText hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 ml-1 text-brandText hover:text-primary focus:outline-none"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo (Left) */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-gold text-gold font-serif font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                SL
              </div>
              <div className="text-left">
                <span className="block font-serif text-lg sm:text-xl font-bold tracking-tight text-primary leading-none group-hover:text-primary-light transition-colors">
                  SUBH LAGAN
                </span>
                <span className="block text-[9px] tracking-[0.25em] uppercase text-gold-dark font-medium leading-tight">
                  SAREES • HERITAGE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links (Shifted UP into Main Header Row) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[11px] font-bold uppercase tracking-widest text-stone-700">
            {navLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`py-1 transition-colors duration-150 relative ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'hover:text-primary'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Icons: Search Icon (Small), User Account, Wishlist, Cart */}
          <div className="flex items-center space-x-1 sm:space-x-2.5">
            {/* Desktop Small Search Icon (Toggles sleek search bar) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full transition ${
                searchOpen
                  ? 'bg-primary text-white'
                  : 'text-stone-700 hover:text-primary hover:bg-cream'
              }`}
              title="Search Sarees"
              aria-label="Search"
            >
              {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1.5 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-stone-700 hover:text-primary hover:bg-cream rounded-md transition"
              >
                {link.name}
              </Link>
            ))}
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
      )}
    </header>
  );
};

export default Navbar;
