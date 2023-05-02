import React, { useEffect, useState } from 'react'
import './circularprogress.css'
import { CircularProgress } from '@mui/material'
import { Icon } from '@iconify/react'

function Circularprogress(props) {
    const [value, setValue] = useState(0)

    useEffect(() => {
        let c_value = 0
        setInterval(() => {
            if (c_value === props.value) {
                clearInterval()
            } else if (c_value === 100) {
                setValue(100)
                clearInterval()

            }
            else {
                c_value++
                setValue(c_value)
            }

        }, 10);
    }, [])
    return (
        <nav className=' relative rounded-full border bg-white flex items-center justify-center '>
            <CircularProgress value={value} className=' inner text-orange-400' color={value < 20 ? 'error' : value < 50 ? 'warning' : value === 100 ? 'success' : 'inherit'} variant='determinate' thickness={7} />
            {
                value == 100 ?
                    <nav className=' text-[0.6rem] font-bold absolute inset-0 grid place-items-center '>
                        <Icon fontSize={20} className=' text-green-700' icon="material-symbols:check-circle-rounded" />
                    </nav> :
                    <nav className=' text-[0.6rem] font-bold absolute inset-0 grid place-items-center '> {value}%</nav>

            }
        </nav>
    )
}

export default Circularprogress