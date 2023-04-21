import React from 'react'
import { Icon } from '@iconify/react'
import { formatcurrency } from '../../../api/Util'
import { Avatar } from '@mui/material'
import Tooltip from '@mui/material/Tooltip/Tooltip'
function Productpricingcard(props) {
  return (
    <div className='min-h-full h-full   w-full p-5 my-auto flex flex-col justify-center gap-3 bg-blue-300/20 text-blue-900 relative rounded-md border border-gray-400/70 pb-20 lg:pb-0'>
      <Icon icon="product" fontSize={30} className=' text-gray-300 absolute' />
      <dl className='flex items-center gap-4 border-b-2 border-gray-100 py-1 border-dashed '>
        <dt className=' capitalize'>Price  Per {props.stockData?.basic_quantity ?? 'Unit'}:</dt>
        <dd className=' font-semibold text-xl'>{formatcurrency(props.stockData?.model?.unit_price ?? 0)}</dd>
      </dl>
      {Boolean(props.stockData?.model?.in_collection) && <dl className='flex items-center gap-4 border-b-2 border-gray-100 py-1 border-dashed '>
        <dt className=' capitalize'>Price Per {props.stockData.collection_method ?? 'collection_method'}</dt>
        <dd className=' font-semibold text-xl'>{Boolean(props.stockData?.model?.in_collection) && formatcurrency(props.stockData?.model?.price_per_collection ?? 0)}</dd>
      </dl>}
      
    </div>
  )
}

export default Productpricingcard