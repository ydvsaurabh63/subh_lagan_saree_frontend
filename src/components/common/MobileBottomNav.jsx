import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sparkles, Heart, ShoppingBag, Shirt } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useTryOn } from '../../context/TryOnContext.jsx';

const MobileBottomNav = () => {
  const location = useLocation();
  const { totalQuantity } = useCart();
  const { wishlist } = useWishlist();
  const { openTryOn } = useTryOn();

  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
  const isShopActive = location.pathname.startsWith('/shop') || location.pathname.startsWith('/product');

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_25px_rgba(104,27,44,0.08)] pb-[env(safe-area-inset-bottom)] transition-all select-none"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-md mx-auto">
        {/* 1. Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors relative ${
              isActive && location.pathname === '/' ? 'text-primary font-bold' : 'text-stone-500 hover:text-primary font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home className={`w-5 h-5 transition-transform duration-200 ${isActive && location.pathname === '/' ? 'scale-110 text-primary' : ''}`} />
              <span className="text-[10px] tracking-tight mt-1">Home</span>
              {isActive && location.pathname === '/' && (
                <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </>
          )}
        </NavLink>

        {/* 2. Sarees / Shop */}
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors relative ${
              isActive || isShopActive ? 'text-primary font-bold' : 'text-stone-500 hover:text-primary font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Sparkles className={`w-5 h-5 transition-transform duration-200 ${isActive || isShopActive ? 'scale-110 text-primary' : ''}`} />
              <span className="text-[10px] tracking-tight mt-1">Sarees</span>
              {(isActive || isShopActive) && (
                <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </>
          )}
        </NavLink>

        {/* 3. Center Special: Virtual Trial */}
        <button
          type="button"
          onClick={openTryOn}
          className="flex flex-col items-center justify-center -mt-4 group focus:outline-none"
          title="Open AI 3D Virtual Fitting Room"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#681B2C] via-[#852338] to-[#C6A15B] p-[2px] shadow-[0_4px_16px_rgba(104,27,44,0.35)] group-hover:scale-105 group-active:scale-95 transition-all duration-200">
            <div className="w-full h-full rounded-full bg-[#681B2C] flex items-center justify-center text-gold">
              <Shirt className="w-5 h-5 text-[#FAF7F2] animate-pulse" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-primary tracking-tight mt-0.5">
            Virtual Trial
          </span>
        </button>

        {/* 4. Wishlist */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors relative ${
              isActive ? 'text-primary font-bold' : 'text-stone-500 hover:text-primary font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Heart className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-primary fill-primary/10' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">Wishlist</span>
              {isActive && (
                <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </>
          )}
        </NavLink>

        {/* 5. Bag / Cart */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors relative ${
              isActive ? 'text-primary font-bold' : 'text-stone-500 hover:text-primary font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <ShoppingBag className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-primary' : ''}`} />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-gold text-primary font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalQuantity > 9 ? '9+' : totalQuantity}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">Bag</span>
              {isActive && (
                <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileBottomNav;

