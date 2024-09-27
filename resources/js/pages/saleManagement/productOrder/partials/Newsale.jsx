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
        handleOutOfStock(formData, modelsFromDB, getProductfromId).then(res => {
            Api.post('/sale/new', _formData).then(res => {
                handleOnsucess(res.data)
                setErrors({})
            }).catch(err => {
                setProcessing(false)
                setProcessingLeaseSale(false)
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
        <div className=' max-w-7xl  mx-auto'>

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

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-full'>
                <div className='flex flex-col gap-2 h-full w-full'>
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
                <Wrapable title={"Customer Cart " + Boolean(items.length) && ` Cart Items (${items.length}) `} asmodal={true} className={'w-full'}>
                    <div className='  w-full bg-white border border-gray-400/70 rounded-md pb-5 '>
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

            <nav className='
           bg-gray-50 shadow border border-gray-300 rounded-md my p-2  w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5'>
                <button disabled={processing} onClick={() => handleOnRegularCheckOut()} info
                    className="bg-indigo-500 h-max w-full rounded-lg disabled:cursor-not-allowed text-white font-bold hover:bg-indigo-400 p-3  duration-[500ms,800ms] grow flex-nowrap !flex items-center justify-center gap-3 "
                >
                    <nav>Check Out</nav>
                    <nav>
                        <kbd class="pointer-events-none w-max inline-block  mx-auto h-5 select-none items-center gap-1 rounded border border-gray-300 bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"><span class="text-xs">⌘</span>Ctrl + S</kbd>
                    </nav>
                </button>

                <button disabled={processingProforma} onClick={() => handleProforma()}
                    className="bg-purple-500 h-max w-full rounded-lg disabled:cursor-not-allowed text-white font-bold hover:bg-purple-400 p-3  duration-[500ms,800ms] grow flex-nowrap !flex items-center justify-center gap-3 "
                >
                    <nav>  Create Proforma</nav>
                    <nav>
                        <kbd class="pointer-events-none w-max inline-block  mx-auto h-5 select-none items-center gap-1 rounded border border-gray-300 bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"><span class="text-xs">⌘</span>Ctrl + S</kbd>
                    </nav>
                </button>
                <button disabled={processing} onClick={() => handleOnLeaseCheckOut()}
                    className="bg-rose-500 h-max w-full rounded-lg disabled:cursor-not-allowed text-white font-bold hover:bg-rose-400 p-3  duration-[500ms,800ms] grow flex-nowrap !flex items-center justify-center gap-3 "
                >
                    <nav>     Credit Sale</nav>
                    <nav>
                        <kbd class="pointer-events-none w-max inline-block  mx-auto h-5 select-none items-center gap-1 rounded border border-gray-300 bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"><span class="text-xs">⌘</span>Ctrl + S</kbd>
                    </nav>
                </button>
                <button disabled={processing} processing={processingLeaseSale} onClick={() => handleUnCollectedSale()}
                    className="bg-red-500 h-max w-full rounded-lg disabled:cursor-not-allowed text-white font-bold hover:bg-red-400 p-3  duration-[500ms,800ms] grow flex-nowrap !flex items-center justify-center gap-3 "
                >
                    <nav>Uncollected Sale</nav>
                    <nav>
                        <kbd class="pointer-events-none w-max inline-block  mx-auto h-5 select-none items-center gap-1 rounded border border-gray-300 bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"><span class="text-xs">⌘</span>Ctrl + S</kbd>
                    </nav>
                </button>


            </nav>
        </div >
    )
}

export default Newsale