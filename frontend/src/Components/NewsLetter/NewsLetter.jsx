import React from 'react'
import './NewsLetter.css'


const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1> Get Exclusive Offers On Your Mail </h1>
        <p> Subscribe to our newsletter and stay update </p>
        <div>
            <input type="email" placeholder='Enter Your Email Id' />
            <button> Subscribe </button>
        </div>
      
    </div>
  )
}

export default NewsLetter
