import React from 'react'
import { Icon } from '@iconify/react'
import FormInputText from '../../../../components/inputs/FormInputText'
function Customerinformation({ errors, formData, setFormData }) {
    return (
        <div className=' min-h-[12rem] bg-white border border-gray-400/70 rounded-md'>
            <nav className=' max-w-4xl mx-auto border-dotted flex items-center gap-2 p-3 text-blue-950/70'>
                <Icon icon="mdi:user" /> <span>Customer Information</span>
            </nav>
            <hr className='border border-gray-200 w-full border-dotted my-0' />
            <nav className='flex flex-col lg:flex-row gap-5 w-full px-3 py-1 my-5 max-w-4xl mx-auto'>
                <FormInputText error={errors['customer_fullname']} value={formData.customer_fullname} onChange={(e) => setFormData(cv => cv = { ...cv, customer_fullname: e.target.value })} className="w-full" label="Customer Full Name" />
                <FormInputText error={errors['customer_contact']} value={formData.customer_contact} onChange={(e) => setFormData(cv => cv = { ...cv, customer_contact: e.target.value })} className="w-full" placeholder="(000) 0000 000" label="Customer Contact" />
            </nav>
        </div>
    )
}

export default Customerinformation