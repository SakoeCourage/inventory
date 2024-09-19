import { Card } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import Button from "../../../components/inputs/Button"
import SideModal from '../../../components/layout/sideModal'
import ProductForm from '.././productForm'
import Api from '../../../api/Api'
import axios, { Axios } from 'axios'
import FormInputSelect from '../../../components/inputs/FormInputSelect'
import { addOrUpdateUrlParam } from '../../../api/Util'
import Modal from '../../../components/layout/modal'
import ExcelUploadForm from './ExcelUploadForm'
import { SnackbarProvider, useSnackbar } from 'notistack'
import StoreProductsTable from './StoreProductsTable'
import IconifyIcon from '../../../components/ui/IconifyIcon'
import AddStoreProductsManually from './AddStoreProductsManually'


function StoreProductsPage() {
  const [searchKey, setSearchKey] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState([])
  const [fullUrl, setFullUrl] = useState(null)
  const [productUploadTemplate, setProductUploadTemplate] = useState(null)
  const [showUploadOptions, setShowUploadOptions] = useState(false)
  const [showAddStoreProdManuallyModal, setShowAddStoreProdManuallyModal] = useState(false);
  const [selectItems, setSelectItems] = useState({
    basicQuantityFromDB: null,
    collectionTypesFromDb: null,
    categoriesFromDb: null
  })
  const [edit, setEdit] = useState({
    open: false,
    data: null
  })

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const updateProduct = (val) => {
    setEdit({
      open: true,
      data: val
    })
    setOpenModal(true)
  }



  const fetchAllProducts = (url) => {
    setIsLoading(true)
    Api.get(url ?? '/store-products/all').then(res => {
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
      var response = await Api.post('/store-products/import', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      enqueueSnackbar("Product Upload Success", { variant: "success" });
      fetchAllProducts();
      fetchDataToSelect()
    } catch (error) {
      console.log(error)
      if (error?.response?.status == 422) {
        enqueueSnackbar(error.response.data ?? "Failed To Upload Store Product - Invalid Template", { variant: "error" });
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
      <Modal
        maxWidth="lg"
        fullWidth
        onClose={() => { fetchAllProducts(); setShowAddStoreProdManuallyModal(false) }} open={showAddStoreProdManuallyModal}
        label="Add Store Products">
        <AddStoreProductsManually />
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
              onChange={(e) => { fullUrl && fetchAllProducts(addOrUpdateUrlParam(fullUrl, 'category', e.target.value)) }
              }
            />
            {(filters?.search || filters?.category) != null && <Button
              onClick={() => { setSearchKey(''); fetchAllProducts() }}
              text="reset"
            />}
          </div>
          <Button className="w-full  my-auto md:w-auto" info onClick={() => setShowAddStoreProdManuallyModal(true)}>
            <div className='flex items-center gap-2 text-xs'>
              <IconifyIcon icon="icon-park:list-add" className='!text-white' fontSize={22} />
              <span className=''>Add Products Manually</span>
            </div>
          </Button>
          <Button className="w-full  my-auto md:w-auto" info onClick={() => setShowUploadOptions(true)}>
            <div className='flex items-center gap-2 text-xs'>
              <Icon icon="flowbite:upload-outline" fontSize={22} />
              <span className=''>Upload Store Product</span>
            </div>
          </Button>
        </div>
        <StoreProductsTable data={data} products={data.data}
          isLoading={isLoading}
          setFilters={setFilters}
          filters={filters}
          full_url={fullUrl}
          setFullUrl={setFullUrl}
          setIsLoading={setIsLoading}
          updateProduct={updateProduct}
          setData={setData}
        />
      </Card>
    </div>
  )
}

export default StoreProductsPage