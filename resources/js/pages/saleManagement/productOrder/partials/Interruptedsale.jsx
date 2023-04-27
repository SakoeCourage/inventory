import React, { useEffect } from 'react'
import Button from '../../../../components/inputs/Button'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { SlideUpAndDownAnimation } from '../../../../api/Util'
import { diffForHumans } from '../../../../api/Util'
import { SnackbarProvider, useSnackbar } from 'notistack'

function Interruptedsale({ setInterruptedSaleAvailable, setFormData, setItems }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const { datetime } = JSON.parse(localStorage.getItem('interrupted_sale'))
    useEffect(() => {
        console.log(JSON.parse(localStorage.getItem('interrupted_sale')))
    }, [])

    const handleOnRestore = () => {
       try {
        setFormData(JSON.parse(localStorage.getItem('interrupted_sale')))
        const { items } = JSON.parse(localStorage.getItem('interrupted_sale'));
        setItems(items)
        localStorage.removeItem('interrupted_sale')
        setInterruptedSaleAvailable(false)
       } catch (error) {
        localStorage.removeItem('interrupted_sale')
        setInterruptedSaleAvailable(false)
       }
    }
    const handleOnIgnore = () => {
        enqueueSnackbar('Error: something went wrong',{variant:'error'})
        localStorage.removeItem('interrupted_sale')
        setInterruptedSaleAvailable(false)
    }

    return (
        <motion.div
            variants={SlideUpAndDownAnimation}
            initial='initial'
            animate='animate'
            exit='exit'
            className=' max-w-2xl bg-white w-full mx-auto min-h-[18rem] rounded-t-md flex flex-col'>
            <nav className='flex flex-col items-center justify-center grow'>
                <nav className=' text-gray-400 p-2 bg-gray-100 rounded-full my-3'><Icon icon="mdi:clock-check-outline" fontSize={70} /></nav>
                <nav className=''>A previously interrupted sale data was found </nav>
                <nav className='text-blue-950 text-xs underline'>{diffForHumans(datetime)}</nav>
                <nav className=' mt-2 text-sm'>Would you like to continue from here? </nav>
            </nav>
            <nav className="mt-auto flex items-center w-full pb-1 px-2 gap-1 flex-col lg:flex-row">
                <Button onClick={() => handleOnRestore()} otherClasses="w-full basis-[100%] lg:basis-[50%]" info text="Yes continue" />
                <Button onClick={() => handleOnIgnore()} otherClasses="w-full basis-[100%] lg:basis-[50%]" neutral text="No ignore" />
            </nav>
        </motion.div>
    )
}

export default Interruptedsale