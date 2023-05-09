import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProductOrders from "./productOrder/index"
import ProductRefund from './productRefund/index'

const Index = () => {
  return (
    <Routes>
      <Route path="newsale" element={<ProductOrders />} />
      <Route path="refund" element={<ProductRefund />} />
    </Routes>
  )
}

export default Index
