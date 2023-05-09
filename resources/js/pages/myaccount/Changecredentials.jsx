import React, { useEffect, useState } from 'react'
import { LoginFormInput } from '../../components/appLogin/LoginForm'
import { Icon } from '@iconify/react'
import { Tooltip } from '@mui/material'
import Button from '../../components/inputs/Button'
import Loadingwheel from '../../components/Loaders/Loadingwheel'
import Api from '../../api/Api'
import { AnimatePresence, motion } from 'framer-motion'
import { SlideUpAndDownAnimation } from '../../api/Util'
import { Logout } from '../../store/authSlice'
import { useDispatch } from 'react-redux'

function Changecredentials({ userData, setComponent }) {
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const [formData, setformData] = useState({
        email: null,
        current_password: null,
        password: null,
        password_confirmation: null,
    })

    const checkCredentials = () => {
        setIsLoading(true)
        Api.put('/user/update/credentials/validate', formData)
            .then(res => {
                setShowConfirmModal(true)
                setIsLoading(false)
            })
            .catch(err => {
                if (err?.response?.status == 422) {
                    setErrors(err.response?.data?.errors)
                    setIsLoading(false)
                }
            })
    }
    const handleSubmit = () => {
        setIsLoading(true)
        Api.put('/user/update/credentials', formData)
            .then(res => {
                dispatch(Logout())
            })
            .catch(err => {
                console.log(err)
                if (err?.response?.status == 422) {
                    setErrors(err.response?.data?.errors)
                    setIsLoading(false)
                }
            })
    }

    useEffect(() => {
        userData?.email && setformData((cv) => cv = { ...cv, email: userData.email })
    }, [])
    useEffect(() => {
        console.log(formData)
    }, [formData])

    return (
        <div className=''>
            {isLoading && <Loadingwheel />}
            <Tooltip title="Back to profile">
                <button onClick={() => setComponent('Profile')} className=' shadow border-b border-dotted border-gray-300 flex items-center gap-1 bg-info-100/50 text-info-900 p-2 rounded-md border w-max text-sm '>
                    <Icon className=' text-gray-500' fontSize={20} icon="typcn:arrow-back-outline" />Return back to profile
                </button>
            </Tooltip>
            <div className='bg-gray-50/40 border border-gray-400/70  rounded-md w-full mt-2   grid grid-cols-1 md:grid-cols-2'>
                <nav className=' hidden md:flex items-center justify-center border-r bg-gray-200/40 '>
                    <nav className='  '>
                        <nav className="flex items-center justify-center w-max mx-auto bg-info-400 mb-5 h-18 p-2 rounded-full aspect-square">
                            <Icon fontSize={50} className=' text-white' icon="material-symbols:tips-and-updates-outline" />
                        </nav>
                        <nav className=' mx-auto'>
                            <ul className=' list-disc list-inside text-sm lg:text-base flex flex-col gap-2'>
                                <li>Provide your current Password and your new password</li>
                                <li>After credential is changed you will be logged out </li>
                                <li>Subsequent Login will require you new credential</li>
                            </ul>
                        </nav>
                    </nav>

                </nav>
                <nav className=' p-5 py-10'>
                    <nav className="  flex flex-col items-center gap-7 w-full mt-5">
                        <LoginFormInput value={formData.email} onChange={(e) => setformData({ ...formData, email: e.target.value })} error={errors?.email} type="text" placeholder="email" label="Email" className="w-full" />
                        <LoginFormInput value={formData.current_password} onChange={(e) => setformData({ ...formData, current_password: e.target.value })} error={errors?.current_password} type="password" placeholder="Enter current password" label="Current Password" className="w-full" />
                    </nav>
                    <nav className="  flex flex-col items-center gap-7  w-full mt-7">
                        <LoginFormInput value={formData.password} onChange={(e) => setformData({ ...formData, password: e.target.value })} error={errors?.password} type="password" placeholder="Enter new password" label="New password" className="w-full" />
                        <LoginFormInput value={formData.password_confirmation} onChange={(e) => setformData({ ...formData, password_confirmation: e.target.value })} error={errors?.password_confirmation} type="password" placeholder="Confirm new password" label="Confirm new password" className="w-full" />
                    </nav>
                    <Button onClick={() => checkCredentials()} className="w-full my-4" text="save changes" />
                </nav>
            </div>
            <AnimatePresence>
                {showConfirmModal && <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className=' fixed inset-0 z-30 flex h-full items-end bg-black/30'>
                    <motion.div
                        variants={SlideUpAndDownAnimation}
                        initial='initial'
                        animate='animate'
                        exit='exit'
                        className=' max-w-2xl bg-white w-full mx-auto min-h-[18rem] rounded-t-md flex flex-col'>
                        <nav className='flex flex-col items-center justify-center grow'>
                            <nav className=' text-gray-400 p-2 bg-gray-100 rounded-full my-3'><Icon icon="ph:warning-circle-light" fontSize={70} /></nav>
                            <nav className=''>You are about to be logged out </nav>
                        </nav>
                        <nav className="mt-auto flex items-center w-full pb-1 px-2 gap-1 flex-col lg:flex-row">
                            <Button onClick={() => handleSubmit()} otherClasses="w-full basis-[100%] lg:basis-[50%]" info text="Continue" />
                            <Button onClick={() => setShowConfirmModal(false)} otherClasses="w-full basis-[100%] lg:basis-[50%]" neutral text="Cancel" />
                        </nav>
                    </motion.div>
                </motion.div>}
            </AnimatePresence>
        </div>
    )
}

export default Changecredentials