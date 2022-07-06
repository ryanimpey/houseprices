import React from 'react'

function Footer() {
  return (
    <footer className='w-full fixed bottom-0 z-10 p-2'>
        <p className='text-right'><small>&copy; copyright {new Date().getFullYear()} housedata.uk</small></p>
    </footer>
  )
}

export default Footer