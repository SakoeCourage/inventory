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


function EmptyList({ setShowProductSearchModal, AddEmptyRecordToList }) {
    return <nav className='w-full min-h-[27rem] relative flex items-center justify-center'>
        <button >
            <nav onClick={AddEmptyRecordToList} className=' mt-2 h-12 active:ring-2  bg-info-100/70 flex items-center gap-4 shadow p-2 uppercase text-info-900 text-xs rounded-sm ring-1 ring-offset-1 ring-info-800/70'>
                <Icon className='text-info-500' fontSize={30} icon="streamline:interface-align-back-back-design-layer-layers-pile-stack" />
                Add a product to line
            </nav>
            <nav onClick={() => setShowProductSearchModal(true)} className=' mt-2 h-12 active:ring-2  bg-info-100/70 flex items-center gap-2 shadow p-2 uppercase text-info-900 text-xs rounded-sm ring-1 ring-offset-1 ring-info-800/70'>
                <Icon className='text-info-500' fontSize={40} icon="fluent:search-square-24-regular" />
                Add a product from search
            </nav>

        </button>
    </nav>
}



function Newstock() {
    const [productsFromDB, setProductsFromDB] = useState([])
    const [modelsFromDB, setModelsFromDB] = useState([])
    const [showProductSearchModal, setShowProductSearchModal] = useState(false)
    const [newStockList, addToNewStockList] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [stockMetaData, setStockMetaData] = useState({
        record_date: null,
        purchase_invoice_number: null,
        supplier: null
    })
    const emptyListRecord = {
        product_id: null,
        model_id: null,
        quantity: null,
        cost_per_unit: null,
        cost_per_collection: null
    }
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

    const AddEmptyRecordToList = () => {
        addToNewStockList(cv => cv = [...cv, emptyListRecord])
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
        addToNewStockList([])
    }

    const handleSubmit = () => {
        checkForAnyWrongPricingIcon()
        setIsLoading(true)
        Api.post('/stock/new', { ...stockMetaData, new_stock_products: newStockList })
            .then(res => {
                setIsLoading(false)
                resetForm()
                setErrors({})
                enqueueSnackbar('New Stock Added', { variant: 'success' })
                const { products, models } = res.data
                setProductsFromDB(products)
                setModelsFromDB(models)
            })
            .catch(err => {
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


    return (
        <div className=' container mx-auto  py-10 min-h-max'>
            {showProductSearchModal && <div className=' fixed inset-0 bg-black/60 z-30 isolate flex flex-col'>
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
                        <FormInputText error={errors?.purchase_invoice_number} value={stockMetaData.purchase_invoice_number} onChange={(e) => setStockMetaData(cv => cv = { ...cv, purchase_invoice_number: e.target.value })} className="w-full" label='Purchase Invoice Number or description' />
                    </nav>
                    <nav className=' flex lg:flex-row flex-col gap-3'>
                        <FormInputSelect error={errors?.supplier} onChange={(e) => setStockMetaData(cv => cv = { ...cv, supplier: e.target.value })} value={stockMetaData.supplier} options={Boolean(suppliers.length) && [...suppliers.map(({ id, supplier_name }) => { return ({ name: supplier_name, value: id }) })]} className="w-full" label="Select Supplier" />
                    </nav>
                </div>
                <div className='bg-white w-full border border-gray-400/70 rounded-md min-h-[30rem] p-4'>
                    <nav className=' border-b border-b-gray-300 border-dashed uppercase'>New stock products</nav>
                    {Boolean(newStockList?.length) ?
                        <Newstocklist
                            newStockList={newStockList}
                            AddEmptyRecordToList={AddEmptyRecordToList}
                            setShowProductSearchModal={setShowProductSearchModal}
                            productsFromDB={productsFromDB}
                            modelsFromDB={modelsFromDB}
                            addToNewStockList={addToNewStockList}
                            errors={errors}
                        />
                        :
                        <EmptyList setShowProductSearchModal={setShowProductSearchModal}
                            addToNewStockList={addToNewStockList}
                            AddEmptyRecordToList={AddEmptyRecordToList}
                        />
                    }

                </div>

                <div className='bg-white w-full border border-gray-400/70 rounded-md p-2 flex flex-col'>
                    <Button processing={isLoading} onClick={() => handleSubmit()} text="Add Current Data to Stock" className=" !min-w-full" />
                </div>
            </main>
        </div>
    )
}

export default Newstock