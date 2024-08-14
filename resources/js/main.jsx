import 'simplebar-react/dist/simplebar.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
// import './app.css'
import './index.scss';
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import { store } from "./store/store";
import Sidebarserviceprovider from './providers/Sidebarserviceprovider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Sidebarserviceprovider>
          <Routes>
            <Route path='/*' element={<App />} />
          </Routes>
        </Sidebarserviceprovider>
      </Provider >
    </BrowserRouter>
  </React.StrictMode>
);
