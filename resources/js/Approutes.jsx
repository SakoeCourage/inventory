import { Suspense, lazy, useEffect } from 'react';
const ApplicationSetup = lazy(() => import('./pages/appllicationStep/index'))
const SaleManagement = lazy(() => import('./pages/saleManagement/index'))
const StockManagement = lazy(() => import('./pages/stockManagement/index'))
const UserManagement = lazy(() => import('./pages/Usermanagement/index'))
import Dashboard from "./pages/dashboard";

export const  routes = [
    {
      path: "/dashboard",
      element: <Dashboard />,
      permissions: []
    },
    {
      path: "/applicationsetup/*",
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
      path: "/usermanagement/*",
      element: <UserManagement />,
      permissions: ['manage users']
    },
  ]
  