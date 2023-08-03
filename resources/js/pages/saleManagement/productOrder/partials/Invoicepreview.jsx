import React, { useState, useEffect, useContext, useRef } from 'react'
import Scrollablemodal from '../../../../components/layout/Scrollablemodal'
import { formatcurrency, dateReformat } from '../../../../api/Util'
import Button from '../../../../components/inputs/Button'
import Productcollection from '../../../../components/Productcollection'
import { useReactToPrint } from 'react-to-print'
import QRCode from 'qrcode.react';
function Invoicepreview({ invoiceData, onClose }) {
    const PrintinvoiceRef = useRef()
    const { amount_paid, balance, sale_invoice, customer_contact, customer_name, discount_rate, paymentmethod, paymentmethod_id, saleitems, salerepresentative, sub_total, total_amount, created_at, user_id, business_profile } = invoiceData?.data;

    const handlePrint = useReactToPrint({
        content: () => PrintinvoiceRef.current,
        documentTitle: `${invoiceData?.type} ${sale_invoice ?? ''} ${String(customer_name ?? '').toUpperCase()} - ${dateReformat(created_at)}`,
        onAfterPrint: () => onClose()
    })

    const businessProfile = {
        name: 'My Business',
        website: 'https://www.example.com',
        email: 'info@example.com',
        phone: '+1234567890',
        address: '123 Main Street, City, Country',
    };
    const businessProfileString = JSON.stringify(businessProfile);

    useEffect(() => {
        console.log(business_profile)
    }, [])

    return (
        <Scrollablemodal closeModal={() => onClose()}>
            <div ref={PrintinvoiceRef} className=' min-w-[1000px] mx-auto pt-5 font-mono'>
                <div className='max-w-4xl mx-auto p-10'>
                    <nav className='flex items-center justify-between gap-4'>
                        <nav className='flex items-center gap-2'>
                            <h1 className="text-4xl font-bold text-gray-600  flex flex-col justify-center items-center mb-1 space-x-3">
                                <span>Inventory</span>
                                <span className='text-sm block text-center'>Lite</span>
                            </h1>
                            <h1 className='text-4xl text-gray-600 border-gray-400 border-l-2 pl-1 '>{invoiceData?.type}</h1>
                        </nav>

                        {business_profile && <nav className=' flex items-center gap-3'>
                            <nav className='text-xs text-gray-500'>
                                <nav className=' gap-1 italic'>
                                    <span>{business_profile?.address}</span>
                                </nav>
                                <nav className=' gap-1 italic'>
                                    <span>{`${business_profile?.box_number} ${business_profile?.address}`}</span>
                                </nav>
                                <nav className='flex items-center gap-1 italic'>
                                    <span>contact us on</span>
                                    <span>{`${business_profile?.tel_1}`}{business_profile?.tel_2 && ',' + business_profile?.tel_2}</span>
                                </nav>

                            </nav>
                            {
                                (business_profile?.business_name || business_profile?.business_email) &&
                                <nav className=' flex items-center justify-end'>
                                    <QRCode fgColor="#4b5563" height={10} width={10} size={45} value={business_profile?.business_name + " " + business_profile?.business_email} />
                                </nav>
                            }

                        </nav>
                        }
                    </nav>

                    <nav className='mt-20  text-gray-800'>
                        <nav className='text-sm '>
                            <nav className=' mb-5 flex items-center justify-between'>
                                <span className='text-xl'>Customer Name
                                    <span className='text-sm block uppercase'>{customer_name ?? ''}</span>
                                    <span className='text-sm block uppercase'>{customer_contact ?? null}</span>
                                </span>
                            </nav>
                            <nav>
                                <span>Date Issued</span>
                                <span className='ml-3 font-semibold'>{dateReformat(created_at)}</span>
                            </nav>
                            <nav>
                                <span>Invoice number</span>
                                <span className='ml-3 font-semibold'>{sale_invoice ?? null}</span>
                            </nav>

                        </nav>

                    </nav>

                    <nav className='mt-20 text-gray-800 flex flex-col gap-3'>
                        <nav className='flex items-center gap-1 text-sm py-2 mb-4 border-b-2'>
                            <span className='  basis-[40%]'>product</span>
                            <span className='  basis-[20%] '>unit price</span>
                            <span className='  text-center basis-[20%]' >quantity</span>
                            <span className='  basis-[20%] ' >amount</span>
                        </nav>
                        {Boolean(saleitems.length) && saleitems.map(({ productsmodels, quantity, amount }, i) => {
                            return (
                                <nav key={i} className='flex items-center gap-1 font-semibold text-gray-500 text-sm'>
                                    <span className=' basis-[40%]'>{productsmodels?.product?.product_name} <span className='text-text-gray-500'>{productsmodels?.model_name}</span> </span>
                                    <span className=' basis-[20%]'>{formatcurrency(productsmodels?.unit_price)}</span>
                                    <span className=' basis-[20%] text-center' >
                                        <Productcollection
                                            in_collections={productsmodels?.in_collection}
                                            quantity={quantity}
                                            units_per_collection={productsmodels?.quantity_per_collection}
                                            collection_type={productsmodels?.collection_type?.type}
                                            basic_quantity={productsmodels?.product?.basic_quantity?.symbol}
                                        />
                                    </span>
                                    <span className=' basis-[20%]' >{formatcurrency(amount)}</span>
                                </nav>
                            )
                        })}

                    </nav>
                    <nav className='flex items-center justify-end mt-10 text-gray-700 font-semibold'>
                        <nav className='flex items-center gap-2'>
                            <span className='text-sm'>Sub Total:</span>
                            <span>{formatcurrency(sub_total)}</span>
                        </nav>
                    </nav>
                    <nav className='flex items-center justify-between mt-5 p-3 rounded-md bg-gray-100'>
                        <nav className='flex items-center w-max'>
                            discount rate
                        </nav>
                        <nav className='w-max text-gray-500'> {discount_rate} %</nav>
                    </nav>
                    <nav className='flex items-center justify-end mt-10 text-grey-700 font-semibold'>
                        <nav className='flex items-center gap-2'>
                            <span className='text-sm'>Total:</span>
                            <span>{formatcurrency(total_amount)}</span>
                        </nav>
                    </nav>


                </div>
                <div className=' print:hidden flex items-center justify-center '>
                    <Button onClick={() => handlePrint()} text="print invoice" className="text-xs rounded-lg my-5 w-max" />
                </div>

            </div>
        </Scrollablemodal>
    )
}

export default Invoicepreview