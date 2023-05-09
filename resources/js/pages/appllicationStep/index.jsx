import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProductDefinition from './productDefinition'
import Productcategories from './Productcategories'
import Productsuppliers from './Productsuppliers'

const Index = () => {
  return (
    <Routes>
      <Route path='products/definition' exact element={<ProductDefinition />} />
      <Route path='products/suppliers' exact element={<Productsuppliers />} />
      <Route path='products/categories' exact element={<Productcategories />} />
    </Routes>
  )
}

export default Index
