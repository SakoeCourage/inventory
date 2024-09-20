import { Card } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ProductsTable from '../productsTable'
import { Icon } from '@iconify/react'
import Button from "../../../components/inputs/Button"
import SideModal from '../../../components/layout/sideModal'
import ProductForm from '.././productForm'
import Api from '../../../api/Api'
import axios, { Axios } from 'axios'
import FormInputSelect from '../../../components/inputs/FormInputSelect'
import { addOrUpdateUrlParam, SlideDownAndUpAnimation } from '../../../api/Util'
import IconifyIcon from '../../../components/ui/IconifyIcon'
import { AnimatePresence, motion } from 'framer-motion'
import Modal from '../../../components/layout/modal'
import ExcelUploadForm from './ExcelUploadForm'
import { SnackbarProvider, useSnackbar } from 'notistack'
import saveAs from 'file-saver'
import { useNavigate, useNavigation } from 'react-router-dom'
/**
 * @typedef TemplateDownloadItem
 * @property {string | JSX.Element} icon - Describes the icon for current item
 * @property {string} title
 * @property {string | JSX.Element} description 
 * @property {string} actionName
 * @property {()=>void} onClick
 */


/**
 * @param {TemplateDownloadItem} props
 * @returns 
 */
const TemplateDownloadCard = (props) => {
    const { icon, title, description, onClick, actionName } = props
    return <div className='settings-card hover:scale-[1.03] transition-all duration-500 rounded-md flex bg-white'>
        <nav className=' p-5 gap-4 flex h-full w-full flex-col justify-between'>
            <nav className="flex flex-row gap-5">
                <nav className='flex order-2  items-start justify-between'>
                    <IconifyIcon
                        className="!h-10 !w-10"
                        icon={`${icon ?? 'vscode-icons:file-type-excel2'}`}
                    />
                </nav>
                <nav className='flex flex-col gap-2 !grow'>
                    <h1 className=' font-semibold text-base text-gray-700'>
                        {title}
                    </h1>
                    <p className='text-xs text-[0.8rem]'>
                        {description}
                    </p>
                </nav>
            </nav>
            <button onClick={onClick} className='pt-3 mt-3 cursor-pointer font-semibold text-base text-gray-500 hover:!font-bold hover:!text-info-600  !justify-self-end border-t flex items-center gap-3 border-gray-300'>
                <IconifyIcon className="!p-0 !h-6 !w-6" icon="entypo:export" />
                <h6 className='my-auto text-inherit '>
                    {actionName}
                </h6>
            </button>
        </nav>
    </div>
}


/**
 * @param {{ Tempates:TemplateDownloadItem[]}} props
 * @returns 
 */
const TemplateDownloadOptions = (props) => {
    const { Tempates } = props
    if ((Boolean(Tempates?.length) == false)) return <></>
    return <>{Tempates.map((temp, i) => <TemplateDownloadCard key={i}  {...temp} />)}
    </>
}

