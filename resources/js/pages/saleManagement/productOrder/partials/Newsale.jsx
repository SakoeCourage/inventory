import React, { useEffect, useState } from 'react'
import FormInputText from '../../../../components/inputs/FormInputText'
import { Icon } from '@iconify/react'
import Customercart from './Customercart'
import { Switch } from '@mui/material'
import { formatcurrency } from '../../../../api/Util'
import Button from '../../../../components/inputs/Button'
import Api from '../../../../api/Api'
import { handleScrolltoError } from '../../../../api/Util'
import OutofstockUi from './OutofstockUi'
import { AnimatePresence } from 'framer-motion'
import Interruptedsale from './Interruptedsale'
import { SnackbarProvider, useSnackbar } from 'notistack'
import { handleOutOfStock } from './handleOutofStock'
import Loadingwheel from '../../../../components/Loaders/Loadingwheel'




function Newsale({ productsFromDB, modelsFromDB, getAllProductsAndModels, setProductsFromDB, setModelsFromDB }) {
    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState({})
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [formData, setFormData] = useState({
        discount_rate: '',
        customer_fullname: '',
        customer_contact: '',
        sub_total: 0,
        total: 0,
        items: []
    })
    const [outOfStockProducts, setOutOfStockProducts] = useState([])
    const [interreptedSaleAvailable, setInterruptedSaleAvailable] = useState(false)
    const [saleDiscount, setSaleDiscount] = useState(true)

    const [items, setItems] = useState([
        { product_id: '', productsmodel_id: '', units: '', unit_price: '', amount: '', price_per_collection: '', collections: '' }
    ])


    const getProductfromId = (product_id) => {
        return productsFromDB.find(product => product.id == product_id)
    }


    const handleOnsucess = (data) => {
        const { products, models } = data
        setProductsFromDB(products)
        setModelsFromDB(models)
        setFormData({
            discount_rate: '',
            customer_fullname: '',
            customer_contact: '',
            sub_total: 0,
            total: 0,
            items: []
        })
        setItems([{ product_id: '', productsmodel_id: '', units: '', unit_price: '', amount: '', price_per_collection: '', collections: '' }])
        setProcessing(false)
        enqueueSnackbar('Sucess', { variant: 'success' })
    }

    const handleSubmit = () => {
        setProcessing(true)
        handleOutOfStock(formData,modelsFromDB,getProductfromId).then(res => {
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

    const checkForInterruptedSale = () => {
        const i_s = localStorage.getItem('interrupted_sale');
        if (i_s) {
            setInterruptedSaleAvailable(true)
        } else {
            setInterruptedSaleAvailable(false)
        }
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


    useEffect(() => {
        if (Boolean(modelsFromDB?.length) && Boolean(modelsFromDB.length)) {
            checkForInterruptedSale()
        }
    }, [modelsFromDB, modelsFromDB])


    return (
        <div className=' max-w-6xl mx-auto'>
            {Boolean(outOfStockProducts.length) && <nav className=' bg-black/30 fixed inset-0 z-40 flex items-end'>
                <AnimatePresence>
                    <OutofstockUi formData={formData} setOutOfStockProducts={setOutOfStockProducts} products={outOfStockProducts} />
                </AnimatePresence>
            </nav>}
            {Boolean(interreptedSaleAvailable) && <nav className=' bg-black/30 fixed inset-0 z-40 flex items-end'>
                <AnimatePresence>
                    <Interruptedsale setItems={setItems} setFormData={setFormData} setInterruptedSaleAvailable={setInterruptedSaleAvailable} />
                </AnimatePresence>
            </nav>}

            {/* <nav className=' w-full text-right my-4 text-gray-950 font-medium leading-8 tracking-4 flex items-center justify-end'><span className='mr-3'>New Product Sale</span> <Icon icon="bi:plus-circle" /></nav> */}
            <div className='flex flex-col gap-6 h-full'>
                <div className=' min-h-[12rem] bg-white border border-gray-400/70 rounded-md'>
                    <nav className=' max-w-4xl mx-auto border-dotted flex items-center gap-2 p-3 text-blue-950/70'>
                        <Icon icon="mdi:user" /> <span>Customer Information</span>
                    </nav>
                    <hr className='border border-gray-200 w-full border-dotted my-0' />
                    <nav className='flex flex-col lg:flex-row gap-5 w-full p-3 my-5 max-w-4xl mx-auto'>
                        <FormInputText error={errors['customer_fullname']} value={formData.customer_fullname} onChange={(e) => setFormData(cv => cv = { ...cv, customer_fullname: e.target.value })} className="w-full" label="Customer Full Name" />
                        <FormInputText error={errors['customer_contact']} value={formData.customer_contact} onChange={(e) => setFormData(cv => cv = { ...cv, customer_contact: e.target.value })} className="w-full" placeholder="(000) 0000 000" label="Customer Contact" />
                    </nav>
                </div>
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
                <div className=' min-h-[12rem] bg-white border border-gray-400/70 rounded-md pb-5 '>
                    <nav className='  flex items-center gap-2 p-3 text-blue-950/70  max-w-4xl mx-auto'>
                        <Icon icon="ic:twotone-shopping-cart-checkout" /> <span>Items Check Out</span>
                    </nav>
                    <hr className='border border-gray-200 w-full border-dotted my-0' />
                    <nav className='flex flex-col gap-2 max-w-4xl mx-auto w-full mt-5'>
                        <nav className="flex items-center justify-between p-2 bg-red-50/50 text-red-950 rounded-md">
                            <nav>
                                SUB TOTAL
                            </nav>
                            <nav>
                                {formatcurrency(formData?.sub_total)}
                            </nav>
                        </nav>
                        <nav className="flex items-center justify-between p-2 text-red-950 rounded-md">
                            <nav className='w-full'>
                                <FormInputText type='number' inputProps={{ max: 100, min: 0 }} className="w-full" value={formData?.discount_rate} onChange={(e) => setFormData(cv => cv = { ...cv, discount_rate: e.target.value })} label='sale discount' placeholder='(%)' />
                            </nav>
                            <nav className='w-full text-sm flex items-center gap-5 justify-end '>
                                <Switch checked={saleDiscount} onChange={(e) => setSaleDiscount(e.target.checked)} />
                                <span className={`${saleDiscount ? 'text-red-950' : 'text-gray-700'} `}>{formData?.discount_rate && saleDiscount ? `${formData?.discount_rate ?? 0}% discount is applied` : 'no discount applied'}</span>

                            </nav>
                        </nav>
                        <nav className="flex items-center justify-between p-2 bg-red-50/50 text-red-950 rounded-md">
                            <nav>
                                TOTAL
                            </nav>
                            <nav>
                                {formatcurrency(formData?.total)}
                            </nav>
                        </nav>
                    </nav>
                  
                    <nav className='max-w-4xl w-full !mx-auto mt-5'>
                        <Button processing={processing} onClick={() => handleSubmit()} info text="Check Out" otherClasses="w-full" />
                    </nav>
                </div>

            </div>
        </div>
    )
}

export default Newsale