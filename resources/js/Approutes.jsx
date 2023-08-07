import {  lazy } from 'react';
import ApplicationSetup from './pages/appllicationStep/index';
import SaleManagement from "./pages/saleManagement/index";
import StockManagement from './pages/stockManagement/index';
import Dashboard from "./pages/dashboard";
import UserManagement from "./pages/usermanagement/index";
import Myaccount from "./pages/myaccount/index"
import Expenses from "./pages/expenses/index"
import Report from "./pages/report/index"

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
  ]
  