import React from 'react'
import Login from '../components/appLogin/login'
import Info from '../components/appLogin/info'

const AppLogin = () => {
  return (
    <div className='h-screen w-screen'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 h-full'>
        <div className='bg-gray-100/70 lg:col-span-2'>
          <div className='h-full'>
            <Login />
          </div>
        </div>
        <div className='hidden  md:grid bg-white lg:col-span-3'>
          <div className='h-full '>
            <Info />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppLogin
