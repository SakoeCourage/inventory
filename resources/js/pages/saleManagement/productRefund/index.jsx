import React, { useState, useEffect, Suspense } from 'react'
import { Pilltab } from '../productOrder'
import Makerefund from './partials/Makerefund'
import Refundhistory from './partials/Refundhistory'
import { Icon } from '@iconify/react'
import Loadingwheel from '../../../components/Loaders/Loadingwheel'

const components = {
  Makerefund: Makerefund,
  Refundhistory: Refundhistory
}

function index() {
  const [currentComponent, setCurrentComponent] = useState('Makerefund')
  const Component = components[currentComponent]

  return (<div className=" ">
    <nav className=" w-full  z-30  bg-info-900/50 p-2 pt-3">
      <header className="flex items-center gap-4 max-w-6xl mx-auto ">
        <Pilltab active={currentComponent == 'Makerefund'} onClick={() => setCurrentComponent('Makerefund')} Pillicon={<Icon fontSize={20} icon="bi:plus-circle" />} title='Refund Sale' />
        <Pilltab active={currentComponent == 'Refundhistory'} onClick={() => setCurrentComponent('Refundhistory')} Pillicon={<Icon fontSize={20} icon="material-symbols:history" />} title='Refund History' />
      </header>
    </nav>
    <main className=" ">
      <Suspense fallback={<Loadingwheel />}>
        <Component />
      </Suspense>

    </main>

  </div>)
}

export default index