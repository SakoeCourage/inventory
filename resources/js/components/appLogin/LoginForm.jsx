import { Icon } from '@iconify/react'
import { Collapse, IconButton, Tooltip } from '@mui/material'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import Button from '../inputs/Button'
import dayjs from 'dayjs';
import { useNavigate, Navigate } from 'react-router-dom';
import User from '../../api/User';
import { getUser, getAuth } from '../../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loadingwheel from '../Loaders/Loadingwheel';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';


const getTime = () => {
  const now = dayjs()
  const currentHour = now.hour()
  // let x 
  if (currentHour >= 0 && currentHour < 12) {
    return "Good morning!"
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good afternoon!"
  } else {
    return "Good evening!"
  }
}


export function LoginFormInput(props) {
  const [type, ChangeType] = useState(props?.type ?? '')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)


  useEffect(() => {
    showPassword ? ChangeType('text') : ChangeType(props?.type)
  }, [showPassword])
  useEffect(() => {
    setError(props?.error)
  }, [props?.error])

  return <div className={`relative ${props.className}`}>
    <p className="bg-inherit backdrop-blur-sm backdrop:bg-transparent rounded-md w-max pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">{props.label ?? 'Label'}</p>
    <input value={props?.value} onChange={(e) => { setError(null); props.onChange(e) }} placeholder={props.placeholder ?? ''} type={type} className="border placeholder-gray-400 focus:outline-none
    focus:border-black w-full pt-4 pr-8 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-inherit
    border-gray-300 rounded-md"/>
    {props.type == 'password' && <button onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword) }} className='   absolute right-5 top-3'>
      <IconButton>
        {showPassword ? <Tooltip title="Hide Password"><Icon className='text-gray-400' fontSize={20} icon="mdi:eye-off-outline" /></Tooltip> :
          <Tooltip title="Reveal Password">
            <Icon className='text-gray-400' fontSize={20} icon="mdi:eye-outline" />
          </Tooltip>
        }
      </IconButton>
    </button>}
    <Collapse in={error && true} orientation='vertical'>
      <div className='flex items-center gap-1 text-red-500 text-sm'>
        <Icon className=' min-w-[1.5rem] min-h-[1.5rem] max-w-[1.5rem] max-h-[1.5rem]' icon="solar:danger-triangle-bold" fontSize={20} />
        {error}
      </div>
    </Collapse>
  </div>
}