const ProductDefinitionPage = () => {
    const [searchKey, setSearchKey] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filters, setFilters] = useState([])
    const [fullUrl, setFullUrl] = useState(null)
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const [showUploadOptions, setShowUploadOptions] = useState(false)
    const [selectedProduct, setSelectedProducts] = useState([])
    const [productUploadTemplate, setProductUploadTemplate] = useState(null)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const navigate = useNavigate();


    const handleDonwloadNewProductsTemplate = () => {
        setShowDownloadOptions(false);
        enqueueSnackbar("Downloading Template Please Wait...", { variant: "default" })
        Api.get("/product/product-template", {
            responseType: "blob"
        })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'IL_Product_Template.xlsx');
            })
            .catch(err => {
                console.log(err)
                enqueueSnackbar("Failed to donwload Template", { variant: "error" })
            });
    }


    const handleDonwloadSelectedNewProductsTemplate = () => {
        setShowDownloadOptions(false);
        if (Boolean(selectedProduct.length) == 0) {
            enqueueSnackbar("No product selection made", { variant: "warning" })
            return;
        }

        enqueueSnackbar("Downloading Template Please Wait...", { variant: "default" })
        Api.post("/product/all-quantity-to-stock-template", {
            product_ids: selectedProduct
        }, {
            responseType: "blob"
        })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'IL_Product_Template.xlsx');
            })
            .catch(err => {
                console.log(err?.response)
                enqueueSnackbar("Failed to donwload Template", { variant: "error" })
            });
    }

    const handleDonwloadQuantityToStockProductsTemplate = () => {
        setShowDownloadOptions(false);
        enqueueSnackbar("Downloading Template Please Wait...", { variant: "default" })
        Api.get("/product/all-quantity-to-stock-template", {
            responseType: "blob"
        }).then(res => {
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'IL_Products_QTS.xlsx');
        }).catch(err => {
            console.log(err)
            enqueueSnackbar("Failed to donwload Template", { variant: "error" })
        });
    }

    /**
    * @type {TemplateDownloadItem[]}
    */

    const ProductTemplateDownloadOptions = [
        {
            icon: null,
            title: "Selected Products",
            description: "Export Selected Products to Excel",
            onClick: () => handleDonwloadSelectedNewProductsTemplate(),
            actionName: "Export"
        },
        {
            icon: null,
            title: "New Products Template",
            description: "Download template to add upload new products",
            onClick: handleDonwloadNewProductsTemplate,
            actionName: "Download"
        },
        {
            icon: null,
            title: "All Products/Quantity Template",
            description: "Export All Products to Excel / Quantity to stock template",
            onClick: handleDonwloadQuantityToStockProductsTemplate,
            actionName: "Export"
        }
    ]


    const [selectItems, setSelectItems] = useState({
        basicQuantityFromDB: null,
        collectionTypesFromDb: null,
        categoriesFromDb: null
    })

    const [edit, setEdit] = useState({
        open: false,
        data: null
    })


    const updateProduct = (val) => {
        setEdit({
            open: true,
            data: val
        })
        setOpenModal(true)
    }



    const fetchAllProducts = (url) => {
        setIsLoading(true)
        Api.get(url ?? '/product/all').then(res => {
            const { products, filters, full_url } = res.data
            setData(products)
            setFilters(filters)
            setFullUrl(full_url)
            setIsLoading(false)
        })
            .catch(err => {
                console.log(err.response)
            })
    }

    const handleProductSearch = () => {
        if (searchKey && fullUrl) {
            fetchAllProducts(addOrUpdateUrlParam(fullUrl, 'search', searchKey))
        }
    }

    const getBasicQuantities = () => {
        return Api.get('/toselect/basicquantities')
    }
    const getCollectionTypes = () => {
        return Api.get('/toselect/collectiontypes')
    }
    const getCategories = () => {
        return Api.get('/toselect/categories')
    }

    const fetchDataToSelect = () => {
        setIsLoading(true)
        axios.all([getBasicQuantities(), getCollectionTypes(), getCategories()])
            .then(axios.spread(function (res_basic_quantities, res_collection_types, res_categories) {
                setSelectItems({
                    basicQuantityFromDB: res_basic_quantities.data,
                    collectionTypesFromDb: res_collection_types.data,
                    categoriesFromDb: res_categories.data,
                })

            }
            )).catch(err => console.log(err))
    }

    const handleOnProductFileUpload = async () => {
        if (productUploadTemplate == null) {
            enqueueSnackbar("Failed To Upload", { variant: "error" })
            return;
        }
        const formData = new FormData()
        formData.append("template_file", productUploadTemplate)

        try {
            setShowUploadOptions(false)
            enqueueSnackbar("Uploading Products Please Wait...", { variant: "default" })
            var response = await Api.post('/product/import-from-excel', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            enqueueSnackbar("Product Upload Success", { variant: "success" });
            fetchAllProducts();
            fetchDataToSelect()
        } catch (error) {
            if (error?.response?.status == 422) {
                enqueueSnackbar(error.response.data, { variant: "error" });
            }
            setShowUploadOptions(true)
        } finally {

        }
    }

    useEffect(() => {
        fetchAllProducts()
        fetchDataToSelect()
    }, [])

    return (
        <div className='text-sm h-max max-w-6xl mx-auto'>
            <Modal onClose={() => setShowUploadOptions(false)} open={showUploadOptions} label="Upload Products">
                <ExcelUploadForm handleUpload={handleOnProductFileUpload} getFile={setProductUploadTemplate} />
            </Modal>
            <Card className='py-6'>
                <div className='flex flex-col md:flex-row gap-3  justify-between items-center px-6 pb-6'>
                    <div className="flex grow items-center flex-col md:flex-row gap-3 w-full ">
                        <div className='border rounded-lg flex items-center justify-between !w-full md:!w-96'>
                            <input onKeyDown={(e) => { e.key === 'Enter' && handleProductSearch() }} className='bg-transparent outline-none px-4 w-full' placeholder='Search product...' value={searchKey} onChange={(e) => setSearchKey(e.target.value)} type="search" />
                            <button onClick={() => handleProductSearch()} className='bg-gray-300 px-3 py-2 grid place-content-center text-gray-600'>
                                <Icon icon="ic:round-search" fontSize={30} />
                            </button>
                        </div>
                        <FormInputSelect className="w-full md:w-56 " type="text" value={filters?.category} label="Filter by Category" options={selectItems?.categoriesFromDb ? [...selectItems.categoriesFromDb.map(entry => { return ({ name: entry.category, value: entry.id }) })] : []} name="Basic selling unit"
                            // value={formValues.category}
                            onChange={(e) => { fullUrl && fetchAllProducts(addOrUpdateUrlParam(fullUrl, 'category', e.target.value)) }}
                        />
                        {(filters?.search || filters?.category) != null && <Button
                            onClick={() => { setSearchKey(''); fetchAllProducts() }}
                            text="reset"
                        />}
                    </div>
                    <div onClick={() => setShowUploadOptions(true)} className={`w-full rounded-md border border-gray-600 py-3 px-3 my-auto md:w-auto cursor-pointer`} >
                        <div className='flex items-center gap-2 text-xs'>
                            <Icon icon="ri:upload-cloud-line" className='text-green-900' fontSize={22} />
                            <span className='text-sm select-none'>Upload</span>
                        </div>
                    </div>
                    <div className={`w-full rounded-md border  border-gray-600 py-3 px-3 my-auto md:w-auto cursor-pointer ${showDownloadOptions && 'bg-info-200 text-info-800'}`} onClick={() => { setShowDownloadOptions(cv => cv = !cv) }}>
                        <div className='flex items-center gap-2 text-xs'>
                            <Icon icon="vscode-icons:file-type-excel2" fontSize={22} />
                            <span className='text-sm select-none'>Download</span>
                            {Boolean(selectedProduct?.length) && <span className='tabular-nums bg-info-800 px-2 py-1 rounded-full text-info-100'>
                                {selectedProduct.length}
                            </span>}
                        </div>
                    </div>
                    <Button className="w-full my-auto md:w-auto" info onClick={() => navigate('new')}>
                        <div className='flex items-center gap-2 text-xs'>
                            <Icon icon="streamline:money-cashier-tag-codes-tags-tag-product-label" fontSize={22} />
                            <span className=''>Add A product</span>
                        </div>
                    </Button>
                </div>

                <div className='relative isolate overflow-hidden'>
                    <>
                        {showDownloadOptions && <div onClick={() => setShowDownloadOptions(false)} className=' bg-gray-100/40 z-40 absolute inset-0 p-2'>
                        </div>}
                        <AnimatePresence>
                            {showDownloadOptions && <motion.div
                                variants={SlideDownAndUpAnimation}
                                initial='initial'
                                animate='animate'
                                exit='exit'
                                className='grid grid-cols-1 h-max absolute inset-0 p-2 z-50 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
                                <TemplateDownloadOptions Tempates={ProductTemplateDownloadOptions} />
                            </motion.div>}
                        </AnimatePresence>
                    </>
                    <ProductsTable
                        data={data}
                        products={data.data}
                        isLoading={isLoading}
                        setFilters={setFilters}
                        setIsLoading={setIsLoading}
                        updateProduct={updateProduct}
                        setData={setData}
                        selectedProducts={selectedProduct}
                        setSelectedProducts={setSelectedProducts}
                    />
                </div>
            </Card>
            <SideModal
                open={openModal}
                showDivider
                maxWidth="3xl"
                title={`${edit.open ? "Edit Product" : "New Product"}`}
                showClose
                onClose={() => {
                    setOpenModal(false)
                    setEdit({})
                }}
            >
                <ProductForm
                    setOpenModal={setOpenModal}
                    handleOnSucess={() => { setOpenModal(false); setEdit(cv => cv = { ...cv, data: null }); fetchAllProducts() }}
                    selectItems={selectItems} edit={edit}
                    fetchAllProducts={fetchAllProducts}
                    setEdit={setEdit}
                    data={data}
                />
            </SideModal>
        </div>
    )
}

export default ProductDefinitionPage
