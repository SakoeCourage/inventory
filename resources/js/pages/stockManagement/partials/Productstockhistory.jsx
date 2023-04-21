import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import FormInputDate from '../../../components/inputs/FormInputDate'
import Button from '../../../components/inputs/Button'
import Stockhistorytable from './Stockhistorytable'
import Stocksupplierstable from './Stocksupplierstable'
import Api from '../../../api/Api'


export function formatMaximumValue(value) {
    let cv;
    if (value > 9) {
        cv = "9+"
    } else {
        cv = value
    }
    return cv;
}

const components = {
    historytable: Stockhistorytable,
    supplierstable: Stocksupplierstable
}

function Productstockhistory({ stockHistorys, stockData, getStockHIstory, currentModelID }) {
    const [currentComponent, setCurrentComponent] = useState('historytable')
    const [supplierdata, setSupplierData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const Component = components[currentComponent]

    const getSuppliersPerGivenModel = (url) => {
        setIsLoading(true)
        Api.get(url ?? `/supplier/model/${currentModelID}`)
            .then(res => {
                setIsLoading(false)
                setSupplierData(res.data)
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleChangePage = (event, newPage) => {
        if ((newPage + 1) > stockHistorys?.history?.current_page) {
            getStockHIstory(stockHistorys?.history?.next_page_url)
        } else {
            getStockHIstory(stockHistorys?.history?.prev_page_url)
        }
    };


    const handleDateChange = (date) => {
        getStockHIstory(`/product/models/${currentModelID}/stock/history?date=${date}`)
    }

    useEffect(() => {
        setCurrentComponent('historytable')
    }, [currentModelID])

    useEffect(() => {
        if (stockData?.has_suppliers > 0) {
            getSuppliersPerGivenModel()
        }
    }, [stockData?.has_suppliers])




    return (
        <div className=' bg-white p-2 rounded-md w-full overflow-x-scroll min-h-[29rem] flex flex-col  border border-gray-400/70 '>
            <div className='my-3 flex items-center justify-between px-3'>
                <nav className="flex items-center gap-3">
                    <nav onClick={() => setCurrentComponent('historytable')} className={` cursor-pointer font-medium text-blue-950/50  h-full text-md leading-9 uppercase border border-gray-400/70 p-2 rounded-md ${currentComponent == "historytable" && 'bg-blue-500/10'}`}>product's stock cycle</nav>
                    <nav onClick={() => setCurrentComponent('supplierstable')} className={` cursor-pointer font-medium text-blue-950/50 flex items-center gap-2  h-full text-md leading-9 uppercase border border-gray-400/70 p-2 rounded-md w-max min-w-[8rem] text-center ${currentComponent == "supplierstable" && 'bg-blue-500/10'}`}>
                        <nav className='inline'>Product's Suppliers  </nav>
                        <nav className=' text-white bg-red-500/70   p-1 rounded-full text-xs w-6 h-6 grid place-items-center '>{formatMaximumValue(stockData?.has_suppliers)}</nav>
                    </nav>
                </nav>
                {currentComponent == 'historytable' ? <nav className="flex items-center gap-4">
                    {stockHistorys?.filters?.date && <Button onClick={() => getStockHIstory()} text="Reset" />}
                    <FormInputDate
                        placeholder='filter date'
                        value={stockHistorys?.filters?.date ? dayjs(stockHistorys?.filters?.date) : null}
                        onChange={(e) => handleDateChange(dayjs(e.target.value.$d).format('YYYY-MM-DD'))}
                    />
                </nav> :
                    <nav></nav>
                }
            </div>
            <Component
                handleChangePage={handleChangePage}
                stockHistorys={stockHistorys}
                stockData={stockData}
                currentModelID={currentModelID}
                getSuppliersPerGivenModel={getSuppliersPerGivenModel}
                supplierdata={supplierdata}
                isLoading={isLoading}
            />

        </div>
    )
}

export default Productstockhistory