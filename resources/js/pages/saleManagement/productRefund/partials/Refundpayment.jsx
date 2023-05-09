import React, { useEffect, useState } from 'react'
import FormInputText from '../../../../components/inputs/FormInputText'
import Rangeinput from '../../../../components/inputs/Rangeinput'
import { formatcurrency } from '../../../../api/Util'
import { Checkbox } from '@mui/material'
import { Icon } from '@iconify/react'
function Refundpayment({ sale, paymentmethod, setSaleDiscountAmount, purchase_total, saleDiscountAmount, SetSale, originalDiscount, storeCredit,maxDiscount }) {

    const [toggleDiscount, setToggleDiscount] = useState(maxDiscount)


    useEffect(() => {
        if (toggleDiscount) {
            SetSale(cv => cv = { ...cv, discount_rate: 0 })
        } else {
            SetSale(cv => cv = { ...cv, discount_rate: originalDiscount })
        }
    }, [toggleDiscount])
   

    return (
        <div className=' flex items-center justify-center min-h-[12rem] flex-col '>
            {storeCredit <= 0 && <nav className=' flex items-center gap-2 p-2 bg-red-100/30 w-full justify-center'> <Icon className='text-red-500/90 h-6 w-6 rounded-full  cursor-pointer transition-all  ' icon="solar:danger-triangle-bold" />
                <p className=' text-sm'>
                    Offer conditional discounts to avoid losses from product returns.
                </p>
            </nav>}
            <div className=' max-w-2xl w-full mx-auto my-auto flex flex-col gap-5  pt-5  '>
                <nav className=' p-2 bg-gray-100/10 flex flex-col '>
                    <nav className=' border-b w-full'>
                        <span>Payment Status</span>
                    </nav>
                    <nav className=' flex flex-row justify-between mt-2'>
                        <span className=' bg-info-400 text-sm rounded-full p-1 px-2 text-white'>Paid</span> <nav className='font-semibold'>
                            <span className=' '>{paymentmethod?.method}</span>
                            <span className=' ml-2'>{formatcurrency(sale?.total_amount)}</span>
                        </nav>
                    </nav>
                </nav>
                <nav className=' p-2 bg-gray-100/10 flex flex-col '>
                    <nav className=' border-b w-full flex items-center justify-between '>
                        <span>Discount status  <span className=' text-gray-400 text-sm'>(Discounted sale amount)</span></span>
                        <span className=' text-sm text-gray-500 '>
                            <button className=' flex  items-center gap-2'>
                                Revoke sale discount <input type='checkbox' className=' accent-info-600' checked={toggleDiscount} />
                            </button>
                        </span>
                    </nav>
                    <nav className=' flex flex-row justify-between mt-2'>
                        <span className=' bg-info-400 text-sm rounded-full p-1 px-2 text-white flex items-center justify-center h-max self-center'>Discounted sale amount</span> <nav className='font-semibold'>
                            <span className=' '><Rangeinput label='GHS' min={0} value={((Number(sale?.discount_rate / 100) * Number(sale?.sub_total))).toFixed(2)} max={((Number(sale?.discount_rate / 100) * Number(sale?.sub_total))).toFixed(2)} onChange={(e) => setSaleDiscountAmount(Number(e.target.value))} /></span>

                        </nav>
                    </nav>
                </nav>
                <nav className=' p-2 bg-gray-100/10 flex flex-col '>
                    <nav className=' border-b w-full '>
                        <span>Balance</span>
                    </nav>
                    <nav className=' flex flex-row justify-between mt-2'>
                        <span className=' bg-info-400 text-sm rounded-full p-1 px-2 text-white flex items-center justify-center h-max self-center'>Store Credit</span> <nav className='font-semibold'>
                            <span className={`${storeCredit <= 0 && 'text-red-600 '}`}>

                                {formatcurrency(storeCredit)}
                            </span>

                        </nav>
                    </nav>
                </nav>

            </div>
        </div>
    )
}

export default Refundpayment