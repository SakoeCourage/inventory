import React, { useEffect, useState } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import Button from '../../../components/inputs/Button'
import Api from '../../../api/Api'
import SelectInput from '@mui/material/Select/SelectInput'
import FormInputSelect from '../../../components/inputs/FormInputSelect'
import { SnackbarProvider, useSnackbar } from 'notistack'
import Loadingspinner from '../../../components/Loaders/Loadingspinner'

function NewStoreForm({ onClose, showStoreForm, fetchStoreTable }) {
    const [formData, setFormData] = useState({
        store_name: '',
        store_branch_id: ''
    })
    const [errors, setErrors] = useState({

    })

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [loadingStoreBranches, setLoadingStoreBranches] = useState(false)
    /**
     * @typedef storeBranchesType
     * @property  {string} branch_name 
     * @property  {number} id 
     */

    /**
     * @type {[storeBranchesType[],React.Dispatch<React.SetStateAction<storeBranchesType[]>>]}
     */
    const [storeBranches, setStoreBranches] = useState([])

    useEffect(() => {
        const { store_branch_id, id, store_name, mode } = showStoreForm
        console.log(showStoreForm)
        if (mode == 'Update Store Data') {
            setFormData({
                id: id,
                store_branch_id: store_branch_id,
                store_name: store_name
            })
        }
    }, [showStoreForm])

    const handleSubmit = () => {
        Api.post('/store/updateorcreate', formData)
            .then(res => {
                fetchStoreTable()
                onClose()
            })
            .catch(err => {
                console.log(err)
                if (err.response?.status == 422) {
                    setErrors(err.response?.data?.errors)
                }
            })
    }

    const fetchAvailableBranchesAsync = async () => {
        try {
            setLoadingStoreBranches(true)
            var branches = await Api.get('toselect/branches')
            setStoreBranches(branches?.data)
        } catch (error) {
            enqueueSnackbar('Failed to load branch list', { variant: 'error' })
        } finally {
            setLoadingStoreBranches(false)
        }
    }

    useEffect(() => {
        fetchAvailableBranchesAsync()
    }, [])

    return (

        <div className='h-full flex flex-col w-full relative'>
            {loadingStoreBranches && <div className="absolute inset-0 flex items-center justify-center bg-white z-30">
                <Loadingspinner />
            </div>}
            <nav className="flex flex-col my-auto max-w-lg w-full mx-auto gap-5">
                <FormInputSelect
                    label="Branch"
                    options={Boolean(storeBranches?.length) ?
                        storeBranches.map(br => ({ name: br.branch_name, value: br.id })) : []
                    }
                    value={formData.store_branch_id}
                    error={errors?.store_branch_id}
                    helperText={errors?.store_branch_id}
                    onChange={(e) => { setFormData(cv => cv = { ...cv, store_branch_id: e.target.value }) }}
                />
                <FormInputText
                    error={errors?.store_name}
                    helperText={errors?.store_name}
                    value={formData.store_name}
                    onChange={(e) => setFormData(cv => cv = { ...cv, store_name: e.target.value })}
                    label='Store Name' />

            </nav>
            <nav className='flex items-center mt-auto w-full p-2'>
                <Button onClick={() => onClose()} otherClasses="grow" text="cancel" neutral />
                <Button onClick={() => handleSubmit()} otherClasses="grow" text="save" info />
            </nav>
        </div>


    )
}

export default NewStoreForm