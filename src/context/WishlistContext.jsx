import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistApi } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';
import { useCart } from './CartContext.jsx';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const res = await wishlistApi.getWishlist();
          if (res.success) {
            setWishlist(res.wishlist || []);
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        } finally {
          setLoading(false);
        }
      } else {
        const saved = localStorage.getItem('sls_guest_wishlist');
        if (saved) {
          try {
            setWishlist(JSON.parse(saved));
          } catch (e) {
            setWishlist([]);
          }
        } else {
          setWishlist([]);
        }
      }
    };

    loadWishlist();
  }, [isAuthenticated, token]);

  const saveGuestWishlist = (newList) => {
    setWishlist(newList);
    localStorage.setItem('sls_guest_wishlist', JSON.stringify(newList));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product;

    if (isAuthenticated) {
      try {
        const res = await wishlistApi.toggleWishlist(productId);
        if (res.success) {
          setWishlist(res.wishlist);
          toast.success(res.message);
        }
      } catch (error) {
        toast.error(error.message || 'Could not update wishlist');
      }
    } else {
      // Guest
      const exists = isInWishlist(productId);
      let updated;
      if (exists) {
        updated = wishlist.filter((item) => (item._id || item) !== productId);
        toast.success('Removed from wishlist');
      } else {
        updated = [...wishlist, product];
        toast.success('Added to wishlist');
      }
      saveGuestWishlist(updated);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await wishlistApi.removeFromWishlist(productId);
        if (res.success) {
          setWishlist(res.wishlist);
          toast.success('Removed from wishlist');
        }
      } catch (error) {
        toast.error(error.message || 'Could not remove item');
      }
    } else {
      const updated = wishlist.filter((item) => (item._id || item) !== productId);
      saveGuestWishlist(updated);
      toast.success('Removed from wishlist');
    }
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id || product);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

