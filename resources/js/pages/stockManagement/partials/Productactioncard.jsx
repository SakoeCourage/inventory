import React from 'react'
import { Icon } from '@iconify/react'
import Button from '../../../components/inputs/Button'
function Productactioncard({setShowStockingModal}) {
  return (
    <div className='min-h-full h-full  w-full p-5 my-auto flex flex-col justify-center gap-3 bg-sky-300/20 text-sky-900 relative rounded-md border border-gray-400/70'>
      <Icon icon="product" fontSize={30}  className=' text-gray-300 absolute'/>
      <dl className='flex items-center gap-4  border-gray-100 py-1 border-dashed '>
         <dt className='font-semibold'>Adjust Current Stock </dt>
      </dl>
      <div className='flex flex-col gap-2'>
        <Button onClick={()=>setShowStockingModal({option: 'add'})} primary text="Increase Stock By Quantity "/>
        <Button onClick={()=>setShowStockingModal({option: 'remove'})} alert text="Reduce Stock By Quantity"/>
      </div>

    </div>
  )
}

export default Productactioncard