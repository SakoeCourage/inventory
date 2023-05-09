import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Allusers from './Allusers'
import Rolesandpermission from './Rolesandpermission'

function Index() {
  return (
    <Routes>
      <Route path="all" exact element={<Allusers />} />
      <Route path="rolesandpermissions" exact element={<Rolesandpermission />} />
    </Routes>
  )
}

export default Index