import React, { useState } from 'react'
import Optioncard from '../partials/Optioncard'
import Addmotion from '../../../components/Addmotion'
import Button from '../../../components/inputs/Button'
import { Icon } from '@iconify/react'
import { Tooltip } from '@mui/material'
import Api from '../../../api/Api'
import { useSnackbar } from 'notistack'
import Productreportview from './Productreportformcomponents/Productreportview'
import { AnimatePresence, motion } from 'framer-motion'
import Loadingwheel from '../../../components/Loaders/Loadingwheel'
function Collationmethod({ setFormData, errors, formData, setCurrentComponent }) {
    const [reportData, setReportData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const handleReportGeneration = () => {
        setIsLoading(true)
        Api.post('/report/product-sale-report', formData)
            .then(res => {
                setIsLoading(false)
                setReportData(res.data)
            })
            .catch(err => {
                setIsLoading(false)

                if (err.response.status === 422) {
                    enqueueSnackbar(`${Object.entries(err?.response?.data?.errors)[0][1]}`, { variant: 'warning' })

                }
            })
    }
    return <>
        { isLoading && <Loadingwheel />}
        <AnimatePresence>
            {reportData && <motion.div
                initial={{ opacity: 0, translateY: '100vh' }}
                animate={{
                    opacity: 1,
                    translateY: '0',
                    transition: {
                        type: 'spring',
                        mass: 0.1,
                        damping: 8
                    }
                }}
                exit={{ opacity: 0, translateY: '100vh', transition: { duration: 0.2 } }}
                id="reportScrollContainer"
                className='fixed  inset-0 isolate  bg-gray-100 overflow-scroll z-[100]'>
                <Productreportview reportType={formData?.collation_method} closeReportView={() => setReportData(null)} reportData={reportData} />
            </motion.div>}
        </AnimatePresence>
        <Addmotion>
            <Tooltip title="Back">
                <button onClick={() => setCurrentComponent('Salereportparameter')} className=' my-3 shadow border-b border-dotted border-gray-300 flex items-center gap-1 bg-info-100/50 text-info-900 p-2 rounded-md border w-max text-sm '>
                    <Icon className=' text-gray-500' fontSize={20} icon="typcn:arrow-back-outline" />Back
                </button>
            </Tooltip>
            <nav className=' rounded-md mb-1 py-2 px-5 bg-info-100/50 text-info-900'>
                Choose how result is collated
            </nav>
            <nav className='p-3 my-2 text-gray-600 bg-white rounded-md shadow-medium flex flex-col  '>
                <span className={` ${errors?.collation_method && 'text-red-400'} mb-5`} > Collation Method</span>
                <nav className=' grid grid-cols-2 gap-3'>
                    <Optioncard onClick={() => setFormData('collation_method', 'Summarized')} className={`bg-emerald-200/40 text-white ring-emerald-500 transition-all duration-500 ring-offset-2 ${formData?.collation_method == 'Summarized' && 'ring-2'}`} caption="Summarized Report" />
                    <Optioncard disabled={formData.range === 'day'} onClick={() => setFormData('collation_method', 'Long')} className={`bg-emerald-200/40 text-white ring-emerald-500 transition-all duration-500 ring-offset-2 ${formData?.collation_method == 'Long' && 'ring-2'}`} caption="Long - Daily Report" />
                </nav>
            </nav>
            <Button onClick={() => handleReportGeneration()} neutral text="Generate Report" className="w-full mt-10" />
        </Addmotion>
    </>
}

export default Collationmethod