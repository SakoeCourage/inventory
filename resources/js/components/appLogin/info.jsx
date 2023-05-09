import React from 'react'
import pic from "../../assets/Untitledinventoryheroimage.png"
import logo from "../../assets/inventorylog.svg"
import Typed from 'typed.js';
const Info = () => {
    const el = React.useRef(null);

    React.useEffect(() => {
        const typed = new Typed(el.current, {
            strings: [
                "Welcome to Inventory Lite",
                "Login to continue...",
                "Easily Track Products  <svg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fillOpacity='0.7' stroke='#ffffff' fill='#ffffff' viewBox='0 0 448 512'><path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'/></svg>",
                "Record Products Sales <svg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fillOpacity='0.7' stroke='#ffffff' fill='#ffffff' viewBox='0 0 448 512'><path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'/></svg>"
                , "Product Sale Report <svg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fillOpacity='0.7' stroke='#ffffff' fill='#ffffff' viewBox='0 0 448 512'><path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'/></svg>",
                "Analytical Dashboard <svg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fillOpacity='0.7' stroke='#ffffff' fill='#ffffff' viewBox='0 0 448 512'><path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'/></svg>",
                "And More....."],
            typeSpeed: 50,
            loop: true,
            backDelay: 4000
        });

        return () => {
            typed.destroy();
        };
    }, []);
    return (
        <div className="w-full bg-cover hidden lg:block relative max-w-md lg:max-w-2xl lg:w-7/12 mx-2 px-2">
            <div className='bg-pink-100/40 mx-auto h-8 w-max rounded-md px-4 mb-8'>
                <span ref={el}
                    className='  text-white/70  w-max my-auto  text-center font-thin font-mono  tracking-2 uppercase text-2xl'>

                </span>

                <nav>

                </nav>
            </div>
            <div className="flex flex-col items-center justify-center w-full h-full relative  ">
                <img src={pic} className='ml-4 mt-5' />
                
            </div>
        </div>
    )
}

export default Info
