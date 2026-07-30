import React from 'react'
import { Outlet } from 'react-router-dom'
import ScrollToTop from './helper/ScrollTop'
import { Navbar } from './Components/navbar'

export default function MainLayout() {
  return (
    <div className='flex flex-col min-h-screen bg-[#071B24] text-white'>
      <main className='flex-grow'>
        {/* <Navbar/> */}
        <ScrollToTop />
        <Outlet/>
      </main>
      {/* <Footer/> */}
    </div>
  )
}