import { Card } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ProductsTable from './productsTable'
import { Icon } from '@iconify/react'
import Button from "../../components/inputs/Button"
import SideModal from '../../components/layout/sideModal'
import ProductForm from './productForm'
import Api from '../../api/Api'
import axios, { Axios } from 'axios'
import FormInputSelect from '../../components/inputs/FormInputSelect'
import { addOrUpdateUrlParam } from '../../api/Util'

const ProductDefinition = () => {
  const [searchKey, setSearchKey] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState([])
  const [fullUrl, setFullUrl] = useState(null)
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
      const { products, filters,full_url } = res.data
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
        fetchAllProducts(addOrUpdateUrlParam(fullUrl,'search',searchKey))
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

  useEffect(() => {
    fetchAllProducts()
    fetchDataToSelect()
  }, [])

  return (
    <div className='text-sm h-max '>
      <div className='bg-info-600 h-[35vh] px-10 overflow-visible '>
        <div className='max-w-6xl mx-auto h-full '>
          <h3 className='pb-3 text-info-100 ml-4 text-lg '><span className="mr-4">Product definition</span>
            <Icon icon="bi:plus-circle" />
          </h3>
          <Card className='py-6 pb-36'>

            <div className='flex justify-between items-center px-6 pb-6'>
              <div className="flex items-center gap-3 w-full">
                <div className='border rounded-lg flex items-center justify-between !w-96'>
                  <input onKeyDown={(e) => { e.key === 'Enter' && handleProductSearch() }} className='bg-transparent outline-none px-4 w-full' placeholder='Search product...' value={searchKey} onChange={(e) => setSearchKey(e.target.value)} type="search" />
                  <button onClick={() => handleProductSearch()} className='bg-gray-300 px-3 py-2 grid place-content-center text-gray-600'>
                    <Icon icon="ic:round-search" fontSize={30} />
                  </button>
                </div>
                <FormInputSelect className="w-56 " type="text"  value={filters?.category} label="Filter by Category" options={selectItems?.categoriesFromDb ? [...selectItems.categoriesFromDb.map(entry => { return ({ name: entry.category, value: entry.id }) })]: []} name="Basic selling unit"
                  // value={formValues.category}
                  onChange={(e) =>{fullUrl && fetchAllProducts(addOrUpdateUrlParam(fullUrl,'category',e.target.value))}}
                />
                {(filters?.search || filters?.category) != null && <Button
                  onClick={() => { setSearchKey(''); fetchAllProducts() }}
                  text="reset"
                />}
              </div>
              <Button info onClick={() => { setEdit(val => val = { ...val, data: null }); setOpenModal(true) }}>
                <div className='flex items-center gap-2 text-xs'>
                  <Icon icon="streamline:money-cashier-tag-codes-tags-tag-product-label" fontSize={22} />
                  <span>Add A product</span>
                </div>
              </Button>

            </div>
            <ProductsTable data={data} products={data.data}
              isLoading={isLoading}
              setFilters={setFilters}
              setIsLoading={setIsLoading}
              updateProduct={updateProduct}
              setData={setData}
            />
          </Card>
        </div>
      </div>
      <SideModal
        open={openModal}
        showDivider
        maxWidth="2xl"
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

export default ProductDefinition
