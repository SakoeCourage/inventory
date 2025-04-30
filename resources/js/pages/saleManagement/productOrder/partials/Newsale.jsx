import React, { useEffect, useMemo, useState, useRef, useContext } from 'react'
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
import Wrapable from '../../../../components/layout/Wrappable'
import Payoutsection from './Payoutsection'
import { PrintPrevewContext } from '..'
import IconifyIcon from '../../../../components/ui/IconifyIcon'

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
    const [items, setItems] = useState([])
    const [processingLeaseSale, setProcessingLeaseSale] = useState(false);
    const { setInvoiceData } = useContext(PrintPrevewContext)

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
        setProcessingLeaseSale(false)
    }

    /**
     * 
     * @param {typeof initial_sale} _formData 
     */
    const checkOut = (_formData) => {
        if (_formData == null) return;
        closeSnackbar()
        handleOutOfStock(formData, modelsFromDB, getProductfromId).then(res => {
            enqueueSnackbar('Checking out please wait...', { variant: 'default', preventDuplicate: true })
            Api.post('/sale/new', _formData).then(res => {
                handleOnsucess(res.data)
                setErrors({})

            }).catch(err => {
                setProcessing(false)
                setProcessingLeaseSale(false)
                enqueueSnackbar('Failed', { variant: 'error', preventDuplicate: true, autoHideDuration:500})
                if (err?.response?.status === 422) {
                    console.log(err?.response?.data?.errors)
                    setProcessing(false)
                    setProcessingLeaseSale(false)
                    setErrors(err?.response?.data?.errors)
                    setTimeout(() => {
                        const miuiError = document.querySelectorAll('.Mui-error')
                        handleScrolltoError(miuiError, 'Mui-error', 'outlet')
                    }, 200);
                }
            })
        }).catch(err => {
            setProcessing(false)
            setProcessingLeaseSale(false)
            setOutOfStockProducts(err)
            enqueueSnackbar('Failed', { variant: 'error', preventDuplicate: true, autoHideDuration:500 })
        }).finally(() => {

        })
    }

    const handleOnRegularCheckOut = () => {
        setFormData(cv => {
            const updatedFormData = { ...cv, sale_type: "regular" };
            setProcessing(true);
            checkOut(updatedFormData);
            return updatedFormData;
        });
    }


    const handleOnLeaseCheckOut = () => {
        setFormData(cv => {
            const updatedFormData = { ...cv, sale_type: "lease" };
            setProcessingLeaseSale(true);
            checkOut(updatedFormData);
            return updatedFormData;
        });
    }


    const handleUnCollectedSale = () => {
        setFormData(cv => {
            const updatedFormData = { ...cv, sale_type: "un_collected" };
            setProcessing(true);
            checkOut(updatedFormData);
            return updatedFormData;
        });
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
        <div className=' max-w-7xl h-full p-1 md:p-0  mx-auto'>

            {/* popup on out of stock */}
            {Boolean(outOfStockProducts.length) && <nav className=' bg-black/30 fixed inset-0 z-50 flex items-end'>
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

            <div className='flex flex-col md:grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-full h-full'>
                <div className='flex flex-col gap-2 order-2 md:order-none h-full w-full'>
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
                    <nav>
                        <Payoutsection
                            formData={formData}
                            saleDiscount={saleDiscount}
                            errors={errors}
                            setFormData={setFormData}
                            paymentMethods={paymentMethods}
                            getBalance={getBalance}
                        />
                    </nav>
                    <nav className={`' bg-white/50 shadow border border-gray-300 rounded-md my p-2 px-5 grid grid-cols-2  w-full md:flex items-center md:gap-10 transition-[opacity] duration-500 ${processing && '!opacity-50 !pointer-events-none'}'`}>
                        <button disabled={processing} onClick={() => handleOnRegularCheckOut()} info className='group  p-2 flex flex-col gap-1 items-center justify-center'>
                            <nav
                                className="border rounded-full text-indigo-500 bg-indigo-100  group-hover:bg-indigo-500 group-hover:text-white border-indigo-500 h-max w-max p-5  aspect-square disabled:cursor-not-allowed font-bold hover:border-indigo-400   duration-[500ms,800ms] grow flex-nowrap !flex items-center justify-center "
                            >
                                <IconifyIcon fontSize='2.5rem' className='!h-8 !w-8 md:!h-12 md:!w-12 !p-0' icon='ic:outline-shopping-cart-checkout' />
                            </nav>
                            <h7 className='text-xs text-indigo-400 whitespace-nowrap'>Check Out</h7>
                        </button>

                        <button disabled={processingProforma} onClick={() => handleProforma()} info className='group  p-2 flex flex-col gap-1 items-center justify-center'>
                            <nav
                                className="border rounded-full text-purple-500 h-max bg-purple-100 group-hover:bg-purple-500 group-hover:text-white border-purple-500  w-max p-5 aspect-square disabled:cursor-not-allowed font-bold hover:border-purple-400   duration-[500ms,800ms] grow flex-nowrap !flex items-center justify-center "
                            >
                                <IconifyIcon fontSize='2.5rem' className='!h-8 !w-8 md:!h-12 md:!w-12 !p-0' icon='mdi:file-document-check-outline' />
                            </nav>
                            <h7 className='text-xs text-purple-400 whitespace-nowrap'>Create Proforma</h7>
                        </button>

                        <button disabled={processing} onClick={() => handleOnLeaseCheckOut()} info className='group  p-2 flex flex-col gap-1 items-center justify-center'>
                            <nav
                                className="border rounded-full text-rose-500 h-max bg-rose-100  group-hover:bg-rose-500 group-hover:text-white border-rose-500  w-max p-5  aspect-square disabled:cursor-not-allowed font-bold hover:border-rose-400   duration-[500ms,800ms] grow flex-nowrap !flex items-center justify-center "
                            >
                                <IconifyIcon fontSize='2.5rem' className='!h-8 !w-8 md:!h-12 md:!w-12 !p-0' icon='tabler:shopping-cart-minus' />
                            </nav>
                            <h7 className='text-xs text-rose-400 whitespace-nowrap'>Credit Sale</h7>
                        </button>

                        <button disabled={processing} processing={processingLeaseSale} onClick={() => handleUnCollectedSale()} info className='group  p-2 flex flex-col gap-1 items-center justify-center'>
                            <nav
                                className="border rounded-full text-red-500 h-max bg-red-100  group-hover:bg-red-500 group-hover:text-white border-red-500  w-max p-5  aspect-square disabled:cursor-not-allowed font-bold hover:border-red-400   duration-[500ms,800ms] grow flex-nowrap !flex items-center justify-center "
                            >
                                <IconifyIcon fontSize='2.5rem' className='!h-8 !w-8 md:!h-12 md:!w-12 !p-0' icon='tabler:shopping-cart-pause' />
                            </nav>
                            <h7 className='text-xs text-red-400 whitespace-nowrap'>Uncollected Sale</h7>
                        </button>

                    </nav>
                </div>
                <Wrapable title={"Customer Cart " + Boolean(items.length) && ` Cart Items (${items.length}) `} asmodal={true} className={'w-full h-full order-1 sm:order-2'}>
                    <div className='h-full bg-white  w-full border border-gray-400/70 rounded-md pb-5 '>
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
                    </div>
                </Wrapable>
            </div>



        </div >
    )
}

export default Newsale