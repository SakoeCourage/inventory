import React, { useEffect, useState, useMemo } from 'react'
import IconifyIcon from '../../../components/ui/IconifyIcon';
import Button from '../../../components/inputs/Button';
import HelpToolTip from '../../../components/ui/HelpterToolTip';
import FormInputText from '../../../components/inputs/FormInputText';
import { useSelector } from 'react-redux';
import { getUser, getAuth } from '../../../store/authSlice';
import Api from '../../../api/Api';
import { motion, AnimatePresence } from 'framer-motion';
import { formatcurrency, SlideInFromRightAnimation } from '../../../api/Util';
import Productcollection from '../../../components/Productcollection';
import { enqueueSnackbar } from 'notistack';
import Inscription from '../../../components/ui/Inscription';

/**
 * @typedef {Object} Product
 * @property {number} id - The ID of the product.
 * @property {string} product_name - The name of the product.
 * @property {BasicQuantity} basic_quantity - The basic quantity information.
 * @property {number} basic_selling_quantity_id - The ID of the basic selling quantity.
 * @property {number} category_id - The ID of the category.
 * @property {boolean} has_models - Indicates if the product has models.
 * @property {number} product_id - The ID of the related product.
 * @property {number} quantity_in_stock - The quantity of the product in stock.
 * @property {number} unit_price - The unit price of the product.
 * @property {Date} created_at - The creation date of the product.
 * @property {Date} updated_at - The last updated date of the product.
 */

/**
 * @typedef {Object} BasicQuantity
 * @property {number} id - The ID of the basic quantity.
 * @property {string} name - The name of the basic quantity.
 * @property {string} symbol - The symbol of the basic quantity.
 * @property {Date} created_at - The creation date of the basic quantity.
 * @property {Date} updated_at - The last updated date of the basic quantity.
 */

/**
 * @typedef {Object} ProductModel
 * @property {number} id - The ID of the product model.
 * @property {string} model_name - The name of the product model.
 * @property {number} in_collection - Indicates if the product model is part of a collection.
 * @property {number|null} collection_method - The method of collection, if applicable.
 * @property {string|null} collection_type - The type of collection, if applicable.
 * @property {number} cost_per_collection - The cost per collection.
 * @property {number} unit_price - The cost per unit.
 * @property {number} price_per_collection - The price per collection.
 * @property {number|null} quantity_per_collection - The quantity per collection, if applicable.
 * @property {Date} created_at - The creation date of the product model.
 * @property {Date} updated_at - The last updated date of the product model.
 * @property {Product} product - The related product information.
 */



/**
 * @typedef {Object} Store
 * @property {number} id - The unique identifier for the store.
 * @property {string} store_name - The name of the store.
 * @property {number} store_branch_id - The identifier for the store branch.
 * @property {string} created_at - The timestamp when the store was created.
 * @property {string} updated_at - The timestamp when the store was last updated.
 */

/**
 * @type {Store}
 */
const store = {
    id: 1,
    store_name: "New Test Store",
    store_branch_id: 1,
    created_at: "2024-08-02T18:08:13.000000Z",
    updated_at: "2024-08-02T18:08:13.000000Z"
};


/**
 * 
 * @param {{ 
 *    isChecked: boolean;
*     store_name: string;
*     onClick: ()=>void;
*     index: number;
*     loading: boolean;
*  }} param0 
* @returns 
*/
const ProductStoreListItem = ({ isChecked, store_name, onClick, index, loading }) => {
    return <li onClick={onClick} className={`px-3 border border-gray-400 ps-list-item flex items-center relative isolate hover:bg-green-800/10 overflow-hidden cursor-pointer py-5 gap-5 bg-green-800/5 rounded-md ${isChecked && ' !text-white inactive'} ${loading && '!pointer-events-none '}`}>
        <div className={`bg-green-900/70 z-[-1] ps-indicator  inset-0 h-full absolute transition-[width] ease-in-out duration-500  ${isChecked ? 'w-full' : 'w-[1.5px]'}`}>
        </div>
        <div className='text-white h-6 w-6 flex items-center justify-center aspect-square my-auto p-2 text-sm bg-green-950/60 rounded'>
            {index}
        </div>
        <nav className=' font-semibold'>{store_name}</nav>
        {isChecked ? <nav className='ml-auto flex items-center gap-2 text-xs'>
            <nav className=' ml-auto text-white flex items-center gap-1 uppercase'>
                <span>In Store</span>
                <IconifyIcon className="!p-0 !h-5 !w-5" icon="mdi:checkbox-marked-circle" />
            </nav>
            <nav className=' ml-auto text-white flex items-center gap-1 uppercase'>
                Click To Remove
            </nav>
        </nav> : <nav className='ml-auto flex items-center gap-2 text-xs'>
            <nav className=' ml-auto text-black flex items-center gap-1 uppercase'>
                Click To Add
            </nav>
        </nav>
        }
    </li>
}


