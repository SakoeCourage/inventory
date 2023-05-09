import React from 'react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
function Unauthorizedaccess() {
    const navigate = useNavigate()
    return (
        <div className='fixed  inset-0 z-50 h-screen w-screen flex items-center justify-center backdrop-blur-[5px] text-white transition-[backdrop] bg-black/60 backdropfiltertry'>
            <main class="relative ring-1 ring-red-400 max-w-md h-max p-5 rounded-md  w-full flex flex-col justify-center items-center border-inherit border ">
                <Icon fontSize={20} className=' absolute top-3 left-3 text-red-400 opacity-80 p-1 h-10 w-10 rounded-full border-inherit ring-inherit border' icon="mdi:user-lock-open" />
                <h1 class="text-9xl font-extrabold text-inherit tracking-widest">401</h1>
                <h5 className=' text-inherit opacity-80'>Unauthorized</h5>
                <h5 className=' text-inherit opacity-80 w-full text-center text-sm'>Looks like you don't have enough priviledges to view this content</h5>
                <button class="mt-5">
                    <a
                        class="relative ring-inherit inline-block text-sm font-medium text-inherit group active:text-orange-500 focus:outline-none focus:ring"
                    >
                        <span
                            class="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-inherit group-hover:translate-y-0 group-hover:translate-x-0"
                        ></span>

                        <span onClick={() => navigate(-1)} class="relative block px-8 py-3 bg-red-500 border border-current">
                            Go Back
                        </span>
                    </a>
                </button>
            </main>
        </div>
    )
}

export default Unauthorizedaccess