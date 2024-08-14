import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import FormInputDate from '../../../components/inputs/FormInputDate'
import Button from '../../../components/inputs/Button'
import Stockhistorytable from './Stockhistorytable'
import Stocksupplierstable from './Stocksupplierstable'
import Api from '../../../api/Api'
import NewStockTab from '../newstockpartials/NewStockTab'

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
        <div className=' bg-white p-2 rounded-md w-full   min-h-[29rem] flex flex-col  border border-gray-400/70 '>
            <div className='my-3 flex flex-col md:flex-row gap-2 items-center md:justify-between px-3'>
                <nav className="flex flex-col md:flex-row w-full  items-center gap-2">
                    <NewStockTab
                        active={currentComponent == "historytable"}
                        onClick={() => setCurrentComponent('historytable')}
                        label={<div className=' text-sm uppercase'>
                            Product's stock cycle
                        </div>}
                        icon='hugeicons:minus-plus-02'
                    />
                    <NewStockTab
                        active={currentComponent == "supplierstable"}
                        onClick={() => setCurrentComponent('supplierstable')}
                        label={<div className='flex items-center gap-1 text-sm'>
                            <nav className='inline uppercase'>Product's Suppliers  </nav>
                            <nav className=' text-white bg-red-500/70   p-1 rounded-full text-xs w-6 h-6 grid place-items-center '>{formatMaximumValue(stockData?.has_suppliers)}</nav>
                        </div>}
                        icon='ph:users'
                    />
                </nav>
                {currentComponent == 'historytable' ? <nav className="!w-full md:w-auto flex items-center gap-4">
                    {stockHistorys?.filters?.date && <Button onClick={() => getStockHIstory()} text="Reset" />}
                    <FormInputDate
                        size="small"
                        className="!w-full md:w-max"
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