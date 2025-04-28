import React, { useEffect, useState } from 'react'
import Api from '../../../../api/Api'
import { Icon } from '@iconify/react'
import { dateReformat, formatcurrency } from '../../../../api/Util'
import Productcollection from '../../../../components/Productcollection'
import Loadingspinner from '../../../../components/Loaders/Loadingspinner'
import Refundinfo from '../../../../components/inputs/Refundinfo'
import QuestionAnswerSection from '../../../../components/ui/QuestionAnswerSection'

function SaleTable({ saleData }) {
  const { sale, sale_items } = saleData

  return <table className=" mx-auto !overflow-x-auto w-full  h-max ">
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
                  {i + 1} {item.is_refunded > 0 && <Refundinfo item />}
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
        setIsLoading(false)
      })
      .catch()
  }
  useEffect(() => {
    fetchSaleData()
  }, [])

  return (
    <div className='min-h-max max-h-[90vh] flex-grow relative  w-full text-info-900 flex flex-col gap-2 overflow-y-scroll'>
      {isLoading && <nav className="flex items-center justify-center w-full absolute inset-0 z-30 bg-white h-full">
        <Loadingspinner />
      </nav>}
      <nav className=' mx-auto w-full p-5 '>
        <fieldset className='grid grid-cols-1 md:grid-cols-2 border p-5 bg-orange-50/50 rounded-md gap-5'>
          <QuestionAnswerSection
            question="Customer Name"
            answer={saleData?.sale?.customer_name}
          />
          <QuestionAnswerSection
            question="Customer Contact"
            answer={saleData?.sale?.customer_contact}
          />
          <QuestionAnswerSection
            question="Sale Representative"
            answer={saleData?.sale_representative}
          />
          <QuestionAnswerSection
            question="Sale Date"
            answer={dateReformat(saleData?.sale?.created_at)}
          />
        </fieldset>
      </nav>
      <nav className="px-5">
        <SaleTable saleData={saleData} />
      </nav>
      <nav className='p-5'>
        <fieldset className='grid grid-cols-1 md:grid-cols-2 border p-5 bg-info-100/50 rounded-md gap-5'>
          <QuestionAnswerSection
            question="Sub total"
            className='md:col-span-2'
            variant="horizontal"
            answer={formatcurrency(saleData?.sale?.sub_total)}
          />
          <QuestionAnswerSection
            question="Sale Discount"
            variant="horizontal"
            className='md:col-span-2'
            answer={saleData?.sale?.discount_rate + ' %'}
          />
          <QuestionAnswerSection
            question="Payment Method"
            variant="horizontal"
            className='md:col-span-2'
            answer={saleData?.payment_method ?? "N/A"}
          />
          <QuestionAnswerSection
            variant="horizontal"
            className='md:col-span-2'
            question="Total"
            answer={formatcurrency(saleData?.sale?.total_amount)}
          />
        </fieldset>
      </nav>
    </div>
  )
}

export default Viewsaleitem