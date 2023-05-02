import React, { useEffect, useState } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import FormInputSelect from '../../../components/inputs/FormInputSelect'
import Button from '../../../components/inputs/Button'
import Api from '../../../api/Api'
import Loadingspinner from '../../../components/Loaders/Loadingspinner'

function Userform({ showUserForm, onClose, roles, fetchUsersData }) {
    const [errors, setErrors] = useState({})
    const [route, setRoute] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        email: '',
        firstname: '',
        lastname: '',
        gender: '',
        contact: '',
        role: ''
    })

    const getUser = (id) => {
        setIsLoading(true)
        Api.get(`/user/get/info/${id}`)
            .then(res => {
                setFormData(res.data)
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleSubmit = () => {
        Api.post(route, formData)
            .then(res => {
                console.log(res.data)
                onClose()
                fetchUsersData()
            })
            .catch(err => {
                console.log(err)
                if (err.response.status == 422) {
                    setErrors(err.response?.data?.errors)
                }
            })
    }

    useEffect(() => {
        if (showUserForm?.id) {
            getUser(showUserForm?.id)
            setFormData(cv => cv = { ...cv, id: showUserForm?.id })
            setRoute('/user/update/' + showUserForm?.id)
        } else {
            setRoute('/user/create')
        }
    }, [showUserForm])


    return (
        <div className='h-full flex flex-col w-full overflow-y-scroll relative '>
            {isLoading && <div className=' bg-white absolute inset-0 flex items-center justify-center'>
                <Loadingspinner />
            </div>}
            <nav className="flex flex-col my-auto max-w-lg w-full mx-auto gap-5 py-4">
                <nav className=' flex items-center gap-5 flex-col '>
                    <FormInputText className="w-full" error={errors?.firstname} helperText={errors?.firstname} value={formData.firstname} onChange={(e) => setFormData(cv => cv = { ...cv, firstname: e.target.value })} label='First Name' />
                    <FormInputText className="w-full" error={errors?.lastname} helperText={errors?.lastname} value={formData.lastname} onChange={(e) => setFormData(cv => cv = { ...cv, lastname: e.target.value })} label='Last Name' />
                </nav>
                <nav className=' flex items-center gap-5 flex-col '>
                    <FormInputText className="w-full" error={errors?.name} helperText={errors?.name} value={formData.name} onChange={(e) => setFormData(cv => cv = { ...cv, name: e.target.value })} label='User Name' />
                    <FormInputText className="w-full" error={errors?.email} helperText={errors?.email} value={formData.email} onChange={(e) => setFormData(cv => cv = { ...cv, email: e.target.value })} label='Email' />
                </nav>
                <nav className=' flex items-center gap-5 flex-col '>
                    <FormInputText className="w-full" error={errors?.contact} helperText={errors?.contact} value={formData.contact} onChange={(e) => setFormData(cv => cv = { ...cv, contact: e.target.value })} label='Contact' placeholder="(000) 0000 000" />
                    <FormInputSelect className="w-full" options={[{ name: 'Male', value: 'Male' }, { name: 'Female', value: 'Female' }]} error={errors?.gender} helperText={errors?.gender} value={formData.gender} onChange={(e) => setFormData(cv => cv = { ...cv, gender: e.target.value })} label='Gender' />
                </nav>
                <FormInputSelect className="w-full" options={roles ? [...roles.map((role) => { return { name: role.name, value: role.name } })] : []} error={errors?.role} helperText={errors?.role} value={formData.role} onChange={(e) => setFormData(cv => cv = { ...cv, role: e.target.value })} label='User Role' />
            </nav>
            <nav className='flex items-center mt-auto w-full p-2'>
                <Button onClick={() => onClose()} otherClasses="grow" text="cancel" neutral />
                <Button onClick={() => handleSubmit()} otherClasses="grow" text="save" info />
            </nav>
        </div>
    )
}

export default Userform