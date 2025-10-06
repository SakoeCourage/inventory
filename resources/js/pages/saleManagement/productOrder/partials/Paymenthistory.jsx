import React, { useEffect, useState } from 'react'
import Api from '../../../../api/Api'
import { Tooltip, TablePagination, Zoom } from '@mui/material'
import { dateReformat, formatcurrency } from '../../../../api/Util'
import FormInputDate from '../../../../components/inputs/FormInputDate'
import Button from '../../../../components/inputs/Button'
import { addOrUpdateUrlParam } from '../../../../api/Util'
import FormInputSelect from '../../../../components/inputs/FormInputSelect'
import dayjs from 'dayjs'

import Loadingwheel from '../../../../components/Loaders/Loadingwheel'

function Paymenthistory({ paymentMethods }) {
    const [paymentHistory, setPaymentHistory] = useState([])
    const [filters, setFilters] = useState([])
    const [fullUrl, setFullUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchPaymentHistory = (url) => {
        setIsLoading(true)
        Api.get(url ?? '/payment/history/all')
            .then(res => {
                const { data, filters,full_url } = res.data
                setPaymentHistory(data)
                setFullUrl(full_url)
                setFilters(filters)
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleChangePage = (event, newPage) => {
        console.log(paymentHistory,"payment history")
        if ((newPage + 1) > paymentHistory?.current_page) {
            fetchPaymentHistory(paymentHistory?.next_page_url)
        } else {
            fetchPaymentHistory(paymentHistory?.prev_page_url)
        }
    };

    useEffect(() => {
        fetchPaymentHistory()
    }, [])


    return (
        <div className=' max-w-6xl mx-auto bg-white min-h-[12rem] p-2 border border-gray-400/70 rounded-md'>
            <div className='flex items-center flex-col md:flex-row gap-4 justify-end my-2'>
                {(filters?.paymentmethod || filters?.day) &&
                    <Button className='!grow md:!grow-0 w-full md:w-auto' onClick={() => { fetchPaymentHistory(); setFilters([]) }} text='reset filters' />
                }
                 <FormInputSelect
                    label='Filter payment method'
                    value={filters?.paymentmethod ? filters?.paymentmethod : null}
                    options={paymentMethods ? [...paymentMethods.map(method => { return ({ name: method?.method, value: method?.id }) })] : []}
                    onChange={(e) => fullUrl && fetchPaymentHistory(addOrUpdateUrlParam(fullUrl, 'paymentmethod', e.target.value))}
                    className="w-full "
                />
                <FormInputDate
                    value={filters?.day ? dayjs(filters?.day) : null}
                    onChange={(e) => fullUrl && fetchPaymentHistory(addOrUpdateUrlParam(fullUrl, 'day', dayjs(e.target.value).format('YYYY-MM-DD')))}
                    className="!w-full "
                />
            </div>
            <div className="overflow-x-auto min-h-[32rem]">
                <table className="w-full overflow-hidden">
                    <thead className="bg-secondary-200 ">
                        <tr>
                            <th className="px-6 py-3  text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                #
                            </th>

                            <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                Date modified
                            </th>
                            <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                Payment Method
                            </th>
                            <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                Payment from
                            </th>
                            <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                Amount
                            </th>


                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 ">
                        {paymentHistory?.data && paymentHistory?.data.map((x, i) => {
                            return (
                                <tr
                                    key={i}
                                    className={`${i % 2 !== 0 && 'bg-secondary-100 '
                                        }`}
                                >
                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0 !capitalize ">

                                            </h6>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0  ">
                                                {dateReformat(x.created_at)}
                                            </h6>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0  ">
                                                {x.payment_method}
                                            </h6>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0  ">
                                                {x.sender}
                                            </h6>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0  ">
                                                {formatcurrency(x.amount)}
                                            </h6>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {isLoading && <Loadingwheel />
                }
            </div>
            <TablePagination className=" !mt-auto "
                rowsPerPageOptions={[10]}
                component="div"
                count={paymentHistory?.total ?? 0}
                rowsPerPage={paymentHistory?.per_page ?? 0}
                page={(paymentHistory?.current_page - 1) ?? 0}
                onPageChange={handleChangePage}
            />
        </div>
    )
}

export default Paymenthistory