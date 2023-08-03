import React, { useEffect, useState } from 'react'
import Statsview from './dashboardcomponents/Statsview'
import LineChart from './dashboardcomponents/Linechart'
import Api from '../api/Api'
import { AnimatePresence } from 'framer-motion'
import SmartRecommendations from './dashboardcomponents/SmartRecommendations'
import Loadingwheel from '../components/Loaders/Loadingwheel'
import Dasboardloader from '../components/Loaders/Dasboardloader'

const Dashboard = () => {
  const [dashboardData, setDashBoardData] = useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const getDashBoardData = () => {
    setIsLoading(true)
    Api.get('/dashboard/data')
      .then(res => {
        setDashBoardData(res.data)
        setIsLoading(false)
      }).catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    getDashBoardData()
  }, [])

  return (
    <div className='h-max  relative  '>
      {dashboardData && <div>  <Statsview dashboardData={dashboardData} />
      <div className=' max-w-[90rem] flex flex-col lg:flex-row gap-2  mx-auto mt-4 '>
        <LineChart dashboardData={dashboardData} />
        <SmartRecommendations unattended_products={dashboardData.unattended_products} smart_recommendations={dashboardData.smart_recommendations} />
      </div>
      </div>}
     
     <Dasboardloader isLoading={isLoading} />
   
     
    </div>
  )
}

export default Dashboard
