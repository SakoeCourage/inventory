import React, { useEffect, useState } from 'react'
import Api from '../../../api/Api'
import Rangeinput from '../../../components/inputs/Rangeinput'
import IconifyIcon from '../../../components/ui/IconifyIcon'
import FormInputsearch from '../../../components/inputs/FormInputsearch'
import { object, string, number, date, boolean } from 'yup';
import Userform from '../../usermanagement/partials/Userform'
import useForm from '../../../hooks/useForm'
import { useSelector } from 'react-redux'
import { getAuth } from '../../../store/authSlice'
import Emptydata from '../../../components/formcomponents/Emptydata'
import { addOrUpdateUrlParam, handleValidation } from '../../../api/Util'
import { enqueueSnackbar } from 'notistack'

/**
 * Represents a product model.
 * 
 * @typedef {Object} ProductModel
 * @property {number} model_id - The unique identifier of the product model.
 * @property {string} product_name - The name of the product.
 * @property {string} model_name - The name of the product model.
 * @property {string} basic_quantity - The basic selling quantity unit of the product.
 * @property {string} category_name - The name of the product category.
 * @property {number} in_collection - Indicates if the product is part of a collection (0 for false, 1 for true).
 * @property {string|null} collection_type - The type of collection method, if applicable.
 * @property {number|null} units_per_collection - The number of units per collection, if applicable.
 * @property {Array} stores - An array of stores where the product is available.
 */


/**
 * 
 * @param {{ 
 *   ProductData: ProductModel,
 *   index: number,
 *   fetcthNotInStoreProducts
 *  }} props 
 * @returns 
 */
const AddStoreProductTableRowItem = (props) => {
    const Auth = useSelector(getAuth)
    const { auth } = Auth
    const store_id = auth?.store_preference?.store_id;
    const { ProductData, fetcthNotInStoreProducts, index } = props;
    const [errors, setErrors] = useState({})

    const { setData, data, processing, reset, post } = useForm({
        quantity: null,
        model_id: null,
        store_id: null
    });
    const [calculatedFields, setCalculatedFields] = useState({
        collection: 0,
        units: 0
    })

    useEffect(() => {
        setData('store_id',store_id)
        setData('model_id',ProductData?.model_id)
    }, [ProductData,store_id])



    useEffect(() => {
        const result = (Number(calculatedFields.collection) * (Number(ProductData.units_per_collection ?? 1))) + Number(calculatedFields.units)
        setData('quantity', result)
    }, [calculatedFields])


    const schema = object({
        quantity: number().min(1, "This field is required").required('This field is required').typeError('This field is required'),
        model_id: number().nonNullable(),
        store_id: number().nonNullable(),
    });

    const handleOnSubmit = () => {
        post('store/product-quantity/to-store', {
            onSuccess: () => {
                setCalculatedFields({
                    collection: 0,
                    units: 0
                })
                setData('quantity', 0)
                fetcthNotInStoreProducts();
            },
            onError: (err) => { enqueueSnackbar("Failed to add ", { variant: "error" }) }
        })
    }

    const handleOnValidate = () => {
        handleValidation(schema, data)
            .then(res => {
                handleOnSubmit();
            })
            .catch(err => {
                setErrors(err)
            })
    }

    useEffect(() => {
        console.log(ProductData)
    }, [data])

    return <tr className="p-tr">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
            {index}
        </th>
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
            {ProductData?.product_name}
        </th>
        <td className="px-6 py-4">
            {ProductData?.model_name}
        </td>
        <td className="px-6 py-4">
            <nav className='flex items-center gap-1'>
                {Boolean(ProductData?.in_collection) && <Rangeinput
                    min={0}
                    value={calculatedFields.collection}
                    error={errors?.quantity}
                    onChange={(e) => setCalculatedFields(cv => cv = { ...cv, collection: e.target.value })}
                    label={`No. of ${ProductData?.collection_type ?? '...'}(s)`} />}
                <Rangeinput
                    value={calculatedFields.units}
                    min={0}
                    error={errors?.quantity}
                    onChange={(e) => setCalculatedFields(cv => cv = { ...cv, units: e.target.value })}
                    label={`No. of ${ProductData?.basic_quantity ?? "..."}(s)`}
                />
            </nav>
        </td>
        <td className="px-6 py-4 mt-auto">
            <button disabled={processing} onClick={handleOnValidate} className=' whitespace-nowrap flex items-center gap-1 text-green-800 hover:ring-offset-1 ring-1 ring-green-600 bg-green-100 !text-sm rounded-md  p-2'>
                <span className='!text-xs'>Add To Store</span>
                <IconifyIcon className="!p-0 !h-4 !w-4 " icon="ic:outline-arrow-forward" />
            </button>
        </td>
    </tr>
}


