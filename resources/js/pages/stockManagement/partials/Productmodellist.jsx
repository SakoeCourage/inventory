import React, { useEffect, useState } from 'react'
import Button from '../../../components/inputs/Button'
import { Icon } from '@iconify/react'
import { useParams } from 'react-router-dom'
import Api from '../../../api/Api'
import Loadingspinner from '../../../components/Loaders/Loadingspinner'

function Productmodellist({setCurrentModelID,currentModelID}) {
    const routeParams = useParams()
    const { productId, productName } = routeParams
    const [data, setData] = useState([])
    const [next_page_url, setnext_page_url] = useState(null)
    const [processing, setProcessing] = useState(false)
    const getProductModelsFromProductId = (url) => {
        setProcessing(true)
        Api.get(url ?? `/product/models/find/${productId}`)
            .then(res => {
                setData([...data, ...res.data.data])
                setnext_page_url(res.data.next_page_url)
                setProcessing(false)
            }).catch(err => console.log(err))
    }

    const handleModelSearch = (searhKey) => {
        Api.get( `/product/models/find/${productId}?search=${searhKey}`)
            .then(res => {
                setData(res.data.data)
                setnext_page_url(res.data.next_page_url)
                setProcessing(false)
            }).catch(err => console.log(err))
    }

    useEffect(() => {
        getProductModelsFromProductId()
    }, [])

    return (
        <div className='w-full transition-[heigth] min-h-[30rem] duration-500 h-max bg-gray-100 rounded-lg shadow-md border border-gray-400/70 p-1 relative'>
            <div className=' w-full rounded-lg mb-1 border focus-within:ring-2 focus-within:ring-info-200 transition-all duration-500 focus-within:border-none bg-white border-gray-400/70 flex items-center px-2'>
                <Icon icon="ic:round-search" fontSize={30} className=' text-gray-300' />
                <input type="search" name="" onChange={(e=>handleModelSearch(e.target.value))} placeholder='Search Model Name' className='w-full pl-1 pr-5 py-3 rounded-t-lg border-none outline-none focus:outline-none focus:border-none' id="" />
            </div>
            <div className='flex flex-col text-blue-950 '>
                {Boolean(data?.length) &&
                    data.map((dt, i) => {
                        return (
                            <abbr onClick={()=>setCurrentModelID(dt.id)} key={i} title={dt.model_name} className={`decoration-none p-2 px-4 hover:bg-blue-50 cursor-pointer model-item truncate w-full ${currentModelID === dt.id && 'addleftline !bg-info-100 '}`}> {dt.model_name} </abbr>
                        )
                    })
                }
                {!Boolean(data.length) && <div className='absolute inset-0 flex items-center justify-center'>
                    <div>Empty Data</div>
                </div>}
                {next_page_url && <Button processing={processing} onClick={() => getProductModelsFromProductId(next_page_url)} otherClasses=" text-sm mt-5 capitalize" text='more models' />}
            </div>
        </div>
    )
}

export default Productmodellist