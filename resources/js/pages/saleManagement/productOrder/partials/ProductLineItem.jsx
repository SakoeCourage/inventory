import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FormInputText from '../../../../components/inputs/FormInputText'
import FormInputSelect from '../../../../components/inputs/FormInputSelect'
import { Icon } from '@iconify/react'
import { Tooltip } from '@mui/material'
import { formatcurrency } from '../../../../api/Util'
import Rangeinput from '../../../../components/inputs/Rangeinput'
import { formatMaximumValue } from '../../../stockManagement/partials/Productstockhistory'
import Productcollection from '../../../../components/Productcollection'
function ProductLineItem({ index, modelsFromDB, productsFromDB, handleProductChange, handleValueChange, item, removeItemat, errors }) {
    let getProductsModelsfromProductId = (id) => {
        return modelsFromDB.filter((data) => data?.product_id == id)
    }

    let getProductNameFromProductId = (id) => {
        return productsFromDB.find((data) => Number(data?.id) == Number(id))?.product_name
    }

    let getModelNameFromProductId = (id) => {
        return modelsFromDB.find((data) => data?.id == id)?.model_name
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

    useEffect(() => {
        console.log(item)
    }, [item])



    return <nav className=' grid grid-cols-8 gap-1 w-full model-item py-2 border-b relative'>
        {/* <nav className=' absolute inset-y-[40%] left-2 bg-red-400 w-5 h-5 text-white flex items-center justify-center rounded-full text-sm aspect-square truncate'>
            {index + 1}
        </nav> */}

        <nav className='flex items-center justify-center col-span-2 '>
            <nav className=' flex flex-col items-start ml-3  gap-2 w-full'>
                <span className=' text-black'>{getProductNameFromProductId(item['product_id'])}</span>
                {item['productsmodel_id']
                    &&
                    <span className=' text-sm'>
                        {getModelNameFromProductId(item['productsmodel_id'])}
                    </span>
                }
            </nav>
        </nav>

        <nav className=' flex items-center justify-center col-span-3'>
            <nav className='flex flex-col  gap-4'>
                <Productcollection
                    in_collections={item?.in_collection}
                    quantity={item?.quantity}
                    units_per_collection={item?.quantity_per_collection}
                    collection_type={getCollectionType(item?.productsmodel_id)}
                    basic_quantity={getBasicQuantity(item?.product_id)}
                />
            </nav>
        </nav>
        <nav className='  flex items-center justify-center col-span-2'>
            <nav>{formatcurrency(calculateAmount)}</nav>
        </nav>
        <nav onClick={() => removeItemat(index)} className=' col-span-1 inset-y-[40%] left-2 p-1 rounded-full text-xs grid place-items-center text-info-500 '>
            <Icon icon="ph:trash-bold" fontSize={20} />
        </nav>
    </nav>
}

export default ProductLineItem