function AddStoreProductsManually() {
    const [currentPageUrl, setCurrentPageUrl] = useState(null)
    const [nextPageUrl, setNextPageUrl] = useState(null)
    const [prevPageUrl, setPrevPageUrl] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const fetcthNotInStoreProducts = (url) => {
        setIsLoading(true);
        Api.get(url ?? '/store-products/unavailable').then(res => {
            const { products, search, full_url } = res.data;
            setCurrentPage(products?.current_page)
            setTotalPage(products?.last_page)
            setNextPageUrl(products?.next_page_url)
            setPrevPageUrl(products?.prev_page_url)
            setProducts([...products?.data])
            setCurrentPageUrl(full_url)
        })
            .catch(err => {
                console.log(err?.response)
            })
            .finally(() => { setIsLoading(false); })
    }

    const handleOnSearchProduct = (sk) => {
        if (currentPageUrl == null) return;
        fetcthNotInStoreProducts(addOrUpdateUrlParam(currentPageUrl, 'search', sk));
    }

    useEffect(() => {
        fetcthNotInStoreProducts();
    }, [])

    return (
        <div className=' min-h-screen'>
            <nav className='w-full z-20 bg-white max-w-sm ml-auto'>
                <FormInputsearch getSearchKey={handleOnSearchProduct} processing={isLoading} placeholder={"search product name"} />
            </nav>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
                        <tr>
                            <th scope="col" className="px-6 py-3 rounded-s-lg">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3 rounded-s-lg">
                                Product name
                            </th>
                            <th scope="col" className="px-6 py-3 rounded-s-lg">
                                Model name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Qty
                            </th>
                            <th scope="col" className="px-6 py-3 rounded-e-lg">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Boolean(products.length) && products?.map((product, i) => <AddStoreProductTableRowItem
                            fetcthNotInStoreProducts={() => fetcthNotInStoreProducts(currentPageUrl)}
                            key={i} index={i + 1} ProductData={product} />)}
                    </tbody>
                </table>
            </div>
            {(Boolean(products?.length) == false) && (isLoading == false) && <div className='flex p-10 items-center justify-center'>
                <Emptydata />
            </div>}

            <div style={{ opacity: isLoading == true ? 0 : 1 }} className='flex items-center p-2 justify-center'>
                <div class='flex items-center justify-center '>
                    <div class="flex justify-center items-center space-x-4">
                        <button onClick={() => fetcthNotInStoreProducts(prevPageUrl)} disabled={prevPageUrl == null} className="border rounded-md bg-gray-100 px-2 py-1 text-3xl leading-6 text-slate-400 transition hover:bg-gray-200 hover:text-slate-500 cursor-pointer shadow-sm">
                            {`<`}
                        </button>
                        <div className="text-slate-500">{currentPage} / {totalPage}</div>
                        <button
                            disabled={nextPageUrl == null}
                            onClick={() => fetcthNotInStoreProducts(nextPageUrl)}
                            className="border rounded-md bg-gray-100 px-2 py-1 text-3xl leading-6 text-slate-400 transition hover:bg-gray-200 hover:text-slate-500 cursor-pointer shadow-sm">
                            {`>`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddStoreProductsManually