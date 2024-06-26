import React from 'react'
import FormInputText from '../../../../components/inputs/FormInputText'
import FormInputSelect from '../../../../components/inputs/FormInputSelect'
import { formatcurrency } from '../../../../api/Util'
function Payoutsection({formData,saleDiscount,errors,setFormData,paymentMethods,getBalance}) {
  return (
   <div className=' bg-white rounded-md border-inherit'>
    <nav className="flex mt-5 items-center justify-between p-2 bg-red-50/50 text-red-950 rounded-md">
                    <nav>
                        SUB TOTAL
                    </nav>
                    <nav className=' font-bold'>
                        {formatcurrency(formData?.sub_total)}
                    </nav>
                </nav>
                <nav className="flex items-center justify-between p-2 text-red-950 rounded-md">
                    <nav className='w-full'>
                        <FormInputText type='number' error={errors.discount_rate} inputProps={{ inputMode: 'numeric', min: 0, max: 100 }} className="w-full" value={formData?.discount_rate} onChange={(e) => setFormData(cv => cv = { ...cv, discount_rate: e.target.value })} label='Sale Discount' placeholder='(%)' />
                    </nav>
                    <nav className='w-full text-sm flex items-center gap-5 justify-end '>
                        {/* <Switch checked={saleDiscount} onChange={(e) => setSaleDiscount(e.target.checked)} /> */}
                        <span className={`${saleDiscount ? 'text-red-950' : 'text-gray-700'} `}>{formData?.discount_rate && saleDiscount ? `${formData?.discount_rate ?? 0}% discount is applied` : 'no discount applied'}</span>

                    </nav>
                </nav>
                <nav className="flex items-center justify-between p-2 text-red-950 rounded-md">
                    <nav className='w-full'>
                        <FormInputText type='number' inputProps={{ min: formData?.total ?? 0 }} className="w-full" error={errors?.amount_paid} value={formData?.amount_paid} onChange={(e) => setFormData(cv => cv = { ...cv, amount_paid: e.target.value })} label='Amount Paid' placeholder='GHS (000)' />
                    </nav>
                    <nav className='w-full text-sm items-end flex text-right justify-self-end  gap-1  flex-col '>
                        <nav className=' text-xs'> Balance:</nav>
                        <nav className=' text-base font-bold'> {formatcurrency(getBalance)}</nav>
                    </nav>
                </nav>
                <nav className="flex items-center justify-between p-2 text-red-950 rounded-md">
                    <nav className='w-full'>
                        <FormInputSelect options={paymentMethods.length ? [...paymentMethods.map(method => { return ({ value: method.id, name: method.method }) })] : []} className=" w-full lg:w-1/2" error={errors?.payment_method} value={formData?.payment_method} onChange={(e) => setFormData(cv => cv = { ...cv, payment_method: e.target.value })} label='Payment Method' />
                    </nav>
                </nav>
                <nav className="flex items-center justify-between p-2 bg-red-50/50 text-red-950 rounded-md">
                    <nav>
                        TOTAL
                    </nav>
                    <nav className=' font-bold'>
                        {formatcurrency(formData?.total)}
                    </nav>
                </nav>
   </div>
  )
}

export default Payoutsection