import { Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import { Suspense, lazy } from 'react';
import { Toaster } from "react-hot-toast";
import { Icon } from "@iconify/react";
import Dashboard from "./pages/dashboard";
import AppLogin from "./pages/appLogin";
const ApplicationSetup = lazy(() => import('./pages/appllicationStep/index'))
const SaleManagement = lazy(() => import('./pages/saleManagement/index'))
const StockManagement = lazy(() => import('./pages/stockManagement/index'))



function App() {

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{ maxWidth: '100%' }}
        toastOptions={{
          // Define default options
          className: 'truncate pr-4 text-sm',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          // Default options for specific types
          success: {
            duration: 4000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 6000,
            theme: {
              primary: 'red',
              secondary: 'black',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" index element={<AppLogin/>}/>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applicationsetup/*" element={
            <Suspense fallback={<div className='grid justify-center items-center h-screen'>
              <Icon icon="svg-spinners:pulse-rings-3" className='text-blue-600' fontSize={60} />
            </div>}>
              <ApplicationSetup />
            </Suspense>
          } />
          <Route path="/salemanagement/*" element={
            <Suspense fallback={<div className='grid justify-center items-center h-screen'>
              <Icon icon="svg-spinners:pulse-rings-3" className='text-blue-600' fontSize={60} />
            </div>}>
              <SaleManagement />
            </Suspense>
          } />
          <Route path="/stockmanagement/*" element={
            <Suspense fallback={<div className='grid justify-center items-center h-screen'>
              <Icon icon="svg-spinners:pulse-rings-3" className='text-blue-600' fontSize={60} />
            </div>}>
              <StockManagement />
            </Suspense>
          } />
        </Route>
      </Routes>
    </>
  )
}

export default App
