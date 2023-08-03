import React, { useEffect, useState } from 'react'
import { dateReformat } from '../../../api/Util'
import { TablePagination } from '@mui/material'
import { Icon } from '@iconify/react'

function Stocksupplierstable({ currentModelID ,supplierdata,getSuppliersPerGivenModel,isLoading}) {
    
    const handleChangePage = (event, newPage) => {
        if ((newPage + 1) > supplierdata.current_page) {
            getSuppliersPerGivenModel(supplierdata.next_page_url)
        } else {
            getSuppliersPerGivenModel(supplierdata.prev_page_url)
        }
    };

    useEffect(() => {
        getSuppliersPerGivenModel()
    }, [])

    return (
        <div className='flex flex-col min-h-full h-full grow relative min-w-full overflow-x-scroll'>
            {isLoading && <div className='absolute inset-0 flex items-center justify-center bg-white/40 z-40'>
                <Icon icon="svg-spinners:pulse-rings-3" className='text-blue-600' fontSize={60} />
            </div>}
            <table className="w-full overflow-hidden">
                <thead className="bg-secondary-200 ">
                    <tr>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                            #
                        </th>

                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                            Last Modified
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                           Supplier's Name
                        </th>
                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                        Supplier's Contact
                        </th>

                    </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200  ">
                    {supplierdata?.data && supplierdata?.data.map((dt, i) => {
                        return (
                            <tr
                                key={i}
                                className={`${i % 2 !== 0 && 'bg-secondary-100 '
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
                                            {dateReformat(dt.supplier.updated_at)}
                                        </h1>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <h1 className="mb-0 !text-sm ">
                                            {dt.supplier.supplier_name}
                                        </h1>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <h1 className="mb-0 !text-sm ">
                                            {dt.supplier.supplier_contact}
                                        </h1>
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
                count={supplierdata.total ?? 0}
                rowsPerPage={supplierdata.per_page ?? 0}
                page={(supplierdata.current_page - 1) ?? 0}
                onPageChange={handleChangePage}
            />
        </div>
    )
}

export default Stocksupplierstable