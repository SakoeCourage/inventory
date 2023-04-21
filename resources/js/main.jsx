import React from 'react';
import ReactDOM from 'react-dom/client';
// import './app.css'
import './index.scss';
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Icon } from '@iconify/react';
// const App = lazy(() => import('./App'))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={
          // <Suspense fallback={<div className='grid justify-center items-center h-screen'>
          //   <Icon icon="svg-spinners:pulse-rings-3" className='text-blue-600' fontSize={60}/>
          // </div>}
          // >
            <App/>
          // </Suspense>
        }/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
