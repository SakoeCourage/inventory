import React, {useState, useRef} from 'react'
import { useOutsideClick } from '../../action/useOutsideClick'

function FloatingInput({type, label, value, onChange, ...props}) {
    const ref = useRef()
    const [focus, setFocus] = useState(false)
    
    useOutsideClick(ref, () => value.length > 0 ? setFocus(true) : setFocus(false))


  return (
    <div className="flex flex-col  border-b ">
        <div className="absolute">
            <label className={`relative text-xs ${focus  ? '': 'top-5'}`}>{label}</label>
        </div>
        <input ref={ref} value={value} onChange={onChange} type={type} {...props} onFocus={_ => setFocus(true)} 
            className="border-transparent bg-transparent pl-0 pt-5 text-base  focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 pb-0"
        />
    </div>
  )
}


export default FloatingInput
