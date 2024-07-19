import React, { useEffect, useState } from 'react'
import ProductDefinitionPage from './productformpartials/ProductDefinitionPage'
import StoreProductsPage from './productformpartials/StoreProductsPage'
import { Pilltab } from '../saleManagement/productOrder'
import { Icon } from '@iconify/react'

const components = {
  ProductsDefinition: ProductDefinitionPage,
  StoreProducts: StoreProductsPage
}


const productDefinition = () => {
  /**
 * @type {[keyof typeof components, React.Dispatch<React.SetStateAction<keyof typeof components>>]}
 */
  const [currentComponent, setCurrentComponent] = useState("ProductsDefinition")

  const Component = components[currentComponent]
  return (
    <>
      <nav className=" w-full  z-30   bg-info-900/50 p-2 pt-3">
        <header className="flex items-center gap-4 max-w-6xl mx-auto ">
          <Pilltab active={currentComponent == "ProductsDefinition"} onClick={() => setCurrentComponent("ProductsDefinition")} Pillicon={<Icon fontSize={20} icon="mdi:tags" />} title='All Products' />
          <Pilltab active={currentComponent == 'StoreProducts'} onClick={() => setCurrentComponent('StoreProducts')} Pillicon={<Icon fontSize={20} icon="mdi:tag" />} title='Store Product' />
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