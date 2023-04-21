import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { formatnumber } from '../../../api/Util'
import Productcollection from '../../../components/Productcollection'
function Productdetailcard({stockData}) {

  return (
    <div className='min-h-full h-full  w-full p-5 my-auto flex flex-col justify-center gap-3 bg-info-300/20 text-info-900 relative rounded-md border border-gray-400/70'>
      <Icon icon="product" fontSize={30}  className=' text-gray-300 absolute'/>
      <dl className='flex items-center gap-4 border-b-2 border-gray-100 py-1 border-dashed   '>
         <dt className=' whitespace-nowrap'>Product Name:</dt>
         <dd className=' font-semibold text-base'>{stockData?.product?.product_name ?? ''}</dd>
      </dl>
      <dl className='flex items-center gap-4 border-b-2 border-gray-100 py-1 border-dashed   '>
         <dt className=' whitespace-nowrap'>Model Type:</dt>
         <dd className=' font-semibold text-base'>{stockData?.model?.model_name ?? ''}</dd>
      </dl>
      <dl className='flex items-center gap-4 border-b-2 border-gray-100 py-1 border-dashed   '>
         <dt className=' whitespace-nowrap'>Qty In Stock:</dt>
         <dd className=' font-semibold text-base'>
         {stockData?.model
            && <Productcollection 
            in_collections={stockData.model?.in_collection}
            quantity={stockData?.model?.quantity_in_stock ?? 0 }
            units_per_collection={stockData.model?.quantity_per_collection}
            basic_quantity={stockData.basic_quantity}
            collection_type={stockData.collection_method}
            />
         }
         </dd>
      </dl>
    </div>
  )
}

export default Productdetailcard