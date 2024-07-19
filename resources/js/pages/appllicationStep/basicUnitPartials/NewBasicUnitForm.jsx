import React, { useEffect, useState } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import Button from '../../../components/inputs/Button'
import Api from '../../../api/Api'

function NewBasicUnitForm({ onClose, showBasicQuantityForm, fetchBasicQuantityTable }) {
    const [formData, setFormData] = useState({
        name: "",
        symbol: "",
    })
    const [errors, setErrors] = useState({

    })
    useEffect(() => {
        const { name, symbol, id, mode } = showBasicQuantityForm
        if (mode == 'Update Basic Selling Quantity') {
            setFormData({
                name: name,
                symbol: symbol,
                id: id
            })
        }
    }, [showBasicQuantityForm])

    const handleSubmit = () => {
        Api.post('/basic-unit/updateorcreate', formData)
            .then(res => {
                fetchBasicQuantityTable()
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
                    error={errors?.name}
                    helperText={errors?.name}
                    value={formData.name}
                    onChange={(e) => setFormData(cv => cv = { ...cv, name: e.target.value })}
                    label='Basic Quantity Name' />
                <FormInputText
                    error={errors?.symbol}
                    helperText={errors?.symbol}
                    value={formData.symbol}
                    onChange={(e) => setFormData(cv => cv = { ...cv, symbol: e.target.value })}
                    label='Symbol' />
            </nav>
            <nav className='flex items-center mt-auto w-full p-2'>
                <Button onClick={() => onClose()} otherClasses="grow" text="cancel" neutral />
                <Button onClick={() => handleSubmit()} otherClasses="grow" text="save" info />
            </nav>
        </div>


    )
}

export default NewBasicUnitForm