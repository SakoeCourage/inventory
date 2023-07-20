import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import Optioncard from './partials/Optioncard'
import Incomestatment from './incomestatment'
import Productsalesreport from './productsalereport'
import Reportoptions from './Reportoptions'

const components = {
  Reportoptions: Reportoptions,
  Productsalesreport: Productsalesreport,
  Incomestatment: Incomestatment
}

function Index() {
  const [currentComponent, setCurrentComponent] = useState('Reportoptions')
  const Component = components[currentComponent]

  return (
    <div className=' h-screen container mx-auto py-5'>
      <Component setCurrentComponent={setCurrentComponent} />
    </div>
  )
}

export default Index