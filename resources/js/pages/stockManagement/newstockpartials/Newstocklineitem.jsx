import React, { useContext, useMemo, useState } from 'react'
import FormInputSelect from '../../../components/inputs/FormInputSelect'
import FormInputText from '../../../components/inputs/FormInputText'
import { Icon } from '@iconify/react'
import { useEffect } from 'react'
import { Tooltip } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import ProductPricing from './ProductPricing'
import { formatcurrency, SlideUpAndDownAnimation } from '../../../api/Util'
import { NewStockContext } from '../Newstock'
import Button from '../../../components/inputs/Button'
import { useSnackbar } from 'notistack'
import IconifyIcon from '../../../components/ui/IconifyIcon'
import Productsearch from './Productsearch'


const emptyListRecord = {
    product_id: null,
    model_id: null,
    quantity: null,
    cost_per_unit: 0,
    cost_per_collection: 0
}


function NewstockcurrentItem() {
    const { productsFromDB, addToNewStockList, newStockList, setStockToDbDbList, modelsFromDB, errors, stockToDbList } = useContext(NewStockContext)
    const [selectProductsModels, setselectProductsModels] = useState([])
    var index = 0;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    var lineItem = newStockList[0];
    const [basicUnit, setBasicUnit] = useState(null)
    const [collectionType, setCollectionType] = useState(null)
    const [Incollection, setInCollection] = useState(false)
    const [requireAttention, setRequireAttention] = useState(false)
    const [showPricingModal, setShowPricingModal] = useState(false)
    const [showProductSearchModal, setShowProductSearchModal] = useState(false)


    const [quantity, setQuantity] = useState({
        collection: '',
        units: ''
    })

    const addNewItem = (data) => {
        // console.log(data)
    }
    const removeItemFromIndex = () => {
        let newitems = [...newStockList];
        newitems.splice(index, 1);
        addToNewStockList(newitems)
    }

    const handleOnSearchKeySelected = (data) => {
        let newitems = [...newStockList];
        newitems[index]['product_id'] = data['product_id'];
        newitems[index]['model_id'] = data['model_id'];
        newitems[index] = {
            ...newitems[index],
            quantity: null,
            cost_per_unit: null,
            cost_per_collection: null
        };
        setQuantity(cv => cv = {
            collection: '',
            units: ''
        })
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

    const getCurrentProductInformation = useMemo(() => {
        if ((lineItem['product_id'] && lineItem['model_id']) == null) return

        var product = productsFromDB
            .find(product => product?.id == lineItem['product_id'])
            ?.product_name;

        var model = modelsFromDB.find(model => model?.id == lineItem['model_id'])

        return {
            product: product,
            model: model?.model_name,
            cost_per_collection: model?.cost_per_collection,
            cost_per_unit: model?.cost_per_unit,
        }
    }, [lineItem, productsFromDB, modelsFromDB])


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

    const handleOnResetSelection = () => {
        addToNewStockList([structuredClone({ ...emptyListRecord })]);
        setCollectionType(null)
        setInCollection(false)
        setQuantity(cv => cv = {
            collection: '',
            units: ''
        })
        setBasicUnit(null)
    }

    const addCurrentSelection = () => {
        if (requireAttention == true) return;


        const data = newStockList[0]
        if (Incollection) {
            const cost_per_collection = (Number(data['cost_per_collection']) == 0 || Number(data['cost_per_collection']) == null) ? getCurrentProductInformation?.cost_per_collection : Number(data['cost_per_collection'])
            data['cost_per_collection'] = cost_per_collection
        }

        const cost_per_unit = (Number(data['cost_per_unit']) == 0 || Number(data['cost_per_unit']) == null) ? getCurrentProductInformation?.cost_per_unit : Number(data['cost_per_unit'])
        data['cost_per_unit'] = cost_per_unit

        const exist = stockToDbList?.some(entry => entry?.model_id == data['model_id'])
        if (exist) {
            enqueueSnackbar("Current Product Found In Line Item", { variant: "error" });
            return;
        }
        if (Incollection) {
            if (Number(data['cost_per_collection']) == 0) {
                console.log({
                    source: "in collection",
                    cpc: cost_per_collection,
                    data: data
                })
                enqueueSnackbar("Failed to add incomplete selection", { variant: "error" });
                return;
            }
        }

        if (Number(data['cost_per_unit']) == 0
            || Number(data['model_id'] == null)
            || Number(data['quantity'] == 0)
            || Number(data['product_id'] == null)
        ) {
            console.log({
                source: "in unit",
                cpc: cost_per_unit,
                data: data
            })
            enqueueSnackbar("Failed to add incomplete selection", { variant: "error" });
            return;
        }

        setStockToDbDbList(cv => cv = [data, ...cv])
        handleOnResetSelection()
    }

    useEffect(() => {
        checkAttentionIfRequired()
    }, [lineItem, getCurrentModel])


    useEffect(() => {
        if (lineItem['product_id'] && Boolean(modelsFromDB?.length)) {
            const models = modelsFromDB?.filter((model, i) => model?.product_id === newStockList[index]['product_id'])
            setselectProductsModels(models)
            setBasicUnit(productsFromDB?.find(product => product?.id == newStockList[index]['product_id'])?.basic_quantity?.name)
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



    const focusOnColl = () => {
        const CiUCollection = document.querySelector('.cost-input-coll');
        if (CiUCollection) {
            const firstInput = CiUCollection.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
            return;
        }
    }

    const focusOnBasic = () => {
        const CiUParent = document.querySelector('.cost-input-unit');
        if (CiUParent) {
            const firstInput = CiUParent.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }

    useEffect(() => {
        if (lineItem['product_id'] && lineItem['model_id']) {
            if (Incollection == true) {
                setTimeout(() => {
                    focusOnColl()
                }, 200);
            } else {
                setTimeout(() => {
                    focusOnBasic()
                }, 200);
            }
        }
    }, [lineItem, Incollection])





    return <nav className='flex flex-col w-full p-2  grow py-4 relative min-h-full h-full overflow-hidden'>
        {showProductSearchModal && <div className=' fixed inset-0 bg-black/60 z-[70] isolate flex flex-col'>
            <div className=" max-w-3xl mx-auto w-full">
                <Productsearch
                    setShowProductSearchModal={setShowProductSearchModal}
                    AddEmptyRecordToList={addNewItem}
                    newStockList={[newStockList]}
                    addToNewStockList={(data) => {
                        handleOnSearchKeySelected(data[1])
                    }}
                    emptyListRecord={{ product_id: '', productsmodel_id: '', units: '', unit_price: '', amount: '', price_per_collection: '', collections: '' }}
                />
            </div>
        </div>}
        <AnimatePresence>
            {showPricingModal &&
                <motion.div
                    variants={SlideUpAndDownAnimation}
                    initial="initial"
                    animate="animate"
                    exit='exit'
                    className="absolute inset-0 bg-gray-100 z-20 h-full">
                    <ProductPricing basicUnit={basicUnit}
                        collectionType={collectionType}
                        setShowPricingModal={setShowPricingModal}
                        Incollection={Incollection}
                        lineItem={newStockList[index]}
                        getCurrentModel={getCurrentModel} />
                </motion.div>}

        </AnimatePresence>
        {requireAttention && <nav className='flex items-center text-red-500 gap-5 p-2 border-l border-l-red-500'>
            <IconifyIcon className="!p-0 !h-4 !w-4 " icon="ep:warning-filled" />
            <span className='text-xs'>
                The is a problem with current products pricing model
            </span>
            <button onClick={() => setShowPricingModal(true)} className=' bg-red-600 text-red-100 rounded-full whitespace-nowrap px-2 p-1 text-[0.75rem] leading-3'>See Problem</button>
        </nav>}
        <nav>
            <button onClick={() => setShowProductSearchModal(true)} className='w-full rounded-lg my-2 px-1 border py-1 bg-green-600  text-white text-sm  flex items-center gap-1 ml-auto'>
                <nav className='text-xs flex items-center gap-1 border p-1 grow rounded-lg'>
                    <IconifyIcon className="p-0 !h-7 !w-7" fontSize='2rem' icon="bi:search" />
                    <span className='text-xs'>Search Product Catalogue</span>
                    <kbd class="pointer-events-none  ml-auto h-5 select-none items-center gap-1 rounded border border-gray-300 bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"><span class="text-xs">⌘</span>Ctrl + F</kbd>
                </nav>
            </button>
        </nav>
        <nav className='flex flex-col gap-4 py-2'>

            <div className=''>
                <nav className='flex items-center justify-between'>
                    <h4 className=' text-sm text-gray-500 font-medium'>Product</h4>
                    <nav className=' text-sm font-thin'>{getCurrentProductInformation ?
                        <nav className='flex gap-2'>
                            <span> {getCurrentProductInformation?.product}</span>
                            <span>
                                {getCurrentProductInformation?.model}
                            </span>
                        </nav>
                        : 'N/A'}</nav>
                </nav>

                <nav className='flex items-center justify-between'>
                    <h4 className=' text-sm text-gray-500 font-medium'>{`Current Cost Per ${basicUnit ?? '...'}`}</h4>
                    <nav className=' text-sm font-thin'>
                        {getCurrentProductInformation ?
                            <nav className='flex gap-2'>
                                <span> {formatcurrency(getCurrentProductInformation?.cost_per_unit)}</span>
                            </nav>
                            : 'N/A'}
                    </nav>
                </nav>

                {Incollection && <nav className='flex items-center justify-between'>
                    <h4 className=' text-sm text-gray-500 font-medium'>{`Current Cost Per ${getCurrentModel()?.collection_type ?? '...'}`}</h4>
                    <nav className=' text-sm font-thin'>
                        {getCurrentProductInformation ?
                            <nav className='flex gap-2'>
                                <span> {formatcurrency(getCurrentProductInformation?.cost_per_collection)}</span>
                            </nav>
                            : 'N/A'}
                    </nav>
                </nav>}

            </div>

            <nav className='flex flex-col lg:flex-row w-full gap-4'>
                {Incollection && <FormInputText
                    inputMode='numeric'
                    error={errors[`new_stock_products.${index}.quantity`]}
                    value={quantity.collection}
                    onChange={(e) => setQuantity(cq => cq = { ...cq, collection: e.target.value })}
                    className='w-full cost-input-coll' label={`Number of ${getCurrentModel()?.collection_type ?? 'Crate'}`} />}
               
                {basicUnit && <FormInputText
                    inputMode='numeric'
                    value={quantity.units}
                    error={errors[`new_stock_products.${index}.quantity`]}
                    onChange={(e) => setQuantity(cq => cq = { ...cq, units: e.target.value })}
                    className='w-full cost-input-unit' label={`Number of ${basicUnit ?? 'Units'}`} />
                }
            </nav>

            <nav className='flex flex-col lg:flex-row w-full gap-2'>
                {Incollection && <FormInputText
                    inputMode='numeric'
                    error={errors[`new_stock_products.${index}.cost_per_collection`]}
                    onChange={(e) => handleChangeAtIndex('cost_per_collection', e.target.value)}
                    className='w-full ' label={`New Cost per ${getCurrentModel()?.collection_type ?? 'Crate'}`} />}
                {basicUnit && <FormInputText
                    inputMode='numeric'
                    error={errors[`new_stock_products.${index}.cost_per_unit`]}
                    onChange={(e) => handleChangeAtIndex('cost_per_unit', e.target.value)}
                    className='w-full' label={`New Cost per ${basicUnit ?? 'Units'}`} />}
            </nav>
        </nav >
        <nav className="grid grid-cols-2 mt-auto gap-5">
            <Button className="" onClick={() => addCurrentSelection()} {...(true ? { success: true } : { neutral: true })} text="Add To List" />
            <Button
                alert
                className=""
                onClick={() => handleOnResetSelection()} text="Reset Selection" />
        </nav>

    </nav >
}

export default NewstockcurrentItem