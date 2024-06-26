import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FormInputText from '../../../../components/inputs/FormInputText'
import FormInputSelect from '../../../../components/inputs/FormInputSelect'
import { Icon } from '@iconify/react'
import { Tooltip } from '@mui/material'
import { formatcurrency } from '../../../../api/Util'
import Button from '../../../../components/inputs/Button'
import Productsearch from '../../../stockManagement/newstockpartials/Productsearch'
const EmptyProductData = { product_id: '', productsmodel_id: '', units: '', unit_price: '', amount: '', price_per_collection: '', collections: '' }

function Productselection({ modelsFromDB, productsFromDB, addNewItem, setShowProductSearchModal, showProductSearchModal, items,checkForImproperPricing,requiredAttention }) {
    const [currentList, setCurrentList] = useState({ ...EmptyProductData })
    const [showModelError, setShowModelError] = useState(false)


    let getProductsModelsfromProductId = (id) => {
        return modelsFromDB.filter((data) => data?.product_id == id)
    }


    let GetmodelfromId = (id) => {
        return modelsFromDB.find(model => model.id == id)
    }

    let checkIfInCollection = (id) => {
        var in_collection = Boolean(GetmodelfromId(id)?.in_collection)
        return in_collection
    }

    let getCollectionType = (id) => {
        if (id) {
            return GetmodelfromId(id)?.collection_type?.type
        }

    }

    let getBasicQuantity = (id) => {
        if (id) {
            return productsFromDB.find(product => product.id === Number(id))?.basic_quantity?.name
        }
    }

    let Getmaxcollection = useCallback(
        (id) => {
            return (GetmodelfromId(currentList['productsmodel_id'])?.quantity_per_collection - 1)
        },
        [currentList['productsmodel_id']],
    )

    let handleValueChange = (name, data) => {
        let newitems = { ...currentList };
        newitems[name] = data
        setCurrentList(newitems)
    }

    let calculateAmount = useMemo(() => {
        var lineamount = ((Number(currentList?.unit_price ?? 0) * currentList?.units ?? 0) + (Number(currentList?.price_per_collection ?? 0) * Number(currentList?.collections ?? 0))).toFixed(2)
        handleValueChange('amount', Number(lineamount))
        return lineamount
    }, [currentList['price_per_collection'], currentList['collections'], currentList['units'], currentList['unit_price'], currentList['productsmodel_id']])



    let handleProductChange = (data) => {
        let newitems = { ...currentList };
        newitems['product_id'] = data
        newitems['productsmodel_id'] = ''
        newitems['unit_price'] = ''
        newitems['units'] = ''
        newitems['price_per_collection'] = ''
        setCurrentList(newitems)
    }


    useMemo(() => {
        handleValueChange('price_per_collection', GetmodelfromId(currentList['productsmodel_id'])?.price_per_collection)
    }, [currentList['collections']])


    useMemo(() => {
        handleValueChange('unit_price', GetmodelfromId(currentList['productsmodel_id'])?.unit_price)
    }, [currentList['units']])


    const scrollToLast = () => {
        const lineitemsContainer = document.querySelector('#lineitemsContainer')
        lineitemsContainer.scrollBy({
            top: lineitemsContainer.scrollHeight,
            left: 0,
            behavior: 'smooth'
        })
    }


    const CartListConditions = () =>{
      return calculateAmount > 0 && showModelError == false && requiredAttention == false
    }

    const addToCart = () => {
        if (CartListConditions()) {
            addNewItem(currentList)
            setCurrentList({ ...EmptyProductData })
            setTimeout(() => {
                scrollToLast()
            }, 200);
        }
    }

 
    useEffect(() => {
        console.log()
        if (currentList['productsmodel_id']) {
            setShowModelError(Boolean(items.find(item => Number(item?.productsmodel_id) == Number(currentList['productsmodel_id']))))
            setCurrentList({
                ...currentList, collections: '', units: ''
            })
            checkForImproperPricing(GetmodelfromId(currentList['productsmodel_id']))

        }
    }, [currentList['productsmodel_id'],currentList['product_id'], items])




    return <div className='flex  max-w-4xl mx-auto gap-4 w-full p-3 pt-5 '>
        {showProductSearchModal && <div className=' fixed inset-0 bg-black/60 z-[70] isolate flex flex-col'>
            <div className=" max-w-3xl mx-auto w-full">
                <Productsearch
                    setShowProductSearchModal={setShowProductSearchModal}
                    AddEmptyRecordToList={addNewItem}
                    newStockList={[currentList]}
                    addToNewStockList={(data) => setCurrentList(data[1])}
                    emptyListRecord={{ product_id: '', productsmodel_id: '', units: '', unit_price: '', amount: '', price_per_collection: '', collections: '' }}
                />
            </div>
        </div>}

        <div className='item flex w-full flex-col gap-4'>
            <nav className='flex flex-col lg:flex-row gap-4 w-full'>
                <FormInputSelect
                    options={Boolean(productsFromDB) ? [...productsFromDB.map(product => { return ({ name: product['product_name'], value: product['id'] }) })] : []}
                    onChange={(e) => handleProductChange(e.target.value)}
                    value={currentList['product_id']}
                    className="w-full" label='Select Product' />
                <FormInputSelect
                    error={showModelError}
                    options={currentList['product_id'] ? [...getProductsModelsfromProductId(currentList['product_id']).map(model => { return ({ name: model['model_name'], value: model['id'] }) })] : []}
                    onChange={(e) => {
                        handleValueChange('units', '')
                        handleValueChange('collections', '')
                        handleValueChange('price_per_collection', '')
                        handleValueChange('unit_price', '')
                        handleValueChange('productsmodel_id', e.target.value)
                    }}
                    value={currentList['productsmodel_id']}
                    className="w-full" label='Model' />
            </nav>
            <nav className='flex flex-col lg:flex-row gap-4'>

                {currentList['productsmodel_id'] && checkIfInCollection(currentList['productsmodel_id']) &&
                    <FormInputText autocomplete="off"
                        value={Boolean(currentList['collections']) && currentList['collections']}
                        onChange={(e) => {
                            handleValueChange('collections', Number(e.target.value))
                        }}
                        type='number' inputProps={{ min: 0 }} inputMode='numeric' min="0" className="w-full" label={`Number of ${getCollectionType(currentList['productsmodel_id'])}`} />
                }

                <FormInputText autocomplete="off"
                    onChange={(e) => {
                        handleValueChange('units', Number(e.target.value))
                    }
                    }
                    value={Boolean(currentList['units']) && currentList['units']}
                    type='number' inputProps={{
                        min: 0,
                        max: currentList['productsmodel_id'] && checkIfInCollection(currentList['productsmodel_id']) && Getmaxcollection(currentList['productsmodel_id'])
                    }} className="w-full" label={currentList['product_id'] ? `Number of ${getBasicQuantity(currentList['product_id'])}` : 'Number of Units'} />
            </nav>
            <nav className='flex items-center justify-end text-xs text-blue-950  bg-red-50/20 py-2'>
                <nav className='flex items-center gap-3'>
                    <span>Amount :</span>
                    <span>{formatcurrency(calculateAmount)}</span>
                </nav>
            </nav>
            <Button onClick={() => addToCart()} {...((CartListConditions()) ? { info: true } : { neutral: true })} text="Add to Cart" />
            <Button onClick={() => setCurrentList({ ...EmptyProductData })} text="Reset" />
        </div>
    </div>
}

export default Productselection