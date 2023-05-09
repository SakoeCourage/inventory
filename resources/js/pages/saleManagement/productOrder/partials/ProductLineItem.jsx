import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FormInputText from '../../../../components/inputs/FormInputText'
import FormInputSelect from '../../../../components/inputs/FormInputSelect'
import { Icon } from '@iconify/react'
import { Tooltip } from '@mui/material'
import { formatcurrency } from '../../../../api/Util'


function ProductLineItem({ index, modelsFromDB, productsFromDB, handleProductChange, handleValueChange, item, items, removeItemat, errors }) {
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
            return (GetmodelfromId(item['productsmodel_id'])?.quantity_per_collection - 1)
        },
        [item['productsmodel_id']],
    )

    let calculateAmount = useMemo(() => {
        var lineamount = ((Number(item?.unit_price ?? 0) * item?.units ?? 0) + (Number(item?.price_per_collection ?? 0) * Number(item?.collections ?? 0))).toFixed(2)
        handleValueChange(index, 'amount', Number(lineamount))
        return lineamount
    }, [item['price_per_collection'], item['collections'], item['units'], item['unit_price'], item['productsmodel_id']])





    return <div data-index={index + 1} className='flex  max-w-4xl mx-auto gap-4 w-full p-3 py-5 customer-cart-list-item  '>
        <div className='item flex w-full flex-col gap-4'>
            <nav className='flex flex-col lg:flex-row gap-4 w-full'>
                <FormInputSelect
                    error={errors && errors[`items.${index}.product_id`]}
                    options={Boolean(productsFromDB) ? [...productsFromDB.map(product => { return ({ name: product['product_name'], value: product['id'] }) })] : []}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    value={item['product_id']}
                    className="w-full" label='Select Product' />
                <FormInputSelect
                 error={errors && errors[`items.${index}.productsmodel_id`]}
                    options={item['product_id'] ? [...getProductsModelsfromProductId(item['product_id']).map(model => { return ({ name: model['model_name'], value: model['id'] }) })] : []}
                    onChange={(e) => {
                        handleValueChange(index, 'units', '')
                        handleValueChange(index, 'collections', '')
                        handleValueChange(index, 'price_per_collection', '')
                        handleValueChange(index, 'unit_price', '')
                        handleValueChange(index, 'productsmodel_id', e.target.value)
                    }}
                    value={item['productsmodel_id']}
                    className="w-full" label='Model' />
            </nav>
            <nav className='flex flex-col lg:flex-row gap-4'>
                {item['productsmodel_id'] && checkIfInCollection(item['productsmodel_id']) &&
                    <FormInputText autocomplete="off"
                    error={errors && errors[`items.${index}.quantity`]}
                        value={item['collections']}
                        onChange={(e) => {
                            handleValueChange(index, 'collections', Number(e.target.value))
                            handleValueChange(index, 'price_per_collection', GetmodelfromId(item['productsmodel_id'])?.price_per_collection)
                        }}
                        type='number' inputProps={{ min: 0 }} inputMode='numeric' min="0" className="w-full" label={`Number of ${getCollectionType(item['productsmodel_id'])}`} />
                }
                <FormInputText autocomplete="off"
                 error={errors && errors[`items.${index}.quantity`]}
                    onChange={(e) => {
                        handleValueChange(index, 'units', Number(e.target.value))
                        handleValueChange(index, 'unit_price', GetmodelfromId(item['productsmodel_id'])?.unit_price)
                    }
                    }
                    value={item['units']}
                    type='number' inputProps={{
                        min: 0,
                        max: item['productsmodel_id'] && checkIfInCollection(item['productsmodel_id']) && Getmaxcollection(item['productsmodel_id'])
                    }} className="w-full" label={item['product_id'] ? `Number of ${getBasicQuantity(item['product_id'])}` : 'Number of Units'} />
            </nav>
            <nav className='flex items-center justify-end text-xs text-blue-950 h-5 bg-red-50/20 py-2'>
                <nav className='flex items-center gap-3'>
                    <span>Amount :</span>
                    <span>{formatcurrency(calculateAmount)}</span>
                    <Tooltip title="Remove from cart">
                        <button onClick={() => removeItemat(index)} className=' p-1 rounded-full text-xs grid place-items-center text-red-500 '>
                            <Icon icon="ph:trash-bold" fontSize={15} />
                        </button>
                    </Tooltip>

                </nav>
            </nav>
        </div>
    </div>
}

export default ProductLineItem