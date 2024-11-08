import React, { useState, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/navbar'
import { SnackbarProvider, useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { useNavigate, Navigate } from "react-router-dom";
import Login from '../components/appLogin/login'
import { useSelector } from 'react-redux'
import { getAuth } from '../store/authSlice'
import { useSidebar } from '../providers/Sidebarserviceprovider'
import Sidebar from '../components/ui/Sidebar'

const Layout = (props) => {
  const auth = useSelector(getAuth)
  const [fullSideBar, setFullSideBar] = useState(false)
  const navigate = useNavigate();
  const outlet = document.querySelector('#outlet')


  const { sidebarStateOpen } = useSidebar()
  const { mini, full } = sidebarStateOpen

  useEffect(() => {
    if (outlet) {
      outlet.scrollTop = 0
    }
    setFullSideBar(false)

  }, [window.location.href])


  return (
    <SnackbarProvider maxSnack={1}>
      {auth.auth ?
        <div className='flex overflow-hidden'>
          {/* Sidebar starts here */}
          <Sidebar />
          {/* Main  section here */}
          <main className={`flex flex-col w-full grow transition-none ${mini ? 'md:w-[calc(100vw-var(--sidebar-mini-width))]' : 'md:w-[calc(100vw-var(--sidebar-width))]'}`}>
            {/* Main  section header */}
            <Navbar setFullSideBar={setFullSideBar} fullSideBar={fullSideBar} />
            <section id='outlet' className='h-[calc(100dvh-var(--header-height))] bg-lime-50/30  pb-4 overflow-y-scroll overflow-x-hidden '>
              <Outlet />
            </section>
          </main>
        </div>
        :
        <Navigate to='/' />
      }
    </SnackbarProvider>

  )
}

export default Layout
1