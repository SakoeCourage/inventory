import { Icon } from '@iconify/react'
import { Collapse, IconButton } from '@mui/material'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import Button from '../inputs/Button'
import { useOutsideClick } from '../../action/useOutsideClick';
import dayjs from 'dayjs';
import { useNavigate, Navigate } from 'react-router-dom';
import User from '../../api/User';
import { getUser, getAuth } from '../../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loadingwheel from '../Loaders/Loadingwheel';
import Info from './info';

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

const LoginInput = (props) => {
  const { label, placeholder, type, error, errorText, required, isPassword, onChange } = props
  const [focus, setFocus] = useState(false)
  const field = useRef()
  const [inputType, setInputType] = useState(type)

  useOutsideClick(field, () => setFocus(false))

  const toggleType = () => {
    if (inputType === 'password') {
      setInputType('text')
    } else {
      setInputType('password')
    }
  }
  return (
    <fieldset className='flex flex-col gap-2'>
      <label className="font-medium">{label}
        {required &&
          <span className='text-red-500 pl-1'>*</span>
        }
      </label>
      <div ref={field} className={`flex justify-between border border-gray-300 rounded-[6px] pl-4 pr-2 py-2 h-12 ${focus && 'border-info-500'} `}>
        <input placeholder={placeholder}
          type={inputType}
          className='   bg-transparent w-full outline-none'
          onFocus={() => setFocus(true)}
          onChange={onChange}
        />
        {isPassword &&
          <IconButton onClick={toggleType} size='small'>
            <Icon icon={inputType === 'password' ? "ic:round-remove-red-eye" : "mdi:eye-off"} fontSize={24} />
          </IconButton>
        }
      </div>
      <Collapse in={error && true} orientation='vertical'>
        <div className='flex items-center gap-1 text-red-500'>
          <Icon icon="solar:danger-triangle-bold" fontSize={20} />
          {errorText}
        </div>
      </Collapse>
    </fieldset>
  )
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


  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    User.login(formValues)
      .then(res => {
        dispatch(getUser())
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
    <div class="w-full   mr-0 mb-0 ml-0 relative z-10 max-w-2xl lg:mt-0 lg:w-5/12">
      {isLoading && <Loadingwheel />}
      {/* <form onSubmit={handleLogin} className='flex flex-col gap-6 w-[70%]'>
        <div className='flex justify-center mb-20'>
          <div className='flex flex-col gap-2 '>
            <div className='mx-auto'>
              <p className='flex items-center gap-2 text-info-500 pb-1'><Icon icon="clarity:dashboard-solid-badged" fontSize={24} /><span className='font-semibold text-lg'>Inventory-Lite</span></p>
              <h3>Welcome Back!</h3>
            </div>
            <p className=' text-gray-600 text-center'>{getTime()} Welcome to account login</p>
          </div>
        </div>
        <LoginInput label="Email Address" placeholder="Enter email"
          type="email"
          required
          errorText={errors.email && errors?.email}
          error={errors.email && errors?.email}
          onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
        />
        <LoginInput label="Password" placeholder="Enter password"
          type="password"
          required
          isPassword
          errorText={errors.email && errors?.email}
          error={errors.password && errors?.email}
          onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}

        />
        <div className='flex justify-end'>
          <button type='button' className='text-info-500 font-medium'>Forgot Password?</button>
        </div>
        <Button info type="submit" disabled={isLoading}>
          <div className='flex items-center gap-2 '>
            Login
          </div>
        </Button>
      </form> */}
      <div class="flex flex-col items-start justify-start pt-10 pr-10 pb-10 pl-10 bg-white loginbox rounded-xl
        relative z-10">
        <div className='flex flex-col items-center gap-2 w-full '>
          <nav className='font-semibold text-lg flex items-center gap-2 text-info-500'>Inventory-Lite</nav>
          <h3>Welcome Back!</h3>
          <p className=' text-gray-600 text-center'>{getTime()} Welcome to account login</p>
        </div>
        <div class="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
          <div class="relative">
            <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">Email</p>
            <input placeholder="example@example.com" type="text" class="border placeholder-gray-400 focus:outline-none
              focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
              border-gray-300 rounded-md"/>
          </div>
          <div class="relative">
            <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600
              absolute">Password</p>
            <input placeholder="Password" type="password" class="border placeholder-gray-400 focus:outline-none
              focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
              border-gray-300 rounded-md"/>
          </div>
          <nav className=' text-sm flex items-center gap-3'>Forgot password? <span className=''>Contact Admin</span></nav>
          <div class="relative w-full">
            <Button className="w-full" info type="submit" disabled={isLoading}>
              <div className='flex items-center gap-2 '>
                Login
              </div>
            </Button>
          </div>
        </div>
      </div>
      <svg viewbox="0 0 91 91" class="absolute top-0 left-0 z-0 w-32 h-32 -mt-12 -ml-12 text-red-300
        fill-current"><g stroke="none" strokewidth="1" fillrule="evenodd"><g fillrule="nonzero"><g><g><circle
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
      <svg viewbox="0 0 91 91" class="absolute bottom-0 right-0 z-0 w-32 h-32 -mb-12 -mr-12 text-info-500
        fill-current"><g stroke="none" strokewidth="1" fillrule="evenodd"><g fillrule="nonzero"><g><g><circle
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

