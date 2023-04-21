import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/layout/sideBar'
import Navbar from '../components/layout/navbar'

const Layout = () => {
  const [fullSideBar, setFullSideBar] = useState(false)
  return (
    <div className='h-screen w-screen overflow-hidden bg-gray-200'>
      <div className='h-14 bg-info-600'>
        <Navbar setFullSideBar={setFullSideBar} />
      </div>
      <div className='flex h-full'>
        <div className=''>
          <SideBar fullSideBar={fullSideBar} />
        </div>
        <div className='w-full min-h-max overflow-y-scroll p-6 pb-20'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
