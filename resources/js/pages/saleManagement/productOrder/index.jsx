
import Newsale from "./partials/Newsale"
import Salehistory from "./partials/Salehistory"
import React, { useState, lazy, Suspense, createContext,useRef } from "react"
import { Icon } from "@iconify/react"
import { useEffect } from "react"
import Api from "../../../api/Api"
import Loadingwheel from "../../../components/Loaders/Loadingwheel"
import LeaseSaleHistory from "./partials/LeaseSaleHistory"
const Paymenthistory = lazy(() => import("./partials/Paymenthistory"))
const Proformalist = lazy(() => import("./partials/Proformalist"))
import Invoicepreview from "./partials/Invoicepreview"
import { useReactToPrint } from 'react-to-print'
import { dateReformat } from "../../../api/Util"
const components = {
  newsale: Newsale,
  salehistory: Salehistory,
  Paymenthistory: Paymenthistory,
  Proformalist: Proformalist,
  LeaseSaleHistory: LeaseSaleHistory
}
export function Pilltab({ title, Pillicon, onClick, active }) {
  return <button onClick={() => onClick()} className={`p-2 border-white text-white  flex items-center gap-2 w-max md:min-w-[12rem] text-center px-3 hover:transform hover:translate-x-1 hover:-translate-y-1 add-border-below relative  transition-all ${active && 'text-white border rounded-lg current'}`}>
    {Pillicon} <span className="hidden md:block text-sm">{title}</span>
  </button>
}
export const PrintPrevewContext = createContext({});

const Index = () => {
  /**
   * @type {[keyof typeof components, React.Dispatch<React.SetStateAction<keyof typeof components>>]}
   */
  const [currentComponent, setCurrentComponent] = useState('newsale')
  const [productsFromDB, setProductsFromDB] = useState([])
  const [modelsFromDB, setModelsFromDB] = useState([])
  const [sales, setSales] = useState([])
  const [filters, setFilters] = useState([])
  const [invoices, setInvoices] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [leaseSalseHisotry, setLeaseSaleHistory] = useState([])
  const [invoiceData, setInvoiceData] = useState(null)
  const PrintinvoiceRef = useRef()


  const getPaymentMethods = () => {
    Api.get('/toselect/paymentmethods')
      .then(res => {
        setPaymentMethods(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getAllProductsAndModels = () => {
    Api.get('/product/all/products/models')
      .then(res => {
        const { products, models, store_products } = res.data
        console.log({ model: models })
        setProductsFromDB(products)
        setModelsFromDB(models)
      })
      .catch(err => {
        console.log(err)
      })
  }



  useEffect(() => {
    getAllProductsAndModels()
    getPaymentMethods()
  }, [])

  const handlePrint = useReactToPrint({
    content: () => PrintinvoiceRef.current,
    documentTitle: `${invoiceData?.type} ${invoiceData?.sale_invoice ?? ''} ${String(invoiceData?.customer_name ?? '').toUpperCase()} - ${dateReformat(invoiceData?.created_at)}`,
    onAfterPrint: () => setInvoiceData(null)
  })

  useEffect(() => {
    if (Boolean(invoiceData)) {
      // console.log(invoiceData)
      console.log(invoiceData?.type)
      handlePrint();
    }
  }, [invoiceData])

  const Component = components[currentComponent]

  return (<PrintPrevewContext.Provider value={{ invoiceData: invoiceData, setInvoiceData: setInvoiceData }} className=" ">
    {invoiceData && (
      <div style={{ display: 'none' }}>
        <Invoicepreview invoiceData={invoiceData} ref={PrintinvoiceRef} />
      </div>
    )}
    <nav className=" w-full  z-30   bg-info-900/50 p-2 pt-3">
      <header className="flex items-center gap-4 max-w-6xl mx-auto ">
        <Pilltab active={currentComponent == 'newsale'} onClick={() => setCurrentComponent('newsale')} Pillicon={<Icon fontSize={20} icon="bi:plus-circle" />} title='New Sale' />
        <Pilltab active={currentComponent == 'salehistory'} onClick={() => setCurrentComponent('salehistory')} Pillicon={<Icon fontSize={20} icon="material-symbols:history" />} title='Sale History' />
        <Pilltab active={currentComponent == "LeaseSaleHistory"} onClick={() => setCurrentComponent("LeaseSaleHistory")} Pillicon={<Icon fontSize={20} icon="material-symbols:history" />} title='Credit Sales' />
        <Pilltab active={currentComponent == 'Proformalist'} onClick={() => setCurrentComponent('Proformalist')} Pillicon={
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="currentColor" d="M208 80h264v32H208zM40 96a64 64 0 1 0 64-64a64.072 64.072 0 0 0-64 64Zm64-32a32 32 0 1 1-32 32a32.036 32.036 0 0 1 32-32Zm104 176h264v32H208zm-104 80a64 64 0 1 0-64-64a64.072 64.072 0 0 0 64 64Zm0-96a32 32 0 1 1-32 32a32.036 32.036 0 0 1 32-32Zm104 176h264v32H208zm-104 80a64 64 0 1 0-64-64a64.072 64.072 0 0 0 64 64Zm0-96a32 32 0 1 1-32 32a32.036 32.036 0 0 1 32-32Z" /></svg>
        } title='Proforma Invoices' />
        <Pilltab active={currentComponent == 'Paymenthistory'} onClick={() => setCurrentComponent('Paymenthistory')} Pillicon={<Icon fontSize={20} icon="dashicons:money-alt" />} title='Payment History' />
        <Pilltab active={currentComponent == 'salehistory'} onClick={() => setCurrentComponent("salehistory")} Pillicon={<Icon fontSize={20} icon="dashicons:money-alt" />} title='UnCollected Sales' />
      </header>
    </nav>

    <main className=" mt-6">
      <Suspense fallback={<Loadingwheel />}>
        <Component
          setCurrentComponent={setCurrentComponent}
          productsFromDB={productsFromDB}
          modelsFromDB={modelsFromDB}
          getAllProductsAndModels={getAllProductsAndModels}
          setModelsFromDB={setModelsFromDB}
          setProductsFromDB={setProductsFromDB}
          setSales={setSales}
          sales={sales}
          setInvoices={setInvoices}
          invoices={invoices}
          setFilters={setFilters}
          paymentMethods={paymentMethods}
          filters={filters}
        />
      </Suspense>
    </main>

  </PrintPrevewContext.Provider>)
}

export default Index
