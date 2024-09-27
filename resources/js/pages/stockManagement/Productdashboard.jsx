import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Api from '../../api/Api'
import Productmodellist from './partials/Productmodellist'
import Productdetailcard from './partials/Productdetailcard'
import Productpricingcard from './partials/Productpricingcard'
import Productactioncard from './partials/Productactioncard'
import Productstockhistory from './partials/Productstockhistory'
import SideModal from '../../components/layout/sideModal'
import Addtostockform from './partials/Addtostockform'
import Removefromstockform from './partials/Removefromstockform'
import Emptydata from '../../components/formcomponents/Emptydata'
import { useSearchParams } from 'react-router-dom'
import Loadingwheel from '../../components/Loaders/Loadingwheel'
import Wrapable from '../../components/layout/Wrappable'
import Modal from '../../components/layout/modal'
import Newproductmodel from '../appllicationStep/productformpartials/Newproductmodel'
import { motion, AnimatePresence } from 'framer-motion'
import { SlideUpAndDownAnimation } from '../../api/Util'
import { enqueueSnackbar } from 'notistack'
import { AccessByPermission } from '../authorization/AccessControl'


/**
 * @typedef {Object} Model
 * @property {number} id - The unique identifier for the model.
 * @property {string} model_name - The name of the model.
 * @property {number} unit_price - The price per unit for the model.
 * @property {number} quantity_in_stock - The quantity of the model currently in stock.
 * @property {boolean} in_collection - Indicates if the model is sold in a collection (1 for true, 0 for false).
 * @property {number} [price_per_collection] - The price per collection, if applicable.
 * @property {number} [quantity_per_collection] - The quantity per collection, if applicable.
 * @property {number} cost_per_unit - The cost per unit of the model.
 * @property {number} [cost_per_collection] - The cost per collection, if applicable.
 */

/**
 * @typedef {Object} Product
 * @property {number} id - The unique identifier for the product.
 * @property {string} created_at - The timestamp when the product was created.
 * @property {string} updated_at - The timestamp when the product was last updated.
 * @property {string} product_name - The name of the product.
 * @property {number} basic_selling_quantity_id - The ID representing the basic selling quantity.
 * @property {boolean} has_models - Indicates if the product has associated models (1 for true, 0 for false).
 * @property {number} category_id - The ID representing the category of the product.
 */

/**
 * @typedef {Object} ProductModelData
 * @property {Model} model - The model data.
 * @property {string} collection_method - The method of collection (e.g., 'Bag').
 * @property {Product} product - The product data.
 * @property {string} basic_quantity - The basic selling quantity (e.g., 'pc').
 * @property {boolean} has_suppliers - Indicates if the product has associated suppliers (1 for true, 0 for false).
 * @property {number} stock_quantity - The current stock quantity.
 * @property {boolean} availability - Indicates if the product is currently available.
 */


