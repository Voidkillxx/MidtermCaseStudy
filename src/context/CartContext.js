import React, { createContext, useState, useEffect } from 'react';
import { calculateSellingPrice } from '../utils/PricingUtils'; 

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Start with empty cart (no localStorage on init)
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // Track current user

  // Load cart from localStorage only when user logs in
  useEffect(() => {
    if (currentUserId) {
      try {
        const localData = localStorage.getItem(`cartItems_${currentUserId}`);
        if (localData) {
          setCartItems(JSON.parse(localData));
        }
      } catch (error) {
        console.error("Could not parse cart items from local storage", error);
      }
    } else {
      // No user logged in, clear cart
      setCartItems([]);
      setSelectedItems([]);
    }
  }, [currentUserId]);

  // Save cart to localStorage only if user is logged in
  useEffect(() => {
    if (currentUserId && cartItems.length >= 0) {
      localStorage.setItem(`cartItems_${currentUserId}`, JSON.stringify(cartItems));
    }
    setSelectedItems(prevSelected =>
      prevSelected.filter(id => cartItems.some(item => item.id === id))
    );
  }, [cartItems, currentUserId]);

  const toggleSelectItem = (itemId) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(itemId)
        ? prevSelected.filter(id => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  const selectedSubtotal = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((total, item) => {
      const validQuantity = parseInt(item.quantity) || 0;
      const sellingPrice = calculateSellingPrice(item.price, item.discount); 
      return total + (validQuantity * sellingPrice);
    }, 0);

  const addToCart = (productToAdd, quantity = 1) => {
    if (!productToAdd || quantity < 1) return;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...productToAdd, quantity: quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    setSelectedItems(prevSelected => prevSelected.filter(id => id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems
        .map(item => {
          if (item.id === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItems([]);
    // Also clear from localStorage
    if (currentUserId) {
      localStorage.removeItem(`cartItems_${currentUserId}`);
    }
  };

  const removeSelectedItems = () => {
    setCartItems(prevItems => prevItems.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  // Function to set current user (call this from App.js on login)
  const setUser = (userId) => {
    setCurrentUserId(userId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedItems,
        selectedSubtotal,
        toggleSelectItem,
        toggleSelectAll,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        removeSelectedItems,
        setUser 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};