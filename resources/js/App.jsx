import { Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import { Suspense, useEffect } from 'react';
import AppLogin from "./pages/appLogin";
import Loadingwheel from "./components/Loaders/Loadingwheel";
import { getUser, getAuth } from "./store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AcessControlPage } from "./pages/authorization/AccessControl";
import Login from "./components/appLogin/login";
import { routes } from "./Approutes";
import Logo from "./components/ui/Logo";

function App() {
  const dispatch = useDispatch()
  const auth = useSelector(getAuth)
  
  useEffect(() => {
    dispatch(getUser())
  }, [])

  return (
    <>
    {(auth.loadingState === 'success' && window.document.readyState == 'complete') ?
      <Routes>
        <Route element={<Layout />}>
          {routes.map((route, i) =>
            <Route key={i} path={route.path} element={
              <AcessControlPage abilities={route.permissions}>
                <Suspense fallback={<Loadingwheel />}>
                  {route.element}
                </Suspense>
              </AcessControlPage>
            } />)}
        </Route>
        <Route element={<AppLogin />} >
          <Route index path="/" element={<Login />} />
        </Route>
        <Route path="*" element={<div className=" flex items-center justify-center h-screen font-semibold"> Page not found</div>} />
      </Routes>
      : 
      <div className="flex items-center h-screen w-screen justify-center">
        <Loadingwheel />
        <Logo className="h-12 w-50 text-info-900"/>
    </div>
    }
    </>

  )
}

export default App
