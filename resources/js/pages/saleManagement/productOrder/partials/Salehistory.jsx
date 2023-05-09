import React, { useEffect, useState } from 'react'
import Api from '../../../../api/Api'
import { Tooltip, TablePagination, Zoom } from '@mui/material'
import { Icon } from '@iconify/react'
import { dateReformat, formatcurrency } from '../../../../api/Util'
import FormInputsearch from '../../../../components/inputs/FormInputsearch'
import FormInputDate from '../../../../components/inputs/FormInputDate'
import Button from '../../../../components/inputs/Button'
import { addOrUpdateUrlParam } from '../../../../api/Util'
import dayjs from 'dayjs'
import SideModal from '../../../../components/layout/sideModal'
import Viewsaleitem from './Viewsaleitem'
import Loadingwheel from '../../../../components/Loaders/Loadingwheel'
import { NavLink } from 'react-router-dom'
import Refundinfo from '../../../../components/inputs/Refundinfo'

function Salehistory({ sales, setSales, filters, setFilters }) {
  const [isLoading, setIsLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [fullUriWithQuery, setfullUriWithQuery] = useState()
  const [showSaleById, setShowSaleById] = useState({
    id: null,
    title: null
  })

  const fetchSalesData = (url) => {
    setIsLoading(true)
    Api.get(url ?? '/sale/all').then(res => {
      const { sales, filters, full_url } = res.data
      setfullUriWithQuery(full_url)
      console.log(sales, filters)
      setFilters(filters)
      setSales(sales)
      setIsLoading(false)
      setProcessing(false)
    })
      .catch(err => {

      })
  }

  const handleChangePage = (event, newPage) => {
    if ((newPage + 1) > sales?.current_page) {
      fetchSalesData(sales?.next_page_url)
    } else {
      fetchSalesData(sales?.prev_page_url)
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  };
  useEffect(() => {
    fetchSalesData()
  }, [])

  const handleSearch = (value) => {
    if (fullUriWithQuery) {
      setProcessing(true);
      fetchSalesData(addOrUpdateUrlParam(fullUriWithQuery, 'search', value))
    }
  }

  return (
    <div className=' max-w-6xl mx-auto bg-white min-h-[12rem] p-2 border border-gray-400/70 rounded-md'>
      {showSaleById.id && showSaleById.title && <SideModal onClose={() => setShowSaleById({ id: null, title: null })} showClose title={showSaleById.title} showDivider={true} open={true} maxWidth='2xl'>
        <Viewsaleitem saleId={showSaleById?.id} setShowSaleById={setShowSaleById} />
      </SideModal>}
      <div className='flex items-center gap-4 justify-end my-2'>
        {(filters?.day || filters?.search) &&
          <Button onClick={() => { fetchSalesData(); setFilters([]) }} text='reset filters' />
        }
        <FormInputsearch
          processing={processing}
          getSearchKey={(value) => { handleSearch(value) }} placeholder='Search cutomer name' className='!w-72 h-14 !mb-0' />
        <FormInputDate
          value={filters?.day ? dayjs(filters?.day) : null}
          onChange={(e) => fullUriWithQuery && fetchSalesData(addOrUpdateUrlParam(fullUriWithQuery, 'day', dayjs(e.target.value).format('YYYY-MM-DD')))}
          className="!w-full"
        />
      </div>
      <div className="overflow-x-auto min-h-[32rem]">
        <table className="w-full overflow-hidden">
          <thead className="bg-secondary-200 ">
            <tr>
              <th className="px-6 py-3  text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                #
              </th>

              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                Date modified
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                Customer Contact
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                Amount Payable
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                Action
              </th>

            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800">
            {sales?.data && sales?.data.map((x, i) => {
              return (
                <tr
                  key={i}
                  className={`${i % 2 !== 0 && 'bg-secondary-100 dark:bg-dark-bg'
                    }`}
                >
                  <td className="px-6 py-2 !text-xs whitespace-nowrap">
                    <div className="flex items-center">
                      <h6 className="mb-0 !capitalize ">
                        {x.sale_invoice} {x.refunds_count > 0 && <Refundinfo/>}
                      </h6>
                    </div>
                  </td>
                  <td className="px-6 py-2 !text-xs whitespace-nowrap">
                    <div className="flex items-center">
                      <h6 className="mb-0  ">
                        {dateReformat(x.created_at)}
                      </h6>
                    </div>
                  </td>
                  <td className="px-6 py-2 !text-xs whitespace-nowrap">
                    <div className="flex items-center">
                      <h6 className="mb-0  ">
                        {x.customer_name}
                      </h6>
                    </div>
                  </td>
                  <td className="px-6 py-2 !text-xs whitespace-nowrap">
                    <div className="flex items-center">
                      <h6 className="mb-0  ">
                        {x.customer_contact}
                      </h6>
                    </div>
                  </td>

                  <td className="px-6 py-2 !text-xs whitespace-nowrap">
                    <div className="flex items-center">
                      <h6 className="mb-0  ">
                        {formatcurrency(x.total_amount)}
                      </h6>
                    </div>
                  </td>

                  <td className="px-6 py-2 !text-xs flex items-center gap-2 whitespace-nowrap text-gray-500">
                    <Tooltip title="View details" arrow TransitionComponent={Zoom}>
                      <span
                        onClick={() => setShowSaleById({ id: x.id, title: String(x.sale_invoice) })}
                        className=" p-1 hover:cursor-pointer"
                      >
                        <Icon className=' text-info-700'  icon="solar:round-arrow-right-up-outline" fontSize={20} />
                      </span>
                    </Tooltip>
                    <Tooltip title="Refund Sale" arrow TransitionComponent={Zoom}>
                      <NavLink to={`/salemanagement/refund?sale=`+x.sale_invoice}
                        className=" p-1 hover:cursor-pointer"
                      >
                        <Icon className=' text-red-700' fontSize={20} icon="heroicons:receipt-refund" />
                      </NavLink>
                    </Tooltip>

                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {isLoading && <Loadingwheel />
        }
      </div>
      <TablePagination className=" !mt-auto "
        rowsPerPageOptions={[10]}
        component="div"
        count={sales?.total ?? 0}
        rowsPerPage={sales?.per_page ?? 0}
        page={(sales?.current_page - 1) ?? 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  )
}

export default Salehistory