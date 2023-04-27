import React, { useEffect, useState } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import Button from '../../../components/inputs/Button'
import Api from '../../../api/Api'

function Newcategoryform({ onClose, showCategoryForm, fetchCategoriesData }) {
    const [formData, setFormData] = useState({
        category: '',
    })
    const [errors, setErrors] = useState({

    })
    useEffect(() => {
        const { category, id, mode } = showCategoryForm
        if (mode == 'Update Category Data') {
            setFormData({
                id: id,
                category: category
            })
        }
    }, [showCategoryForm])

    const handleSubmit = () => {
        Api.post('/category/updateorcreate', formData)
            .then(res => {
                fetchCategoriesData()
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
                <FormInputText error={errors?.category} helperText={errors?.category} value={formData.category} onChange={(e) => setFormData(cv => cv = { ...cv, category: e.target.value })} label='Category Name' />
            </nav>
            <nav className='flex items-center mt-auto w-full p-2'>
                <Button onClick={() => onClose()} otherClasses="grow" text="cancel" neutral />
                <Button onClick={() => handleSubmit()} otherClasses="grow" text="save" info />
            </nav>
        </div>


    )
}

export default Newcategoryform