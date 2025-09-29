import React from 'react'
import './ListProduct.css'
import { useState } from 'react'
import { useEffect } from 'react';
import cross_icon from '../../assets/cross_icon.png'

const ListProduct = () => {

    const [allProducts, setAllProducts] = useState([]) ;
    
    const fetchInfo = async () => {
        await fetch('https://e-commerece-site-b39f.onrender.com/allProducts')
        .then((res)=>res.json())
        .then((data)=>{setAllProducts(data)}) ;
    }

    useEffect(()=>{
        fetchInfo();
    },[])

    const remove_product = async  (id) => {
       await fetch('https://e-commerece-site-b39f.onrender.com/removeproduct', {
                  method:'POST', 
                  
           headers: {
             Accept: 'application/json',
               'Content-Type': 'application/json',
},
                  body:JSON.stringify({id:id})
       })
       fetchInfo();
    }

  return (
    <div className='list-product'>
         <h1>All Products List</h1>
   
   <div className="listproduct-format-main">

    <p>Product</p>
    <p>Title</p>
    <p>Old_Price</p>
    <p>New_Price</p>
    <p>Category</p>
    <p>Remove</p>
   </div>

   <div className="listproduct-allproduct">
 <hr />
 {allProducts.map((product,index)=>{
    return <> <div  key={product.index} className="listproduct-format-main  listproduct-format">
         <img src={product.image} className='listproduct-product-icon'  alt={product.name} />
       <p> {product.name} </p>
       <p>${product.old_price} </p>
       <p>${product.new_price} </p>
       <p>{product.category}</p>
       <img src={cross_icon} onClick={() => remove_product(product.id)} className='listproduct-remove-icon' alt="" />
    </div>
    <hr/>
    </>
 })}
   </div>

    </div>
  )
}

export default ListProduct
