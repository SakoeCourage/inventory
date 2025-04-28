import React from 'react'
import FormInputText from '../../../../components/inputs/FormInputText'
import FormInputSelect from '../../../../components/inputs/FormInputSelect'
import { formatcurrency } from '../../../../api/Util'
import QuestionAnswerSection from '../../../../components/ui/QuestionAnswerSection'

function Payoutsection({ formData, saleDiscount, errors, setFormData, paymentMethods, getBalance }) {
    return (
        <div className=' bg-white/50 shadow border-2 border-gray-400 my-1 p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 rounded-md border-inherit'>
            <nav className="flex items-center justify-between w-full p-2 text-red-950 rounded-md">
                <nav className='w-full'>
                    <FormInputSelect options={paymentMethods.length ? [...paymentMethods.map(method => { return ({ value: method.id, name: method.method }) })] : []} className=" w-full" error={errors?.payment_method} value={formData?.payment_method} onChange={(e) => setFormData(cv => cv = { ...cv, payment_method: e.target.value })} label='Payment Method' />
                </nav>
            </nav>
            <nav className="flex items-center justify-between p-2 text-red-950 rounded-md">
                <nav className='w-full'>
                    <FormInputText type='number' inputProps={{ min: formData?.total ?? 0 }} className="w-full" error={errors?.amount_paid} value={formData?.amount_paid} onChange={(e) => setFormData(cv => cv = { ...cv, amount_paid: e.target.value })} label='Amount Paid' placeholder='GHS (000)' />
                </nav>
            </nav>
            <nav className="flex items-center justify-between p-2 text-red-950 rounded-md">
                <nav className='w-full'>
                    <FormInputText type='number' error={errors.discount_rate} inputProps={{ inputMode: 'numeric', min: 0, max: 100 }} className="w-full" value={formData?.discount_rate} onChange={(e) => setFormData(cv => cv = { ...cv, discount_rate: e.target.value })} label='Sale Discount' placeholder='(%)' />
                </nav>
            </nav>

            <nav className="flex flex-col items-center justify-between p-2  text-red-950 rounded-md">
                <QuestionAnswerSection
                    question={<> <nav className=' '>
                        SUB TOTAL
                    </nav></>
                    }
                    answer={
                        <nav className=' '>
                            {formatcurrency(formData?.sub_total)}
                        </nav>
                    }
                />
            </nav>
            <nav className="flex flex-col items-center justify-between p-2  text-red-950 rounded-md">
                <QuestionAnswerSection
                    question={<>    <nav className=' '>
                        BALANCE
                    </nav></>
                    }
                    answer={
                        <nav className=' '>
                            {formatcurrency(getBalance)}
                        </nav>
                    }
                />
            </nav>
            <nav className="flex flex-col items-center justify-between p-2  text-red-950 rounded-md">
                <QuestionAnswerSection
                    question={<>
                        <nav className=' '>
                            TOTAL
                        </nav>
                    </>
                    }
                    answer={
                        <nav className=' '>
                            {formatcurrency(formData?.total)}
                        </nav>
                    }
                />
            </nav>
        </div>
    )
}

export default Payoutsection