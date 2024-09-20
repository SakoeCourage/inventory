import React, { useEffect, useMemo,useState } from 'react'
import ProductLineItem from './ProductLineItem'
import EmpytCart from './EmpytCart';
import printJS from 'print-js'
import qz from 'qz-tray';
function Customercart({ productsFromDB, modelsFromDB, formData, setFormData, items, setItems, errors }) {

    let removeItemat = (i) => {
        let newitems = [...items];
        newitems.splice(i, 1);
        setItems(newitems)
    }

    let getsub_total = useMemo(() => {
        let subtotalamount = 0;
        if (items) {
            for (const { amount } of items) {
                subtotalamount += Number(amount ?? 0)
            }
        }
        setFormData(cv => cv = { ...cv, sub_total: subtotalamount.toFixed(2) })
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
        <div className=''>
            {Boolean(items.length) && <div id='lineitemsContainer' className=' w-full '>
                <nav className='w-full text-gray-500 grid grid-cols-8 gap-1 sticky top-0 bg-white z-20  font-medium py-1 border-b'>
                    <nav className=' flex items-center ml-3 justify-start col-span-2'>Product</nav>
                    <nav className=' flex items-center justify-center col-span-3'>Quantity</nav>
                    <nav className='flex items-center justify-center col-span-2'>Amount</nav>
                    <nav className='flex items-center justify-center col-span-1'></nav>
                </nav>
                {items?.map((item, i) => {
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

            </div>}
            {!Boolean(items.length) && <EmpytCart />
            }

        </div>
    )
}

export default Customercart