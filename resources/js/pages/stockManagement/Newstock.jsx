import React, { useEffect, useState } from 'react'
import FormInputText from '../../components/inputs/FormInputText'
import FormInputDate from '../../components/inputs/FormInputDate'
import FormInputSelect from '../../components/inputs/FormInputSelect'
import Newstocklist from './newstockpartials/Newstocklist'
import Emptydata from '../../components/formcomponents/Emptydata'
import Modal from '../../components/layout/modal'
import Productsearch from './newstockpartials/Productsearch'
import { Icon } from '@iconify/react'
import Api from '../../api/Api'
import dayjs from 'dayjs'
import Button from '../../components/inputs/Button'
import { handleScrolltoError } from '../../api/Util'
import { SnackbarProvider, useSnackbar } from 'notistack'
import NewStockTab from './newstockpartials/NewStockTab'
import NewStockProductsView from './newstockpartials/NewStockProductsView'
import LowStockProductsView from './newstockpartials/LowStockProductsView'
import { createContext, useContext } from 'react'

export const NewStockContext = createContext({})

function EmptyList({ setShowProductSearchModal, AddEmptyRecordToList }) {
    const handleCtrlS = (event) => {
        if (event.ctrlKey && event.key === 'f') {
            event.preventDefault();
            setShowProductSearchModal(cv => cv = !cv)

        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleCtrlS);
        return () => {
            window.removeEventListener('keydown', handleCtrlS);
        };
    }, []);


    return <nav className='w-full min-h-[27rem] relative flex items-center justify-center'>
        <button >
            <nav onClick={() => setShowProductSearchModal(true)} className=' mt-2 h-12 active:ring-2  bg-info-100/70 flex items-center gap-2 shadow p-2 uppercase text-info-900 text-xs rounded-sm ring-1 ring-offset-1 ring-info-800/70'>
                <kbd class="pointer-events-none  ml-auto h-5 select-none items-center gap-1 rounded border  bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"><span class="text-xs">⌘</span>Ctrl + F</kbd>
                Add a product from search
            </nav>

        </button>
    </nav>
}

const components = {
    NewStockProductsView: NewStockProductsView,
    LowStockProductsView: LowStockProductsView
}

const emptyListRecord = {
    product_id: null,
    model_id: null,
    quantity: null,
    cost_per_unit: 0,
    cost_per_collection: 0
}

