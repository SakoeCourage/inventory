import { Card } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ProductsTable from './productsTable'
import { Icon } from '@iconify/react'
import Button from "../../components/inputs/Button"
import SideModal from '../../components/layout/sideModal'
import ProductForm from './productForm'
import Api from '../../api/Api'
import axios, { Axios } from 'axios'


const ProductDefinition = () => {
  const [searchKey, setSearchKey] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState([])
  const [selectItems, setSelectItems] = useState({
    basicQuantityFromDB: null,
    collectionTypesFromDb: null,
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

  const handleProductSearch = () => {
    if (searchKey) {
      setIsLoading(true)
      Api.get(`/product/all?search=${searchKey}`).then(res => {
        const { products, filters } = res.data
        setData(products)
        setFilters(filters)
        setIsLoading(false)
      }).catch(err => {
        console.log(err)
      })
    }
  }

  const fetchAllProducts = (url) => {
    setIsLoading(true)
    Api.get(url ?? '/product/all').then(res => {
      const { products, filters } = res.data
      setData(products)
      setFilters(filters)
      setIsLoading(false)
    })
      .catch(err => {
        console.log(err.response)
      })
  }

  const getBasicQuantities = () => {
    return Api.get('/toselect/basicquantities')
  }
  const getCollectionTypes = () => {
    return Api.get('/toselect/collectiontypes')
  }

  const fetchDataToSelect = () => {
    setIsLoading(true)
    axios.all([getBasicQuantities(), getCollectionTypes()])
      .then(axios.spread(function (res_basic_quantities, res_collection_types) {
        setSelectItems({
          basicQuantityFromDB: res_basic_quantities.data,
          collectionTypesFromDb: res_collection_types.data,
        })

      }
      )).catch(err => console.log(err))
  }

  useEffect(() => {
    fetchAllProducts()
    fetchDataToSelect()
  }, [])

  return (
    <div className='container mx-auto text-sm'>
      <h3 className='pb-3'>Product definition</h3>
      <Card className='py-6'>
        <div>
          <div className='flex justify-between items-center px-6 pb-6'>
            <div className="flex items-center gap-3">
              <div className='border rounded-lg flex items-center justify-between w-96'>
                <input onKeyDown={(e) => { e.key === 'Enter' && handleProductSearch() }} className='bg-transparent outline-none px-4 w-full' placeholder='Search product...' value={searchKey} onChange={(e) => setSearchKey(e.target.value)} type="search" />
                <button onClick={() => handleProductSearch()} className='bg-gray-300 px-3 py-2 grid place-content-center text-gray-600'>
                  <Icon icon="ic:round-search" fontSize={30} />
                </button>
              </div>
              {filters?.search != null && <Button
                onClick={() => { setSearchKey(''); fetchAllProducts() }}
                text="reset"
              />}
            </div>
            <Button primary onClick={() => { setEdit(val => val = { ...val, data: null }); setOpenModal(true) }}>
              <div className='flex items-center gap-2'>
                <Icon icon="streamline:money-cashier-tag-codes-tags-tag-product-label" fontSize={22} />
                <span>New product</span>
              </div>
            </Button>
          </div>
        </div>
        <ProductsTable data={data} products={data.data}
          isLoading={isLoading}
          setFilters={setFilters}
          setIsLoading={setIsLoading}
          updateProduct={updateProduct}
          setData={setData}
        />
      </Card>
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
