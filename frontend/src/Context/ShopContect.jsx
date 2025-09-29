


import React, { createContext, useState, useEffect } from "react";
import all_product_assets from "../Components/Assets/all_product";


export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  // Initial state with assets products
  const [all_product, setAll_Product] = useState(all_product_assets);

  // Cart items state
  const [cartItems, setCartItems] = useState({});

  // Fetch admin added products and merge with assets
  useEffect(() => {
    fetch("https://e-commerece-site-b39f.onrender.com/allproducts")
      .then((res) => res.json())
      .then((adminProducts) => {
        setAll_Product([...all_product_assets, ...adminProducts]);
      })
      .catch((err) => console.log("Fetch Error:", err));
  }, []);

  // Add to cart
  const addToCart = (itemId) => {
   setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
   if(localStorage.getItem('auth-token')){
       fetch('https://e-commerece-site-b39f.onrender.com/addtocart', {
            method:'POST' ,
            headers:{
              Accept: 'application/form-data' ,
              'auth-token': `${localStorage.getItem('auth-token')}` ,
              'Content-Type' : `application/json` ,
            }, 
            body:JSON.stringify({itemId:itemId})
       })
       .then((response)=>response.json())
       .then((data)=>console.log(data))
   }

  };

  // Remove from cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] > 0 ? prev[itemId] - 1 : 0,}));
      if(localStorage.getItem('auth-token')){
       fetch('https://e-commerece-site-b39f.onrender.com/removefromcart', {
            method:'POST' ,
            headers:{
              Accept: 'application/form-data' ,
              'auth-token': `${localStorage.getItem('auth-token')}` ,
              'Content-Type' : `application/json` ,
            }, 
            body:JSON.stringify({itemId:itemId})
       })
       .then((response)=>response.json())
       .then((data)=>console.log(data))
   }
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item]>0) {
        let itemInfo = all_product.find((product) =>product.id===Number(item))
        totalAmount += itemInfo.new_price * cartItems[item]; 
      }
    
    }
    return totalAmount;
  };

  // Get total items in cart
  const getTotalCartItems = () =>{
  let totalItems = 0 ;
  for(const item in cartItems){
    if(cartItems[item] > 0){
      totalItems+= cartItems[item]
    }
  } 
  return totalItems ;
  }

  // Context value
  const contextValue = {
    all_product,
 
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;













