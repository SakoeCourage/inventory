import { Card, Chip, Collapse, FormControl, FormControlLabel, Switch } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import SaleForm from './saleForm'
import CartTable from './cartTable'
import FormInputText from '../../../components/inputs/FormInputText'
import Button from '../../../components/inputs/Button'
import HistoryTable from './historyTable'

const items = [
 {id: 1, recorded: '2 hours ago', customerName: 'Mary Brown', customerContact: '0244444444', amount: 4903, salesRep: 'Admin'},
 {id: 2, recorded: '2 hours ago', customerName: 'Mary Brown', customerContact: '0244444444', amount: 4903, salesRep: 'Admin'},
 {id: 3, recorded: '2 hours ago', customerName: 'Mary Brown', customerContact: '0244444444', amount: 4903, salesRep: 'Admin'},
 {id: 4, recorded: '2 hours ago', customerName: 'Mary Brown', customerContact: '0244444444', amount: 4903, salesRep: 'Admin'},
 {id: 5, recorded: '2 hours ago', customerName: 'Mary Brown', customerContact: '0244444444', amount: 4903, salesRep: 'Admin'},
 {id: 6, recorded: '2 hours ago', customerName: 'Mary Brown', customerContact: '0244444444', amount: 4903, salesRep: 'Admin'},
 {id: 7, recorded: '2 hours ago', customerName: 'Mary Brown', customerContact: '0244444444', amount: 4903, salesRep: 'Admin'},
 {id: 8, recorded: '2 hours ago', customerName: 'Mary Brown', customerContact: '0244444444', amount: 4903, salesRep: 'Admin'},
 {id: 9, recorded: '2 hours ago', customerName: 'Mary Brown', customerContact: '0244444444', amount: 4903, salesRep: 'Admin'},
 {id: 10, recorded: '2 hours ago', customerName: 'Mary Brown', customerContact: '0244444444', amount: 4903, salesRep: 'Admin'},
]
const Index = () => {
  const [showHistory, setShowHistory] = useState(false)
  const [cart, setCart] = useState([])
  const [addDiscount, setAddDiscount] = useState(false)
  const [generateInvoice, setGenerateInvoce] = useState(false)
  const [rate, setRate] = useState('')
  const [historyData, setHistoryData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const subTotal = useMemo(() => {
    let d = []
    let sum = 0
    cart.map(r => {
      d.push(r.amount)
    })
    for (const item of d) {
      sum += item
    }
    return sum.toFixed(2)
  }, [cart])

  const total = useMemo(() => {
    let d = subTotal - ((Number(rate) / 100) * subTotal)
    return d.toFixed(2)
  }, [subTotal, rate])

  const toggleHistoty = () => {
    setShowHistory(true)
    setIsLoading(true)
    setTimeout(() => {
      setHistoryData(items)
      setIsLoading(false)
    }, 500)

  }



  // useEffect(() => {
  //   setCart(items)
  // },[])
  return (
    <div className='pb-10 h-full'>
      <div className='flex gap-3'>
        <Chip color='info' onClick={() => setShowHistory(false)} icon={<Icon icon="material-symbols:add-shopping-cart-rounded" fontSize={18} />} label="New sale" variant={showHistory ? "outlined" : 'filled'} />
        <Chip color='info' onClick={toggleHistoty} label="History" icon={<Icon icon="mdi:clipboard-text-history-outline" fontSize={18} />} variant={showHistory ? "filled" : 'outlined'} />
      </div>
      {showHistory ?
        <Card className='my-4 bg-white p-6'>
          <HistoryTable data={historyData} isLoading={isLoading}/>
        </Card>
        :
        <Card className='grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 my-4 bg-white p-6 '>
          <div className='lg:col-span-3 '>
            {cart.length > 0 ?
              <React.Fragment>
                <div className='bg-gray-50  rounded-md shadow-md'>
                  <CartTable data={cart} removeProduct={(val) => setCart(cart.filter(x => x.id !== val))} />
                </div>
                <section className='pt-6'>
                  <div className='flex justify-between bg-blue-100  items-center py-1  px-6'>
                    <h6>Sub total</h6>
                    <h6 className='pr-20'>GH₵ {subTotal}</h6>
                  </div>
                  <div className='flex flex-col md:flex-row justify-between py-2 px-6 md:items-center'>
                    <FormControl>
                      <FormControlLabel control={<Switch checked={addDiscount} onChange={(e) => { setAddDiscount(e.target.checked); setRate('') }} />} label="Add discount" />
                    </FormControl>
                    <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-10'>
                      <FormInputText value={rate} size="small" label="Enter Rate(%)" disabled={!addDiscount} onChange={(e) => setRate(e.target.value)} type="number" />
                      <span className='lg:pr-20'>{rate || 0} % discount applied</span>
                    </div>
                  </div>
                </section>
                <section className='mt-2'>
                  <div className='flex justify-between bg-blue-100  items-center py-1 px-6'>
                    <h6>Total</h6>
                    <h6 className='pr-20'>GH₵ {total}</h6>
                  </div>
                  <div className='flex justify-between py-2 px-6 items-center'>
                    <FormControl>
                      <FormControlLabel control={<Switch checked={generateInvoice} onChange={(e) => setGenerateInvoce(e.target.checked)} />} label="Generate sale invoice" />
                    </FormControl>
                    <div className='flex items-center gap-10'>
                      <Button text="submit" success />
                    </div>
                  </div>
                </section>

              </React.Fragment>
              :
              <div className='flex justify-center items-center h-80'>
                <div className='flex flex-col gap-6'>
                  <div className='mx-auto bg-gray-200 rounded-full p-10 animate-pulse'>
                    <Icon icon="ri:file-forbid-fill" className='text-gray-400' fontSize={80} />
                  </div>
                  <p className='text-lg flex gap-2 items-center'>No item added to cart <Icon icon="material-symbols:shopping-cart" fontSize={24} /> </p>
                </div>
              </div>
            }
          </div>
          <div className='lg:col-span-2 '>
            <SaleForm newItem={(val) => setCart(prev => prev.concat(val))} />
          </div>
        </Card>
      }
    </div>
  )
}

export default Index
