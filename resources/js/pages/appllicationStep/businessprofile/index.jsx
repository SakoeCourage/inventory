import React, { useEffect, useState } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import Formhook from '../../../components/formcomponents/formhook'
import Button from '../../../components/inputs/Button'
import Api from '../../../api/Api'
import Loadingwheel from '../../../components/Loaders/Loadingwheel'
import { enqueueSnackbar } from 'notistack'
function index() {
  const [isLoading, setIsLoading] = useState(false)
  const { post, setData, data, errors, processing } = Formhook({
    business_name: '',
    box_number: '',
    address: '',
    street: '',
    tel_1: '',
    tel_2: '',
    business_email: '',
    about_business: ''
  })

  const fetchbusinessprofile = () => {
    setIsLoading(true)
    Api.get('/business-profile/get')
      .then(res => {
        setData(res.data)
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchbusinessprofile()
  }, [])

  return (
    <div className='max-w-6xl mx-auto py-10 h-max '>
      {(isLoading || processing) && <Loadingwheel />}
      <nav className=' bg-white border h-max border-gray-400/70 rounded-md w-full gap-10 p-5 grid grid-cols-1 md:grid-cols-2 '>
        <nav className=' col-span-1 md:col-span-2  border-b border-dotted border-blue-900'>Business Information </nav>
        <nav className="flex flex-col gap-4 text-gray-600">
          <nav>Business Name <abbr title="required" className=' text-red-500 ml-1'>*</abbr></nav>
          <FormInputText error={errors?.business_name} value={data.business_name} onChange={(e) => setData('business_name', e.target.value)} placeholder="Business Name" />
        </nav>
        <nav className="flex flex-col gap-4 text-gray-600">
          <nav>Box Number <abbr title="required" className=' text-red-500 ml-1'>*</abbr></nav>
          <FormInputText error={errors?.box_number} value={data.box_number} onChange={(e) => setData('box_number', e.target.value)} placeholder="P.O box" />
        </nav>
        <nav className="flex flex-col gap-4 text-gray-600">
          <nav>Address / Location  <abbr title="required" className=' text-red-500 ml-1'>*</abbr></nav>
          <FormInputText error={errors?.address} value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder="Business Address" />
        </nav>
        <nav className="flex flex-col gap-4 text-gray-600">
          <nav>Business Email</nav>
          <FormInputText error={errors?.business_email} value={data.business_email} onChange={(e) => setData('business_email', e.target.value)} placeholder="Business Email" />
        </nav>
        <nav className="flex flex-col gap-4 text-gray-600">
          <nav>Street <abbr title="required" className=' text-red-500 ml-1'>*</abbr></nav>
          <FormInputText error={errors?.street} value={data.street} onChange={(e) => setData('street', e.target.value)} placeholder="Street" />
        </nav>
        <nav className="flex flex-col gap-4 text-gray-600">
          <nav>Tel 1 <abbr title="required" className=' text-red-500 ml-1'>*</abbr></nav>
          <FormInputText error={errors?.tel_1} value={data.tel_1} onChange={(e) => setData('tel_1', e.target.value)} placeholder="(000) 0000 000" />

        </nav>
        <nav className="flex flex-col gap-4 text-gray-600">
          <nav>Tel 2</nav>
          <FormInputText error={errors?.tel_2} value={data.tel_2} onChange={(e) => setData('tel_2', e.target.value)} placeholder="(000) 0000 000" />
        </nav>
        <nav className="flex flex-col col-span-1 md:col-span-2 gap-4 text-gray-600">
          <nav>About Business</nav>
          <FormInputText error={errors?.about_business} value={data.about_business} onChange={(e) => setData('about_business', e.target.value)} rows={3} multiline={true} placeholder="" />
        </nav>
        <nav className='col-span-1 md:col-span-2 flex items-center justify-end'>
          <Button onClick={() => post('/business-profile/create-update',{onSuccess:()=>{fetchbusinessprofile();enqueueSnackbar('Record updated',{variant:'success'})}})} className="w-full md:w-auto" text="Save Changes" />
        </nav>
      </nav>

    </div>
  )
}

export default index