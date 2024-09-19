import React, { useState, useEffect, useContext, useRef, forwardRef } from 'react'
import Scrollablemodal from '../../../../components/layout/Scrollablemodal'
import { formatcurrency, dateReformat } from '../../../../api/Util'
import Button from '../../../../components/inputs/Button'
import Productcollection from '../../../../components/Productcollection'

import QRCode from 'qrcode.react';
const Invoicepreview = forwardRef(({ invoiceData }, ref) => {
    const { amount_paid, balance, sale_invoice, customer_contact, customer_name, discount_rate, paymentmethod, paymentmethod_id, saleitems, salerepresentative, sub_total, total_amount, created_at, user_id, business_profile, store } = invoiceData?.data;

    return (
        // <Scrollablemodal closeModal={() => onClose()}>
        <div ref={ref} className='max-w-[18.9rem] overflow-x-hidden mx-auto  font-mono'>
            <div className=' px-4 py-5 pb-10 '>
                <nav className='flex items-center flex-col justify-center gap-4 p-2'>
                    {
                        (business_profile?.business_name || business_profile?.business_email) &&
                        <nav className=' flex items-center justify-end'>
                            <QRCode fgColor="#4b5563" height={10} width={10} size={45} value={business_profile?.business_name + " " + business_profile?.business_email} />
                        </nav>
                    }
                    <nav className='flex flex-col items-center '>
                        <h6 className='text-sm leading-3'>
                            {business_profile?.business_name}
                        </h6>
                        <h6 className='text-sm leading-3'>
                            {store?.name}
                        </h6>
                        <h6 className='text-sm leading-3'>
                            {store?.branch}
                        </h6>
                        <h6 className='text-sm leading-3'>
                            <span>{`${business_profile?.tel_1}`}{business_profile?.tel_2 && ',' + business_profile?.tel_2}</span>
                        </h6>
                        <h6 className='text-sm leading-3'>
                            {dateReformat(created_at)}
                        </h6>
                    </nav>
                </nav>
                <nav className=' text-center text-sm py-2 border-dashed border-y border-gray-800'>
                    {invoiceData?.type} {sale_invoice && ": " + sale_invoice}
                </nav>

                <nav className=' text-gray-800 flex flex-col gap-3 pb-2 border-dashed border-b border-gray-800'>
                    <nav className='flex items-center gap-1 text-sm py-2 border-dashed border-b border-gray-800'>
                        <span className='  basis-[40%]'>Item</span>
                        <span className='  basis-[20%] '>Qty</span>
                        <span className=' basis-[20%] text-right' >Amt</span>
                    </nav>
                    {Boolean(saleitems.length) && saleitems.map(({ productsmodels, quantity, amount }, i) => {
                        return (
                            <nav key={i} className='flex items-center gap-1   text-xs'>
                                <span className=' basis-[40%] mr-auto'><span className=''>{productsmodels?.model_name}</span> </span>
                                <span className=' basis-[20%] text-center mx-auto' >
                                    <Productcollection
                                        className=''
                                        in_collections={productsmodels?.in_collection}
                                        quantity={quantity}
                                        units_per_collection={productsmodels?.quantity_per_collection}
                                        collection_type={productsmodels?.collection_type?.type}
                                        basic_quantity={productsmodels?.product?.basic_quantity?.symbol}
                                    />
                                </span>
                                <span className=' basis-[20%] ml-auto'>{formatcurrency(amount)}</span>
                            </nav>
                        )
                    })}

                </nav>
                <nav className='flex items-center justify-start text-gray-700 font-semibold'>
                    <nav className='flex items-center gap-2'>
                        <span className='text-sm'>Sub Total:</span>
                        <span>{formatcurrency(sub_total)}</span>
                    </nav>
                </nav>
                <nav className='flex items-center justify-start text-gray-700 font-semibold'>
                    <nav className='flex items-center gap-2'>
                        <span className='text-sm'>Discount:</span>
                        <span>{discount_rate}%</span>
                    </nav>
                </nav>
                <nav className='flex items-center justify-start text-gray-700 font-semibold'>
                    <nav className='flex items-center gap-2'>
                        <span className='text-sm'>Total:</span>
                        <span>{formatcurrency(total_amount)}</span>
                    </nav>
                </nav>
                {paymentmethod?.method && <nav className='flex items-center justify-start text-gray-700 font-semibold'>
                    <nav className='flex items-center gap-2'>
                        <span className='text-sm capitalize'>{paymentmethod?.method}:</span>
                        <span>{formatcurrency(amount_paid)}</span>
                    </nav>
                </nav>}
                {invoiceData?.type != "PROFORMA INVOICE" && <nav className=' text-center text-xs py-2 border-dashed border-t border-gray-800'>
                    Thank You for your purchase!
                </nav>}
            </div>
            {/* <div className=' print:hidden flex items-center justify-center '>
                    <Button onClick={() => handlePrint()} text="print invoice" className="text-xs rounded-lg my-5 w-max" />
                </div> */}

        </div>
        // </Scrollablemodal>
    )
})

export default Invoicepreview