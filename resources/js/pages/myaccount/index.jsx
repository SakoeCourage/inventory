import React, { useEffect, useState } from 'react'
import Api from '../../api/Api'
import { useSelector } from 'react-redux'
import { getAuth } from '../../store/authSlice'
import Loadingwheel from '../../components/Loaders/Loadingwheel'
import { Icon } from '@iconify/react';
import { Tooltip } from '@mui/material'
import Profile from './Profile'
import Changecredentials from './Changecredentials'


const components = {
  Profile: Profile,
  Changecredentials: Changecredentials
}


function Index() {
  const auth = useSelector(getAuth)
  const [userData, setUserData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [component, setComponent] = useState('Profile')
  const getUser = () => {
    setIsLoading(true)
    if (auth?.auth?.user?.id) {
      Api.get(`/user/get/info/${auth?.auth?.user?.id}`)
        .then(res => {
          setUserData(res.data)
          // console.log(res.data)
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


  return (<div class="">
    <div class="w-full ">
      {isLoading && <Loadingwheel />}
      <div class="w-full bg-info-600 h-48  "></div>
      <div className=' max-w-5xl mx-auto w-full flex items-center justify-start'>
        <div class="relative -mt-16 md:-mt-20 ml-5 flex items-center gap-3 ">
          <div class={` border  border-gray-300 text-5xl text-info-800 h-28 md:h-36 grid place-items-center  rounded-full aspect-square shadow-md border-b ${isLoading ? 'bg-gray-200' : 'bg-info-100'}`}>
            {userData?.role && userData?.role.charAt(0)}
          </div>
          {component == "Profile" && <Tooltip title="Update Login Credentials">
            <button onClick={() => setComponent('Changecredentials')} className='-mt-5 text-white flex items-center bg-info-100/30 p-2 rounded-md text-sm'>
              <Icon className='mr-2' fontSize={20} icon="streamline:interface-user-edit-actions-close-edit-geometric-human-pencil-person-single-up-user-write" />
              Update Login Credentials
            </button>
          </Tooltip>}
        </div>
      </div>
    </div>
    <div className=' max-w-5xl mx-auto mt-5 px-2 '>
      <Component setComponent={setComponent} userData={userData} />
    </div>
  </div>
  )
}

export default Index