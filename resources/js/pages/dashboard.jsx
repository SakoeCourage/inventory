import React, { useEffect, useState } from 'react'
import Statsview from './dashboardcomponents/Statsview'
import LineChart from './dashboardcomponents/Linechart'
import Api from '../api/Api'
import { AnimatePresence } from 'framer-motion'

import Dasboardloader from '../components/Loaders/Dasboardloader'
const Dashboard = () => {
  const [dashboardData, setDashBoardData] = useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const getDashBoardData = () => {
    setIsLoading(true)
    Api.get('/dashboard/data')
      .then(res => {
        console.log(res.data)
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
      <div className='card rounded-md  max-w-[90rem]  mx-auto mt-4 shadow-md p-10 border border-gray-400/40'>
        <LineChart dashboardData={dashboardData}  />
      </div>
      </div>}
     
     <Dasboardloader isLoading={isLoading} />
    
     
    </div>
  )
}

export default Dashboard