function Newstock() {
    /**
     * @type {[keyof typeof components,React.Dispatch<React.SetStateAction<keyof typeof components>>]}
     */
    const [currentComponent, setCurrentComponent] = useState("NewStockProductsView")
    var CurrentView = components[currentComponent]
    const [productsFromDB, setProductsFromDB] = useState([])
    const [modelsFromDB, setModelsFromDB] = useState([])
    const [showProductSearchModal, setShowProductSearchModal] = useState(false)
    const [newStockList, addToNewStockList] = useState([structuredClone({ ...emptyListRecord })])
    const [suppliers, setSuppliers] = useState([])
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const [stockMetaData, setStockMetaData] = useState({
        record_date: null,
        purchase_invoice_number: null,
        supplier: null
    })
    const [stockToDbList, setStockToDbDbList] = useState([]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const getAllProductsAndModels = () => {
        Api.get('/product/all/products/models')
            .then(res => {
                const { products, models } = res.data
                setProductsFromDB(products)
                setModelsFromDB(models)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const AddEmptyRecordToList = (newValue) => {
        addToNewStockList(cv => cv = [...cv, newValue])
    }



    useEffect(() => {
        getAllProductsAndModels()
    }, [])

 

    const getAllSuppliers = () => {
        Api.get('/supplier/all').then(res => {
            setSuppliers(res.data)
        }).catch(err => {
            console.log(err)
        })
    }



    useEffect(() => {
        getAllSuppliers()
    }, [])

    const checkForAnyWrongPricingIcon = () => {
        const errorIcon = document.querySelectorAll('.attention-icon')
        if (errorIcon.length > 0) {
            handleScrolltoError(errorIcon, 'attention-icon', 'outlet')
            throw new Error('invalid pricing')
        }

    }

    const resetForm = () => {
        setStockMetaData({
            record_date: null,
            purchase_invoice_number: '',
            supplier: null
        })
        addToNewStockList([structuredClone({ ...emptyListRecord })])
        setStockToDbDbList([])
    }

    const handleSubmit = () => {
        checkForAnyWrongPricingIcon()
        setIsLoading(true)
        Api.post('/stock/new', { ...stockMetaData, new_stock_products: stockToDbList })
            .then(res => {
                setIsLoading(false)
                resetForm()
                setErrors({})
                enqueueSnackbar('New Stock Added', { variant: 'success' })
                const { products, models } = res.data
                console.log(products)
                setProductsFromDB(products)
                setModelsFromDB(models)
            })
            .catch(err => {
                console.log(err)
                if (err.response?.status === 422) {
                    setErrors(err.response?.data?.errors)
                    setIsLoading(false)
                    setTimeout(() => {
                        const miuiError = document.querySelectorAll('.Mui-error')
                        handleScrolltoError(miuiError, 'Mui-error', 'outlet')
                    }, 200);

                }
            })
    }

    // Low Stock Product Section 
    const [lowSockProducts, setLowStockProducts] = useState([]);

    const getLowStockProducts = (url) => {
        Api.get(url ?? '/stock/low-products')
            .then(res => {
                console.log(res.data)
                setLowStockProducts(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }


    return (
        <NewStockContext.Provider value={{
            newStockList: newStockList,
            AddEmptyRecordToList: AddEmptyRecordToList,
            setShowProductSearchModal: setShowProductSearchModal,
            productsFromDB: productsFromDB,
            modelsFromDB: modelsFromDB,
            addToNewStockList: addToNewStockList,
            stockToDbList: stockToDbList,
            setStockToDbDbList: setStockToDbDbList,
            errors: errors,
            getLowStockProducts: getLowStockProducts,
            lowSockProducts: lowSockProducts,
            setLowStockProducts: setLowStockProducts
        }}>
            <div className=' container mx-auto  py-10 min-h-max'>
                {showProductSearchModal && <div className=' fixed inset-0  bg-black/60 z-30 isolate flex flex-col'>
                    <div className=" max-w-3xl mx-auto w-full">
                        <Productsearch
                            setShowProductSearchModal={setShowProductSearchModal}
                            AddEmptyRecordToList={AddEmptyRecordToList}
                            newStockList={newStockList}
                            addToNewStockList={addToNewStockList}
                            emptyListRecord={emptyListRecord}
                        />
                    </div>
                </div>}

                <main className=' text-blue-950 max-w-5xl w-full mx-auto  flex flex-col gap-5 min-h-max'>
                    <div className='bg-white w-full border border-gray-400/70 rounded-md min-h-[12rem]  flex flex-col gap-4 p-4'>
                        <nav className=' border-b border-b-gray-300 border-dashed uppercase'>New stock information</nav>
                        <nav className=' flex lg:flex-row flex-col gap-3'>
                            <FormInputDate error={errors?.record_date} value={stockMetaData.record_date && dayjs(stockMetaData.record_date)} onChange={(e) => setStockMetaData(cv => cv = { ...cv, record_date: dayjs(e.target.value).format('YYYY-MM-DD') })} className="w-full" label='Record Date' />
                            <FormInputText error={errors?.purchase_invoice_number} value={stockMetaData.purchase_invoice_number} onChange={(e) => setStockMetaData(cv => cv = { ...cv, purchase_invoice_number: e.target.value })} className="w-full" label='Purchase Invoice Number' />
                        </nav>
                        <nav className=' flex lg:flex-row flex-col gap-3'>
                            <FormInputSelect error={errors?.supplier} onChange={(e) => setStockMetaData(cv => cv = { ...cv, supplier: e.target.value })} value={stockMetaData.supplier} options={Boolean(suppliers.length) ? [...suppliers.map(({ id, supplier_name }) => { return ({ name: supplier_name, value: id }) })] : []} className="w-full" label="Select Supplier" />
                        </nav>
                    </div>
                    <div className='bg-white w-full border border-gray-400/70 rounded-md min-h-[30rem] flex flex-col p-4'>
                        <nav className='flex items-center border-b'>
                            <NewStockTab
                                onClick={() => setCurrentComponent('NewStockProductsView')}
                                active={currentComponent == 'NewStockProductsView'}
                                icon='fluent:form-new-20-filled'
                                label='New Stock Products'
                            />
                            <NewStockTab
                                onClick={() => setCurrentComponent('LowStockProductsView')}
                                active={currentComponent == 'LowStockProductsView'}
                                icon='ph:warning-circle-duotone'
                                label='Low Stock Products'
                            />
                        </nav>
                        <CurrentView
                            newStockList={newStockList}
                            AddEmptyRecordToList={AddEmptyRecordToList}
                            setShowProductSearchModal={setShowProductSearchModal}
                            productsFromDB={productsFromDB}
                            modelsFromDB={modelsFromDB}
                            addToNewStockList={addToNewStockList}
                            errors={errors}
                        />
                    </div>
                    <div className='bg-white w-full border border-gray-400/70 rounded-md p-2 flex flex-col'>
                        <Button processing={isLoading} onClick={() => handleSubmit()} text="Add Current Data to Stock" className=" !min-w-full" />
                    </div>
                </main>
            </div>
        </NewStockContext.Provider>
    )
}

export default Newstock