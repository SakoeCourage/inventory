import React, { useEffect, useState } from 'react'
import Api from '../../../api/Api'
import IconifyIcon from '../../../components/ui/IconifyIcon'
import Button from '../../../components/inputs/Button'
import { enqueueSnackbar } from 'notistack'


/**
 * @typedef {Object} Product
 * @property {number} id - Unique identifier of the product.
 * @property {string} updated_at - Timestamp when the product was last updated.
 * @property {string} product_name - Name of the product.
 * @property {?number} quantity_in_stock - Quantity of the product in stock, or null if not available.
 * @property {string} basic_quantity - Unit of measurement for the product (e.g., 'pcs').
 * @property {string} category_name - Category to which the product belongs.
 * @property {number} models_count - Number of models related to the product.
 * @property {?any} store_products - Store products information, or null if not available.
 */




/**
 * 
 * @param {{ 
 *      product: Product,
 *      onClick: ()=>void,
 *      current: boolean,
 *      currentModelId: number,
 *      onSucess: ()=>void
 *  }}  
 * @returns 
 */
const ProductListItem = ({ product, onClick, current, currentModelId, onSucess }) => {
    const { id, product_name, category_name } = product
    const [isLoading, setIsLoading] = useState(false);

    const handleTranferProduct = () => {
        enqueueSnackbar({ variant: "info", message: "Transfering Product..." })
        setIsLoading(true)
        Api.post("/product-model/transfer", { product_id: id, model_id: currentModelId })
            .then(res => {
                enqueueSnackbar({ variant: "success", message: "Product Transfered Sucessfully" })
                onSucess();
            })
            .catch(err => {
                console.log(err)
                enqueueSnackbar({ variant: "error", message: "Failed to transfer product" })
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    return <div className='flex cursor-pointer hover:scale-[1.01] transition-all w-full border !min-h-16 !h-16 rounded overflow-hidden odd:bg-gray-200/40 even:bg-gray-200'>
        <nav className='flex items-center justify-center basis-[15%] '>
            {/* <nav className='px-3 py-1 bg-gray-200 text-gray-700 flex items-center justify-center'>
                <IconifyIcon icon="tabler:tags-filled" className="!p-0 " />
            </nav> */}
        </nav>
        <nav className=' basis-[30%] py-2 flex flex-col items-start'>
            <h6 className='text-xs text-gray-400'>Product Name</h6>
            <p className=' text-sm text-gray-700 '>
                {product_name}
            </p>
        </nav>
        <nav className=' basis-[30%] py-2 flex flex-col items-start'>
            <h6 className='text-xs text-gray-400'>Category Name</h6>
            <p className=' text-sm text-gray-700 '>
                {category_name}
            </p>
        </nav>
        <nav className='basis-[25%] py-2 flex flex-col items-center justify-center'>
            {current ? <button  className='p-1 px-5 flex items-center gap-1 rounded-full bg-green-800/90 text-white'>
                <IconifyIcon icon="material-symbols:check" className="!h-6 !w-6" />
                <span className=' text-xs'>
                    Current
                </span>
            </button> :
                <button disabled={isLoading} onClick={handleTranferProduct} className='p-1 px-2 flex items-center gap-1 rounded-full bg-indigo-800/90 text-white'>
                    <IconifyIcon icon="ic:baseline-plus" className="!h-6 !w-6" />
                    <span className=' text-xs'>
                        Move Here
                    </span>
                </button>}
        </nav>

    </div>
}

export default ProductListItem;