import React, { useEffect, useState } from 'react'
import Api from '../../api/Api'
import { useSelector } from 'react-redux'
import { getAuth } from '../../store/authSlice'
import Loadingwheel from '../../components/Loaders/Loadingwheel'
import { Icon } from '@iconify/react';
import { Tooltip } from '@mui/material'
import Profile from './Profile'
import Changecredentials from './Changecredentials'
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationAlerts from './NotificationAlerts'
import { AccessByPermission } from '../authorization/AccessControl'

const components = {
  Profile: Profile,
  Changecredentials: Changecredentials,
  NotificationAlerts: NotificationAlerts
}


function Index() {
  const auth = useSelector(getAuth)
  const [userData, setUserData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  const cView = queryParams.get('tab')
  const navigate = useNavigate();

  const changeTab = (newTab) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('tab', newTab);
    navigate({
      search: queryParams.toString(),
    });
  };

  const [component, setComponent] = useState(cView ?? 'Profile')

  const getUser = () => {
    setIsLoading(true)
    if (auth?.auth?.user?.id) {
      Api.get(`/user/get/info/${auth?.auth?.user?.id}`)
        .then(res => {
          setUserData(res.data)
          setIsLoading(false)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const Component = components[component]



  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const tab = queryParams.get('tab');
    if (!tab) return;
    setComponent(tab);
  }, [search]);


  return (<div class="">
    <div class="w-full ">
      {isLoading && <Loadingwheel />}
      <div class="w-full bg-info-900/90 h-48  "></div>
      <div className=' max-w-5xl mx-auto w-full flex items-center justify-start'>
        <div class="relative -mt-16 md:-mt-20 ml-5 flex items-center gap-3 ">
          <div class={` border  border-gray-300 text-5xl -mt-12 md:-mt-0 text-info-800 h-32 md:h-36 grid place-items-center  rounded-full aspect-square shadow-md border-b ${isLoading ? 'bg-gray-200' : 'bg-info-100'}`}>
            {userData?.role && userData?.role.charAt(0)}
          </div>
          <div className='flex items-center flex-col md:flex-row gap-1 md:gap-3 md:-mt-5 -mt-16 '>
            <Tooltip title="Update Login Credentials">
              <button onClick={() => changeTab('Profile')} className={`truncate grow w-full md:w-auto md:grow-0  flex items-center  p-2 rounded-md text-xs md:text-sm bg-info-100/30 text-white ${component == 'Profile' && ' !bg-info-100/90 !text-info-900 '}`}>
                <Icon className='hidden md:block mr-1 md:mr-2' fontSize={20} icon="iconoir:user" />
                <span className=' '>
                  Profile
                </span>
              </button>
            </Tooltip>
            <Tooltip title="Update Login Credentials">
              <button onClick={() => changeTab('Changecredentials')} className={` truncate grow w-full md:w-auto md:grow-0  flex items-center  p-2 rounded-md text-xs md:text-sm  bg-info-100/30 text-white ${component == 'Changecredentials' && ' !bg-info-100/90 !text-info-900'}`}>
                <Icon className='hidden md:block mr-1 md:mr-2' fontSize={20} icon="streamline:interface-user-edit-actions-close-edit-geometric-human-pencil-person-single-up-user-write" />
                <span className=''> Update Login Credentials</span>
              </button>
            </Tooltip>
            <AccessByPermission abilities={['manage stock data', 'authorize expense','generate product order']}>
              <Tooltip title="Update Login Credentials">
                <button onClick={() => changeTab('NotificationAlerts')} className={` truncate grow w-full md:w-auto md:grow-0  flex items-center  p-2 rounded-md text-xs md:text-sm bg-info-100/30 text-white ${component == 'NotificationAlerts' && ' !bg-info-100/90 !text-info-900 '}`}>
                  <Icon className='hidden md:block mr-1 md:mr-2' fontSize={20} icon="mage:email-notification" />
                  <span className=' '>
                    Notification Alerts
                  </span>
                </button>
              </Tooltip>
            </AccessByPermission>
          </div>

        </div>
      </div>
    </div>
    <div className=' max-w-5xl mx-auto mt-5 px-2 '>

      <Component fetchData={getUser} setComponent={changeTab} userData={userData} />
    </div>
  </div>
  )
}

export default Index