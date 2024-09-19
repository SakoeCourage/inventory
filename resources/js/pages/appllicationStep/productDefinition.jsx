import React, { useEffect, useState } from 'react'
import ProductDefinitionPage from './productformpartials/ProductDefinitionPage'
import StoreProductsPage from './productformpartials/StoreProductsPage'
import { Pilltab } from '../saleManagement/productOrder'
import { Icon } from '@iconify/react'
import { Routes, Route,useSearchParams } from 'react-router-dom'

const components = {
  ProductsDefinition: ProductDefinitionPage,
  StoreProducts: StoreProductsPage
}


const productDefinition = () => {
  const [searchParams, setsearchParams] = useSearchParams()
  /**
 * @type {[keyof typeof components, React.Dispatch<React.SetStateAction<keyof typeof components>>]}
 */
  const [currentComponent, setCurrentComponent] = useState(searchParams?.get('view') ?? "ProductsDefinition")

  const Component = components[currentComponent]

  useEffect(() => {
    setCurrentComponent(searchParams?.get('view') ?? "ProductsDefinition")
  }, [searchParams?.get('view')])


  return (
    <>
   

      <nav className=" w-full  z-30   bg-info-900/50 p-2 pt-3">
        <header className="flex items-center gap-4 max-w-6xl mx-auto ">
          <Pilltab active={currentComponent == "ProductsDefinition"} onClick={() => setsearchParams({ view: "ProductsDefinition" })} Pillicon={<Icon fontSize={20} icon="mdi:tags" />} title='All Products' />
          <Pilltab active={currentComponent == 'StoreProducts'} onClick={() => setsearchParams({ view: 'StoreProducts' })} Pillicon={<Icon fontSize={20} icon="mdi:tag" />} title='Store Product' />
        </header>
      </nav>
      <main className=" mt-6">
        <Component
        />
      </main>
    </>
  )
}

export default productDefinition