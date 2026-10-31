import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Helper to calculate totals
  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  // Load cart data
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          // If guest cart exists in localStorage, sync it first!
          const guestCartJson = localStorage.getItem('sls_guest_cart');
          if (guestCartJson) {
            try {
              const guestItems = JSON.parse(guestCartJson).map((item) => ({
                productId: item.product?._id || item.product,
                quantity: item.quantity,
              }));
              if (guestItems.length > 0) {
                await cartApi.syncGuestCart(guestItems);
              }
              localStorage.removeItem('sls_guest_cart');
            } catch (err) {
              console.error('Failed to sync guest cart:', err);
            }
          }

          const res = await cartApi.getCart();
          if (res.success && res.cart) {
            setItems(res.cart.items || []);
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Load guest cart from local storage
        const saved = localStorage.getItem('sls_guest_cart');
        if (saved) {
          try {
            setItems(JSON.parse(saved));
          } catch (e) {
            setItems([]);
          }
        } else {
          setItems([]);
        }
      }
    };

    loadCart();
  }, [isAuthenticated, token]);

  // Sync state to local storage if guest
  const saveGuestCart = (newItems) => {
    setItems(newItems);
    localStorage.setItem('sls_guest_cart', JSON.stringify(newItems));
  };

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10));

    if (isAuthenticated) {
      try {
        const res = await cartApi.addToCart(product._id, qty);
        if (res.success) {
          setItems(res.cart.items);
          toast.success(`"${product.name}" added to cart!`);
        }
      } catch (error) {
        toast.error(error.message || 'Could not add to cart');
      }
    } else {
      // Guest cart
      const existingIndex = items.findIndex(
        (it) => (it.product?._id || it.product) === product._id
      );

      let newItems = [...items];
      if (existingIndex > -1) {
        newItems[existingIndex].quantity += qty;
      } else {
        newItems.push({
          product,
          quantity: qty,
        });
      }
      saveGuestCart(newItems);
      toast.success(`"${product.name}" added to cart!`);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
      return removeFromCart(productId);
    }

    if (isAuthenticated) {
      try {
        const res = await cartApi.updateQuantity(productId, qty);
        if (res.success) {
          setItems(res.cart.items);
        }
      } catch (error) {
        toast.error(error.message || 'Could not update quantity');
      }
    } else {
      const newItems = items.map((item) => {
        const id = item.product?._id || item.product;
        if (id === productId) {
          return { ...item, quantity: qty };
        }
        return item;
      });
      saveGuestCart(newItems);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await cartApi.removeFromCart(productId);
        if (res.success) {
          setItems(res.cart.items);
          toast.success('Item removed from cart');
        }
      } catch (error) {
        toast.error(error.message || 'Could not remove item');
      }
    } else {
      const newItems = items.filter(
        (item) => (item.product?._id || item.product) !== productId
      );
      saveGuestCart(newItems);
      toast.success('Item removed from cart');
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartApi.clearCart();
        setItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      localStorage.removeItem('sls_guest_cart');
      setItems([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        totalQuantity,
        loading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

