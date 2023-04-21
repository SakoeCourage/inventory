import React from 'react'
import { Icon } from '@iconify/react'
const CloseButton = ({onClick}) => {
  return (
    <button onClick={onClick} type="button" className="rounded-full w-9 h-9 text-gray-500 hover:bg-red-100 hover:text-red-600" >
        <Icon icon="material-symbols:close-rounded" sx={{ fontSize: 27 }}/> 
    </button>
  )
}

export default CloseButton
