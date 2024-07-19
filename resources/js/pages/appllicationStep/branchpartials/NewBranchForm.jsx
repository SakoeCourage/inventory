import React, { useEffect, useState } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import Button from '../../../components/inputs/Button'
import Api from '../../../api/Api'

function NewBranchForm({ onClose, showBranchForm, fetchBranchedTable }) {
    const [formData, setFormData] = useState({
        branch_name: '',
    })
    const [errors, setErrors] = useState({

    })
    useEffect(() => {
        const { branch_name, id, mode } = showBranchForm
        if (mode == 'Update Branch Data') {
            setFormData({
                id: id,
                branch_name: branch_name
            })
        }
    }, [showBranchForm])

    const handleSubmit = () => {
        Api.post('/branch/updateorcreate', formData)
            .then(res => {
                fetchBranchedTable()
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
                    error={errors?.branch_name}
                    helperText={errors?.branch_name}
                    value={formData.branch_name}
                    onChange={(e) => setFormData(cv => cv = { ...cv, branch_name: e.target.value })}
                    label='Branch Name' />
            </nav>
            <nav className='flex items-center mt-auto w-full p-2'>
                <Button onClick={() => onClose()} otherClasses="grow" text="cancel" neutral />
                <Button onClick={() => handleSubmit()} otherClasses="grow" text="save" info />
            </nav>
        </div>


    )
}

export default NewBranchForm