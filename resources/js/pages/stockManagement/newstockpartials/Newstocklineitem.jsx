import React, { useMemo, useState } from 'react'
import FormInputSelect from '../../../components/inputs/FormInputSelect'
import FormInputText from '../../../components/inputs/FormInputText'
import { Icon } from '@iconify/react'
import { useEffect } from 'react'
import { Tooltip } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import ProductPricing from './Productpricing'
import { SlideUpAndDownAnimation } from '../../../api/Util'



function Newstocklineitem({ index, productsFromDB, addToNewStockList, newStockList, modelsFromDB, lineItem, errors }) {
    const [selectProductsModels, setselectProductsModels] = useState([])
    const [basicUnit, setBasicUnit] = useState(null)
    const [collectionType, setCollectionType] = useState(null)
    const [Incollection, setInCollection] = useState(false)
    const [requireAttention, setRequireAttention] = useState(false)
    const [showPricingModal, setShowPricingModal] = useState(false)
    const [quantity, setQuantity] = useState({
        collection: '',
        units: ''
    })
    const removeItemFromIndex = () => {
        let newitems = [...newStockList];
        newitems.splice(index, 1);
        addToNewStockList(newitems)
    }
    const handleChangeInProduct = (key, data) => {
        let newitems = [...newStockList];
        newitems[index][key] = data;
        newitems[index] = {
            ...newitems[index],
            quantity: null,
            cost_per_unit: null,
            cost_per_collection: null
        };
        setCollectionType(null)
        setInCollection(false)
        setQuantity(cv => cv = {
            collection: '',
            units: ''
        })
        addToNewStockList(newitems)
    }

    const handleChangeAtIndex = (key, data) => {
        let newitems = [...newStockList];
        newitems[index][key] = data;
        addToNewStockList(newitems)
    }

    const getCurrentModel = () => {
        return selectProductsModels.find((m, i) => m.id == lineItem['model_id'])
    }

    const checkAttentionIfRequired = () => {
        if (getCurrentModel()) {
            if (Boolean(getCurrentModel()?.in_collection)) {
                if ((Number(lineItem['cost_per_collection']) >= Number(getCurrentModel()?.price_per_collection)) || (Number(lineItem['cost_per_unit']) >= Number(getCurrentModel()?.unit_price))) {
                    setRequireAttention(true)
                } else {
                    setRequireAttention(false)
                }
            } else if (!Boolean(getCurrentModel()?.in_collection)) {
                if (Number(lineItem['cost_per_unit']) >= Number(getCurrentModel()?.unit_price)) {
                    setRequireAttention(true)
                } else {
                    setRequireAttention(false)
                }
            }
        }
    }

    useEffect(() => {
        checkAttentionIfRequired()
    }, [lineItem, getCurrentModel])


    useEffect(() => {
        if (lineItem['product_id'] && Boolean(modelsFromDB.length)) {
            const models = modelsFromDB.filter((model, i) => model.product_id === newStockList[index]['product_id'])
            setselectProductsModels(models)
            setBasicUnit(productsFromDB.find(product => product.id == newStockList[index]['product_id'])?.basic_quantity?.name)
        }
    }, [lineItem['product_id']])

    useEffect(() => {
        handleChangeInProduct('cost_per_unit', getCurrentModel()?.cost_per_unit)
        handleChangeInProduct('cost_per_collection', getCurrentModel()?.cost_per_collection)
        if (newStockList[index]['model_id'] && Boolean(selectProductsModels.length)) {
            let model = getCurrentModel()
            setInCollection(Boolean(model?.in_collection))
            handleChangeAtIndex('in_collection', Boolean(model?.in_collection))
            setCollectionType(model?.collection_type?.type)
        }
    }, [lineItem['model_id'], selectProductsModels])

    useEffect(() => {
        const { collection, units } = quantity
        let quantity_per_collection = getCurrentModel()?.quantity_per_collection
        let calculatedQuantity = Number((collection ?? 0) * quantity_per_collection) + Number(units ?? 0)
        handleChangeAtIndex('quantity', calculatedQuantity)
    }, [quantity])

    return <nav className='flex flex-col gap-4 w-full p-2 py-4 relative h-max   product-list overflow-hidden'>

        <AnimatePresence>
            {showPricingModal &&
                <motion.div
                    variants={SlideUpAndDownAnimation}
                    initial="initial"
                    animate="animate"
                    exit='exit'
                    className="absolute inset-0 bg-gray-100 z-20 h-full px-5 py-2">
                    <ProductPricing basicUnit={basicUnit} collectionType={collectionType} setShowPricingModal={setShowPricingModal} Incollection={Incollection} lineItem={lineItem} getCurrentModel={getCurrentModel} />
                </motion.div>}
        </AnimatePresence>


        <nav className='flex items-center justify-between text-sm'>
            <nav className='flex items-center gap-3 my-2 rounded-sm shadow-md p-2 bg-blue-50  ring-1 ring-offset-1 ring-blue-200/90'>
                <span>Product Line Item</span>
                <span className='text-white bg-blue-500/70   p-1 rounded-full text-xs w-6 h-6 grid place-items-center '>{index + 1}</span>
            </nav>
            <nav className='flex w-max items-center gap-4'>
                {requireAttention && lineItem['model_id'] && <nav className='cursor-pointer attention-icon' onClick={() => setShowPricingModal(true)}>
                    <Tooltip arrow title="Product's pricing needs to be configured properly . Click to Learn more">
                        <Icon className='text-red-500/90 h-8 w-8 rounded-full hover:ring-2 ring-offset-[0.2px] ring-red-500/90 cursor-pointer transition-all ' fontSize={15} icon="mdi:warning-circle" />
                    </Tooltip>
                </nav>}
                <button onClick={() => removeItemFromIndex()} className='flex items-center gap-3 rounded-sm shadow-md p-2 bg-red-50  ring-1 ring-offset-1 ring-red-200/90'>
                    <span>Remove this item</span>
                    <span className='text-white bg-red-500/70   p-1 rounded-full text-xs w-6 h-6 grid place-items-center '>
                        <Icon icon="ph:trash-bold" fontSize={15} />
                    </span>
                </button>
            </nav>
        </nav>


        <nav className='flex flex-col lg:flex-row w-full gap-2'>
            <FormInputSelect error={errors[`new_stock_products.${index}.product_id`]} value={newStockList[index]['product_id']} onChange={(e) => {
                newStockList[index]['model_id'] = null
                handleChangeInProduct('product_id', e.target.value)
            }} options={Boolean(productsFromDB.length) && [...productsFromDB?.map((product, i) => { return ({ name: product.product_name, value: product.id }) })]} className='w-full' label='Select Product' />
            <FormInputSelect
                error={errors[`new_stock_products.${index}.model_id`]}
                value={lineItem['model_id']}
                onChange={(e) => {
                    handleChangeAtIndex('model_id', e.target.value)
                    setQuantity({
                        collection: null,
                        units: null
                    })
                }}
                options={Boolean(selectProductsModels.length) ? [...selectProductsModels?.map((model, i) => { return ({ name: model.model_name, value: model.id }) })] : []}
                className='w-full' label='Select Product Model' />
        </nav>


        <nav className='flex flex-col lg:flex-row w-full gap-2'>
            {Incollection && <FormInputText
                error={errors[`new_stock_products.${index}.quantity`]}
                value={quantity.collection}
                onChange={(e) => setQuantity(cq => cq = { ...cq, collection: e.target.value })}
                className='w-full' label={`Number of ${collectionType ?? 'Crate'}`} />}
            {basicUnit && <FormInputText
                value={quantity.units}
                error={errors[`new_stock_products.${index}.quantity`]}
                onChange={(e) => setQuantity(cq => cq = { ...cq, units: e.target.value })}
                className='w-full' label={`Number of ${basicUnit ?? 'Units'}`} />}
        </nav>


        <nav className='flex flex-col lg:flex-row w-full gap-2'>
            {Incollection && <FormInputText
                value={newStockList[index]['cost_per_collection']}
                error={errors[`new_stock_products.${index}.cost_per_collection`]}
                onChange={(e) => handleChangeAtIndex('cost_per_collection', e.target.value)}
                className='w-full' label={`Cost per ${collectionType ?? 'Crate'}`} />}
            {basicUnit && <FormInputText
                value={newStockList[index]['cost_per_unit']}
                error={errors[`new_stock_products.${index}.cost_per_unit`]}
                onChange={(e) => handleChangeAtIndex('cost_per_unit', e.target.value)}
                className='w-full' label={`Cost per ${basicUnit ?? 'Units'}`} />}
        </nav>

    </nav>
}

export default Newstocklineitem