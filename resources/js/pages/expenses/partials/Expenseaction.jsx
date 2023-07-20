import React, { useEffect, useState } from 'react'
import Api from '../../../api/Api'
import { dateReformat, formatcurrency } from '../../../api/Util'
import { Statuscode } from './expenseHistory'
import Button from '../../../components/inputs/Button'
import { AccessByPermission } from '../../authorization/AccessControl'

function Expenseaction({ id, handleClose }) {
  const [data, setData] = useState(null)
 const [isLoading, setIsLoading] = useState(false)

  const handleExpenseAction = (actionType) =>{
    setIsLoading(true)
    Api.post(`/expense/take-action/${id}`, { action: actionType })
      .then(res => {
        handleClose()
      }).catch(err => {
        console.log(err)
        setIsLoading(false)
      })
  }
  useEffect(() => {
    Api.get(`/expense/submits/get/${id}`)
      .then(res => {
        setData(res.data)
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div className=' h-max min-h-full flex flex-col gap-10 w-full p-2 overflow-y-scroll'>
      <nav className=' bg-gray-50/40 border border-gray-400/70 rounded-md w-full gap-7 p-5 grid grid-cols-1 md:grid-cols-2 '>
        {/* <nav className='  border-b border-dotted border-blue-900'>Personal Information </nav> */}
        <nav className="flex flex-col gap-4 text-gray-600">
          <nav className=' font-semibold'>Date created</nav>
          <nav className=' text-sm text-gray-500'>{dateReformat(data?.created_at) ?? <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
        </nav>
        <nav className="flex flex-col gap-4 text-gray-600">
          <nav className=' font-semibold'>Author</nav>
          <nav className=' text-sm text-gray-500'>{data?.author?.name ?? <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
        </nav>
        <nav className="flex flex-col gap-4 text-gray-600 ">
          <nav className=' font-semibold'>Description</nav>
          <nav className=' text-sm text-gray-500'>{data?.description ?? <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
        </nav>
        <nav className="flex flex-col gap-4 text-gray-600 ">
          <nav className=' font-semibold'>Status</nav>
          <nav className=' text-sm text-gray-500'>{Number(data?.status) >= 0 ? <nav>{Statuscode[Number(data?.status)]['definition']}</nav> : <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
        </nav>

      </nav>
      <nav className=' bg-gray-50/40 border border-gray-400/70 rounded-md w-full gap-4 p-5 grid grid-cols-3 text-gray-600 '>
        <nav className=' grid grid-cols-3 col-span-3 bg-gray-100 p-1 font-semibold'>
          <nav>
            #
          </nav>
          <nav>
            Item Name
          </nav>
          <nav>
            Amount
          </nav>
        </nav>
        <>
          {Boolean(data?.expenseitems.length) ?
            data?.expenseitems.map((item, i) => {
              return (
                <nav className=' col-span-3 grid grid-cols-3 text-gray-600'>
                  <nav>
                    {i + 1}
                  </nav>
                  <nav>
                    {item?.expensedefinition?.name}
                  </nav>
                  <nav>
                    {formatcurrency(item?.amount)}
                  </nav>
                </nav>
              )
            })
            :
            <nav className=' text-gray-400 col-span-4'>Loading... &nbsp;</nav>
          }

        </>


      </nav>
      <nav className="flex flex-col items-end gap-4 text-gray-600 p-4 ">
        <nav className=' font-semibold'>Total Amount</nav>
        <nav className='  text-gray-500 font-semibold'>{formatcurrency(data?.total_amount) ?? <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
      </nav>

      <AccessByPermission abilities={['authorize expense']}>
      {
      Boolean(data?.expenseitems.length) && Number(data?.status) == 0 && <div className='flex items-center gap-2 mt-auto w-full'>
        <Button onClick={()=>handleExpenseAction('approve')} className="w-1/2" processing={false} type="submit" text="Approved" success />
        <Button className="w-1/2" onClick={()=>handleExpenseAction('decline')} type="button" text="Decline" danger />
      </div>
      }
      </AccessByPermission>
  
    </div>
  )
}

export default Expenseaction