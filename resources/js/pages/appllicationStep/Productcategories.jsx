import React, { useEffect, useState } from 'react'
import Supplierstable from './supplierspartials/Supplierstable'
import { Card } from '@mui/material'
import { Icon } from '@iconify/react'
import SideModal from '../../components/layout/sideModal'
import Button from '../../components/inputs/Button'
import Api from '../../api/Api'
import Newcategoryform from './cateogoriespartials/Newcategoryform'
import Categoriestable from './cateogoriespartials/Categoriestable'

function Productcategories() {
  const [searchKey, setSearchKey] = useState(null)
  const [data, setData] = useState([])
  const [filters, setFilters] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState({
    category:null,
    id: null,
    mode: null
  })
  const fetchCategoriesData = (url) => {
    setIsLoading(true)
    Api.get(url ?? '/category/all').then(res => {
      const { category, filters } = res.data
      setData(category)
      setFilters(filters)
      setIsLoading(false)
    })
      .catch(err => {
        console.log(err)
      })
  }

  const handleCategorySearch = () => {
    if (searchKey) {
      fetchCategoriesData('/category/all?search=' + searchKey)
    }
  }

  const handleClose = () => {
    setShowCategoryForm({
      category:null,
      id: null,
      mode: null
    })
  }

  return (
    <div className='text-sm h-max '>
      <div className='bg-info-600 h-[35vh] px-10 overflow-visible '>
        <div className='max-w-6xl mx-auto h-full '>
          <h3 className='pb-3 text-info-100 ml-4 text-lg '><span className="mr-4">Product Categories</span>
            <Icon icon="bi:plus-circle" />
          </h3>
          <Card className='py-6 pb-36'>
            <div className='flex justify-between items-center px-6 pb-6'>
              <div className="flex items-center gap-3">
                <div className='border rounded-lg flex items-center justify-between w-96'>
                  <input onKeyDown={(e) => { e.key === 'Enter' && handleCategorySearch() }} className='bg-transparent outline-none px-4 w-full' placeholder='Search category...' value={searchKey} onChange={(e) => setSearchKey(e.target.value)} type="search" />
                  <button onClick={() => handleCategorySearch()} className='bg-gray-300 px-3 py-2 grid place-content-center text-gray-600'>
                    <Icon icon="ic:round-search" fontSize={30} />
                  </button>
                </div>
                {filters?.search != null && <Button
                  onClick={() => { setSearchKey(''); fetchCategoriesData() }}
                  text="reset"
                />}
              </div>
              <Button onClick={() => setShowCategoryForm(cv => cv = { ...cv, mode: "New Category" })} info >
                <div className='flex items-center gap-2 text-xs'>
                  <Icon icon="carbon:tag-group" fontSize={22} />
                  <span>Add A Category</span>
                </div>
              </Button>

            </div>
            <Categoriestable
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setFilters={setFilters}
              filters={filters}
              fetchCategoriesData={fetchCategoriesData}
              setData={setData}
              data={data}
              setShowCategoryForm={setShowCategoryForm}
            />
          </Card>
        </div>
      </div>
      <SideModal
        open={showCategoryForm.mode}
        title={showCategoryForm.mode}
        onClose={() => handleClose()}
        showDivider
        maxWidth="xl"
        showClose
      >
        <Newcategoryform fetchCategoriesData={fetchCategoriesData} showCategoryForm={showCategoryForm}  onClose={() => handleClose()} />
      </SideModal>
    </div>
  )
}

export default Productcategories