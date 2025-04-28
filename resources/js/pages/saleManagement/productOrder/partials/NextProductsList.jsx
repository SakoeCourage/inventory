import { Tooltip } from '@mui/material'
import React, { useEffect } from 'react'
import IconifyIcon from '../../../../components/ui/IconifyIcon'
import { formatcurrency } from '../../../../api/Util'


const NProductListItem = ({ totalAmount, product, model, list }) => {
    return (
        <nav className={` px-2 rounded-md   ${!!list?.length && 'border shadow-orange-100 backdrop-blur-sm bg-orange-50 shadow-lg'}`}>
            {product ? <nav className='flex items-start flex-col gap-2  py-5'>
            
                <nav className=' items-center text-base text-gray-500 font-bold flex pb-2 min-w-full border-gray-300'>
                    <nav className='flex '>
                        <span className=' font-semibold text-gray-500 pr-2'> {product}  </span>
                        <span className='font-medium pl-2'>
                            {model}
                        </span>
                    </nav>
                    <nav className='flex ml-auto items-center justify-end text-xs text-blue-950/65  bg-red-50/20 py-2'>
                        <nav className='flex items-center gap-3'>
                            <span>Amount :</span>
                            <span>{formatcurrency(totalAmount ?? 0)}</span>
                        </nav>
                    </nav>
                </nav>
            </nav> : <nav className='p-5 text-xs text-gray-300 flex items-center gap-1'>
                <IconifyIcon icon='material-symbols:upload-sharp' />
                Search for a product to begin.
            </nav>}
            <nav />
        </nav>
    )
}

const NextProductsList = ({ productsList, cProductTotalAmount, cProduct, cProductModel }) => {
    useEffect(() => {
        console.log(productsList)
    }, [productsList])

    return (
        <div className='w-full relative overflow-visible isolate p-2 flex flex-col'>
            {!!productsList?.length && <nav className='text-xs absolute top-0 z-20 bg-orange-50 text-red-500 font-medium p-2 rounded-full !h-6 !w-max flex items-center justify-center whitespace-normal '>{productsList?.length} more item(s)</nav>}
            {!!productsList?.length && <nav className='product-stack-indicator'></nav>}
            <NProductListItem list={productsList} totalAmount={cProductTotalAmount} product={cProduct} model={cProductModel} />
        </div>
    )
}

export default NextProductsList