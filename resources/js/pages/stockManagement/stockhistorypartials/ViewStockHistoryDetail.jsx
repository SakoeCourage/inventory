import React, { useEffect } from 'react'
import QuestionAnswerSection from '../../../components/ui/QuestionAnswerSection'
import Api from '../../../api/Api'
import { dateReformat, formatcurrency } from '../../../api/Util'
import HelpToolTip from '../../../components/ui/HelpterToolTip'
import Productcollection from '../../../components/Productcollection'

function InvoiceTable({ data }) {
    if (data == null) return ""
    const { model_details } = data
    return <table className=" mx-auto !overflow-x-auto w-full  h-max border rounded-md">
        <thead className="bg-white border-secondary-400/50 border rounded-md ">

            <tr className='text-gray-500 '>
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
            {Boolean(model_details) && model_details.map((item, i) => {
                return (
                    <tr
                        key={i}
                        className={`${i % 2 !== 0 && 'bg-secondary-100/50 '
                            }`}
                    >
                        <td className="px-6 py-3 !text-xs ">
                            <div className="flex items-center">
                                <h6 className="text-sm font-normal mb-0 !capitalize ">
                                    {i + 1}
                                </h6>
                            </div>
                        </td>
                        <td className="px-6 py-3 !text-xs">
                            <div className="flex items-center">
                                <h6 className="text-sm font-normal mb-0  ">
                                    <span>{item?.product_details?.product_name}</span>
                                    <span className='ml-2 text-gray-500'>{item?.model_name}</span>
                                </h6>
                            </div>
                        </td>
                        <td className="px-6 py-3 !text-xs ">
                            <div className="flex items-center">
                                <h6 className="text-sm font-normal mb-0  ">
                                    <Productcollection
                                        in_collections={item?.in_collection}
                                        quantity={item?.quantity}
                                        units_per_collection={item?.quantity_per_collection}
                                        collection_type={item?.collection_method}
                                        basic_quantity={item?.basic_quantity?.symbol}
                                    />

                                </h6>
                            </div>
                        </td>
                        <td className="px-6 py-3 !text-xs whitespace-nowrap">
                            <div className="flex items-center">
                                <h6 className="text-sm font-normal mb-0  ">
                                    {formatcurrency(item?.total_amount)}
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
const ViewStockHistoryDetail = ({ id }) => {
    const [stockData, setStockData] = React.useState({})

    const fectchStockData = () => {
        Api.get('/stock/stock-history/' + id)
            .then(res => {
                setStockData(res.data)
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        fectchStockData()
    }, [])

    return (
        <div className='flex flex-col p-2 w-full '>
            <h1 className=' whitespace-nowrap text-gray-400 font-medium text-sm py-2 px-2'>Stock Products Details</h1>
            <fieldset className='grid grid-cols-1 md:grid-cols-2 border p-5 bg-orange-50/50 rounded-md gap-5'>
                <QuestionAnswerSection
                    question="Record Date"
                    answer={dateReformat(stockData?.record_date)}
                />
                <QuestionAnswerSection
                    question="Supplier"
                    answer={stockData?.supplier}
                />
                <QuestionAnswerSection
                    className='md:col-span-2'
                    question="Invoice/Description"
                    answer={stockData?.purchase_invoice_number}
                />
            </fieldset>
            <nav className="">
                <h1 className=' whitespace-nowrap text-gray-400 font-medium text-sm py-5 px-2'>Stock Products List</h1>
                <InvoiceTable data={stockData?.stock_data} />
            </nav>
            <nav className='p-5 border-y border-gray-300'>
                <QuestionAnswerSection
                    variant="horizontal"
                    question={<span className='flex items-center gap-1'>Invoice Total  <HelpToolTip content="Total is generated from the cost of the invoice items" /></span>}
                    answer={formatcurrency(stockData?.stock_data?.total_invoice_amount)}
                />
            </nav>
        </div>
    )
}

export default ViewStockHistoryDetail