import React, { useEffect, useState } from 'react'
import Api from '../../../../api/Api'
import Productcollection from '../../../../components/Productcollection'
import { dateReformat } from '../../../../api/Util'
import dayjs from 'dayjs'
import { TablePagination } from '@mui/material'
import { Icon } from '@iconify/react'
import Loadingwheel from '../../../../components/Loaders/Loadingwheel'
import FormInputDate from '../../../../components/inputs/FormInputDate'
import { addOrUpdateUrlParam, } from '../../../../api/Util'
import Button from '../../../../components/inputs/Button'

function Refundhistory() {
  const [refundHistory, setRefundHistory] = useState([])
  const [filters, setFilters] = useState([])
  const [fullUrl, setFullUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(null)

  const handleChangePage = (event, newPage) => {
    if ((newPage + 1) > refundHistory.current_page) {
      fetchStoreHistory(refundHistory.next_page_url)
    } else {
      fetchStoreHistory(refundHistory.prev_page_url)
    }
  };


  const fetchStoreHistory = (url) => {
    setIsLoading(true)
    Api.get(url ?? '/refund/history')
      .then(res => {
        const { history, filters, full_url } = res.data
        setRefundHistory(history)
        setFilters(filters)
        setFullUrl(full_url)
        setIsLoading(false)

      })
      .catch(err => {
        console.log(err)
      })
  }


  useEffect(() => {
    fetchStoreHistory()
  }, [])

  return (
    <div className=' max-w-6xl mx-auto bg-white min-h-[12rem] p-2 border border-gray-400/70 rounded-md mt-6'>
      {isLoading && <Loadingwheel />}
      <div className='flex items-center gap-4 justify-end my-2'>
        {(filters?.date) &&
          <Button onClick={() => { fetchStoreHistory(); setFilters([]) }} text='reset filters' />
        }

        <FormInputDate
          value={filters?.date ? dayjs(filters?.day) : null}
          onChange={(e) => fullUrl && fetchStoreHistory(addOrUpdateUrlParam(fullUrl, 'date', dayjs(e.target.value).format('YYYY-MM-DD')))}
          className="!w-full"
        />
      </div>
      <div className="overflow-x-auto min-h-[30rem] h-full">
        <table className="w-full overflow-hidden">
          <thead className="bg-secondary-200 ">
            <tr>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                #
              </th>

              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                Date
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                Time
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                Product Name
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                Model Name
              </th>

              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                Refund Quantity
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                Author
              </th>

            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200   ">
            {Boolean(refundHistory?.data?.length) && refundHistory?.data?.map((dt, i) => {
              return (
                <tr
                  key={i}
                  className={`${i % 2 !== 0 && 'bg-secondary-100 '
                    }`}
                >
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <h1 className="mb-0 !text-sm">
                        {dt.action_type == 'addition' ?
                          <Icon fontSize={16} icon="mdi:arrow-up" className=' text-green-700 transition-all' /> :

                          <Icon fontSize={16} icon="mdi:arrow-up" className=' text-red-700 transition-all transform rotate-180' />

                        }
                      </h1>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <h1 className="mb-0 !text-sm">
                        {dateReformat(dt.created_at)}
                      </h1>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <h1 className="mb-0 !text-sm ">
                        {dayjs(dt.created_at).format('hh:mm')}
                      </h1>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <h1 className="mb-0 !text-sm">
                        {dt.product_name}
                      </h1>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <h1 className="mb-0 !text-sm">
                        {dt.model_name}
                      </h1>
                    </div>
                  </td>

                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {dt.action_type == "reduction" ? <h1 className="mb-0 text-red-400  !text-sm"><Productcollection
                        in_collections={dt?.in_collection}
                        quantity={dt.quantity}
                        units_per_collection={dt?.quantity_per_collection}
                        collection_type={dt?.collection_method}
                        basic_quantity={dt?.basic_quantity}
                      /></h1>
                        :
                        <h1 className="mb-0 text-green-800 !text-sm"><Productcollection
                          in_collections={dt?.in_collection}
                          quantity={dt.quantity}
                          units_per_collection={dt?.quantity_per_collection}
                          collection_type={dt?.collection_method}
                          basic_quantity={dt?.basic_quantity}
                        /></h1>

                      }
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <h6 className="mb-0 !text-sm ">
                        {dt.author}
                      </h6>
                    </div>
                  </td>


                </tr>
              )
            })}
          </tbody>


        </table>
      </div>
      <TablePagination className=" !mt-auto "
        rowsPerPageOptions={[10]}
        component="div"
        count={refundHistory?.total ?? 0}
        rowsPerPage={refundHistory?.per_page ?? 0}
        page={(refundHistory?.current_page - 1) ?? 0}
        onPageChange={handleChangePage}
      />
    </div>
  )
}

export default Refundhistory