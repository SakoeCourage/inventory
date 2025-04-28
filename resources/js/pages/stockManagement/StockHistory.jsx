import React, { useEffect, useState } from 'react'
import Api from '../../api/Api'
import Loadingwheel from '../../components/Loaders/Loadingwheel'
import { dateReformat, formatcurrency, addOrUpdateUrlParam } from '../../api/Util'
import { TablePagination, Tooltip } from '@mui/material'
import Button from '../../components/inputs/Button'
import FormInputsearch from '../../components/inputs/FormInputsearch'
import FormInputDate from '../../components/inputs/FormInputDate'
import FormInputSelect from '../../components/inputs/FormInputSelect'
import dayjs from 'dayjs'
import IconifyIcon from '../../components/ui/IconifyIcon'
import Modal from '../../components/layout/modal'
import SideModal from '../../components/layout/sideModal'
import ViewStockHistoryDetail from './stockhistorypartials/ViewStockHistoryDetail'


const StockHistory = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [stockHistory, setStockHistory] = useState([])
  const [fullUriWithQuery, setfullUriWithQuery] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [currentStockHistoryId, setCurrentStockHistoryId] = useState(null)
  const fetchStochHistoryData = (url) => {
    setIsLoading(true)
    Api.get(url ?? '/stock/stock-history').then(res => {
      const { stock_history, filters, full_url } = res.data
      console.log(res.data)
      setfullUriWithQuery(full_url)
      setFilters(filters)
      setStockHistory(stock_history)
      setIsLoading(false)
      setProcessing(false)
    })
      .catch(err => {

      })
  }

  const handleChangePage = (event, newPage) => {
    if ((newPage + 1) > stockHistory?.current_page) {
      fetchStochHistoryData(stockHistory?.next_page_url)
    } else {
      fetchStochHistoryData(stockHistory?.prev_page_url)
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  };

  const handleSearch = (value) => {
    if (fullUriWithQuery) {
      setProcessing(true);
      fetchStochHistoryData(addOrUpdateUrlParam(fullUriWithQuery, 'search', value))
    }
  }
  const getAllSuppliers = () => {
    Api.get('/supplier/all').then(res => {
      setSuppliers(res.data)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchStochHistoryData()
    getAllSuppliers()
  }, [])


  return (
    <div className=' container mx-auto p-0 md:p-10'>
      <SideModal showClose title="Entry Details"  open={currentStockHistoryId != null} maxWidth={'lg'} onClose={() => {setCurrentStockHistoryId(null) }}  >
        <ViewStockHistoryDetail id={currentStockHistoryId}/>
      </SideModal>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-gray-500 font-semibold text-3xl py-2'>
          Stock History
        </h1>
      </div>
      <div className=' max-w-5xl mx-auto bg-white p-5 rounded-md border'>
        <div className='flex flex-col md:flex-row items-center gap-4 justify-end my-2'>
          <FormInputsearch
            processing={processing}
            getSearchKey={(value) => { handleSearch(value) }} placeholder='Invoice Number/Description' className='!w-full h-14 !mb-0' />
          <FormInputDate
            value={filters?.record_date ? dayjs(filters?.record_date) : null}
            onChange={(e) => fullUriWithQuery && fetchStochHistoryData(addOrUpdateUrlParam(fullUriWithQuery, 'record_date', dayjs(e.target.value).format('YYYY-MM-DD')))}
            className="!w-full"
          />
          <FormInputSelect
            onChange={(e) => fullUriWithQuery && fetchStochHistoryData(addOrUpdateUrlParam(fullUriWithQuery, 'supplier', e.target.value))}
            value={filters?.supplier ? filters?.supplier : null}
            options={Boolean(suppliers.length) ? [...suppliers.map(({ id, supplier_name }) => { return ({ name: supplier_name, value: id }) })] : []} className="w-full" label="Supplier" />
          {(filters?.record_date || filters?.search || filters?.supplier) &&
            <Button className='!grow md:!grow-0 w-full md:w-auto' onClick={() => { fetchStochHistoryData(); setFilters([]) }} text='reset filters' />
          }
        </div>
        <div className="overflow-x-auto min-h-[32rem]">
          <table className="w-full overflow-hidden">
            <thead className="bg-secondary-200 ">
              <tr>

                <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                  Record Date
                </th>
                <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                  Description / Invoice No
                </th>
                <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 ">
              {stockHistory?.data && stockHistory?.data.map((x, i) => {
                return (
                  <tr
                    key={i}
                    className={`${i % 2 !== 0 && 'bg-secondary-100 '
                      }`}
                  >
                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                      <div className="flex items-center">
                        <h6 className="mb-0  ">
                          {dateReformat(x.record_date)}
                        </h6>
                      </div>
                    </td>
                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                      <div className="flex items-center">
                        <h6 className="mb-0  ">
                          {x.purchase_invoice_number ?? 'N/A'}
                        </h6>
                      </div>
                    </td>
                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                      <div className="flex items-center">
                        <h6 className="mb-0  ">
                          {x.supplier ?? 'N/A'}
                        </h6>
                      </div>
                    </td>
                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                      <div className="flex items-center">
                          <button onClick={()=>setCurrentStockHistoryId(x.id)} primary className="mb-0 !text-xs !py-1 !px-2 bg-danger-700 text-white rounded-full">
                          View Detail
                          </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <TablePagination className=" !mt-auto "
            rowsPerPageOptions={[10]}
            component="div"
            count={stockHistory?.total ?? 0}
            rowsPerPage={stockHistory?.per_page ?? 0}
            page={(stockHistory?.current_page - 1) ?? 0}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {isLoading && <Loadingwheel />
          }
        </div>
      </div>
    </div>
  )
}

export default StockHistory