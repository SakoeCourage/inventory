import React from 'react'
import { Icon } from '@iconify/react'
import FormInputText from '../../../../components/inputs/FormInputText'
function Customerinformation({ errors, formData, setFormData }) {
    return (
        <div className=' bg-white/50  border border-gray-400/70 rounded-md'>
            <nav className='flex flex-col lg:flex-row gap-5 w-full px-3 py-1 my-5 max-w-4xl mx-auto'>
                <FormInputText error={errors['customer_fullname']} value={formData.customer_fullname} onChange={(e) => setFormData(cv => cv = { ...cv, customer_fullname: e.target.value })} className="w-full" label="Customer Full Name" />
                <FormInputText error={errors['customer_contact']} value={formData.customer_contact} onChange={(e) => setFormData(cv => cv = { ...cv, customer_contact: e.target.value })} className="w-full" placeholder="(000) 0000 000" label="Customer Contact" />
            </nav>
        </div>
    )
}

export default Customerinformation