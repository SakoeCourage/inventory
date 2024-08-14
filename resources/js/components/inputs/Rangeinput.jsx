import { Button } from '@mui/material'
import { useEffect, useRef, useState } from 'react'


/**
 * @typedef {Object} RangeInputProps
 * @property {function} onChange - Callback function to handle change events.
 * @property {number} [min] - Minimum value for the input.
 * @property {number} [max] - Maximum value for the input.
 * @property {number} [value] - Current value of the input.
 * @property {boolean} [error] - Flag indicating if there is an error.
 * @property {string} [className] - Additional CSS classes for the component.
 * @property {string} [label] - Label for the input.
 * @property {string} [placeholder] - Placeholder text for the input.
 */

/**
 * @param {RangeInputProps} props
 */
function Rangeinput(props) {
    const [hasError, setHasError] = useState(false)
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
        setHasError(false)
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
            rangeCheck((props.value), inputRef.current)
    }, [props.value])


    useEffect(() => {
        if (props?.error) {
            setHasError(true)
        }
    }, [props.error])


    return <div className={`flex flex-col gap-1 ' ${props.className}`}>
        {props?.label && <label htmlFor="" className=' text-gray-500 text-xs'> {props.label}</label>}
        <div className={`flex items-center border  w-full rounded-md ${hasError && 'border-red-600 focus-within:ring-red-600 Mui-error'}`}>
            <Button onClick={handleDecrease} className=' !py-2 !px-1 h-full grid place-items-center  '>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="18" fill='currentColor' className='text-red-600' viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
            </Button>
            <input ref={inputRef} placeholder={props.placeholder ?? '0'} onChange={(e) => hanleOnChange(e.target.value, e.target)} max={14} min={0} className='  px-2 py-1 text-center outline-none bg-inherit focus:border-x focus:outline-none grow hidespin text-gray-700' type='number' />
            <Button onClick={handleIncrease} className='!py-2 !px-1 h-full grid place-items-center '>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="18" fill='currentColor' className='text-green-600' viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" /></svg>
            </Button>
        </div>
    </div>
}

export default Rangeinput
