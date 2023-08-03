import React, { useEffect } from 'react'
import Productcollection from '../../../components/Productcollection'
import { dateReformat } from '../../../api/Util'
import dayjs from 'dayjs'
import { TablePagination } from '@mui/material'
import { Icon } from '@iconify/react'
function Stockhistorytable({ stockHistorys, stockData, handleChangePage }) {
    useEffect(() => {
      console.log(stockHistorys)
    }, [])
    
    return (
        <div className='flex flex-col min-h-full h-full  grow overflow-x-scroll '>
            <table className="w-full overflow-hidden">
                <thead className="bg-secondary-200 ">
                    <tr>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                            #
                        </th>

                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                            Time
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                            Quantity
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                            Stock Balance
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                            Description
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                            Author
                        </th>

                    </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200  ">
                    {Boolean(stockHistorys?.history?.data?.length) && stockHistorys?.history?.data?.map((dt, i) => {
                        return (
                            <tr
                                key={i}
                                className={`${i % 2 !== 0 && 'bg-secondary-100 '
                                    }`}
                            >
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <h1 className="mb-0 !text-sm">
                                            {dt.action_type == 'addition' ?
                                                <Icon fontSize={16} icon="mdi:arrow-up" className=' text-green-700 transition-all' /> :

                                                <Icon fontSize={16} icon="mdi:arrow-up" className=' text-red-700 transition-all transform rotate-180' />

                                            }
                                        </h1>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <h1 className="mb-0 !text-sm">
                                            {dateReformat(dt.created_at)}
                                        </h1>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <h1 className="mb-0 !text-sm ">
                                            {dayjs(dt.created_at).format('hh:mm')}
                                        </h1>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {dt.action_type == "reduction" ? <h1 className="mb-0 text-red-400  !text-sm"><Productcollection
                                            in_collections={stockData?.model?.in_collection}
                                            quantity={dt.quantity}
                                            units_per_collection={stockData?.model?.quantity_per_collection}
                                            collection_type={stockData?.collection_method}
                                            basic_quantity={stockData?.basic_quantity}
                                        /></h1>
                                            :
                                            <h1 className="mb-0 text-green-800 !text-sm"><Productcollection
                                                in_collections={stockData?.model?.in_collection}
                                                quantity={dt.quantity}
                                                units_per_collection={stockData?.model?.quantity_per_collection}
                                                collection_type={stockData?.collection_method}
                                                basic_quantity={stockData?.basic_quantity}
                                            /></h1>

                                        }
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {dt.action_type == "reduction" ? (<h1 className="mb-0 text-red-400 !text-sm "><Productcollection
                                            in_collections={stockData?.model?.in_collection}
                                            quantity={dt.net_quantity}
                                            units_per_collection={stockData?.model?.quantity_per_collection}
                                            collection_type={stockData?.collection_method}
                                            basic_quantity={stockData?.basic_quantity}
                                        /></h1>)
                                            :
                                            <h1 className="mb-0 text-green-800 !text-sm"><Productcollection
                                                in_collections={stockData?.model?.in_collection}
                                                quantity={dt.net_quantity}
                                                units_per_collection={stockData?.model?.quantity_per_collection}
                                                collection_type={stockData?.collection_method}
                                                basic_quantity={stockData?.basic_quantity}
                                            /></h1>

                                        }

                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <h6 className="mb-0  !text-sm">
                                            {dt.description}
                                        </h6>
                                    </div>
                                </td>

                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <h6 className="mb-0 !text-sm ">
                                        {dt.author?.name}
                                        </h6>
                                    </div>
                                </td>


                            </tr>
                        )
                    })}
                </tbody>


            </table>
            <TablePagination className=" !mt-auto "
                rowsPerPageOptions={[10]}
                component="div"
                count={stockHistorys?.history?.total ?? 0}
                rowsPerPage={stockHistorys?.history?.per_page ?? 0}
                page={(stockHistorys?.history?.current_page - 1) ?? 0}
                onPageChange={handleChangePage}
            />
        </div>
    )
}

export default Stockhistorytable