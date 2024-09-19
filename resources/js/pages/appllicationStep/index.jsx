import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProductDefinition from './productDefinition'
import Productcategories from './Productcategories'
import Productsuppliers from './Productsuppliers'
import ExpenseDefinition from './expenseDefinition'
import Businessprofile from './businessprofile'
import StoreDefininition from './storeDefininition'
import BranchDefinition from './branchDefinition'
import PackagingUnit from './packagingUnit'
import BasicUnit from './basicUnit'
import UpdateOrNewProductPage from './productformpartials/UpdateOrNewProductPage'

const Index = () => {
  return (
    <Routes>
      <Route path='products/definition' element={<ProductDefinition />} />
      <Route path='products/definition/new' element={<UpdateOrNewProductPage />} />
      <Route path='products/definition/update/:id' element={<UpdateOrNewProductPage />} />
      {/* <Routes>
        <Route path='new' exact  element={<div className=' bg-red-600'>new Product hosdfi osid foisdfoisd </div>} />
      </Routes > */}
      <Route path='products/suppliers' exact element={<Productsuppliers />} />
      <Route path='products/categories' exact element={<Productcategories />} />
      <Route path='expense/definition' exact element={<ExpenseDefinition />} />
      <Route path='businessprofile/definition' exact element={<Businessprofile />} />
      <Route path='store/definition' exact element={<StoreDefininition />} />
      <Route path='branch/definition' exact element={<BranchDefinition />} />
      <Route path='selling-unit/packaging' exact element={<PackagingUnit />} />
      <Route path='selling-unit/basic' exact element={<BasicUnit />} />
    </Routes>
  )
}

export default Index
