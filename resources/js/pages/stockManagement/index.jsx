import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Productsdashboard from './Productdashboard'
import Newstock from './Newstock'
import Unattendedproducts from './Unattendedproducts'

const Index = () => {
  return (
    <Routes>
        <Route path="product/:productId/:productName/manage" exact={true} element={<Productsdashboard />} />
        <Route path="newstock" exact={true} element={<Newstock />} />
        <Route path="unattended" exact={true} element={<Unattendedproducts />} />
    </Routes>
  )
}

export default Index
