import React, { useEffect, useState } from 'react'
import Supplierstable from './supplierspartials/Supplierstable'
import { Card } from '@mui/material'
import { Icon } from '@iconify/react'
import SideModal from '../../components/layout/sideModal'
import Button from '../../components/inputs/Button'
import Api from '../../api/Api'
import Expensetable from './expensepartials/Expensetable'
import Newexpenseform from './expensepartials/Newexpenseform'
function ExpenseDefinition() {

  const [data, setData] = useState([])
  const [filters, setFilters] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState({
    expense: null,
    id: null,
    mode: null
  })
  const fetchExpenseData = (url) => {
    setIsLoading(true)
    Api.get(url ?? '/expense/all').then(res => {
      console.log(res.data)
      setData(res.data)
      setIsLoading(false)
    })
      .catch(err => {
        console.log(err)
      })
  }


  const handleClose = () => {
    setShowExpenseForm({
      name: null,
      id: null,
      mode: null
    })
  }

  useEffect(() => {
    fetchExpenseData()
  }, [])
  

  return (
    <div className='text-sm h-max '>
      <div className='bg-info-600 h-[35vh] md:px-10 overflow-visible '>
        <div className='max-w-6xl mx-auto h-full '>
          <h3 className='pb-3 text-info-100 ml-4 text-lg '><span className="mr-4">Expense Items Definition</span>
            <Icon icon="bi:plus-circle" />
          </h3>
          <Card className='py-6 pb-36'>
            <div className='flex justify-end items-center px-6 pb-6'>
              <Button className="w-full  my-auto md:w-auto" onClick={() => setShowExpenseForm(cv => cv = { ...cv, mode: "New Expense" })} info >
                <div className='flex items-center gap-2 text-xs'>
                  <Icon icon="carbon:tag-group" fontSize={22} />
                  <span>Add Expense Item</span>
                </div>
              </Button>

            </div>
            <Expensetable
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setFilters={setFilters}
              filters={filters}
              fetchExpenseData={fetchExpenseData}
              setData={setData}
              data={data}
              setShowExpenseForm={setShowExpenseForm}
            />
          </Card>
        </div>
      </div>
      <SideModal
        open={showExpenseForm.mode}
        title={showExpenseForm.mode}
        onClose={() => handleClose()}
        showDivider
        maxWidth="xl"
        showClose
      >
        <Newexpenseform fetchExpenseData={fetchExpenseData} showExpenseForm={showExpenseForm} onClose={() => handleClose()} />
      </SideModal>
    </div>
  )
}

export default ExpenseDefinition