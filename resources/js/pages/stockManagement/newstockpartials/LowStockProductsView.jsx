import React, { useContext, useEffect, useState } from 'react'
import { NewStockContext } from '../Newstock'
import LowStockProductsTable from './LowStockProductsTable';


function LowStockProductsView() {
  const { getLowStockProducts, lowSockProducts } = useContext(NewStockContext)

  return (
    <div>
      <LowStockProductsTable data={lowSockProducts} />
    </div>
  )
}

export default LowStockProductsView