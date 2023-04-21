import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Productstock from './Productstock'
import Newstock from './Newstock'

const Index = () => {
  return (
    <Routes>
        <Route path="product/:productId/:productName/manage" exact={true} element={<Productstock />} />
        <Route path="newstock" exact={true} element={<Newstock />} />
    </Routes>
  )
}

export default Index
