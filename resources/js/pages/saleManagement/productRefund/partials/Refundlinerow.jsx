import React, { useEffect, useMemo, useState } from 'react'
import {  Switch } from '@mui/material'
import { formatcurrency } from '../../../../api/Util'
import Rangeinput from '../../../../components/inputs/Rangeinput'
import Productcollection from '../../../../components/Productcollection'



export function GetProductCollectionData(in_collection, quantity, quantity_per_collection) {
    let collection = Boolean(in_collection) && Math.floor(Number(quantity) / Number(quantity_per_collection ?? 1))
    let unit = Boolean(in_collection) ? Number(quantity) % Number(quantity_per_collection ?? 1) : quantity
    return { collection, unit }
}

function Refundlinerow({ line_item, index, SetLineitems, items }) {
    const [productQuantity, setProductQuantity] = useState({
        collection: 0,
        units: 0,
    })


    let handleValueChange = (name, data) => {
        let newitems = [...items];
        newitems[index][name] = data
        SetLineitems(newitems)
    }


    const getProductMaxValues = useMemo(() => {
        return GetProductCollectionData(line_item?.in_collection, Number(line_item?.quantity), line_item?.quantity_per_collection);
    }, [line_item?.quantity])


    useEffect(() => {
        let data = GetProductCollectionData(line_item?.in_collection, Number(line_item?.quantity_to_refund), line_item?.quantity_per_collection);
        setProductQuantity({
            collection: data.collection,
            units: data.unit
        })
    }, [line_item.quantity_to_refund])


    useEffect(() => {
        handleValueChange('quantity_to_refund', ((line_item?.quantity_per_collection ?? 0) * productQuantity.collection) + productQuantity.units)
        handleValueChange('row_total', ((line_item?.price_per_collection ?? 0) * productQuantity.collection) + (line_item?.price_per_unit * productQuantity.units))

    }, [productQuantity])





    return <tr className=' border-y'>
        <td className="px-6 py-2 !text-sm whitespace-nowrap">
            <div className="flex  flex-col gap-2 font-normal">
                <nav className="mb-0  ">
                    {line_item?.product_name}
                </nav>
                <nav className="mb-0  ">
                    {line_item?.model_name}
                </nav>
            </div>
        </td>
        <td className="px-6 py-2 !text-sm whitespace-normal">
            <Productcollection
                in_collections={line_item?.in_collection}
                basic_quantity={line_item?.basic_quantity}
                quantity={line_item?.quantity}
                collection_type={line_item?.collection_type}
                units_per_collection={line_item?.quantity_per_collection}
            />
        </td>
        <td className="px-6 py-2 !text-sm whitespace-normal flex flex-col gap-2">
            {Boolean(line_item?.in_collection) &&
                <Rangeinput value={productQuantity.collection}
                    min={0}
                    max={getProductMaxValues.collection}
                    label={line_item?.collection_type + '(s)'}
                    onChange={(e) => setProductQuantity({ ...productQuantity, collection: e.target.value })}
                />}

            <Rangeinput
                value={productQuantity.units}
                min={0} label={line_item?.basic_quantity + '(s)'}
                max={getProductMaxValues.unit}
                onChange={(e) => setProductQuantity({ ...productQuantity, units: e.target.value })}
            />
        </td>
        <td className='px-6 py-2 !text-sm whitespace-nowrap'>
            <div className=' flex items-center flex-col gap-2 justify-center w-full h-full '>
                <Switch checked={line_item?.return_to_stock} onChange={(e) => void(0)} />
                {/* <nav>Defected</nav> */}
            </div>
        </td>
        <td className='px-6 py-2 !text-sm whitespace-nowrap'>
            {formatcurrency(line_item?.row_total)}
        </td>
    </tr>
}

export default Refundlinerow