import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { totalQuantity } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

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
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brandText hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 ml-1 text-brandText hover:text-primary focus:outline-none"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center border-2 border-gold text-gold font-serif font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                SL
              </div>
              <div className="text-left">
                <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-primary leading-none group-hover:text-primary-light transition-colors">
                  SUBH LAGAN
                </span>
                <span className="block text-[10px] tracking-[0.25em] uppercase text-gold-dark font-medium leading-tight">
                  SAREES • HERITAGE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search Banarasi, Kanjivaram, Silk Sarees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-cream/70 border border-gold/30 rounded-full focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold placeholder-stone-400 transition"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400" />
            </form>
          </div>

          {/* Icons: Account, Wishlist, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User Account Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 p-2 rounded-full hover:bg-cream text-brandText hover:text-primary transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center border border-primary/20">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline-block text-xs font-medium max-w-[80px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
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
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 hover:bg-cream text-stone-700 hover:text-primary transition"
                      >
                        <UserCheck className="w-4 h-4 text-gold" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 hover:bg-cream text-stone-700 hover:text-primary transition"
                      >
                        <Package className="w-4 h-4 text-gold" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 hover:bg-cream text-stone-700 hover:text-primary transition"
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
                        className="w-full flex items-center space-x-2 px-4 py-2.5 hover:bg-rose-50 text-rose-700 transition text-left"
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
                  className="flex items-center space-x-1 p-2 rounded-full hover:bg-cream text-brandText hover:text-primary transition"
                  title="Account Login"
                >
                  <User className="w-5 h-5 text-stone-700 hover:text-primary" />
                  <span className="hidden md:inline-block text-xs font-medium">Sign In</span>
                </Link>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-cream text-brandText hover:text-primary transition"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5 text-stone-700 hover:text-primary transition" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
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
              <ShoppingBag className="w-5 h-5 text-primary" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Input */}
        {searchOpen && (
          <div className="lg:hidden pb-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search Sarees, Fabrics, Colors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-cream border border-gold/40 rounded-full focus:outline-none focus:ring-1 focus:ring-gold"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            </form>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 py-2 border-t border-stone-100 text-xs font-semibold uppercase tracking-widest">
          {navLinks.map((link) => {
            const isActive = location.pathname + location.search === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`py-1 transition-colors duration-150 relative ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-stone-700 hover:text-primary'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-primary hover:bg-cream rounded-md transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-stone-700 hover:text-primary hover:bg-cream rounded-md"
                >
                  My Profile ({user?.name})
                </Link>
                <Link
                  to="/profile?tab=orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-stone-700 hover:text-primary hover:bg-cream rounded-md"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 rounded-md"
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

