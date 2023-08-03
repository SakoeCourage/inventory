import React, { useEffect, useState } from 'react'
import Api from '../../../../api/Api'
import { Icon } from '@iconify/react'
import { dateReformat, formatcurrency } from '../../../../api/Util'
import Productcollection from '../../../../components/Productcollection'
import Loadingspinner from '../../../../components/Loaders/Loadingspinner'
import Refundinfo from '../../../../components/inputs/Refundinfo'

function SaleTable({ saleData }) {
  const { sale, sale_items } = saleData

  return <table className="addleftline md:w-[90%] mx-auto !overflow-x-auto w-full  h-max ">
    <thead className="bg-white border-secondary-400/50 border rounded-md ">
      <tr>
        <th className="px-6 py-3  text-left rtl:text-right   font-semibold ">
          #
        </th>

        <th className="px-6 py-3 text-left rtl:text-right   font-semibold ">
          Product
        </th>
        <th className="px-6 py-3 text-left rtl:text-right   font-semibold ">
          Quantity
        </th>
        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
          Amount
        </th>

      </tr>
    </thead>
    <tbody className="divide-y divide-secondary-200">
      {Boolean(sale_items) && sale_items.map((item, i) => {
        return (
          <tr
            key={i}
            className={`${i % 2 !== 0 && 'bg-secondary-100/50 '
              }`}
          >
            <td className="px-6 py-3 !text-xs ">
              <div className="flex items-center">
                <h6 className="text-sm font-normal mb-0 !capitalize ">
                  {i + 1} {item.is_refunded > 0 && <Refundinfo item/>}
                </h6>
              </div>
            </td>
            <td className="px-6 py-3 !text-xs">
              <div className="flex items-center">
                <h6 className="text-sm font-normal mb-0  ">
                  <span>{item?.sale_product?.product?.product_name}</span>
                  <span className='ml-2 text-gray-500'>{item?.sale_product?.model_name}</span>
                </h6>
              </div>
            </td>
            <td className="px-6 py-3 !text-xs ">
              <div className="flex items-center">
                <h6 className="text-sm font-normal mb-0  ">
                  <Productcollection
                    in_collections={item?.sale_product?.in_collection}
                    quantity={item?.quantity}
                    units_per_collection={item?.sale_product?.quantity_per_collection}
                    collection_type={item?.sale_product?.collection_type?.type}
                    basic_quantity={item?.basic_selling_quantity}
                  />

                </h6>
              </div>
            </td>
            <td className="px-6 py-3 !text-xs whitespace-nowrap">
              <div className="flex items-center">
                <h6 className="text-sm font-normal mb-0  ">
                  {formatcurrency(item?.amount)}
                </h6>
              </div>
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>

  // </div>
}


function Viewsaleitem({ saleId, setShowSaleById }) {
  const [saleData, setSalData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const fetchSaleData = () => {
    setIsLoading(true)
    Api.get('/sale/get/' + saleId)
      .then(res => {
        setSalData(res.data)
        console.log(res.data)
        setIsLoading(false)
      })
      .catch()
  }
  useEffect(() => {
    fetchSaleData()
  }, [])

  return (
    <div className='min-h-max max-h-[90vh] flex-grow relative  w-full text-info-900 flex flex-col gap-8 overflow-y-scroll'>
      {isLoading && <nav className="flex items-center justify-center w-full absolute inset-0 z-30 bg-white h-full">
        <Loadingspinner />
      </nav>}
      <nav className=' addleftline flex flex-col gap-10  md:px-5 mx-auto w-full   md:w-[90%] mt-16   items-center'>
        <nav className=' grid grid-cols-2  w-full gap-2'>
          <nav className='flex flex-col p-2 basis-[50%]  gap-5 text-lg bg-red-200/25 rounded-md'>
            <nav>Cutomer Name</nav>
            <nav className='font-semibold'>{saleData?.sale?.customer_name}</nav>
          </nav>
          <nav className='flex flex-col p-2 basis-[50%]  gap-5 text-lg bg-gray-200/25 rounded-md'>
            <nav>Cutomer Contact</nav>
            <nav className='font-semibold'>{saleData?.sale?.customer_contact}</nav>
          </nav>
        </nav>
        <nav className=' grid grid-cols-2 gap-2 w-full'>
          <nav className='flex flex-col p-2 basis-[50%]  gap-5 text-lg bg-orange-200/25 rounded-md'>
            <nav>Sale Representative</nav>
            <nav className='font-semibold'>{saleData?.sale_representative}</nav>
          </nav>
          <nav className='flex flex-col p-2 basis-[50%]  gap-5 text-lg bg-info-200/25 rounded-md'>
            <nav> Sale Date </nav>
            <nav className='font-semibold'>{dateReformat(saleData?.sale?.created_at)}</nav>
          </nav>
        </nav>
      </nav>
      <SaleTable saleData={saleData} />
      <nav className=' addleftline md:px-5 w-full  md:w-[90%] mx-auto  flex flex-col gap-4'>
        <nav className='flex items-center gap-2 p-2 bg-gray-100/70'>
          <nav className=' w-full'>
            Sub total
          </nav>
          <nav className=' w-full'>
            {formatcurrency(saleData?.sale?.sub_total)}
          </nav>
        </nav>
        <nav className='flex items-center gap-2 p-2 '>
          <nav className=' w-full'>
            Sale Discount
          </nav>
          <nav className=' w-full'>
            {saleData?.sale?.discount_rate}%
          </nav>
        </nav>
        <nav className='flex items-center gap-2 p-2 '>
          <nav className=' w-full'>
            Payment Method
          </nav>
          <nav className=' w-full'>
            {saleData?.payment_method}
          </nav>
        </nav>
        <nav className='flex items-center gap-2 p-2 bg-gray-100/70 '>
          <nav className=' w-full'>
            Total
          </nav>
          <nav className=' w-full'>
            {formatcurrency(saleData?.sale?.total_amount)}
          </nav>
        </nav>
      </nav>
    </div>
  )
}

export default Viewsaleitem