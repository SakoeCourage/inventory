import React from 'react'
import { Icon } from '@iconify/react'

export default function Emptyresults(props) {
  return (
    <div className={`h-full min-h-xl w-full  ${props.className}`}>
    <nav className="text-sm text-gray-500 w-full">
                <span className=" mx-auto h-16 w-16 p-4  rounded-full mb-4 flex items-center justify-center text-gray-400 bg-gray-200  ">
                <Icon icon="ph:magnifying-glass-duotone" />
                </span>
                <span className=" text-lg block text-center">{props.caption ?? 'No results found'}</span>
                <span className="mt-1 text-center test-sm  block">{props.content ?? 'Try adjusting your search or filter to find what you want'}</span>
                <nav className='flex items-center justify-center'>
                <button onClick={props.onClick} className=" text-sm block text-center mt-5 text-blue-500 underline">{props.inscription}</button>
                </nav>
    </nav>
</div>
  )
}
