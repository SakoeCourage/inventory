import React, { useEffect, useMemo, useState } from 'react'
import FormInputText from '../../../../components/inputs/FormInputText'
import { Icon } from '@iconify/react'
import Productsection from './Productsection'
import Button from '../../../../components/inputs/Button'
import Api from '../../../../api/Api'
import { handleScrolltoError } from '../../../../api/Util'
import OutofstockUi from './OutofstockUi'
import { AnimatePresence } from 'framer-motion'
import Interruptedsale from './Interruptedsale'
import { SnackbarProvider, useSnackbar } from 'notistack'
import { handleOutOfStock, checkForInterruptedSale, ini_sale, ini_sale_items } from './handlers'
import Customerinformation from './Customerinformation'
import Itemscheckout from './Itemscheckout'
import Invoicepreview from './Invoicepreview'
import Wrapable from '../../../../components/layout/Wrappable'

function Newsale({ productsFromDB, modelsFromDB, paymentMethods, getAllProductsAndModels, setProductsFromDB, setModelsFromDB }) {
    const initial_sale = { ...ini_sale }
    const [showProductSearchModal, setShowProductSearchModal] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [processingProforma, setProcessingProforma] = useState(false)
    const [errors, setErrors] = useState({})
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [formData, setFormData] = useState(initial_sale)
    const [outOfStockProducts, setOutOfStockProducts] = useState([])
    const [interreptedSaleAvailable, setInterruptedSaleAvailable] = useState(false)
    const [saleDiscount, setSaleDiscount] = useState(true)
    const [invoiceData, setInvoiceData] = useState(null)

    const [items, setItems] = useState([])

    const getProductfromId = (product_id) => {
        return productsFromDB.find(product => product.id == product_id)
    }

    const handleOnClearCart = () => {
        setItems([])
    }

    const handleOnsucess = (data, message = "New sale recorded") => {
        if (data) {
            const { products, models, newsale } = data
            setInvoiceData({
                data: newsale,
                type: 'SALE INVOICE'
            })
            setProductsFromDB(products)
            setModelsFromDB(models)
        }
        setFormData(initial_sale)
        setItems([])
        enqueueSnackbar(message, { variant: 'success' })
        setProcessing(false)
        setProcessingProforma(false)
    }

    const handleSubmit = () => {
        setProcessing(true)
        handleOutOfStock(formData, modelsFromDB, getProductfromId).then(res => {
            Api.post('/sale/new', formData).then(res => {
                handleOnsucess(res.data)
                setErrors({})

            }).catch(err => {
                console.log(err)
                if (err?.response?.status === 422) {
                    console.log(err?.response?.data?.errors)
                    setProcessing(false)
                    setErrors(err?.response?.data?.errors)
                    setTimeout(() => {
                        const miuiError = document.querySelectorAll('.Mui-error')
                        handleScrolltoError(miuiError, 'Mui-error', 'outlet')
                    }, 200);
                }
            })
        }).catch(err => {
            setProcessing(false)
            setOutOfStockProducts(err)
        })
    }

    const handleProforma = () => {
        setProcessingProforma(true)
        Api.post('/proforma/new', formData).then(res => {
            console.log()
            setInvoiceData({
                data: res.data,
                type: 'PROFORMA INVOICE'
            })
            handleOnsucess(null, "Proforma Generated")
            setErrors({})
        }).catch(err => {
            if (err?.response?.status === 422) {
                setProcessingProforma(false)
                setErrors(err?.response?.data?.errors)
                setTimeout(() => {
                    const miuiError = document.querySelectorAll('.Mui-error')
                    handleScrolltoError(miuiError, 'Mui-error', 'outlet')
                }, 200);
            }
        })
    }



    useEffect(() => {
        items.map((item, i) => {
            if (item.productsmodel_id) {
                var model = modelsFromDB.find(model => Number(model.id) == Number(item.productsmodel_id))
                let quantity_per_collection = model?.quantity_per_collection
                let quantity = (Number(quantity_per_collection) * Number(item.collections ?? 0)) + Number(item.units)
                item.quantity = quantity
                item.in_collection = Boolean(model.in_collection)
                item.cost_per_collection = model.cost_per_collection
                item.cost_per_unit = model.cost_per_unit
                item.quantity_per_collection = model.quantity_per_collection
            }
        })
        setFormData(cv => cv = { ...cv, items: items })
    }, [items])

    // Check for any sale discount parameters
    useEffect(() => {
        if (saleDiscount && formData?.discount_rate) {
            let dicounted_amount = (formData?.discount_rate / 100) * formData?.sub_total
            let Total = formData?.sub_total - dicounted_amount
            setFormData(cv => cv = { ...cv, total: Total })
        } else {
            let Total = formData?.sub_total
            setFormData(cv => cv = { ...cv, total: Total })
        }
    }, [formData?.discount_rate, formData?.sub_total, saleDiscount])

    // stock items changes to formdata
    useEffect(() => {
        items.map((item, i) => {
            if (item.productsmodel_id) {
                var model = modelsFromDB.find(model => Number(model.id) == Number(item.productsmodel_id))
                let quantity_per_collection = model?.quantity_per_collection
                let quantity = (Number(quantity_per_collection) * Number(item.collections ?? 0)) + Number(item.units)
                item.quantity = quantity
                item.in_collection = Boolean(model.in_collection)
                item.cost_per_collection = model.cost_per_collection
                item.cost_per_unit = model.cost_per_unit
                item.quantity_per_collection = model.quantity_per_collection

            }
        })
        setFormData(cv => cv = { ...cv, items: items })
    }, [items])

    const getBalance = useMemo(() => {
        let bal = 0
        if (Number(formData.amount_paid && formData.total)) {
            if (Number(formData.amount_paid) > Number(formData.total)) {
                bal = Number(Number(formData.amount_paid) - Number(formData.total))
                setFormData(cv => cv = { ...cv, balance: bal })
            }
        }
        return bal;
    }, [formData.amount_paid, Number(formData.total)])



    const handleLoadProforma = () => {
        if (localStorage.getItem('proforma_list')) {
            try {
                const { items } = JSON.parse(localStorage.getItem('proforma_list'))
                setItems(items)
                setFormData(JSON.parse(localStorage.getItem('proforma_list')))
                enqueueSnackbar("Loaded from Proforma", { variant: 'success' })
                localStorage.removeItem('proforma_list')
            } catch (error) {
                localStorage.removeItem('proforma_list')
                enqueueSnackbar("Failed to load proforma", { variant: 'error' })
            }
        }

    }

    useEffect(() => {
        if (Boolean(modelsFromDB?.length) && Boolean(modelsFromDB.length)) {
            handleLoadProforma();
            checkForInterruptedSale(setInterruptedSaleAvailable)
        }
    }, [modelsFromDB, modelsFromDB])




    return (
        <div className=' max-w-7xl  mx-auto'>
            {Boolean(invoiceData) && <Invoicepreview invoiceData={invoiceData} onClose={() => setInvoiceData(null)} />}
            {/* popup on out of stock */}
            {Boolean(outOfStockProducts.length) && <nav className=' bg-black/30 fixed inset-0 z-40 flex items-end'>
                <AnimatePresence>
                    <OutofstockUi formData={formData} setOutOfStockProducts={setOutOfStockProducts} products={outOfStockProducts} />
                </AnimatePresence>
            </nav>}
            {/* popup if found interupted sale */}
            {Boolean(interreptedSaleAvailable) && <nav className=' bg-black/30 fixed inset-0 z-40 flex items-end'>
                <AnimatePresence>
                    <Interruptedsale setItems={setItems} setFormData={setFormData} setInterruptedSaleAvailable={setInterruptedSaleAvailable} />
                </AnimatePresence>
            </nav>}

            <div className='flex flex-col md:flex-row gap-4 w-full min-w-full'>
               
                    <div className=' order-2 flex flex-col gap-2 h-full w-full'>
                        <Customerinformation errors={errors} formData={formData} setFormData={setFormData} />
                        <Productsection
                            setShowProductSearchModal={setShowProductSearchModal}
                            showProductSearchModal={showProductSearchModal}
                            productsFromDB={productsFromDB}
                            modelsFromDB={modelsFromDB}
                            setFormData={setFormData}
                            formData={formData}
                            items={items}
                            errors={errors}
                            setItems={setItems}
                        />

                    </div>
               

                {/* Items Check out */}
                {/* Cart Section */}
                <Wrapable title={"Customer Cart " + Boolean(items.length) && ` Cart Items (${items.length}) `} asmodal={true} className={'w-full'}>
                <div className='  min-h-[12rem] w-full h-full bg-white border border-gray-400/70 rounded-md pb-5 '>
                    <Itemscheckout
                        productsFromDB={productsFromDB}
                        modelsFromDB={modelsFromDB}
                        setFormData={setFormData}
                        formData={formData}
                        items={items}
                        errors={errors}
                        setItems={setItems}
                        handleOnClearCart={handleOnClearCart}
                        paymentMethods={paymentMethods}
                        setSaleDiscount={saleDiscount}
                        saleDiscount={saleDiscount}
                        getBalance={getBalance}
                    />
                    <nav className='max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5 w-full !mx-auto mt-5 px-2 pb-2 md:pb-0'>
                        <Button processing={processingProforma} onClick={() => handleProforma()} alert text="Generate Sale as Proforma" otherClasses="grow" />
                        <Button processing={processing} onClick={() => handleSubmit()} info text="Check Out" otherClasses="grow" />
                    </nav>
                </div>
                </Wrapable>

            </div>
        </div>
    )
}

export default Newsale