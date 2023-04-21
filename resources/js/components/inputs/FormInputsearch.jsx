import React, { useEffect, useMemo, useState, useCallback ,forwardRef} from 'react'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash-es'
import Loadingspinner from '../Loaders/Loadingspinner'


const FormInputsearch = forwardRef((props,ref)=> {
    const [searkKey, setSearchKey] = useState('')
    const [processing, setProcessing] = useState(false)
    const delayedQuery = useCallback(debounce(() => {
        props.getSearchKey(searkKey)
    }, 300), [searkKey])
    useEffect(() => {
        setProcessing(true)
        delayedQuery();
        return delayedQuery.cancel;
    }
        , [searkKey, delayedQuery])

    useEffect(() => {
        props.processing == false && setProcessing(false)
    }, [props.processing])

    return (
        <div className={` w-full rounded-lg mb-1 border focus-within:ring-2 focus-within:ring-info-200 transition-all duration-500 focus-within:border-none bg-white border-gray-400/70 flex items-center px-2 ${props.className}`}>
            {processing ? <Loadingspinner /> : <Icon icon="ic:round-search" fontSize={30} className=' text-gray-300' />
            }
            <input autoComplete='off' ref={ref} id="search-bar" type="search" name="" value={props?.searchKey} onChange={(e => setSearchKey(e.target.value))} placeholder={`${props.placeholder ?? 'Enter search item'}`} className='w-full pl-1 pr-5 py-3 rounded-t-lg border-none outline-none focus:outline-none focus:border-none' />
        </div>
    )
}
)
export default FormInputsearch