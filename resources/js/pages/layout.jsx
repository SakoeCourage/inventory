import React, { useState, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/layout/sideBar'
import Navbar from '../components/layout/navbar'
import { SnackbarProvider, useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { useNavigate, Navigate } from "react-router-dom";
import Login from '../components/appLogin/login'
import { useSelector } from 'react-redux'
import { getAuth } from '../store/authSlice'


const Layout = (props) => {
  const auth = useSelector(getAuth)
  const [fullSideBar, setFullSideBar] = useState(false)
  const navigate = useNavigate();
  const outlet = document.querySelector('#outlet')


  useEffect(() => {
    if (outlet) {
      outlet.scrollTop = 0
    }

  }, [window.location.href])


  

  return (
    <SnackbarProvider maxSnack={1}>
      {auth.auth ? 
      <div className='h-screen w-screen overflow-hidden bg-gray-200/80'>
        <div className='flex h-full'>
          <div className=''>
            <SideBar fullSideBar={fullSideBar} setFullSideBar={setFullSideBar} />
          </div>
          <div className='w-full min-h-screen overflow-hidden'>
            <div className=' h-[var(--navbar-height)] bg-info-600'>
              <Navbar setFullSideBar={setFullSideBar} fullSideBar={fullSideBar} />
            </div>
            <div ref={outlet} id='outlet' className='w-full min-h-max h-full overflow-y-scroll pb-20  '>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      :
      <Navigate to='/'/>
      }
    </SnackbarProvider>

  )
}

export default Layout
1