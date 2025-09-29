import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = (products) => {
  let cart = {};
  if (products) {
    for (let product of products) {
      cart[product.id] = 0;
    }
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [allProduct, setAllProduct] = useState([]);
  const [cartItems, setItemCarts] = useState({});

  // Fetch products on mount
  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((res) => res.json())
      .then((data) => {
        setAllProduct(data);
        setItemCarts(getDefaultCart(data));
      });
  }, []);

  const addToCart = (itemId) => {
    setItemCarts((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    console.log(cartItems);
  };

  const removeFromCart = (itemId) => {
    setItemCarts((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = allProduct.find((p) => p.id === Number(item));
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItems = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItems += cartItems[item];
      }
    }
    return totalItems;
  };

  const ShopContextValue = {
    allProduct, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems
  };

  return (
    <ShopContext.Provider value={ShopContextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;