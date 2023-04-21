import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProductDefinition from './productDefinition'

const Index = () => {
  return (
    <Routes>
      <Route path='productdefinition' exact element={<ProductDefinition />} />
    </Routes>
  )
}

export default Index
