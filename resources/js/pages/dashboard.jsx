import React, { useEffect, useState } from 'react'
import Statsview from './dashboardcomponents/Statsview'
import LineChart from './dashboardcomponents/Linechart'
import Api from '../api/Api'
import { AnimatePresence } from 'framer-motion'
import SmartRecommendations from './dashboardcomponents/SmartRecommendations'
import Loadingwheel from '../components/Loaders/Loadingwheel'
import Dasboardloader from '../components/Loaders/Dasboardloader'
import StockAvailability from './dashboardcomponents/StockAvailability'
import ExpenseCard from './dashboardcomponents/ExpenseCard'

const Dashboard = () => {
  const [dashboardData, setDashBoardData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)


  /**
 * @description - Fetching Dashboard Data
 */
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

  useEffect(() => {
    console.log(dashboardData)
  }, [dashboardData])


  return (
    <div className='h-max  relative  '>
      {dashboardData && <div>  <Statsview dashboardData={dashboardData} />
        <div className=' container flex flex-col lg:flex-row gap-2  mx-auto mt-4 '>
          <LineChart dashboardData={dashboardData} />
          <ExpenseCard dashboardData={dashboardData} />
          {/* <SmartRecommendations unattended_products={dashboardData.unattended_products} smart_recommendations={dashboardData.smart_recommendations} /> */}
        </div>
      </div>}
      <Dasboardloader isLoading={isLoading} />

    </div>
  )
}

export default Dashboard