/**
 * 
 * @param {{ 
 *  productData: ProductModel,
 *  reset: ()=>void,
 *  store_name: string,
 *  store_id: number
 *  }} props 
 * @returns 
 */
const ProductStoreInitialQuantity = ({ productData, reset, store_name, store_id }) => {
    const [updatedQuantity, setUpdatingQuantity] = useState(false)
    const [formData, setFormData] = useState({
        model_id: productData?.id,
        quantity: null
    })

    const [calculatedFields, setCalculatedFields] = useState({
        collection: 0,
        units: 0
    })

    const getEstimatedQuantity = useMemo(() => {
        const result = (Number(calculatedFields.collection) * (Number(productData?.quantity_per_collection ?? 1))) + Number(calculatedFields.units)
        setFormData(cd => cd = { ...cd, quantity: (Number(calculatedFields.collection) * (Number(productData?.quantity_per_collection ?? 1))) + Number(calculatedFields.units) })
        return result
    }, [productData, calculatedFields])

    const handleOnSave = () => {
        setUpdatingQuantity(true)
        Api.post('/store/product-quantity', {
            model_id: formData.model_id,
            store_id: store_id,
            quantity: formData.quantity
        })
            .then(res => {
                enqueueSnackbar("Initial quantity added", { variant: "success" })
                reset();
            })
            .catch(err => {
                enqueueSnackbar("Failed to set quantity", { variant: "error" })
            })
            .finally(() => {
                setUpdatingQuantity(false)
            })
    }

    const focusOnColl = () => {
        const CiUCollection = document.querySelector('.qty-input-coll');
        if (CiUCollection) {
            const firstInput = CiUCollection.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
            return;
        }
    }
    const focusOnUnit = () => {
        const CiUParent = document.querySelector('.qty-input-unit');
        if (CiUParent) {
            const firstInput = CiUParent.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }

    useEffect(() => {
        var in_collection = Boolean(productData?.in_collection)
        if (in_collection) {
            setTimeout(() => {
                focusOnColl()
            }, 300);
        } else {
            setTimeout(() => {
                focusOnUnit()
            }, 300);
        }
    }, [productData])


    return <motion.div
        tabIndex={1}
        variants={SlideInFromRightAnimation}
        initial='initial'
        animate='animate'
        className=' bg-white'>
        <div class="">
            <div class="relative overflow-hidden px-8 pt-8">
                <div width="80" height="77" class="absolute -top-10 -right-10 text-yellow-500">
                    <svg width="120" height="119" viewBox="0 0 120 119" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.3"
                            d="M6.38128 49.1539C3.20326 32.893 13.809 17.1346 30.0699 13.9566L70.3846 6.07751C86.6455 2.89948 102.404 13.5052 105.582 29.7661L113.461 70.0808C116.639 86.3417 106.033 102.1 89.7724 105.278L49.4577 113.157C33.1968 116.335 17.4384 105.729 14.2604 89.4686L6.38128 49.1539Z"
                            fill="currentColor" />
                    </svg>
                </div>
                <div class="text-2xl flex flex-col pb-4">
                    <small className='flex items-center gap-1'>
                        <span>Get started with</span>
                        <strong className='flex items-center gap-1'>
                            <span>
                                {productData?.product?.product_name}
                            </span>
                            <span>
                                {productData?.model_name}
                            </span>
                        </strong>
                    </small>
                    <span class="text-xl ">Set an intitial stock quantity to <strong className=' '>{store_name}</strong></span>
                </div>
                <div className='flex items-center  gap-2'>
                    {Boolean(productData?.in_collection) && <FormInputText onChange={(e) => setCalculatedFields(cv => cv = { ...cv, collection: e.target.value })} required className="w-full grow qty-input-coll" label={`Quantity of ${productData?.collection_type?.type}(s)`} />}
                    <FormInputText onChange={(e) => setCalculatedFields(cv => cv = { ...cv, units: e.target.value })} required className="w-full grow qty-input-unit" label={`Quantity of ${productData?.product?.basic_quantity?.symbol}(s)`} />
                </div>
                <div class="py-2">
                    <ul className='p-1  divide-y'>
                        <li className='flex py-2 items-center justify-between'>
                            <nav className='font-medium'>Store Name</nav>
                            <nav>{store_name}</nav>
                        </li>
                        <li className='flex py-2 items-center justify-between'>
                            <nav className='font-medium'>Product Name</nav>
                            <nav className='flex items-center gap-1'>
                                <span>
                                    {productData?.product?.product_name}
                                </span>
                                <span>
                                    {productData?.model_name}
                                </span>
                            </nav>
                        </li>
                        {Boolean(productData?.in_collection) && <li className='flex py-2 items-center justify-between'>
                            <nav className='font-medium'>Current Cost {productData?.collection_method?.type}</nav>
                            <nav>{formatcurrency(productData?.cost_per_collection)}</nav>
                        </li>}
                        <li className='flex py-2 items-center justify-between'>
                            <nav className='font-medium'>Current Cost Per {productData?.product?.basic_quantity?.symbol}</nav>
                            <nav>{formatcurrency(productData?.unit_price)}</nav>
                        </li>
                        <li className='flex py-2 items-center justify-between'>
                            <nav className='font-medium flex items-center gap-2'>
                                <span>Store Quantity</span>
                                <HelpToolTip
                                    className=''
                                    content={<ul className=''>
                                        <li>Initial Store Quantity</li>
                                    </ul>}
                                />

                            </nav>
                            <nav>
                                <Productcollection
                                    in_collections={productData?.in_collection}
                                    quantity={formData?.quantity}
                                    units_per_collection={productData?.quantity_per_collection}
                                    collection_type={productData?.collection_type?.type}
                                    basic_quantity={productData?.product?.basic_quantity?.symbol}
                                />
                            </nav>
                        </li>
                    </ul>
                    <div class="w-full  flex justify-center items-center border-t border-solid border-gray-200">
                        <button onClick={handleOnSave} class="flex-1 px-4 py-3 text-white bg-green-400 duration-150" >
                            Save
                        </button>
                        <button onClick={reset} class="border-r border-gray-200 flex-1 px-4 py-3 text-white bg-red-400 duration-150" >
                            Not Now
                        </button>
                    </div>
                </div>

            </div>

        </div>


    </motion.div >
}

/**
 * @typedef {Object} StoreState
 * @property {boolean} open - Indicates whether something is open.
 * @property {Store[]} current_stores - Represents the current stores.
 * @property {string} model_name - Represents the model name.
 * @property {id} model_id - Represents the model id.
 */

/**
 * 
* @param {{ 
*  model_name: string,
*  current_stores: Store[]
*  setShowStoreAvailabilityForm: React.Dispatch<React.SetStateAction<StoreState>>
*  showStoreAvailabilityForm: StoreState,
*  handleOnSaveOrCancel: ()=>void
*  }}
* @returns 
*/

function ProductStoreAvailabilityForm({ model_name, current_stores, setShowStoreAvailabilityForm, handleOnSaveOrCancel, showStoreAvailabilityForm }) {
    const Auth = useSelector(getAuth)
    const { auth } = Auth
    // console.log(current_stores)

    // console.log(auth?.user?.stores)

    /**
     * @typedef {object} storeList
     * @property {boolean} isChecked
     * @property {string} store_name
     * @property {number} store_id
     */

    /**
     * @type {[storeList[],React.Dispatch<React.SetStateAction<storeList[]>>]}
     */
    const [currentStores, setCurrentStores] = useState([]);

    const [isToggling, setIsToggling] = useState(false)

    /**
    * @type {[ProductModel | null,React.Dispatch<React.SetStateAction<ProductModel | null>>]}
    */
    const [initialProductData, setInitialProductData] = useState(null)

    const [initalStoreName, setInitialStoreName] = useState(null)

    const [initialStoreId, setInitialStoreId] = useState(null)

    /**
     * 
     * @param {string} store_name 
     * @param {ProductModel} productData 
     */
    const toggleCheck = (store_name, productData) => {
        const updatedStores = currentStores.map(store => {
            if (store.store_name === store_name) {
                const isChecked = !store.isChecked;
                if (isChecked) {
                    setTimeout(() => {
                        setInitialProductData(productData)
                        setInitialStoreName(store?.store_name)
                        setInitialStoreId(store?.store_id)
                    }, 400);
                }
                return { ...store, isChecked };
            }
            return store;
        });
        setCurrentStores(updatedStores);
    };

    /**
     * 
     * @param {storeList} data 
     */
    const toggleProductToStore = (data) => {
        const model_id = showStoreAvailabilityForm?.model_id

        if ((model_id == null) || (data == null)) {
            console.warn("erro model")
            return
        }
        const { store_id, store_name } = data;

        if (store_id == null) return;
        // Handle Api call
        setIsToggling(true)
        Api.post('/store/toggle-product', { model_id: model_id, store_id: store_id })
            .then(res => {
                toggleCheck(store_name, res.data)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsToggling(false)
            })

    }

    const handleOnReset = () => {
        setShowStoreAvailabilityForm({
            open: false,
            current_stores: null,
            model_name: null,
            model_id: null
        })
        setInitialStoreName(null)
        setInitialStoreId(null)
        handleOnSaveOrCancel();
    }

    useEffect(() => {
        /** @type {storeList[] | []} */
        let newStoreList = []

        /**@type {Store[]} */
        const userStores = auth?.user?.stores;

        if (Boolean(userStores?.length)) {
            userStores?.forEach(store => {
                const inStore = current_stores?.some(cstore => cstore?.id == store?.id)
                if (inStore) {
                    newStoreList = [...newStoreList, { isChecked: true, store_name: store?.store_name, store_id: store?.id }]
                } else {
                    newStoreList = [...newStoreList, { isChecked: false, store_name: store?.store_name, store_id: store?.id }]
                }
            })
        }
        setCurrentStores(newStoreList)
    }, [current_stores, auth?.user?.stores])



    useEffect(() => {
        console.log(initialProductData)
    }, [initialProductData])




    return (
        <div className='min-h-full h-auto w-full border flex items-end overflow-y-scroll overflow-x-hidden rounded-md p-2'>
            <div className='w-full'>
                {initialProductData == null && <motion.div
                    variants={SlideInFromRightAnimation}
                    initial='initial'
                    animate='animate'
                    className='w-full'>
                    <nav className='border-b text-base py-5'>
                        <nav className='px-3 py-2'>
                            Please select to toggle to or from the list of available stores to add or remove <strong>{model_name}</strong>
                        </nav>
                        <Inscription title='Need Help - Store Actions'>
                            <ul className=' list-outside list-disc px-3 py-2 space-y-1'>
                                <li>
                                    Removing a product from the store?
                                    <br />
                                    <small>Click and wait for store to turn transparent</small>
                                    <br />
                                    <small>This action will clear the current stock quantity of this product.</small>
                                </li>
                                <li>
                                    Adding product to store?
                                    <br />
                                    <small>Click and wait for store to turn green</small>
                                    <br />
                                    <small>You can optionally set initial stock quantity</small>
                                </li>
                            </ul>
                        </Inscription>
                    </nav>
                    <ul className='flex flex-col gap-1 relative'>
                        {isToggling && <div className=' absolute inset-0 z-10 bg-white/50'>
                        </div>}
                        {Boolean(currentStores?.length) && currentStores?.map((cv, i) => (
                            <ProductStoreListItem
                                loading={isToggling}
                                onClick={() => toggleProductToStore(cv)}
                                {...cv}
                                key={i}
                                index={i + 1}
                            />
                        ))}
                    </ul>
                    <div className='grid grid-cols-1 my-4 gap-2'>
                        <Button ghost className="bg-gray-300/70" onClick={handleOnReset}>
                            Done
                        </Button>
                    </div>
                </motion.div>}
                {initialProductData != null && <ProductStoreInitialQuantity
                    store_name={initalStoreName}
                    productData={initialProductData}
                    store_id={initialStoreId}
                    reset={() => setInitialProductData(null)}
                />}

            </div>
        </div>
    );
}

export default ProductStoreAvailabilityForm;