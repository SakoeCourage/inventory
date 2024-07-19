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

const Index = () => {
  return (
    <Routes>
      <Route path='products/definition' exact element={<ProductDefinition />} />
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
