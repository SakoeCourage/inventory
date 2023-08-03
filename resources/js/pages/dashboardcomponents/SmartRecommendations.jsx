import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { useEffect } from 'react'
import Circularprogress from '../../components/Loaders/Circularprogress'
import { NavLink } from 'react-router-dom'
import Emptydata from '../../components/formcomponents/Emptydata'


function Belowrecommended(props) {
    return <div className='flex items-center gap-1  bg-red-100/30 shadow-md p-2 rounded-md m-1 relative'>
        <Circularprogress value={props.product?.percentage ?? 0} />
        <nav className='flex flex-col gap-2 p-2'>
            <nav className='flex items-center gap-2'><nav>{props.product?.product_name}</nav> <nav className=' text-gray-500'>{props.product?.model_name}</nav></nav>
            <nav className='text-xs'>Product might run out of stock soon</nav>
        </nav>
        <NavLink className="  absolute inset-y-[40%] right-5 flex items-center justify-center " to={`/stockmanagement/product/${props.product?.product_id}/${props.product?.product_name}/manage?model=${props.product?.model_id}`}>
            <Icon className=' ' icon="solar:round-arrow-right-up-outline" fontSize={20} />
        </NavLink>
    </div>
}
function Aboverecommended(props) {
    return <div className='flex items-center gap-1 aboverecomendation shadow-md p-2 rounded-md m-1 relative'>
        <Circularprogress value={100} />
        <nav className='flex flex-col gap-2 p-2'>
            <nav className='flex items-center gap-2'><nav>{props.product?.product_name}</nav> <nav className=' text-gray-500'>{props.product?.model_name}</nav></nav>
            <nav className='text-xs'>Everything looks good</nav>
        </nav>
        <NavLink className="  absolute inset-y-[40%] right-5 flex items-center justify-center " to={`/stockmanagement/product/${props.product?.product_id}/${props.product?.product_name}/manage?model=${props.product?.model_id}`}>
            <Icon className=' ' icon="solar:round-arrow-right-up-outline" fontSize={20} />
        </NavLink>

    </div>
}
function Outofstock(props) {
    return <div className='flex items-center gap-1  bg-red-100 shadow-md p-2 rounded-md m-1 relative'>
        <Circularprogress value={0} />
        <nav className='flex flex-col gap-2 p-2'>
            <nav className='flex items-center gap-2'><nav>{props.product?.product_name}</nav> <nav className=' text-gray-500'>{props.product?.model_name}</nav></nav>
            <nav className='text-xs'>Product is out of stock</nav>
        </nav>
        <NavLink className="  absolute inset-y-[40%] right-5 flex items-center justify-center " to={`/stockmanagement/product/${props.product?.product_id}/${props.product?.product_name}/manage?model=${props.product?.model_id}`}>
            <Icon className=' ' icon="solar:round-arrow-right-up-outline" fontSize={20} />
        </NavLink>

    </div>
}

function UnAttendedProducts({ products, models }) {
    return <div className='flex items-center gap-1 justify-between px-4 py-5  bg-red-100 shadow-md  rounded-md m-1 relative'>
        <nav className=' flex items-center '>
            <Icon icon="solar:danger-triangle-bold" className=' text-red-500' fontSize={30} />
            <nav className='flex flex-col gap-2 p-2 text-sm'>
                {models} models in {products} products requires attention
            </nav></nav>
        <NavLink className="  absolute inset-y-[40%] right-5 flex items-center justify-center " to='/stockmanagement/unattended'>
            <Icon className=' ' icon="solar:round-arrow-right-up-outline" fontSize={20} />
        </NavLink>
    </div>
}


function SmartRecommendations({ smart_recommendations, unattended_products }) {

    return (
        <div className='grow relative min-w-[30%] shadow-md  border card rounded-md border-gray-400/40 h-[35.5rem] overflow-y-scroll custom-scroll' >
            <nav className='border-b p-2 sticky top-0 z-20 bg-white'>
                <nav className='flex items-center gap-1 text-info-900'>
                    <Icon fontSize={25} className='text-info-600 ' icon="ph:list-magnifying-glass" />
                    <nav className='flex items-center justify-between grow'>
                        <span>Smart Stock</span>
                        <span className=' text-sm text-gray-400'>Based on most recent sale</span>
                    </nav>
                </nav>
            </nav>

            {
                Boolean(smart_recommendations?.OutOfStock?.length) && smart_recommendations?.OutOfStock?.map((product, i) => {
                    return (<Outofstock key={i} product={product} value={0} />)
                })
            }
            {
                Boolean(smart_recommendations?.BelowRecommended?.length) && smart_recommendations?.BelowRecommended?.map((product, i) => {
                    return (<Belowrecommended key={i} product={product} value={0} />)
                })
            }
            {
                (Boolean(unattended_products.products)) &&
                <UnAttendedProducts products={unattended_products?.products} models={unattended_products?.models} />
            }
            {
                Boolean(smart_recommendations?.EnoughInStock?.length) && smart_recommendations?.EnoughInStock?.map((product, i) => {
                    return (<Aboverecommended key={i} product={product} value={0} />)
                })
            }
            {

            }
            {(!Boolean(unattended_products.products) && !Boolean(unattended_products?.length)) &&
                <div className=' h-full w-full flex items-center justify-center'>
                    <div className='flex flex-col  items-center text-xs'>
                        <Emptydata caption="" />
                        <nav className='mt-2'>Smart stock show</nav>
                        <nav>Product recomendation</nav>
                    </div>
                </div>

            }


        </div>
    )
}

export default SmartRecommendations