import React, { useState } from 'react'
import Optioncard from '../../partials/Optioncard'
import FormInputDate from '../../../../components/inputs/FormInputDate'
import { Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import Addmotion from '../../../../components/Addmotion'
import dayjs from 'dayjs'

function Selectionscreen({ collationMethod, setCollationMethod,setCurrentComponent }) {
    return <Addmotion className=' grid grid-cols-2 gap-3'>
        <Optioncard onClick={() => {setCollationMethod('Week');setCurrentComponent('Weekly')}} className={`bg-emerald-200/40 text-white ring-emerald-500 transition-all duration-500 ring-offset-2 ${collationMethod == 'Week' && 'ring-2'}`} caption="A Week" />
        <Optioncard onClick={() => {setCollationMethod('Month');setCurrentComponent("Monthly")}} className={`bg-emerald-200/40 text-white ring-emerald-500 transition-all duration-500 ring-offset-2 ${collationMethod == 'Month' && 'ring-2'}`} caption="A Month" />
    </Addmotion>
}

function Weekly({setCurrentComponent:setParentComponent,setFormData,formData}) {
    return <Addmotion className=' py-2 px-5 flex items-center justify-center flex-col gap-2'>
        <Tooltip title="Report options">
            <button onClick={() => setParentComponent('Selectionscreen')} className=' my-3 shadow border-b border-dotted border-gray-300 flex items-center gap-1 bg-info-100/50 text-info-900 p-2 rounded-md border w-max text-sm '>
                <Icon className=' text-gray-500' fontSize={20} icon="typcn:arrow-back-outline" />Collaction Method
            </button>
        </Tooltip>
        <nav>
            Choose a day within the week
        </nav>
        <nav>
            <FormInputDate value={dayjs(formData?.startDate)} onChange={(e) => setFormData('startDate', dayjs(e.target.value).format('YYYY-MM-DD'))} />
        </nav>
    </Addmotion>
}
function Monthly({setCurrentComponent:setParentComponent,setFormData,formData}) {
    return <Addmotion className=' py-2 px-5 flex items-center justify-center flex-col gap-2'>
        <Tooltip title="Report options">
            <button onClick={() => setParentComponent('Selectionscreen')} className=' my-3 shadow border-b border-dotted border-gray-300 flex items-center gap-1 bg-info-100/50 text-info-900 p-2 rounded-md border w-max text-sm '>
                <Icon className=' text-gray-500' fontSize={20} icon="typcn:arrow-back-outline" />Collaction Method
            </button>
        </Tooltip>
        <nav>
            Choose a Month
        </nav>
        <nav>
            <FormInputDate value={dayjs(formData?.month)} onChange={(e) => setFormData('month', dayjs(e.target.value).format('YYYY-MM'))}  views={['year', 'month']} />
        </nav>
    </Addmotion>
}

const components = {
    Selectionscreen: Selectionscreen,
    Weekly: Weekly,
    Monthly: Monthly,
}

function Dateselection({ setFormData,formData ,collationMethod, setCollationMethod}) {
   
    const [currentComponent, setCurrentComponent] = useState('Selectionscreen')
    const Component = components[currentComponent]
    return (
        <div className='my-4'>
            <nav className=' rounded-md mb-1 py-2 px-5 bg-info-100/50 text-info-900'>
                Choose how result is collated
            </nav>
            <nav className='p-3 my-2 text-gray-600 bg-white rounded-md shadow-medium flex flex-col  '>
                <span className={` ${false && 'text-red-400'} mb-5`} > Collation Method</span>
                <Component formData={formData} setFormData={setFormData} setCurrentComponent={setCurrentComponent} collationMethod={collationMethod} setCollationMethod={setCollationMethod} />
            </nav>
        </div>
    )
}

export default Dateselection