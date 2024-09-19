import React, { useEffect, useState } from 'react'
import IconifyIcon from '../../../../components/ui/IconifyIcon'
import { dateReformat, formatcurrency } from '../../../../api/Util'
import FormInputSelect from '../../../../components/inputs/FormInputSelect'
import FormInputText from '../../../../components/inputs/FormInputText'
import Button from '../../../../components/inputs/Button'
import Api from '../../../../api/Api'
import useForm from '../../../../hooks/useForm'
import Loadingspinner from '../../../../components/Loaders/Loadingspinner'
import { enqueueSnackbar } from 'notistack'

function CreaditSalePayment({ sale }) {
    const [isLoading, setIsLoading] = useState(false);
    const [saleData, setSaleData] = useState({})
    const [paymentMethod, setPaymentMethods] = useState([]);
    const [newSaleBalance, setNewSaleBalance] = useState(0)
    const { setData, data, reset, patch, errors } = useForm({ amount: null, payment_method: null })

    const fetchSaleData = () => Api.get(`/lease/sale/${sale.id}/history`)

    const fetchPaymenthMethod = () => Api.get(`/toselect/paymentmethods`)


    const fetachAllData = () => {
        if (sale == null) return;
        setIsLoading(true);
        Promise.all([fetchPaymenthMethod(), fetchSaleData()])
            .then(res => {
                const [paymentMethodData, saleData] = res;
                setPaymentMethods(paymentMethodData.data)
                setSaleData(saleData.data);
                var blnc = Array.isArray(saleData.data?.lease_payment_history) && Math.abs(saleData.data?.lease_payment_history[0]?.balance ?? 0)
                setNewSaleBalance(blnc)
            })
            .catch(err => {

            })
            .finally(() => {
                setIsLoading(false);
            })

    }

    const handleOnSubmit = () => {
        patch("/lease/make-payment/" + sale.id,
            {
                onSuccess: () => { fetachAllData() },
                onError: (err) => {
                    if (err.response.status == 404) {
                        enqueueSnackbar(err.response.data, { variant: "error" })
                    }
                }
            }
        )
    }

    useEffect(() => {
        fetachAllData();
    }, [])

    useEffect(() => {
        var currentBalance = Array.isArray(saleData?.lease_payment_history) && Math.abs(saleData?.lease_payment_history[0]?.balance)

        if (Number(currentBalance) >= 0) {
            setNewSaleBalance(Math.abs(currentBalance) - data.amount)
            console.log(newSaleBalance)

            if (Number(data.amount) > currentBalance) {
                setData("amount", Math.abs(currentBalance));
            }
        }
    }, [data])


    if (isLoading) return <div className=' min-h-72 flex items-center justify-center'>
        <Loadingspinner />
    </div>

    return (
        <div className='w-full overflow-x-hidden'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                <nav className=' aspect-square p-2 flex items-center justify-center bg-green-50 flex-col gap-3'>
                    <nav className='flex flex-col gap-1'>
                        <IconifyIcon fontSize='4rem' className="h-20 w-20 mx-auto !p-0 fill-green-800" icon="icon-park:customer" />
                        <span className=' text-xs text-center font-thin'>
                            Customer
                        </span>
                    </nav>
                    <h6 className=' text-center'>
                        {saleData?.customer_name}
                    </h6>
                </nav>
                <nav className=' aspect-square p-2 flex items-center justify-center bg-orange-50 flex-col gap-3'>
                    <nav className='flex flex-col gap-1'>
                        <IconifyIcon fontSize='4rem' className="h-20 w-20 mx-auto !p-0 text-orange-800" icon="icon-park-twotone:phone" />
                        <span className=' text-xs text-center font-thin'>
                            Contact
                        </span>
                    </nav>
                    <h6 className=' text-center'>
                        {saleData?.customer_contact}
                    </h6>
                </nav>
                <nav className=' aspect-square p-2 flex items-center justify-center bg-red-50 flex-col gap-3'>
                    <nav className='flex flex-col gap-1'>
                        <IconifyIcon fontSize='4rem' className="h-20 w-20 mx-auto !p-0 text-red-800" icon="solar:money-bag-broken" />
                        <span className=' text-xs text-center font-thin'>
                            Current Balance
                        </span>
                    </nav>
                    <h6 className=' text-center'>
                        {Array.isArray(saleData?.lease_payment_history) &&
                            formatcurrency(Math.abs(saleData?.lease_payment_history[0]?.balance ?? 0))}
                    </h6>
                </nav>
            </div>

            {Array.isArray(saleData?.lease_payment_history) &&
                Math.abs(saleData?.lease_payment_history[0]?.balance ?? 0) == 0 ? <div className='flex items-center justify-center flex-col bg-gray-100 my-2'>
                <nav className='flex items-center justify-center flex-col gap-2 py-5'>
                    <IconifyIcon className="h-20 w-20 text-green-300 " fontSize='5rem' icon="lets-icons:check-fill" />
                    <nav>
                       Lease Payment Completed
                    </nav>
                </nav>
            </div> : <div className='py-2'>
                <nav className='grid grid-cols-1 gap-3'>
                    <FormInputSelect error={errors?.payment_method}
                        value={data.payment_method}
                        onChange={(e) => setData("payment_method", e.target.value)}
                        label="Payment Method" size="small" options={Boolean(paymentMethod?.length)
                            ? paymentMethod.map(entry => { return ({ name: entry.method, value: entry.id }) })
                            : []}
                    />
                    <FormInputText
                        InputProps={{ inputProps: { min: 0, max: Array.isArray(saleData?.lease_payment_history) && saleData?.lease_payment_history[0]?.balance } }}
                        error={errors?.amount}
                        value={data?.amount} onChange={(e) => setData('amount', e.target.value)} type="number" label="Amount (GHS)" size="small" />
                    <nav className='flex items-center p-1 bg-orange-50/10 justify-between'>
                        <span>New Balance:</span>
                        <span>{formatcurrency(newSaleBalance)}</span>
                    </nav>
                    <Button onClick={() => handleOnSubmit()}>
                        Make payment
                    </Button>
                </nav>
            </div>
            }

            <div className=' mt-5 '>
                <nav className='text-sm'>Payment History</nav>
                <div className='overflow-x-scroll'>

                    <table className="w-full ">
                        <thead className="bg-secondary-200 ">
                            <tr>
                                <th className="px-6 py-3  text-left rtl:text-right text-sm  whitespace-nowrap font-semibold ">
                                    #
                                </th>

                                <th className="px-6 py-3 text-left rtl:text-right text-sm  whitespace-nowrap font-semibold ">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left rtl:text-right text-sm  whitespace-nowrap font-semibold ">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left rtl:text-right text-sm  whitespace-nowrap font-semibold ">
                                    Balance
                                </th>
                                <th className="px-6 py-3 text-left rtl:text-right text-sm  whitespace-nowrap font-semibold ">
                                    Payment Method
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200 ">
                            {!!saleData?.lease_payment_history?.length && saleData?.lease_payment_history.map(entry =>
                                <tr
                                // key={i}
                                // className={`${i % 2 !== 0 && 'bg-secondary-100 '
                                //     }`}
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
                                                {dateReformat(entry.created_at)}
                                            </h6>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0  ">
                                                {formatcurrency(entry.amount)}
                                            </h6>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0  ">
                                                {formatcurrency(Math.abs(entry.balance))}
                                            </h6>
                                        </div>
                                    </td>

                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0  ">
                                                {entry?.payment_method ? entry?.payment_method?.method : "N/A"}
                                            </h6>
                                        </div>
                                    </td>


                                </tr>
                            )
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CreaditSalePayment