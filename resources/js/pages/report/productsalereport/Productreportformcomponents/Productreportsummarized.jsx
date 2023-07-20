import React, { useEffect } from 'react'
import { formatcurrency } from '../../../../api/Util'
import Productcollection from '@/components/Productcollection'
function ReportSaleBannerCard(props) {
  return <div className={`flex flex-col shadow-light min-w-[25rem]  rounded-md p-5 font-sans ${props.className}`}>
    <nav className=' basis-[10%] font-semibold text-gray-600 '>
       Sale Summary (All Products)
    </nav>
    <nav className=' basis-[15%] font-medium  text-3xl my-4 text-gray-600'>
       {formatcurrency(props.data['DAILY SALE'])}
    </nav>
    <nav className='grow flex flex-col gap-2'>
      <nav className='flex items-center justify-between'>
        <span>Gross Sale</span>
        <span>{formatcurrency(props.data['GROSS SALE'])}</span>
      </nav>
      <nav className='flex items-center justify-between'>
        <span>Discounted Sale</span>
        <span>{formatcurrency(props.data['DISCOUNTED SALE'])}</span>
      </nav>

      {Object.entries(props.data['PAYMENT METHODS']).map((dt, i) => {
        return (
          <nav key={i} className='flex items-center justify-between'>
            <span className='capitalize'>{dt[0]}</span>
            <span>{formatcurrency(dt[1])}</span>
          </nav>
        )
      })}
      <nav className='flex items-center justify-between'>
        <span>Estimated Revenue</span>
        <span>{formatcurrency(props.data['TOTAL REVENUE'])}</span>
      </nav>
    </nav>
  </div>
}
function ReportSaleItemQuantity(props) {
  const { basic_quantity, collection_type, in_collection, models, product_name, quantity_per_model, units_per_crate, total_sale_quantity } = props.data
  return <div className={`flex flex-col shadow-light min-w-[25rem]  rounded-md p-5 font-sans ${props.className}`}>
    <nav className=' basis-[10%] font-semibold text-gray-600 '>
      {product_name} <span className="mx-1 text-sm">(Sale Qty)</span>
    </nav>
    <nav className=' basis-[15%] font-medium  text-3xl my-4 text-gray-600'>
      <Productcollection in_collections={false}
        collection_type={collection_type}
        units_per_collection={units_per_crate}
        quantity={total_sale_quantity}
        basic_quantity={basic_quantity} />
    </nav>
    <nav className='grow flex flex-col gap-2'>
      {Object.values(quantity_per_model).map((dt, i) => {
        return (
          <nav key={i} className='flex items-center justify-between'>
            <span className='capitalize'>{dt['name']}</span>
            <span>    <Productcollection in_collections={dt['in_collection']}
              collection_type={dt['collection_method']}
              units_per_collection={dt['quantity_per_collection']}
              quantity={dt['quantity']}
              basic_quantity={basic_quantity}
            /></span>
          </nav>
        )
      })}
    </nav>
  </div>
}

function Productreportsummarized(props) {
  const { date_created, end, product_sale, sale_summary, start, title } = props.reportData

  return (
    <div className=' min-h-screen p-5 min-w-[56rem] w-full mx-auto grid gap-5 grid-cols-2'>
      <ReportSaleBannerCard data={sale_summary} className='col-span-2' />
      {product_sale.map((psale, i) => <ReportSaleItemQuantity key={i} data={psale} />)}
    </div>
  )
}

export default Productreportsummarized