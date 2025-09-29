import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>

        <div className="descriptionbox-navigetor">
            <div className="descriptionbox-nav-box"> Description </div>
            <div className="descriptionbox-nav-box fade"> Reviews (122) </div>
        </div>
       <div className="descriptionbox-description">
        <p>An e-comerce website is an online platform that facilitate
            buying and selling product or sevices over the internet 
            serves as a virtual marketplace where businesses and indivtual 
            showcase their products, intract with customers, and conduct 
            transections without the need for a physical precense. E-Comerce
            websites have gained immense popularity due to their conveince  
            accessiblity and the global reach they offer. 
        </p>
       </div>
    </div>
  )
}

export default DescriptionBox
