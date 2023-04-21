import { Icon } from '@iconify/react'
import { Collapse, IconButton } from '@mui/material'
import React, { useRef, useState, useCallback } from 'react'
import Button from '../inputs/Button'
import { useOutsideClick } from '../../action/useOutsideClick';
import dayjs from 'dayjs';
import { object, string } from 'yup';
import { useNavigate } from 'react-router-dom';


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

const Login = () => {
  const [formValues, setFormValues] = useState({
    email: null,
    password: null
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const schema = object({
    email: string().email("Email must contain '@', '.'").required('This field is required'),
    password: string().required('This field is required'),
  })

  const handleForm = useCallback(
    async (e) => {
      e.preventDefault()
      setIsLoading(true)
      const isFormValid = await schema.isValid(formValues, {
        abortEarly: false,
      })
      if (isFormValid) {
        setTimeout(() => {
          navigate('/dashboard')
          setIsLoading(false)
        }, 700)
      } else {
        schema.validate(formValues, { abortEarly: false }).catch((err) => {
          const errors = err.inner.reduce((acc, error) => {
            return {
              ...acc,
              [error.path]: error.message,
            }
          }, {})

          setErrors(errors)
          setIsLoading(false)

        })
      }
    },
    [formValues]
  )

  return (
    <div className='flex justify-center items-center h-full  '>
      <form onSubmit={handleForm} className='flex flex-col gap-6 w-[70%]'>
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
            {isLoading &&

              <Icon icon="eos-icons:loading" className='text-info-500' fontSize={23} />
            }
          </div>
        </Button>
      </form>
    </div>
  )
}

export default Login

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
