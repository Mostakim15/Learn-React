import React from 'react'

function Container({children}) {
return (
    <div className='mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10'>{children}</div>
  )
}

export default Container