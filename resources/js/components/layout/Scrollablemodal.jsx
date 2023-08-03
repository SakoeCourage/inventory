import React from 'react'
import { motion } from 'framer-motion';
import Addmotion from '../Addmotion';
export default function Scrollablemodal(props) {
    return (<motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        id="modal" className="fixed bg-black/20  overflow-y-scroll isolate backdrop-blur-[1px] flex items-center justify-center z-[60]   inset-0 min-h-screen ">
        <Addmotion
            className="md:relative my-auto   static inset-0 w-max z-[60]  md:inset-auto md:min-h-max  md:mx-auto ">
            <div className=" min-w-max h-screen  relative flex items-center md:!py-5  rounded-lg  ">
                <div className={`min-w-max bg-white mx-auto rounded-md shadow-md min-h-max my-auto ${props.className}`}>
                    <div className='flex items-center justify-between sticky top-0 w-full bg-white z-50 rounded-t-lg px-5'>
                        <button onClick={(e) => { e.preventDefault(); props.closeModal() }} type="button" className="order-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  " >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="px-6 py-4 border-b rounded-t order-1 ">
                            {props.title && <h3 className="text-lg font-semibold text-gray-800 uppercase lg:text-lg ">
                                {props.title ?? 'title'}
                            </h3>}
                        </div>
                    </div>
                    <div className=''>
                        {props.children}
                    </div>
                </div>

            </div>

        </Addmotion>
    </motion.div>
    )
}

