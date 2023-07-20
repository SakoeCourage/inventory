import React from "react"
import { Icon } from "@iconify/react"
function Optioncard({ className, caption,onClick,reportOption,disabled = false }) {
    return <div  onClick={()=> !disabled && onClick(reportOption)} className={`border rounded-lg p-5  shadow-sm flex flex-col items-center cursor-pointer ${className} ${disabled && ' !pointer-events-none !cursor-not-allowed bg-gray-400 '}`}>
      <nav className='  px-2 py-1 rounded-lg font-medium text-info-700 bg-inherit/50 '>
        {caption}
      </nav>
      <button className='  my-4 aspect-square h-16 rounded-full bg-white text-gray-600 grid place-items-center'>
        <Icon fontSize={25} icon="material-symbols:arrow-right-alt-rounded" />
      </button>
    </div>
  }

  export default Optioncard
  