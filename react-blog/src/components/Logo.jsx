import React from 'react'
import blogLogo from '../assets/blogLogo.png'

function Logo({width="200px"}) {
  return (
    <div><img src={blogLogo} alt="blog logo" style={{width: width}} /></div>
  )
}

export default Logo