import React, { useEffect, useState } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import Button from '../../../components/inputs/Button'
import Api from '../../../api/Api'

function Newsupplierform({fetchSupplierData,onClose,showSupplierForm}) {
    const[formData, setFormData] = useState({
        supplier_name: '',
        supplier_contact:''
    })
    const [errors, setErrors] = useState({

    })
    useEffect(() => {
      const {supplier_name,supplier_contact,id,mode }= showSupplierForm
      if(mode == 'Update Supplier Data'){
        setFormData({
            id: id,
            supplier_contact: supplier_contact,
            supplier_name: supplier_name
        })
      }
    }, [showSupplierForm])

    const handleSubmit = () =>{
        Api.post('/supplier/updateorcreate',formData)
        .then(res=>{
            fetchSupplierData()
            onClose()
        })
        .catch(err=>{
            console.log(err)
            if(err.response?.status == 422){
                 setErrors(err.response?.data?.errors)
            }
        })
    }
    
  return (
    <div className='h-full flex flex-col w-full'>
        <nav className="flex flex-col my-auto max-w-lg w-full mx-auto gap-5">
            <FormInputText error={errors?.supplier_name} helperText={errors?.supplier_name} value={formData.supplier_name} onChange={(e)=>setFormData(cv=>cv={...cv,supplier_name:e.target.value})} label='Supplier Name'/>
            <FormInputText error={errors?.supplier_contact} helperText={errors?.supplier_contact} value={formData.supplier_contact} onChange={(e)=>setFormData(cv=>cv={...cv,supplier_contact:e.target.value})} label='Supplier Contact'/>
        </nav>
        <nav className='flex items-center mt-auto w-full p-2'>
            <Button onClick={()=>onClose()}  otherClasses="grow" text="cancel" neutral/>
            <Button onClick={()=>handleSubmit()} otherClasses="grow" text="save" info/>
        </nav>
    </div>
  )
}

export default Newsupplierform