const LoginForm = () => {
  const [formValues, setFormValues] = useState({
    email: null,
    password: null
  })
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    User.login(formValues)
      .then(res => {
        Cookies.set('BearerToken', res.data?.token)
        window.location.href = queryParams.get('callbackUrl') ?? '/dashboard'
      })
      .catch(err => {
        console.log(err)
        if (err.response.status === 422) {
          setErrors(err?.response?.data?.errors)
          setIsLoading(false)
        }
      })
  }


  return (
    <div className="w-full   mr-0 mb-0 ml-0 relative z-10 max-w-lg lg:mt-0 lg:w-5/12">
      {isLoading && <Loadingwheel />}
      <div className="flex flex-col items-start justify-start pt-10 pr-10 pb-5 pl-10 bg-white loginbox rounded-xl
        relative z-10">
        <div className='flex flex-col items-center gap-2 w-full '>
          <nav className='font-semibold text-lg flex items-center gap-2 text-info-500'>Inventory-Lite</nav>
          <p className=' text-gray-600 text-center font-medium'>{getTime()}</p>
          <h3 className=' text-gray-600'>Welcome Back!</h3>
        </div>
        <form onSubmit={handleLogin} className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">

          <LoginFormInput error={errors?.email} label="Email" onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} placeholder="example@example.com" type="text" />
          <LoginFormInput error={errors?.password} label="Password" onChange={(e) => setFormValues({ ...formValues, password: e.target.value })} placeholder="Password" type="password" />

          <nav className=' text-sm flex items-center gap-3'>Forgot password? <span className=''>Contact Admin</span></nav>
          <div className="relative w-full">
            <Button className="w-full" info type="submit" disabled={isLoading}>
              <div className='flex items-center gap-2 '>
                Login
              </div>
            </Button>
          </div>
        </form>
        <nav className='flex items-center justify-center w-full mt-7 text-sm'>
          <span className=' text-gray-400 pr-2'>Software Version</span>
          <span className=' text-gray-400 pl-2 border-l'>{import.meta.env.VITE_APP_SOFTWARE_VERSION}</span>
        </nav>
      </div>
      <svg viewBox="0 0 91 91" className="absolute top-0 left-0 z-0 w-32 h-32 -mt-12 -ml-12 text-red-200/60
        fill-current"><g stroke="none" strokeWidth="1" fillRule="evenodd"><g fillRule="nonzero"><g><g><circle
          cx="3.261" cy="3.445" r="2.72" /><circle cx="15.296" cy="3.445" r="2.719" /><circle cx="27.333" cy="3.445"
            r="2.72" /><circle cx="39.369" cy="3.445" r="2.72" /><circle cx="51.405" cy="3.445" r="2.72" /><circle cx="63.441"
              cy="3.445" r="2.72" /><circle cx="75.479" cy="3.445" r="2.72" /><circle cx="87.514" cy="3.445" r="2.719" /></g><g
                transform="translate(0 12)"><circle cx="3.261" cy="3.525" r="2.72" /><circle cx="15.296" cy="3.525"
                  r="2.719" /><circle cx="27.333" cy="3.525" r="2.72" /><circle cx="39.369" cy="3.525" r="2.72" /><circle
              cx="51.405" cy="3.525" r="2.72" /><circle cx="63.441" cy="3.525" r="2.72" /><circle cx="75.479" cy="3.525"
                r="2.72" /><circle cx="87.514" cy="3.525" r="2.719" /></g><g transform="translate(0 24)"><circle cx="3.261"
                  cy="3.605" r="2.72" /><circle cx="15.296" cy="3.605" r="2.719" /><circle cx="27.333" cy="3.605" r="2.72" /><circle
              cx="39.369" cy="3.605" r="2.72" /><circle cx="51.405" cy="3.605" r="2.72" /><circle cx="63.441" cy="3.605"
                r="2.72" /><circle cx="75.479" cy="3.605" r="2.72" /><circle cx="87.514" cy="3.605" r="2.719" /></g><g
                  transform="translate(0 36)"><circle cx="3.261" cy="3.686" r="2.72" /><circle cx="15.296" cy="3.686"
                    r="2.719" /><circle cx="27.333" cy="3.686" r="2.72" /><circle cx="39.369" cy="3.686" r="2.72" /><circle
              cx="51.405" cy="3.686" r="2.72" /><circle cx="63.441" cy="3.686" r="2.72" /><circle cx="75.479" cy="3.686"
                r="2.72" /><circle cx="87.514" cy="3.686" r="2.719" /></g><g transform="translate(0 49)"><circle cx="3.261"
                  cy="2.767" r="2.72" /><circle cx="15.296" cy="2.767" r="2.719" /><circle cx="27.333" cy="2.767" r="2.72" /><circle
              cx="39.369" cy="2.767" r="2.72" /><circle cx="51.405" cy="2.767" r="2.72" /><circle cx="63.441" cy="2.767"
                r="2.72" /><circle cx="75.479" cy="2.767" r="2.72" /><circle cx="87.514" cy="2.767" r="2.719" /></g><g
                  transform="translate(0 61)"><circle cx="3.261" cy="2.846" r="2.72" /><circle cx="15.296" cy="2.846"
                    r="2.719" /><circle cx="27.333" cy="2.846" r="2.72" /><circle cx="39.369" cy="2.846" r="2.72" /><circle
              cx="51.405" cy="2.846" r="2.72" /><circle cx="63.441" cy="2.846" r="2.72" /><circle cx="75.479" cy="2.846"
                r="2.72" /><circle cx="87.514" cy="2.846" r="2.719" /></g><g transform="translate(0 73)"><circle cx="3.261"
                  cy="2.926" r="2.72" /><circle cx="15.296" cy="2.926" r="2.719" /><circle cx="27.333" cy="2.926" r="2.72" /><circle
              cx="39.369" cy="2.926" r="2.72" /><circle cx="51.405" cy="2.926" r="2.72" /><circle cx="63.441" cy="2.926"
                r="2.72" /><circle cx="75.479" cy="2.926" r="2.72" /><circle cx="87.514" cy="2.926" r="2.719" /></g><g
                  transform="translate(0 85)"><circle cx="3.261" cy="3.006" r="2.72" /><circle cx="15.296" cy="3.006"
                    r="2.719" /><circle cx="27.333" cy="3.006" r="2.72" /><circle cx="39.369" cy="3.006" r="2.72" /><circle
              cx="51.405" cy="3.006" r="2.72" /><circle cx="63.441" cy="3.006" r="2.72" /><circle cx="75.479" cy="3.006"
                r="2.72" /><circle cx="87.514" cy="3.006" r="2.719" /></g></g></g></g></svg>
      <svg viewBox="0 0 91 91" className="absolute -bottom-3 right-0 z-0 w-32 h-32 -mb-12 -mr-12 text-info-500
        fill-current"><g stroke="none" strokeWidth="1" fillRule="evenodd"><g fillRule="nonzero"><g><g><circle
          cx="3.261" cy="3.445" r="2.72" /><circle cx="15.296" cy="3.445" r="2.719" /><circle cx="27.333" cy="3.445"
            r="2.72" /><circle cx="39.369" cy="3.445" r="2.72" /><circle cx="51.405" cy="3.445" r="2.72" /><circle cx="63.441"
              cy="3.445" r="2.72" /><circle cx="75.479" cy="3.445" r="2.72" /><circle cx="87.514" cy="3.445" r="2.719" /></g><g
                transform="translate(0 12)"><circle cx="3.261" cy="3.525" r="2.72" /><circle cx="15.296" cy="3.525"
                  r="2.719" /><circle cx="27.333" cy="3.525" r="2.72" /><circle cx="39.369" cy="3.525" r="2.72" /><circle
              cx="51.405" cy="3.525" r="2.72" /><circle cx="63.441" cy="3.525" r="2.72" /><circle cx="75.479" cy="3.525"
                r="2.72" /><circle cx="87.514" cy="3.525" r="2.719" /></g><g transform="translate(0 24)"><circle cx="3.261"
                  cy="3.605" r="2.72" /><circle cx="15.296" cy="3.605" r="2.719" /><circle cx="27.333" cy="3.605" r="2.72" /><circle
              cx="39.369" cy="3.605" r="2.72" /><circle cx="51.405" cy="3.605" r="2.72" /><circle cx="63.441" cy="3.605"
                r="2.72" /><circle cx="75.479" cy="3.605" r="2.72" /><circle cx="87.514" cy="3.605" r="2.719" /></g><g
                  transform="translate(0 36)"><circle cx="3.261" cy="3.686" r="2.72" /><circle cx="15.296" cy="3.686"
                    r="2.719" /><circle cx="27.333" cy="3.686" r="2.72" /><circle cx="39.369" cy="3.686" r="2.72" /><circle
              cx="51.405" cy="3.686" r="2.72" /><circle cx="63.441" cy="3.686" r="2.72" /><circle cx="75.479" cy="3.686"
                r="2.72" /><circle cx="87.514" cy="3.686" r="2.719" /></g><g transform="translate(0 49)"><circle cx="3.261"
                  cy="2.767" r="2.72" /><circle cx="15.296" cy="2.767" r="2.719" /><circle cx="27.333" cy="2.767" r="2.72" /><circle
              cx="39.369" cy="2.767" r="2.72" /><circle cx="51.405" cy="2.767" r="2.72" /><circle cx="63.441" cy="2.767"
                r="2.72" /><circle cx="75.479" cy="2.767" r="2.72" /><circle cx="87.514" cy="2.767" r="2.719" /></g><g
                  transform="translate(0 61)"><circle cx="3.261" cy="2.846" r="2.72" /><circle cx="15.296" cy="2.846"
                    r="2.719" /><circle cx="27.333" cy="2.846" r="2.72" /><circle cx="39.369" cy="2.846" r="2.72" /><circle
              cx="51.405" cy="2.846" r="2.72" /><circle cx="63.441" cy="2.846" r="2.72" /><circle cx="75.479" cy="2.846"
                r="2.72" /><circle cx="87.514" cy="2.846" r="2.719" /></g><g transform="translate(0 73)"><circle cx="3.261"
                  cy="2.926" r="2.72" /><circle cx="15.296" cy="2.926" r="2.719" /><circle cx="27.333" cy="2.926" r="2.72" /><circle
              cx="39.369" cy="2.926" r="2.72" /><circle cx="51.405" cy="2.926" r="2.72" /><circle cx="63.441" cy="2.926"
                r="2.72" /><circle cx="75.479" cy="2.926" r="2.72" /><circle cx="87.514" cy="2.926" r="2.719" /></g><g
                  transform="translate(0 85)"><circle cx="3.261" cy="3.006" r="2.72" /><circle cx="15.296" cy="3.006"
                    r="2.719" /><circle cx="27.333" cy="3.006" r="2.72" /><circle cx="39.369" cy="3.006" r="2.72" /><circle
              cx="51.405" cy="3.006" r="2.72" /><circle cx="63.441" cy="3.006" r="2.72" /><circle cx="75.479" cy="3.006"
                r="2.72" /><circle cx="87.514" cy="3.006" r="2.719" /></g></g></g></g></svg>
    </div>



  )
}


export default LoginForm;

