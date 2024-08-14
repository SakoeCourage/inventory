import React, { useState, useRef, useEffect } from 'react'
import IconifyIcon from './IconifyIcon';


/**
 * 
 * @param {{
 *   title?: string;
 *   children: React.children;
 *   className: string;
 *   }}  
 * @returns 
 */
function Inscription({ title = "title", children, className }) {
    const contentRef = useRef()
    const [isFullHieight, setIsFullHeight] = useState(false);


    const toggleScrollHeight = () => {
        const contentScrollHeight = contentRef.current.scrollHeight
        const height = contentRef.current.getBoundingClientRect().height
        const h = Number(height) == 0 ? Number(contentScrollHeight) : 0;
        Number(height) == 0 ? setIsFullHeight(true) : setIsFullHeight(false);
        contentRef.current.style.height = `${h}px`
    }


    return <div onClick={() => toggleScrollHeight()} className={`w-full select-none rounded-lg cursor-pointer overflow-hidden ${isFullHieight ? 'bg-red-500 text-white' : 'bg-red-100 text-red-400'} ${className}`}>
        <nav className=' flex items-center rounded-lg gap-3 px-3 py-2'>
            <span className=' font-semibold text-sm capitalize flex items-center gap-1'>
                <IconifyIcon icon="fluent:question-circle-12-filled" className="!p-0 !h-6 !w-6" /> {title}
            </span>
            <nav className=" text-xs my-auto ml-auto self-end flex items-center gap-2">
                <span>{`${isFullHieight ? 'Read Less' : 'Read More'}`}</span>
                <IconifyIcon icon="octicon:chevron-down-24" size='md' className={` transition !p-0 !h-6 !w-6 transform ${isFullHieight && ' rotate-180'}`} />
            </nav>
        </nav>
        <div ref={contentRef} className='text-xs h-0  transition-all duration-200  px-5' style={{ transitionTimingFunction: 'cubic-bezier(0.15, 0.51, 0, 1.09)' }} >
            {children}
        </div >
    </div>
}

export default Inscription