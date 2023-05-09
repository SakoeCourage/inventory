import React, { useEffect, useMemo, useState } from 'react'
import FormInputText from '../../../../components/inputs/FormInputText'
import { Icon } from '@iconify/react'
import Customercart from './Customercart'
import Button from '../../../../components/inputs/Button'
import Api from '../../../../api/Api'
import { handleScrolltoError } from '../../../../api/Util'
import OutofstockUi from './OutofstockUi'
import { AnimatePresence } from 'framer-motion'
import Interruptedsale from './Interruptedsale'
import { SnackbarProvider, useSnackbar } from 'notistack'
import { handleOutOfStock, checkForInterruptedSale, ini_sale, ini_sale_items } from './handlers'
import Loadingwheel from '../../../../components/Loaders/Loadingwheel'
import Customerinformation from './Customerinformation'
import Itemscheckout from './Itemscheckout'



function Newsale({ productsFromDB, modelsFromDB, paymentMethods, getAllProductsAndModels, setProductsFromDB, setModelsFromDB }) {

    const initial_sale = { ...ini_sale }
    const initial_sale_items = { ...ini_sale_items }

    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState({})
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [formData, setFormData] = useState(initial_sale)
    const [outOfStockProducts, setOutOfStockProducts] = useState([])
    const [interreptedSaleAvailable, setInterruptedSaleAvailable] = useState(false)
    const [saleDiscount, setSaleDiscount] = useState(true)

    const [items, setItems] = useState([
        initial_sale_items
    ])


    const getProductfromId = (product_id) => {
        return productsFromDB.find(product => product.id == product_id)
    }


    const handleOnsucess = (data) => {
        const { products, models } = data
        setProductsFromDB(products)
        setModelsFromDB(models)
        setFormData(initial_sale)
        setItems([initial_sale_items])
        setProcessing(false)
        enqueueSnackbar('New sale recorded', { variant: 'success' })
    }

    const handleSubmit = () => {
        setProcessing(true)
        handleOutOfStock(formData, modelsFromDB, getProductfromId).then(res => {
            Api.post('/sale/new', formData).then(res => {
                handleOnsucess(res.data)
                setErrors({})
            }).catch(err => {
                if (err?.response?.status === 422) {
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


    useEffect(() => {
        if (Boolean(modelsFromDB?.length) && Boolean(modelsFromDB.length)) {
            checkForInterruptedSale(setInterruptedSaleAvailable)
        }
    }, [modelsFromDB, modelsFromDB])
    useEffect(() => {
        console.log(formData)
    }, [formData])



    return (
        <div className=' max-w-6xl mx-auto'>
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


            <div className='flex flex-col gap-6 h-full'>
                <Customerinformation errors={errors} formData={formData} setFormData={setFormData} />

                {/* Cart Section */}
                <div className=' min-h-[12rem] bg-white border border-gray-400/70 rounded-md pb-5 '>
                    <nav className='  flex items-center gap-2 p-3 text-blue-950/70  max-w-4xl mx-auto mt-'>
                        <Icon icon="material-symbols:shopping-cart" /> <span>Customer Cart</span>
                    </nav>
                    <hr className='border border-gray-200 w-full border-dotted my-0' />
                    <Customercart
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
                <div className=' min-h-[12rem] bg-white border border-gray-400/70 rounded-md pb-5 '>
                    <Itemscheckout
                        paymentMethods={paymentMethods}
                        formData={formData}
                        setSaleDiscount={saleDiscount}
                        setFormData={setFormData}
                        errors={errors}
                        saleDiscount={saleDiscount}
                        getBalance={getBalance}
                    />

                    <nav className='max-w-4xl w-full !mx-auto mt-5'>
                        <Button processing={processing} onClick={() => handleSubmit()} info text="Check Out" otherClasses="w-full" />
                    </nav>
                </div>

            </div>
        </div>
    )
}

export default Newsale