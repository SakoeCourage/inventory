import React, { useEffect, useState } from 'react'
import Addmotion from '../../../components/Addmotion'
import Salereportproducts from '../productsalereport/Salereportproducts'
import { Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import Dateselection from './partials/Dateselection'
import dayjs from 'dayjs'
import Api from '../../../api/Api'
import Button from '../../../components/inputs/Button'
import { useSnackbar } from 'notistack'
import { AnimatePresence,motion } from 'framer-motion'
import Incomestatemenreportview from './Incomestatementcomponents/Incomestatemenreportview'
import Loadingwheel from '../../../components/Loaders/Loadingwheel'

const matchRoute = {
  "Week": "/report/income-week-report",
  "Month": "/report/income-month-report"
}

function index({ setCurrentComponent: setParentComponent }) {
  const [fullUrl, setFullUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState(null)
  const { enqueueSnackbar } = useSnackbar()
  const [data, setData] = useState([])
  const [collationMethod, setCollationMethod] = useState(null)
  const [nextPageUrl, setnextPageUrl] = useState(null)
  const [productsFromDB, setProductsFromDB] = useState([])
  const [scrollY, setScrollY] = useState(0)
  const [formData, setFormData] = useState({
    startDate: null,
    month: null,
    endDate: null,
    product_ids: [],
  })


  useEffect(() => {
    if (formData.startDate) {
      let day = new Date(formData.startDate)
      day.setDate(day.getDate() + 6)
      setFormData({ ...formData, endDate: dayjs(day).format('YYYY-MM-DD') })
    }
  }, [formData?.startDate])

  const handleOnValueChange = (k, v) => {
    if (Array.isArray(k) && typeof v === 'undefined') {
      const updatedFormData = { ...formData };
      k.forEach((keyValuePair) => {
        const [key, value] = Object.entries(keyValuePair)[0];
        updatedFormData[key] = value;
      });
      setFormData(updatedFormData);
    } else {
      setFormData({ ...formData, [k]: v });
    }
  };

  const handleReportGeneration = () => {
    if (collationMethod) {
      setIsLoading(true)
      Api.post(matchRoute[collationMethod], formData)
        .then(res => {
          setReportData(res.data)
          console.log(res?.data)
          setIsLoading(false)
          console.log(res.data)
        })
        .catch(err => {
          if (err.response.status === 422) {
            enqueueSnackbar(err?.response.data.message, { variant: 'error' })
          }
          setIsLoading(false)
        })
    }
  }

  return (
    <div className='bg-white border p-2 border-gray-300 rounded-md max-w-6xl mx-auto'>
        <h3 className=' text-gray-600 py-3 px-1 mb-3 border-b'>Income Report</h3>
      {isLoading && <Loadingwheel />}
      <AnimatePresence>
        {reportData && collationMethod && <motion.div
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
          <Incomestatemenreportview closeReportView={() => { setReportData(null); }} reportData={reportData} component={collationMethod} />
        </motion.div>}
      </AnimatePresence>
      <Addmotion className="pb-28 max-w-6xl mx-auto h-max">
        <Tooltip title="Report options">
          <button onClick={() => setParentComponent('Reportoptions')} className=' my-3 shadow border-b border-dotted border-gray-300 flex items-center gap-1 bg-info-100/50 text-info-900 p-2 rounded-md border w-max text-sm '>
            <Icon className=' text-gray-500' fontSize={20} icon="typcn:arrow-back-outline" />Report options
          </button>
        </Tooltip>
        <Dateselection
          collationMethod={collationMethod}
          setCollationMethod={setCollationMethod}
          formData={formData}
          setFormData={handleOnValueChange} />
        {/* <Salereportproducts
          setProductsFromDB={setProductsFromDB}
          productsFromDB={productsFromDB}
          scrollY={scrollY}
          setScrollY={setScrollY}
          data={data}
          setData={setData}
          setFullUrl={setFullUrl}
          setnextPageUrl={setnextPageUrl}
          nextPageUrl={nextPageUrl}
          setCurrentComponent={() => void (0)}
          formData={formData}
          setFormData={handleOnValueChange}
        /> */}
        <Button onClick={() => handleReportGeneration()} neutral text="Generate Report" className="w-full mt-10" />
      </Addmotion>
    </div>
  )
}

export default index