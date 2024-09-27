import React, { useState } from 'react'
import FormInputDate from '../../../components/inputs/FormInputDate'
import Button from '../../../components/inputs/Button'
import { Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import Optioncard from '../partials/Optioncard'
import dayjs from 'dayjs'
import { handleValidation } from '../../../api/Util'
import Addmotion from '../../../components/Addmotion'
import { object, string, number, date, boolean, array } from 'yup';
import Salereportproducts from './Salereportproducts'
import { handleScrolltoError } from '../../../api/Util'

function Salereportparameter({ setCurrentComponent, setProductsFromDB, productsFromDB, setParentComponent, formData, setFormData, data, setData, setFullUrl, setnextPageUrl, nextPageUrl, scrollY, setScrollY }) {
    const [errors, setErrors] = useState({})
    const { enqueueSnackbar } = useSnackbar()
    let schema = object({
        range: string().required('This field is required'),
        start_date: string().required('This field is required').typeError('This field is required'),
        end_date: string().when('range', {
            is: (value) => value === 'range',
            then: () => string().required('This field is required').typeError('This field is required'),
            otherwise: () => string().notRequired()
        }),
        product_ids: array().min(1).required("This field is required")
    })


    const handleOnProceed = () => {
        handleValidation(schema, formData)
            .then(res => {
                setCurrentComponent('Collationmethod')
            })
            .catch(err => {
                const miuiError = document.querySelectorAll('.Mui-error')
                handleScrolltoError(miuiError, 'Mui-error', 'outlet')
            })
    }
    return (
        <div className=' p-3 bg-white border border-gray-300 rounded-md'>
            <h3 className=' text-gray-600 py-3 px-1 mb-3 border-b'>Product Sale Report</h3>
            <Addmotion className="pb-28">
                <Tooltip title="Report options">
                    <button onClick={() => setParentComponent('Reportoptions')} className=' my-3 shadow border-b border-dotted border-gray-300 flex items-center gap-1 bg-info-100/50 text-info-900 p-2 rounded-md border w-max text-sm '>
                        <Icon className=' text-gray-500' fontSize={20} icon="typcn:arrow-back-outline" />Report options
                    </button>
                </Tooltip>
                <nav className='p-3 text-gray-600 mb-4 bg-white rounded-md shadow-medium flex flex-col gap-5 '>
                    <span className={` ${errors?.range && 'text-red-400 Mui-error'}`}> Choose prefered date(s)</span>
                    <nav className=' flex items-center gap-3 w-full'>
                        <Button onClick={() => setFormData([{ end_date: null }, { range: 'day' }, { collation_method: null }])} {...(formData.range === 'day' ? {} : { neutral: true })} className=" grow" text="A Day" />
                        <Button onClick={() => setFormData([{ range: 'range' }, { collation_method: null }])} {...(formData.range === 'range' ? {} : { neutral: true })} className=" grow" text="Date Range" />
                    </nav>
                    <nav className=' flex flex-col md:flex-row gap-5'>
                        <FormInputDate error={errors?.start_date} maxDate={dayjs(new Date())} value={dayjs(formData?.start_date)} onChange={(e) => setFormData('start_date', dayjs(e.target.value).format('YYYY-MM-DD'))} className="grow" label="Select Date" />
                        {formData.range === "range" && <nav className=' inline-block h-full my-auto mx-auto '>To</nav>}
                        {formData.range === "range" &&
                            <Addmotion className="grow">
                                <FormInputDate error={errors?.end_date} maxDate={dayjs(new Date())} minDate={dayjs(formData?.start_date).add(1, 'day')} value={dayjs(formData?.end_date)} onChange={(e) => setFormData('end_date', dayjs(e.target.value).format('YYYY-MM-DD'))} className="w-full" label="Select Date" />
                            </Addmotion>

                        }
                    </nav>
                </nav>
                <Salereportproducts
                    setProductsFromDB={setProductsFromDB}
                    productsFromDB={productsFromDB}
                    scrollY={scrollY}
                    setScrollY={setScrollY}
                    data={data}
                    setData={setData}
                    setFullUrl={setFullUrl}
                    setnextPageUrl={setnextPageUrl}
                    nextPageUrl={nextPageUrl}
                    setCurrentComponent={setCurrentComponent}
                    formData={formData}
                    setFormData={setFormData}
                />
                <nav className="shadow-medium bg-white rounded-md p-2 my-4">
                    <Button onClick={() => handleOnProceed()} neutral className=" w-full flex items-center justify-center gap-10">
                        <span className=' my-auto h-full mx-2 inline-block'>
                            Proceed
                        </span>
                        <Icon className='my-auto' fontSize={25} icon="material-symbols:arrow-right-alt-rounded" />
                    </Button>
                </nav>
            </Addmotion>
        </div>
    )
}

export default Salereportparameter