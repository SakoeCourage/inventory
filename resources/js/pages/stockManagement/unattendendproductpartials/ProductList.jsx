import React from 'react'
import ProductListItem from './ProductListItem'
import { Icon } from '@iconify/react'
function ProductList({ productname, products }) {
    return <div className='rounded-md  flex flex-col '>
        <nav className='border-b p-3 bg-info-100/70 text-info-900 text-sm sticky top-12 z-[0] text-xs'>
            {productname} <span className=' text-xs opacity-60'>{products?.length}</span>
        </nav>
        <nav className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 p-5 u-list '>
            {products && products.map((product, i) => <ProductListItem product={product} key={i} />)}
        </nav>
    </div>

}

export default ProductList