import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContect';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProduct from '../Components/RelatedProducts/RelatedProducts';


const Product = () => {
  const {all_product} = useContext(ShopContext)
  const { productId } = useParams();   // 👈 yaha id hi likhna hoga

   const product = all_product.find((e) => e.id === Number(productId));
  return (
    <div>
     <Breadcrum product={product}/>
     <ProductDisplay product={product} />
     <DescriptionBox />
     <RelatedProduct />
    </div>
  )
}

export default Product 
