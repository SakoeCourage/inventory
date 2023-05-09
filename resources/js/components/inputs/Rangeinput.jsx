import { Button } from '@mui/material'
import { useEffect, useRef } from 'react'

function Rangeinput(props) {
    const inputRef = useRef()
    const dispatchValue = (value) => {
        props.onChange({
            target: {
                value: value
            }
        })
    }

    const hasMaxValue = () => props.hasOwnProperty('max')
    const hasMinValue = () => props.hasOwnProperty('min')

    const rangeCheck = (val, node) => {
        if (val === '') {
            node.value = '';
            dispatchValue('');
            return;
        }
        const minValue = Number(props.min);
        const maxValue = Number(props.max);

        if (hasMaxValue() && val > maxValue) {
            node.value = maxValue;
            dispatchValue(maxValue);
        } else if (hasMinValue() && val < minValue) {
            node.value = minValue;
            dispatchValue(minValue);
        } else {
            node.value = val;
            dispatchValue(val);
        }
    }


    const hanleOnChange = (value, node) => {
        rangeCheck(value, node)
    }
    const handleIncrease = (e) => {
        var value = Number(inputRef.current?.value ?? 0) + 1
        hanleOnChange(value, inputRef.current)
    }


    const handleDecrease = (e) => {

        var value = Number(inputRef.current?.value) - 1
        hanleOnChange(value, inputRef.current)
    }

    useEffect(() => {
        if (props.value) {
            rangeCheck((props.value), inputRef.current)
        }
    }, [props.value])




    return <div className={`flex flex-col gap-1 ${props.className}`}>
        {props.label && <label htmlFor="" className=' text-gray-500 text-xs'> {props.label}</label>}
        <div className='flex items-center border w-full rounded-md focus-within:border-none focus-within:ring-info-300 focus-within:ring-1  '>
            <Button onClick={handleDecrease} className='p-2 grid place-items-center shadow-lg '>-</Button>
            <input ref={inputRef} placeholder={props.placeholder ?? '0'} onChange={(e) => hanleOnChange(e.target.value, e.target)} max={14} min={0} className=' border-x outline-none focus:border-x focus:outline-none grow px-2 hidespin text-blue-700' type='number' />
            <Button onClick={handleIncrease} className='p-2 grid place-items-center shadow-lg'>+</Button>
        </div>
    </div>
}

export default Rangeinput
