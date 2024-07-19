import {  lazy } from 'react';
const ApplicationSetup = lazy(() => import('./pages/appllicationStep/index'))
const SaleManagement = lazy(() => import('./pages/saleManagement/index'))
const StockManagement = lazy(() => import('./pages/stockManagement/index'))
const Dashboard = lazy(()=>import('./pages/dashboard'));
const UserManagement = lazy(() => import('./pages/usermanagement/index'))
const Myaccount = lazy(()=>import('./pages/myaccount/index'))
const Expenses = lazy(()=>import('./pages/expenses/index'))
const Report = lazy(()=>import('./pages/report/index'))
const AppSetup = lazy(()=>import('./pages/appllicationStep/SetupCategoryScreen'))

export const  routes = [
    {
      path: "/dashboard",
      element: <Dashboard />,
      permissions: []
    },
    {
      path: "/account",
      element: <Myaccount />,
      permissions: []
    },
    {
      path: "/app-setup/*",
      element: <ApplicationSetup />,
      permissions: ['define system data']
    },
    {
      path: "/salemanagement/*",
      element: <SaleManagement />,
      permissions: ['generate product order']
    },
    {
      path: "/stockmanagement/*",
      element: <StockManagement />,
      permissions: ['manage stock data']
    },
    {
      path: "/report/*",
      element: <Report />,
      permissions: ['generate report']
    },
    {
      path: "/usermanagement/*",
      element: <UserManagement />,
      permissions: ['manage users']
    },
    {
      path: "/expenses/*",
      element: <Expenses />,
      permissions: ['create expense','authorize expense']
    },
    {
      path: "/app-setup",
      element: <AppSetup />,
      permissions: ['define system data']
    },
  ]
  