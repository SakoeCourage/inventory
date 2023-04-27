import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { formatcurrency } from '../../../api/Util'
import { Avatar } from '@mui/material'
import Tooltip from '@mui/material/Tooltip/Tooltip'
function Productpricingcard(props) {
  useEffect(() => {
    console.log(props)
  }, [props?.stockData])

  return (
    <div className="grid grid-cols-1 gap-2">
      <div className='min-h-full h-full   w-full p-5 my-auto flex flex-col justify-center gap-2 bg-emerald-300/20 text-emerald-900 relative rounded-md border border-gray-400/70 pb-20 lg:pb-0'>
          <nav className=' bg-emerald-50 p-1 rounded-md w-max'> Selling Price</nav>
        <dl className='flex items-center gap-4 border-b-2 border-gray-100 py-1 border-dashed '>
          <dt className=' capitalize' > Per {props.stockData?.basic_quantity ?? 'Unit'}:</dt>
          <dd className=' font-semibold text-xl'>{formatcurrency(props.stockData?.model?.unit_price ?? 0)}</dd>
        </dl>
        {Boolean(props.stockData?.model?.in_collection) && <dl className='flex items-center gap-4 border-b-2 border-gray-100 py-1 border-dashed '>
          <dt className=' capitalize'>Per {props.stockData.collection_method ?? 'collection_method'}</dt>
          <dd className=' font-semibold text-xl'>{Boolean(props.stockData?.model?.in_collection) && formatcurrency(props.stockData?.model?.price_per_collection ?? 0)}</dd>
        </dl>}

      </div>
      <div className='min-h-full h-full   w-full p-5 my-auto flex flex-col justify-center gap-2 bg-red-300/20 text-red-900 relative rounded-md border border-gray-400/70 pb-20 lg:pb-0'>
      <nav className='bg-red-50 p-1 rounded-md w-max'> Buying Price</nav>
        <dl className='flex items-center gap-4 border-b-2 border-gray-100 py-1 border-dashed '>
          <dt className=' capitalize'> Per {props.stockData?.basic_quantity ?? 'Unit'}:</dt>
          <dd className=' font-semibold text-xl'>{formatcurrency(props.stockData?.model?.cost_per_unit ?? 0)}</dd>
        </dl>
        {Boolean(props.stockData?.model?.in_collection) && <dl className='flex items-center gap-4 border-b-2 border-gray-100 py-1 border-dashed '>
          <dt className=' capitalize'>Per {props.stockData.collection_method ?? 'collection_method'}</dt>
          <dd className=' font-semibold text-xl'>{Boolean(props.stockData?.model?.in_collection) && formatcurrency(props.stockData?.model?.cost_per_collection ?? 0)}</dd>
        </dl>}

      </div>
    </div>
  )
}

export default Productpricingcard