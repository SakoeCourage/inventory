import React from 'react'
import Button from '../../../components/inputs/Button'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
function ProductListItem({ product }) {
    const navigate = useNavigate()
    return <div className=' border-2 rounded-md p-2 grid grid-cols-1 gap-3 text-sm u-listitem model-item '>
        <nav className=' flex items-center justify-between py-1 bg-gray-50'>
            <nav>Product</nav>
            <nav className=' flex items-center gap-2'>
                <span>{product.product_name} </span>
           
            </nav>
        </nav>
        <nav className=' flex items-center justify-between py-1 bg-gray-50'>
            <nav>Model</nav>
            <nav className=' flex items-center gap-2'>
                
                <span>{product.model_name}</span>
            </nav>
        </nav>
        <nav className=' flex items-center justify-between py-1 bg-gray-50'>
            <nav>Quantity in Stock</nav>
            <nav className=' text-red-400 text-center'>
                {product.quantity_in_stock}
            </nav>
        </nav>
        <Button onClick={() => navigate(`/stockmanagement/product/${product?.product_id}/${product?.product_name}/manage?model=${product?.model_id}`)} neutral otherClasses=" mt-3 !text-sm uppercase">
            <nav className=' flex items-center gap-2'>
                <nav>Manage {product.model_name}</nav>
                <Icon className=' ' icon="solar:round-arrow-right-up-outline" fontSize={20} />
            </nav>
        </Button>
    </div>
}


export default ProductListItem