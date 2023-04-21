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
import Loadingspinner from '../../components/Loaders/Loadingspinner'
import { Icon } from '@iconify/react'
import Emptydata from '../../components/formcomponents/Emptydata'


function Productstock() {
    const [showStockingModal, setShowStockingModal] = useState({
        option: null
    })
    const [currentModelID, setCurrentModelID] = useState(null)
    const [stockHistorys, setStockHistory] = useState([])
    const [stockData, setStockData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getStockData = () => {
        if (currentModelID) {
            setIsLoading(true)
            Api.get(`/product/models/${currentModelID}/stock/data`)
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
        if (currentModelID) {
            Api.get(url ?? `/product/models/${currentModelID}/stock/history`)
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
        if (currentModelID) {
            fetchAllData()
        }
    }, [currentModelID])



    return (
        <div className='flex min-h-full gap-4'>
            {isLoading && <div className='fixed inset-0 flex items-center justify-center bg-white/40 z-40'>
                <Icon icon="svg-spinners:pulse-rings-3" className='text-blue-600' fontSize={60} />
            </div>}

            <SideModal onClose={() => setShowStockingModal({ option: null })}
                showClose title="Add to Stock " maxWidth='xl'
                open={Boolean(currentModelID && showStockingModal.option == 'add')}>
                <Addtostockform
                    fetchAllData={fetchAllData}
                    setShowStockingModal={setShowStockingModal}
                    stockData={stockData}
                />
            </SideModal>

            <SideModal onClose={() => setShowStockingModal({ option: null })}
                showClose title="Adjust Stock" maxWidth='xl'
                open={Boolean(currentModelID && showStockingModal.option == 'remove')} >
                <Removefromstockform
                    fetchAllData={fetchAllData}
                    stockData={stockData}
                    setShowStockingModal={setShowStockingModal}
                />
            </SideModal>

            <div className=' min-w-[17rem] text-sm'>
                <Productmodellist
                    currentModelID={currentModelID}
                    setCurrentModelID={setCurrentModelID}
                />
            </div>
            {currentModelID ? <div className=' container mx-auto'>
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
                <div className=' mt-12 text-sm'>
                    <Productstockhistory
                        currentModelID={currentModelID}
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

export default Productstock