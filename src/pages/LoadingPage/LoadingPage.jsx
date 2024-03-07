import React from 'react'
import loadingGif from "../../Assets/loading.gif"
import logo from "../../Assets/Zoomed_Logo.png"
import "./LoadingPage.css"

function LoadingPage() {
    return (
        <div className='loading-container'>
            <div className='loading-logo'><img src={logo} alt="logo" /></div>
            
            <img src={loadingGif} alt="Loading" />
        </div>
    )
}

export default LoadingPage