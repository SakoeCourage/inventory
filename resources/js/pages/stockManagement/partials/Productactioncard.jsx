import React from 'react'
import { Icon } from '@iconify/react'
import Button from '../../../components/inputs/Button'
import IconifyIcon from '../../../components/ui/IconifyIcon'
function Productactioncard({ setShowStockingModal, stockData,onEditProductData }) {

  return (
    <div className='min-h-full h-full  w-full p-5 my-auto flex flex-col justify-center gap-3 bg-sky-300/20 text-sky-900 relative rounded-md border border-gray-400/70'>
      {stockData && <>
        {stockData?.availability == true ?
          <>    <Icon icon="product" fontSize={30} className=' text-gray-300 absolute' />
            <dl className='flex items-center gap-4  border-gray-100 py-1 border-dashed '>
              <dt className='font-semibold'>Inventory Actions </dt>
            </dl>
            <div className='flex flex-col gap-2'>
              <Button onClick={() => setShowStockingModal({ option: 'add' })} primary text="Increase Stock By Quantity " />
              <Button onClick={() => setShowStockingModal({ option: 'remove' })} alert text="Reduce Stock By Quantity" />
              <Button onClick={() => onEditProductData()} danger text="Change Product Details / Pricing" />
            </div></>
          : <div className='flex flex-col items-center gap-5  w-full'>
            <IconifyIcon className="!bg-red-500 !p-2 !h-12 !w-12 text-white" fontSize='2.25rem' icon="iconoir:shopping-bag-warning" />
            <nav className='text-sm font-semibold text-orange-800'>
              Cannot find this product in current store
            </nav>
          </div>
        }
      </>}
    </div>
  )
}

export default Productactioncard