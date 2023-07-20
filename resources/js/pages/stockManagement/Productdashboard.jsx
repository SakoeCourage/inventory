import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Api from '../../api/Api'
import Productmodellist from './partials/Productmodellist'
import Productdetailcard from './partials/Productdetailcard'
import Productpricingcard from './partials/Productpricingcard'
import Productactioncard from './partials/Productactioncard'
import Productstockhistory from './partials/Productstockhistory'
import SideModal from '../../components/layout/sideModal'
import Addtostockform from './partials/Addtostockform'
import Removefromstockform from './partials/Removefromstockform'
import Emptydata from '../../components/formcomponents/Emptydata'
import { useSearchParams } from 'react-router-dom'
import Loadingwheel from '../../components/Loaders/Loadingwheel'

function Productsdashboard() {
    const [showStockingModal, setShowStockingModal] = useState({
        option: null
    })
   
    const [stockHistorys, setStockHistory] = useState([])
    const [stockData, setStockData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchParams, setsearchParams] = useSearchParams()

    const getStockData = () => {
        if (searchParams.get('model')) {
            setIsLoading(true)
            Api.get(`/product/models/${searchParams.get('model')}/stock/data`)
                .then(res => {
                    setStockData(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    const getStockHIstory = (url) => {
        setIsLoading(true)
        if (searchParams.get('model')) {
            Api.get(url ?? `/product/models/${searchParams.get('model')}/stock/history`)
                .then(res => {
                    setStockHistory(res.data)
                    setIsLoading(false)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const fetchAllData = () => {
        getStockData()
        getStockHIstory()
    }



    useEffect(() => {
        if (searchParams.get('model')) {
            fetchAllData()
        }
    }, [searchParams.get('model')])



    return (
        <div className='flex min-h-full  gap-4 p-6 max-w-[90rem] mx-auto'>
            {isLoading && <Loadingwheel />}
            <SideModal onClose={() => setShowStockingModal({ option: null })}
                showClose title="Add to Stock " maxWidth='xl'
                open={Boolean(searchParams.get('model') && showStockingModal.option == 'add')}>
                <Addtostockform
                    fetchAllData={fetchAllData}
                    setShowStockingModal={setShowStockingModal}
                    stockData={stockData}
                />
            </SideModal>

            <SideModal onClose={() => setShowStockingModal({ option: null })}
                showClose title="Adjust Stock" maxWidth='xl'
                open={Boolean(searchParams.get('model') && showStockingModal.option == 'remove')} >
                <Removefromstockform
                    fetchAllData={fetchAllData}
                    stockData={stockData}
                    setShowStockingModal={setShowStockingModal}
                />
            </SideModal>

            <div className=' min-w-[17rem] text-sm'>
                <Productmodellist
                />
            </div>
            {searchParams.get('model') ? <div className=' container mx-auto'>
                <div className=' min-h-[15rem] grid grid-cols-1 lg:grid-cols-3 gap-5 text-sm'>
                    <Productdetailcard
                        stockData={stockData}
                    />
                    <Productpricingcard
                        stockData={stockData}
                    />
                    <Productactioncard
                        setShowStockingModal={setShowStockingModal}
                    />
                </div>
                <div className=' mt-12 text-sm w-full'>
                    <Productstockhistory
                        currentModelID={searchParams.get('model')}
                        getStockHIstory={getStockHIstory}
                        stockData={stockData}
                        stockHistorys={stockHistorys} />
                </div>
            </div> :
                <div className='container mx-auto flex items-center justify-center'>
                    <div className="flex flex-col gap-3 items-center">
                        <Emptydata caption='No product model selected' />
                        <nav className=' bg-white/40 p-3 rounded-md shadow-md'>
                            Choose a product model to view its record
                        </nav>
                    </div>
                </div>
            }
        </div>
    )
}

export default Productsdashboard