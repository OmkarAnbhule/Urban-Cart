import React from 'react'

export default function Footer() {
  return (
    <div className='footer'>
        <div className='footer-links'>
        <div>
          <h3>Customer Service</h3>
          <p>Contact Us</p>
          <p>FAQ</p>
          <p>Returns & Exchange</p>
          <p>Shipping Information</p>
        </div>
        <div>
          <h3>Sponsors</h3>
          <p>Company Name</p>
          <p>Company Name</p>
          <p>Company Name</p>
          <p>Company Name</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <p>Home</p>
          <p>Favorites</p>
          <p>My Account</p>
          <p>Order Tracking</p>
        </div>
        <div>
          <h3>Follow us</h3>
          <p>Facebook</p>
          <p>Twitter</p>
          <p>Instagram</p>
          <p>Linked In</p>
        </div>
        </div>
        <div className='divider'></div>
        <div className='contact'>
            <h2>Contact Us</h2>
            <div>
                <i className='bi bi-facebook'></i>
                <i className='bi bi-github'><a href='https://github.com/OmkarAnbhule/Urban-Cart.git'></a></i>
                <i className='bi bi-linkedin'></i>
                <i className='bi bi-instagram'></i>
            </div>
            <div>
                <p><i className='bi bi-c-circle'></i> 2021-2024, Urbancart.com, Inc. or its affiliates</p>
            </div>
        </div>
      </div>
  )
}
