import React, { useEffect, useState } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import Button from '../../../components/inputs/Button'
import Api from '../../../api/Api'
import { SnackbarProvider, useSnackbar } from 'notistack'
function Roleform({ onClose, fetchRolesData, showRoleForm }) {
  const [errors, setErrors] = useState({})
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [formData, setFormData] = useState({
    id: null,
    name: ''
  })

  useEffect(() => {
    if (showRoleForm?.id) {
      setFormData({
        id: showRoleForm.id,
        name: showRoleForm.name
      })
    }
  }, [showRoleForm])

  const handleSubmit = () => {
    Api.post('/roles/updateorcreate', formData).then(res => {
      console.log(res.data)
      onClose()
      fetchRolesData()
    })
      .catch(err => {
        console.log(err)
        if (err.respose?.status == 422) {
          setErrors(err.response?.data?.errors)
        }
        enqueueSnackbar(err.response.data.message, { variant: 'error' })
      })
  }

  return (
    <div className='h-full flex flex-col w-full '>
      <nav className="flex flex-col my-auto max-w-lg w-full mx-auto gap-5">
        <FormInputText error={errors?.name} helperText={errors?.name} value={formData.name} onChange={(e) => setFormData(cv => cv = { ...cv, name: e.target.value })} label='Role Name' />
      </nav>
      <nav className='flex items-center mt-auto w-full p-2'>
        <Button onClick={() => onClose()} otherClasses="grow" text="cancel" neutral />
        <Button onClick={() => handleSubmit()} otherClasses="grow" text="save" info />
      </nav>
    </div>
  )
}

export default Roleform