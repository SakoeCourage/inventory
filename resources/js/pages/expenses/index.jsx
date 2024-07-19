import React, { useEffect, useState } from 'react'
import ExpenseHistory from './partials/expenseHistory'
import NewExpense from './partials/newExpense'
import { Pilltab } from '../saleManagement/productOrder'
import { Icon } from '@iconify/react'
import Api from '../../api/Api'
import Loadingwheel from '../../components/Loaders/Loadingwheel'
import { AccessByPermission } from '../authorization/AccessControl'
const components = {
  expenseHistory: ExpenseHistory,
  newExpense: NewExpense,
}

function index() {
  const [currentComponent, setCurrentComponent] = useState('expenseHistory')
  const [expenseItems, setexpenseItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const Component = components[currentComponent]
  const [expensesfromDB, setExpensesFromDB] = useState([])
  const [filters, setFilters] = useState({})
  const [fullUrl, setFullUrl] = useState(null)


  const getExpenseItems = () => {
    Api.get('/toselect/expenses')
      .then(res => {
        // console.log(res.data)
        setexpenseItems(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getExpensesFromDB = (url =fullUrl ) => {
    setIsLoading(true)
    Api.get(url ?? '/expense/submits/all')
      .then(res => {
        console.log()
        const { expenses, filters, full_url } = res.data
        setExpensesFromDB(expenses)
        setFilters(filters)
        setFullUrl(full_url)
        setIsLoading(false)

      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)

      })
  }

  useEffect(() => {
    getExpenseItems()
  }, [])

  return (
    <div>
      {isLoading && <Loadingwheel />}
      <nav className=" w-full  z-30   bg-info-900/60 p-2 pt-3">
        <header className="flex items-center gap-4 max-w-6xl mx-auto ">
          <Pilltab active={currentComponent == 'expenseHistory'} onClick={() => setCurrentComponent('expenseHistory')} Pillicon={<Icon fontSize={20} icon="material-symbols:history" />} title='History' />
          <AccessByPermission abilities={['create expense']}>
          <Pilltab active={currentComponent == 'newExpense'} onClick={() => setCurrentComponent('newExpense')} Pillicon={<Icon fontSize={20} icon="bi:plus-circle" />} title='New epenses' />
          </AccessByPermission>
        </header>
      </nav>
      <section className=' max-w-6xl mx-auto'>
        <Component expenseItems={expenseItems}
          expensesfromDB={expensesfromDB}
          filters={filters}
          fullUrl={fullUrl}
          getExpensesFromDB={getExpensesFromDB} />
      </section>
    </div>
  )
}

export default index