function Productsdashboard() {
    const [showStockingModal, setShowStockingModal] = useState({
        option: null
    })

    const [editProductData, setEditProductData] = useState([])

    const [stockHistorys, setStockHistory] = useState([])
    /**
     * @type {[ProductModelData,React.Dispatch<React.SetStateAction<ProductModelData>>]}
     */
    const [stockData, setStockData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchParams, setsearchParams] = useSearchParams()
    const [collectionFromDB, setCollectionFromDB] = useState([]);

    const getStockData = () => {
        if (searchParams.get('model')) {
            setIsLoading(true)
            Api.get(`/product/models/${searchParams.get('model')}/stock/data`)
                .then(res => {
                    setStockData(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const getStockHIstory = (url) => {
        setIsLoading(true)
        if (searchParams.get('model')) {
            Api.get(url ?? `/product/models/${searchParams.get('model')}/stock/history`)
                .then(res => {
                    setStockHistory(res.data)
                    setIsLoading(false)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const fetchAllData = () => {
        getStockData()
        getStockHIstory()
    }

    const getCollectionTypes = () => {
        Api.get('/toselect/collectiontypes').then(res => {
            setCollectionFromDB(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleOnEditProductData = () => {
        if (stockData == null) return;
        if (collectionFromDB)
            setEditProductData([
                {
                    id: stockData?.model?.id,
                    collection_method: stockData.collection_method,
                    in_collection: Boolean(stockData?.model?.in_collection),
                    model_name: stockData?.model?.model_name,
                    price_per_collection: stockData?.model?.price_per_collection,
                    quantity_per_collection: stockData?.model?.quantity_per_collection,
                    cost_per_unit: stockData?.model?.cost_per_unit,
                    cost_per_collection: stockData.model?.cost_per_collection,
                    unit_price: stockData?.model.unit_price,
                }
            ]);
    }

    const handleOnUpdateModelData = (i, modelData) => {
        let data = modelData;

        if (data?.id == null) return;
        enqueueSnackbar("Updating Product Data Please Wait", { variant: "default" })

        Api.post('/product-model/update/' + data?.id, data)
            .then(res => {
                enqueueSnackbar("Product Data Updated Succesfully", { variant: "success" })
                setEditProductData([])
            })
            .catch(err => {
                enqueueSnackbar("Failed to update product data", { variant: "error" })
            }
            )
            .finally(() => {
                if (searchParams.get('model')) {
                    fetchAllData()
                }
            })
    };

    const handleModelEdit = (i, value) => {
        let data = editProductData;
        data[i] = value;
        setEditProductData(data);
    };

    useEffect(() => {
        if (searchParams.get('model')) {
            fetchAllData()
        }
    }, [searchParams.get('model')])


    useEffect(() => {
        console.log(editProductData)
    }, [editProductData])

    useEffect(() => {
        getCollectionTypes()
    }, [])


    return (
        <div className='flex flex-col md:flex-row min-h-full  gap-4 p-1 md:p-6 max-w-[85rem] mx-auto'>
            <AnimatePresence>
                {Boolean(editProductData?.length) && <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className=' fixed inset-0 z-30 flex h-full items-end bg-black/30'>
                    <motion.div
                        variants={SlideUpAndDownAnimation}
                        initial='initial'
                        animate='animate'
                        exit='exit'
                        className=' max-w-2xl bg-white w-full mx-auto min-h-[18rem] rounded-t-md flex flex-col'>
                        <Newproductmodel
                            models={editProductData}
                            editIndex={0}
                            selectItems={{
                                collectionTypesFromDb: collectionFromDB
                            }}
                            basic_selling_quantity={stockData?.basic_quantity}
                            handelNewProductModel={() => void (0)}
                            handleModelEdit={handleOnUpdateModelData}
                            setShowNewModelForm={() => setEditProductData([])}
                        />
                    </motion.div>
                </motion.div>}
            </AnimatePresence>

            {isLoading && <Loadingwheel />}
            <SideModal onClose={() => setShowStockingModal({ option: null })}
                showClose title="Add to Stock " maxWidth='xl'
                open={Boolean(searchParams.get('model') && showStockingModal.option == 'add')}>
                <Addtostockform
                    fetchAllData={fetchAllData}
                    setShowStockingModal={setShowStockingModal}
                    stockData={stockData}
                />
            </SideModal>

            <SideModal onClose={() => setShowStockingModal({ option: null })}
                showClose title="Adjust Stock" maxWidth='xl'
                open={Boolean(searchParams.get('model') && showStockingModal.option == 'remove')} >
                <Removefromstockform
                    fetchAllData={fetchAllData}
                    stockData={stockData}
                    setShowStockingModal={setShowStockingModal}
                />
            </SideModal>

            <Wrapable hasSubTree={true} title="Models">
                <div className=' min-w-[17rem] h0 text-sm'>
                    <Productmodellist
                    />
                </div>
            </Wrapable>
            {searchParams.get('model') ? <div className=' container mx-auto'>
                <div className=' min-h-[15rem] grid grid-cols-1 lg:grid-cols-3 gap-5 text-sm'>
                    <Productdetailcard
                        stockData={stockData}
                    />
                    <Productpricingcard
                        stockData={stockData}
                    />
                    <AccessByPermission abilities={['manage stock data']}>
                        <Productactioncard
                            setShowStockingModal={setShowStockingModal}
                            stockData={stockData}
                            onEditProductData={handleOnEditProductData}
                        />
                    </AccessByPermission>
                </div>
                <div className=' mt-12 text-sm w-full'>
                    <Productstockhistory
                        currentModelID={searchParams.get('model')}
                        getStockHIstory={getStockHIstory}
                        stockData={stockData}
                        stockHistorys={stockHistorys} />
                </div>
            </div> :
                <div className='container mx-auto flex items-center justify-center'>
                    <div className="flex flex-col gap-3 items-center">
                        <Emptydata caption='No product model selected' />
                        <nav className=' bg-white/40 p-3 rounded-md shadow-md'>
                            Choose a product model to view its record
                        </nav>
                    </div>
                </div>
            }
        </div>
    )
}

export default Productsdashboard