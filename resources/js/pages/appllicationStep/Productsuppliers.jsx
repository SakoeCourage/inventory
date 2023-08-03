import React, { useEffect, useState } from 'react'
import Supplierstable from './supplierspartials/Supplierstable'
import { Card } from '@mui/material'
import { Icon } from '@iconify/react'
import SideModal from '../../components/layout/sideModal'
import Button from '../../components/inputs/Button'
import Api from '../../api/Api'
import Newsupplierform from './supplierspartials/Newsupplierform'

function Productsuppliers() {
  const [searchKey, setSearchKey] = useState(null)
  const [data, setData] = useState([])
  const [filters, setFilters] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSupplierForm, setShowSupplierForm] = useState({
    supplier_name: null,
    supplier_contact: null,
    id: null,
    mode: null
  })
  const fetchSupplierData = (url) => {
    setIsLoading(true)
    Api.get(url ?? '/supplier/to-table').then(res => {
      const { suppliers, filters } = res.data
      setData(suppliers)
      setFilters(filters)
      setIsLoading(false)
    })
      .catch(err => {
        console.log(err)
      })
  }

  const handleSupplierSearch = () => {
    if (searchKey) {
      fetchSupplierData('/supplier/to-table?search=' + searchKey)
    }
  }

  const handleClose = () => {
    setShowSupplierForm({
      supplier_name: null,
      supplier_contact: null,
      id: null,
      mode: null
    })
  }

  return (
    <div className='text-sm h-max '>
      <div className='bg-info-600 h-[35vh] md:px-10 overflow-visible '>
        <div className='max-w-6xl mx-auto h-full '>
          <h3 className='pb-3 text-info-100 ml-4 text-lg '><span className="mr-4">Product Suppliers</span>
            <Icon icon="bi:plus-circle" />
          </h3>
          <Card className='py-6 pb-36'>
          <div className='flex flex-col md:flex-row gap-3  justify-between items-center px-6 pb-6'>
              <div className="flex grow items-center flex-col md:flex-row gap-3 w-full ">
                <div className='border rounded-lg flex items-center justify-between !w-full md:!w-96'>
                  <input onKeyDown={(e) => { e.key === 'Enter' && handleSupplierSearch() }} className='bg-transparent outline-none px-4 w-full' placeholder='Search supplier...' value={searchKey} onChange={(e) => setSearchKey(e.target.value)} type="search" />
                  <button onClick={() => handleSupplierSearch()} className='bg-gray-300 px-3 py-2 grid place-content-center text-gray-600'>
                    <Icon icon="ic:round-search" fontSize={30} />
                  </button>
                </div>
                {filters?.search != null && <Button
                  onClick={() => { setSearchKey(''); fetchSupplierData() }}
                  text="reset"
                />}
              </div>
              <Button className="w-full  my-auto md:w-auto" onClick={() => setShowSupplierForm(cv => cv = { ...cv, mode: "New Supplier" })} info >
                <div className='flex items-center gap-2 text-xs'>
                  <Icon icon="ph:user-plus" fontSize={22} />
                  <span>Add A Supplier</span>
                </div>
              </Button>

            </div>
            <Supplierstable
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setFilters={setFilters}
              filters={filters}
              fetchSupplierData={fetchSupplierData}
              setData={setData}
              data={data}
              setShowSupplierForm={setShowSupplierForm}
            />
          </Card>
        </div>
      </div>
      <SideModal
        open={showSupplierForm.mode}
        title={showSupplierForm.mode}
        onClose={() => handleClose()}
        showDivider
        maxWidth="xl"
        showClose
      >
        <Newsupplierform fetchSupplierData={fetchSupplierData} showSupplierForm={showSupplierForm}  onClose={() => handleClose()} />
      </SideModal>
    </div>
  )
}

export default Productsuppliers