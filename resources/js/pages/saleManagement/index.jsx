import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProductOrders from "./productOrder/index"

const Index = () => {
  return (
   <Routes>
    <Route path="newsale" element={<ProductOrders/>}/>
   </Routes>
  )
}

export default Index
