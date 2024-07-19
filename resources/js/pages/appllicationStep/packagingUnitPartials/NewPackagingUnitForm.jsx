import React, { useEffect, useState } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import Button from '../../../components/inputs/Button'
import Api from '../../../api/Api'

function NewPackagingUnitForm({ onClose, showPackagingUnitForm, fetchPackagingUnitTable }) {
    const [formData, setFormData] = useState({
        type: "",
    })
    const [errors, setErrors] = useState({

    })
    useEffect(() => {
        const { type, id, mode } = showPackagingUnitForm
        if (mode == 'Update Packaging Quantity') {
            setFormData({
                type: type,
                id: id
            })
        }
    }, [showPackagingUnitForm])

    const handleSubmit = () => {
        Api.post('/packaging-unit/updateorcreate', formData)
            .then(res => {
                fetchPackagingUnitTable()
                onClose()
            })
            .catch(err => {
                console.log(err)
                if (err.response?.status == 422) {
                    setErrors(err.response?.data?.errors)
                }
            })
    }
    return (

        <div className='h-full flex flex-col w-full'>
            <nav className="flex flex-col my-auto max-w-lg w-full mx-auto gap-5">
                <FormInputText
                    error={errors?.type}
                    helperText={errors?.type}
                    value={formData.type}
                    onChange={(e) => setFormData(cv => cv = { ...cv, type: e.target.value })}
                    label='Packaging Type' />
            </nav>
            <nav className='flex items-center mt-auto w-full p-2'>
                <Button onClick={() => onClose()} otherClasses="grow" text="cancel" neutral />
                <Button onClick={() => handleSubmit()} otherClasses="grow" text="save" info />
            </nav>
        </div>


    )
}

export default NewPackagingUnitForm