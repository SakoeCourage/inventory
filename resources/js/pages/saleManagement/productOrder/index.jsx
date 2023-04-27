
import Newsale from "./partials/Newsale"
import Salehistory from "./partials/Salehistory"
import React, { useState } from "react"
import { Icon } from "@iconify/react"
import { useEffect } from "react"
import Api from "../../../api/Api"

const components = {
  newsale: Newsale,
  salehistory: Salehistory
}
function Pilltab({ title, Pillicon, onClick ,active}) {
  return <button onClick={() => onClick()} className={`p-2 border-white text-white  flex items-center gap-2 min-w-[12rem] text-center px-3 hover:transform hover:translate-x-1 hover:-translate-y-1 add-border-below relative  transition-all ${active && 'text-white border rounded-lg current'}`}>
    {Pillicon} {title}
  </button>
}

const Index = () => {
  const [currentComponent, setCurrentComponent] = useState('newsale')
  const [productsFromDB, setProductsFromDB] = useState([])
  const [modelsFromDB, setModelsFromDB] = useState([])
  const [sales,setSales] = useState([])
  const [filters,setFilters] = useState([])


  const getAllProductsAndModels = () => {
    Api.get('/product/all/products/models')
      .then(res => {
        const { products, models } = res.data
        setProductsFromDB(products)
        setModelsFromDB(models)
      })
      .catch(err => {
        console.log(err)
      })
  }


  useEffect(() => {
    getAllProductsAndModels()
  }, [])


  const Component = components[currentComponent]
  return (<div className=" ">
    <nav className=" w-full  z-30   bg-info-600 p-2 pt-3">
      <header className="flex items-center gap-4 max-w-6xl mx-auto ">
        <Pilltab active={currentComponent == 'newsale'} onClick={() => setCurrentComponent('newsale')} Pillicon={<Icon icon="bi:plus-circle" />} title='New Sale' />
        <Pilltab active={currentComponent == 'salehistory'} onClick={() => setCurrentComponent('salehistory')} Pillicon={<Icon icon="material-symbols:history" />} title='Sale History' />
      </header>
    </nav>

    <main className=" mt-6">
      <Component
        productsFromDB={productsFromDB}
        modelsFromDB={modelsFromDB}
        getAllProductsAndModels={getAllProductsAndModels}
        setModelsFromDB={setModelsFromDB}
        setProductsFromDB={setProductsFromDB}
        setSales={setSales}
        sales={sales}
        setFilters={setFilters}
        filters={filters}
      />
    </main>

  </div>)
}

export default Index
