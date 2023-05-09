import React from 'react'
import { motion } from 'framer-motion'

function Dasboardloader({isLoading}) {
    return (
        <div
            className={`bg-white absolute inset-0 h-[calc(100vh-var(--navbar-height))] w-full z-10   ${!isLoading && 'transition-transform duration-500  translate-y-[-100vh]'} ` }>
          <div>
          <div className=" dashboardloader">
            </div>
            {/* <div className="absolute top-[60%] flex justify-center w-full ">
                <nav className=' w-max bg-info-100/40 p-1 rounded-md  '>Dashboard is setting up..</nav>
            </div> */}
          </div>
        </div>
    )
}

export default Dasboardloader