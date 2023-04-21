import React from 'react'
import Productcollection from '../../../components/Productcollection'
import { dateReformat } from '../../../api/Util'
import dayjs from 'dayjs'
import { TablePagination } from '@mui/material'
function Stockhistorytable({ stockHistorys, stockData, handleChangePage }) {
    return (
        <div className='flex flex-col min-h-full h-full  grow '>
            <table className="w-full overflow-hidden">
                <thead className="bg-secondary-200 ">
                    <tr>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                            #
                        </th>

                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                            Time
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                            Quantity
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                            Stock Balance
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                            Description
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                            Author
                        </th>

                    </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800  ">
                    {Boolean(stockHistorys?.history?.data?.length) && stockHistorys?.history?.data?.map((dt, i) => {
                        return (
                            <tr
                                key={i}
                                className={`${i % 2 !== 0 && 'bg-secondary-100 dark:bg-dark-bg'
                                    }`}
                            >
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <h1 className="mb-0 !text-sm">

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
                                            Sakoe Courage
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