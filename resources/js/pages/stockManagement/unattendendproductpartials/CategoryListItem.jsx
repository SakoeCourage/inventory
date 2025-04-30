import React from 'react'
import { Icon } from '@iconify/react'
import ProductList from './ProductList'

function CategoryListItem({ categoryname, products }) {
    return <div className=' border rounded-md  relative bg-white  border-gray-400/70 isolate mt-0'>
        <nav className='border-b p-3 bg-info-400 text-white text-sm sticky top-0 z-10 backdrop-blur-sm rounded-b-m capitalize'>
            {categoryname}
        </nav>
        {Object.entries(products).map((product, i) => <ProductList key={i} productname={product[0]} products={product[1]} />)}
    </div>
}


export default CategoryListItem