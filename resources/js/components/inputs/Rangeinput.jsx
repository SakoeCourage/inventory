import { Button } from '@mui/material'
import { useEffect, useRef,useState } from 'react'

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
        if (props.value) {
            rangeCheck((props.value), inputRef.current)
        }
    }, [props.value])

    
    useEffect(() => {
        if (props?.error) {
          setHasError(true)
        }
      }, [props.error])




    return <div className={`flex flex-col gap-1 ' ${props.className}`}>
        {props?.label && <label htmlFor="" className=' text-gray-500 text-xs'> {props.label}</label>}
        <div className={`flex items-center border w-full rounded-md focus-within:border-none focus-within:ring-info-300 focus-within:ring-1  ${hasError && 'border-red-600 focus-within:ring-red-600 Mui-error'}`}>
            <Button onClick={handleDecrease} className=' p-2 grid place-items-center  '>
            <svg className='text-info-700' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15 11.5a.5.5 0 0 1 0 1H9a.5.5 0 0 1 0-1Z"/><path fill="currentColor" d="M12 21.934A9.933 9.933 0 1 1 21.932 12A9.945 9.945 0 0 1 12 21.934Zm0-18.866A8.933 8.933 0 1 0 20.932 12A8.944 8.944 0 0 0 12 3.068Z"/></svg>    
            </Button>
            <input ref={inputRef} placeholder={props.placeholder ?? '0'} onChange={(e) => hanleOnChange(e.target.value, e.target)} max={14} min={0} className=' border-x outline-none bg-inherit focus:border-x focus:outline-none grow px-1 hidespin text-info-700' type='number' />
            <Button onClick={handleIncrease} className='p-2 grid place-items-center '>
            <svg className='text-info-700' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15 12.5h-2.5V15a.5.5 0 0 1-1 0v-2.5H9a.5.5 0 0 1 0-1h2.5V9a.5.5 0 0 1 1 0v2.5H15a.5.5 0 0 1 0 1Z"/><path fill="currentColor" d="M12 21.932A9.934 9.934 0 1 1 21.932 12A9.944 9.944 0 0 1 12 21.932Zm0-18.867A8.934 8.934 0 1 0 20.932 12A8.944 8.944 0 0 0 12 3.065Z"/></svg>
            </Button>
        </div>
    </div>
}

export default Rangeinput
