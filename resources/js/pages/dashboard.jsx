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
import IconifyIcon from '../components/ui/IconifyIcon'
import { DateCalendar } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import ClickAwayListener from 'react-click-away-listener'



const DateButtons = ({ children, onClick, active = false }) => {
  useEffect(() => {
    console.log(active)
  }, [active])

  return <button onClick={onClick} className={`text-gray-700 flex items-center gap-2 rounded-md border border-gray-400 font-medium px-5 py-1 bg-lime-50/30 shadow-md ${active && ' !bg-info-900 text-white'}`}>
    {active && <IconifyIcon className="!p-0 !h-6 !w-6" icon="material-symbols-light:check" />}
    {children}
  </button>
}


const Dashboard = () => {
  const [dashboardData, setDashBoardData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [anchor, setAnchor] = React.useState(null);

  const handleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const open = Boolean(anchor);

  const id = open ? 'simple-popper' : undefined;

  /**
 * @description - Fetching Dashboard Data
 */
  const getDashBoardData = () => {
    setIsLoading(true)
    Api.get('/dashboard/data')
      .then(res => {
        setDashBoardData(res.data)
        console.log(res.data)
        setIsLoading(false)
      }).catch(err => {
        console.log(err)
      })
  }

  const fetchDashboardDataByDate = (date) => {
    if (date == null) return;
    Api.get('/dashboard/data?date=' + date)
      .then(res => {
        setDashBoardData(res.data)
        console.log(res.data)
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

  const today = dayjs().format('YYYY-MM-DD');
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

  return (
    <div className='h-max  relative  '>
      <nav className='bg-gray-100 p-2'>
        <nav className='flex items-center gap-2 px-5 container mx-auto'>
          <DateButtons active={dayjs(dashboardData?.date).format("YYYY-MM-DD") == today} onClick={() => fetchDashboardDataByDate(today)} >
            Today
          </DateButtons>
          <DateButtons active={dayjs(dashboardData?.date).format("YYYY-MM-DD") == yesterday} onClick={() => fetchDashboardDataByDate(yesterday)} >
            Yesterday
          </DateButtons>
          <DateButtons onClick={handleClick}>
            {dayjs(dashboardData?.date).format("YYYY-MM-DD")}
            <IconifyIcon icon="stash:calendar-duotone" className="!p-0 !h-6 !w-6 " />
          </DateButtons>
        </nav>
      </nav>
      <BasePopup id={id} open={open} anchor={anchor}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ClickAwayListener onClickAway={() => setAnchor(null)}>
            <DateCalendar maxDate={dayjs()} className='bg-white' value={dayjs(dashboardData?.date)} onChange={(newValue) => { fetchDashboardDataByDate(dayjs(newValue).format('YYYY-MM-DD')); setAnchor(null) }} />
          </ClickAwayListener>
        </LocalizationProvider>
      </BasePopup>

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
