import React from 'react'
import { Icon } from '@iconify/react'
function Unauthorizedaccess() {
    return (
        <div className=' h-[calc(100vh-4rem)] flex items-center justify-center'>
            <nav className='flex flex-col gap-2 items-center border-2  border-white p-4 py-5 rounded-md'>
                <Icon className='text-red-500/90 h-8 w-8 rounded-full  cursor-pointer transition-all ' fontSize={15} icon="solar:danger-triangle-bold" />
                <nav className='bg-red-50 text-red-400 p-2' >Unathorized Access</nav>
                <nav className=' text-gray-500 text-sm '>Looks like you don't have enough priviledges to view this content</nav>
                {/* <nav>Contact Administrator</nav> */}
            </nav>
        </div>
    )
}

export default Unauthorizedaccess