import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Icon } from '@iconify/react'
import Loadingspinner from '../loaders/Loadingspinner'


export default function Customsearchinput(props) {
  const [currentValue, setCurrentValue] = useState(props.value ?? '')
  let handleonchange = (onchangeValue) => {
    setCurrentValue(onchangeValue)
    props.getValue(onchangeValue)
  }
  return (
    <div className={`w-full space-y-1`}>
      <nav className=" relative border flex items-center  border-gray-200 focus-within:border-none rounded leading-6 w-full min-w-max ring-offset-1 focus-within:ring-2 transition-all ease-out duration-150" >
        <input value={currentValue} onChange={(e) => handleonchange(e.target.value)} readOnly={props.disabled} min='0' className={`px-5 py-3 text-sm min-w-max  grow  border-none focus:border-none focus:outline-none `} placeholder={props.placeholder ?? `enter ${props.label ?? ''}`} />
        {props.processing ? <Loadingspinner /> :
          <button onClick={()=>props.searchFor(currentValue)} disabled={!currentValue} className='grid place-items-center py-3 px-2 bg-blue-800 text-white transition-all rounded-md shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-blue-800'>
            Search
          </button>
        }
      </nav>
    </div>
  )
}
