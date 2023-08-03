import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Productselection from './Productselection'
import { Icon } from '@iconify/react'

function Productsection({ productsFromDB, modelsFromDB, formData, setFormData, items, setItems, errors, setShowProductSearchModal, showProductSearchModal }) {
    const [requiredAttention, setRequireAttention] = useState(false)
    const navigate = useNavigate()
    const getProductNameFromID = (id) => {
        return productsFromDB.find(product => product.id == id)?.product_name
    }

    const [routeParams, setRouteParams] = useState({
        product_name: '',
        product_id: '',
        model_id: ''
    })

    let addNewItem = (newItem) => {
        if (newItem) {
            setItems((ci => ci = [...ci, newItem]))
        }
    }

    const prepareRouteParams = (product_name, product_id, model_id) => {
        setRouteParams({
            product_id: product_id,
            product_name: product_name,
            model_id: model_id
        })
        setRequireAttention(true)
    }

    const handleOnToDashboard = () => {
        if (Boolean(formData?.items?.length)) {
            localStorage.setItem('interrupted_sale', JSON.stringify({ datetime: new Date(), ...formData }))
            navigate(`/stockmanagement/product/${routeParams.product_id}/${routeParams.product_name}/manage?model=${routeParams.model_id}`)
        }
    }

    const checkForImproperPricing = ({ id: model_id, product_id, cost_per_collection, cost_per_unit, price_per_collection, unit_price, in_collection }) => {
        if (Boolean(in_collection)) {
            if ((Number(cost_per_collection) >= Number(price_per_collection)) || (Number(cost_per_unit) >= Number(unit_price))) {
                prepareRouteParams(getProductNameFromID(product_id), product_id, model_id)
            } else {
                setRequireAttention(false)
            }
        } else if (!Boolean(in_collection)) {
            if (Number(cost_per_unit) >= Number(unit_price)) {
                prepareRouteParams(getProductNameFromID(product_id), product_id, model_id)
            } else {
                setRequireAttention(false)
            }
        }
    }





    return (
        <div className=' min-h-[12rem] bg-white border border-gray-400/70 rounded-md '>
            {!requiredAttention ? <nav className='  flex items-center gap-2 p-3 text-blue-950/70  max-w-4xl mx-auto mt-'>
                <nav className=' flex items-center gap-2'>
                    <Icon icon="material-symbols:shopping-cart" /> <span>Product</span>
                </nav>
                <button onClick={() => setShowProductSearchModal(true)} className=' px-2 py-1 border text-sm rounded-full flex items-center gap-1 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20.031 20.79c.46.46 1.17-.25.71-.7l-3.75-3.76a7.904 7.904 0 0 0 2.04-5.31c0-4.39-3.57-7.96-7.96-7.96s-7.96 3.57-7.96 7.96c0 4.39 3.57 7.96 7.96 7.96c1.98 0 3.81-.73 5.21-1.94l3.75 3.75zM4.11 11.02c0-3.84 3.13-6.96 6.96-6.96c3.84 0 6.96 3.12 6.96 6.96s-3.12 6.96-6.96 6.96c-3.83 0-6.96-3.12-6.96-6.96z" /></svg>
                    <span>Extended Product Search</span>
                </button>
            </nav> :
                <nav className=' flex items-center p-3 py-4 gap-2 bg-red-50'>
                    <svg className=' text-red-500' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 36 36"><circle cx="17.93" cy="11.9" r="1.4" fill="currentColor" class="clr-i-outline clr-i-outline-path-1" /><path fill="currentColor" d="M21 23h-2v-8h-3a1 1 0 0 0 0 2h1v6h-2a1 1 0 1 0 0 2h6a1 1 0 0 0 0-2Z" class="clr-i-outline clr-i-outline-path-2" /><path fill="currentColor" d="M18 6a12 12 0 1 0 12 12A12 12 0 0 0 18 6Zm0 22a10 10 0 1 1 10-10a10 10 0 0 1-10 10Z" class="clr-i-outline clr-i-outline-path-3" /><path fill="none" d="M0 0h36v36H0z" /></svg>
                    <nav className=' text-sm'>
                        <span>Current Product is not configured properly </span>
                        <button onClick={handleOnToDashboard} className=' p-1 bg-white ml-1 rounded-md'>Goto dashboard
                            <svg className=' ml-1' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42c.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41l-6.58-6.6a.996.996 0 1 0-1.41 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z" /></svg>
                        </button>
                    </nav>
                </nav>}
            <hr className='border border-gray-200 w-full border-dotted my-0' />
            <nav className='flex flex-col py-4 relative min-h-[15rem]'>

                {productsFromDB && modelsFromDB &&
                    <Productselection
                        requiredAttention={requiredAttention}
                        checkForImproperPricing={checkForImproperPricing}
                        items={items}
                        setShowProductSearchModal={setShowProductSearchModal}
                        showProductSearchModal={showProductSearchModal}
                        productsFromDB={productsFromDB}
                        modelsFromDB={modelsFromDB}
                        addNewItem={addNewItem}
                    />}
            </nav>
        </div>
    )
}

export default Productsection