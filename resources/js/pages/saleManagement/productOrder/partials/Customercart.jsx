import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FormInputText from '../../../../components/inputs/FormInputText'
import FormInputSelect from '../../../../components/inputs/FormInputSelect'
import { Icon } from '@iconify/react'
import { Tooltip,Switch } from '@mui/material'
import { formatcurrency } from '../../../../api/Util'
import Productsearch from '../../../stockManagement/newstockpartials/Productsearch'
import ProductLineItem from './ProductLineItem'
import Button from '../../../../components/inputs/Button'





function Customercart({ productsFromDB, modelsFromDB ,formData,setFormData,items,setItems,errors}) {
    const [showProductSearchModal, setShowProductSearchModal] = useState(false)
   

    let addNewItem = () => {
        setItems((ci => ci = [...ci, { product_id: '', productsmodel_id: '', units: '', unit_price: '', amount: '', price_per_collection: '', collections: '' }]))
    }

    let removeItemat = (i) => {
        if (items.length !== 1) {
            let newitems = [...items];
            newitems.splice(i, 1);
            setItems(newitems)
        }
    }

    let getsub_total = useMemo(() => {
        let subtotalamount = 0;
        if (items) {
            for (const { amount } of items) {
                subtotalamount += Number(amount ?? 0)
            }
        }
        setFormData(cv=>cv= {...cv,sub_total: subtotalamount.toFixed(2)})
        return subtotalamount.toFixed(2)
    }, [items])

    let handleValueChange = (i, name, data) => {
        let newitems = [...items];
        newitems[i][name] = data
        setItems(newitems)
    }

    let handleProductChange = (i, data) => {
        let newitems = [...items];
        newitems[i]['product_id'] = data
        newitems[i]['productsmodel_id'] = ''
        newitems[i]['unit_price'] = ''
        newitems[i]['units'] = ''
        newitems[i]['price_per_collection'] = ''
        setItems(newitems)

    }

 

    return (
        <nav className='flex flex-col py-4 customer-cart-list relative min-h-[15rem]'>
            {showProductSearchModal && <div className=' fixed inset-0 bg-black/60 z-[70] isolate flex flex-col'>
                <div className=" max-w-3xl mx-auto w-full">
                    <Productsearch
                        setShowProductSearchModal={setShowProductSearchModal}
                        AddEmptyRecordToList={addNewItem}
                        newStockList={items}
                        addToNewStockList={setItems}
                        emptyListRecord={{ product_id: '', productsmodel_id: '', units: '', unit_price: '', amount: '', price_per_collection: '', collections: '' }}
                    />
                </div>
            </div>}
            {items.map((item, i) => {
                return (<ProductLineItem
                    productsFromDB={productsFromDB}
                    modelsFromDB={modelsFromDB}
                    key={i}
                    index={i}
                    handleProductChange={handleProductChange}
                    handleValueChange={handleValueChange}
                    item={item}
                    items={items}
                    removeItemat={removeItemat}
                    errors={errors}
                />)
            })}
            <nav className=" mt-5 flex gap-2 items-center justify-evenly text-red-400 bg-red-100/30 border w-max mx-auto px-3 rounded-md">
                <Tooltip title="Add a product from search">
                    <Icon onClick={() => setShowProductSearchModal(true)} className=' h-12 cursor-pointer transform scale-125 w-full grid place-items-center  ' icon="fluent:search-square-24-regular" />
                </Tooltip>
                <hr className='w-full  border-2 transform rotate-90' />
                <Tooltip title=' Add a product to cart '>
                    <Icon onClick={() => addNewItem()} className=' h-12 cursor-pointer w-full grid place-items-center  ' icon="streamline:interface-align-back-back-design-layer-layers-pile-stack" />
                </Tooltip>
            </nav>
     
        </nav>
    )
}

export default Customercart