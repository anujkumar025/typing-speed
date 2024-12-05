import React from 'react';
import './Header.css';
import image from './images-uBW4nlvoEh-transformed-removebg-preview.png'

function Header() {
  return (
    <div className='Header-main'>
        <div className='Header-title-container'>
            {/* <div className='Header-title'>Type Sprint</div> */}
            <img id='logo_dtu' src={image} alt='DTU'/>
            <div>Type Sprint</div>
        </div>
    </div>
  )
}

export default Header;