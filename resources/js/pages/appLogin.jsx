import React, { useEffect } from 'react'

import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAuth } from '../store/authSlice'

const AppLogin = (props) => {
  const auth = useSelector(getAuth)

  return (
    <>
      {!auth.auth ?
        <Outlet /> 
        :
         <Navigate to='/dashboard' />
      }
    </>

  )
}


export default AppLogin
