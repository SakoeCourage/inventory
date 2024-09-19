import React, { useEffect, useState } from 'react'
import Api from '../../../api/Api'
import IconifyIcon from '../../../components/ui/IconifyIcon'
import Button from '../../../components/inputs/Button'
import ProductListItem from './ProductListItem'

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
 * modelName: string
 * currentProductId: number
 * modelId: number
 * onClose: ()=>void
 * onProductChange: ()=>void
 * }} props  
 * @returns 
 */
function MoveProductModelView(props) {
    const [isLoading, setIsLoading] = useState(true)
    const [filters, setFilters] = useState([])
    const [productSearchKey, setProductSearchKey] = useState(null)
    /**
     * @type {[Array<Product>,React.Dispatch<React.SetStateAction<Array<Product>>>]}
     */
    const [data, setData] = useState([])
    const [fullUrl, setFullUrl] = useState(null)
    const [nextPageUrl, setNextPageUrl] = useState(null)


    const fetchAllProducts = (url = null) => {
        setIsLoading(true)
        Api.get(url ?? '/product/all').then(res => {
            const { products, filters, full_url } = res.data
            setNextPageUrl(products?.next_page_url);
            setData([...data, ...products?.data])
            setFilters(filters)
            setFullUrl(full_url)
            setIsLoading(false)
        })
            .catch(err => {
                console.log(err.response)
            })
    }

    const handleOnSearch = () => {
        if (productSearchKey == null) return;
        setIsLoading(true)
        Api.get('/product/all?search=' + productSearchKey)
            .then(res => {
                const { products, filters, full_url } = res.data
                setNextPageUrl(products?.next_page_url);
                setData([...products?.data])
                setFilters(filters)
                setFullUrl(full_url)
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err.response)
            })

    }
    useEffect(() => {
        fetchAllProducts();
    }, [])

    return (
        <div className='p-2 flex flex-col h-[calc(min(600px,90vh))] '>
            <nav className='px-1 py-2 basis-[50px] flex items-center justify-between gap-1 text-xs bg-gray-100'>
                <nav>
                    Please select from the list of &nbsp; <strong>Product</strong>&nbsp; to transfer &nbsp;<strong>{props?.modelName}</strong>&nbsp;
                </nav>
                <button onClick={() => props.onClose()} className='flex items-center  text-red-500'>
                    <IconifyIcon icon="material-symbols:close" className="!h-8  !w-8" />
                    <span>Close </span>
                </button>
            </nav>
            <nav className='flex flex-col gap-1 grow overflow-y-scroll px-2 pb-2 relative'>
                <nav className='!min-h-16 !h-16  sticky top-0 !backdrop-blur-md z-30 flex items-center gap-1 '>
                    <div className='border grow overflow-hidden  rounded-md border-gray-800 my-2 focus-within:ring-1 focus-within:ring-gray-700 focus-within:ring-offset-1 transition-all duration-500'>
                        <input
                            type="search"
                            className='bg-white p-3 w-full focus:border-none active:border-none focus:outline-none active:outline-none'
                            placeholder="Enter product name here..."
                            name=""
                            id=""
                            value={productSearchKey}
                            onChange={(e) => setProductSearchKey(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => handleOnSearch()} >
                        <IconifyIcon icon="bi:search" className="text-white" />
                    </Button>
                </nav>
                {!!data?.length && data.map((entry, i) => <ProductListItem
                    currentModelId={props.modelId}
                    onSucess={()=>props.onProductChange()}
                    current={entry.id == props.currentProductId}
                    product={entry} key={i}
                />)}
                {nextPageUrl && <button disabled={isLoading} onClick={() => fetchAllProducts(nextPageUrl)} className=' mx-auto p-2 rounded-md text-xs bg-gray-100'>
                    Load More Products
                </button>}
            </nav>
        </div>
    )
}

export default MoveProductModelView