import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { Switch } from '@mui/material'
import { formatcurrency } from '../../../../api/Util'
import FormInputText from '../../../../components/inputs/FormInputText'
import FormInputSelect from '../../../../components/inputs/FormInputSelect'
import Api from '../../../../api/Api'
import Customercart from './Customercart'
import Payoutsection from './Payoutsection'
function Itemscheckout({ handleOnClearCart,productsFromDB,modelsFromDB,items,setItems,formData, setSaleDiscount, setFormData, errors, saleDiscount, getBalance, paymentMethods }) {


    return (
        <>
            <nav className='  flex items-center gap-2 p-3 text-blue-950/70 text-sm  max-w-4xl mx-auto '>
                <nav className=' bg-info-100/40 text-info-600 flex items-center gap-3 px-2 py-1 rounded-md'>
                <Icon icon="ic:twotone-shopping-cart-checkout" /> <span>Cart List</span>
                </nav>
                {Boolean(items?.length) &&<span className=' px-1 rounded-full h-5  min-w-[1.5rem] w-max bg-info-500 text-white flex items-center justify-center text-xs'>{items?.length }</span>}
                {Boolean(items?.length) &&<button onClick={()=>handleOnClearCart()} className=' p-1 rounded-full h-7 min-w-[1.5rem] w-max bg-info-100/30 hover:bg-info-100 px-2 py-2 text-info-600 flex items-center justify-center text-xs ml-auto'>
                <svg className=' mr-2' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm5.66 14.24l-1.41 1.41L10 11.41l-4.24 4.25l-1.42-1.42L8.59 10L4.34 5.76l1.42-1.42L10 8.59l4.24-4.24l1.41 1.41L11.41 10z"/></svg>
                    Clear cart
                </button>}
            </nav>
            <hr className='border border-gray-200 w-full border-dotted my-0' />
            <nav className='flex flex-col gap-2 max-w-4xl mx-auto w-full '>
                <Customercart
                    productsFromDB={productsFromDB}
                    modelsFromDB={modelsFromDB}
                    setFormData={setFormData}
                    formData={formData}
                    items={items}
                    errors={errors}
                    setItems={setItems}
                />
                <Payoutsection 
                    formData={formData}
                    saleDiscount={saleDiscount}
                    errors={errors}
                    setFormData={setFormData}
                    paymentMethods={paymentMethods}
                    getBalance={getBalance}
                />
                
            </nav>
        </>
    )
}

export default Itemscheckout