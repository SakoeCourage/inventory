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
import Loadingwheel from '../../../../components/Loaders/Loadingwheel'
import { useSnackbar } from 'notistack'
import Invoicepreview from './Invoicepreview'
function Proformalist({ invoices, setInvoices, setCurrentComponent }) {
  const {enqueueSnackbar,closeSnackbar} = useSnackbar()
  const [isLoading, setIsLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [fullUriWithQuery, setfullUriWithQuery] = useState()
  const [filters, setFilters] = useState()
  const [invoiceData, setInvoiceData] = useState(null)

  const fetchProformaData = (url) => {
    setIsLoading(true)
    Api.get(url ?? '/proforma/all').then(res => {
      const { invoices, filters, full_url } = res.data
      setfullUriWithQuery(full_url)
      setFilters(filters)
      setInvoices(invoices)
      setIsLoading(false)
      setProcessing(false)
    })
      .catch(err => {

      })
  }

  const handleChangePage = (event, newPage) => {
    if ((newPage + 1) > invoices?.current_page) {
      fetchProformaData(invoices?.next_page_url)
    } else {
      fetchProformaData(invoices?.prev_page_url)
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  };
  useEffect(() => {
    fetchProformaData();
  }, [])

  const handleSearch = (value) => {
    if (fullUriWithQuery) {
      setProcessing(true);
      fetchProformaData(addOrUpdateUrlParam(fullUriWithQuery, 'search', value))
    }
  }

  const handleToCart = (formData) => {
    localStorage.setItem('proforma_list', JSON.stringify(formData))
    setCurrentComponent('newsale')
  }

  const generateGenerateInvoice = (proformaInvoiceID) => {
    if (proformaInvoiceID) {
      enqueueSnackbar('Loading invoice',{variant: 'default',key:'proformaloadingstus'})
      Api.get(`proforma/view-invoice/${proformaInvoiceID}`)
        .then(res => {   
          closeSnackbar('proformaloadingstus')
         
          setInvoiceData({
            data: res.data,
            type: 'PROFORMA INVOICE'
          })
        })
        .catch(err=>{
          enqueueSnackbar('Failed to load invoice',{variant: 'error'})
        })
    }
  }


  const handelOnDelete = (proformaInvoiceID) => {
    if (proformaInvoiceID) {
      setIsLoading(true)
      Api.delete(`proforma/delete/${proformaInvoiceID}`)
        .then(res => {   
          fetchProformaData(fullUriWithQuery)
        })
        .catch(err=>{
          console.log(err)
          setIsLoading(false);
          enqueueSnackbar('Failed to remove invoice',{variant: 'error'})
        })
    }
  }



  return (
    <div className=' max-w-6xl mx-auto bg-white min-h-[12rem] p-2 border border-gray-400/70 rounded-md'>
      {invoiceData && <Invoicepreview invoiceData={invoiceData} onClose={() => setInvoiceData(null)} />}
      <div className='flex items-center flex-col md:flex-row gap-4 justify-end my-2'>
        {(filters?.day || filters?.search) &&
          <Button onClick={() => { fetchProformaData(); setFilters([]) }} text='reset filters' />
        }
        <FormInputsearch
          processing={processing}
          getSearchKey={(value) => { handleSearch(value) }} placeholder='Search cutomer name' className='!w-full h-14 !mb-0' />
        <FormInputDate
          value={filters?.day ? dayjs(filters?.day) : null}
          onChange={(e) => fullUriWithQuery && fetchProformaData(addOrUpdateUrlParam(fullUriWithQuery, 'day', dayjs(e.target.value).format('YYYY-MM-DD')))}
          className="!w-full"
        />
      </div>
      <div className="overflow-x-auto min-h-[32rem]">
        <table className="w-full overflow-hidden">
          <thead className="bg-secondary-200 ">
            <tr>
              <th className="px-6 py-3  text-left rtl:text-right  whitespace-nowrap font-semibold ">
                #
              </th>

              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                Date Created
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                Customer Contact
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                Invoice Total
              </th>
              <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                Action
              </th>

            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200 ">
            {invoices?.data && invoices?.data.map((x, i) => {
              return (
                <tr
                  key={i}
                  className={`${i % 2 !== 0 && 'bg-secondary-100 '
                    }`}
                >
                  <td className="px-6 py-2 !text-xs whitespace-nowrap">
                    <div className="flex items-center">
                      <h6 className="mb-0 !capitalize ">
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
                    <Tooltip title="View Invoice" arrow TransitionComponent={Zoom}>
                      <button
                        onClick={() => generateGenerateInvoice (x.id)}
                        className=" p-1 hover:cursor-pointer"
                      >
                        <Icon className=' text-info-700' icon="solar:round-arrow-right-up-outline" fontSize={20} />
                      </button>
                    </Tooltip>
                    <Tooltip title="View Cart" arrow TransitionComponent={Zoom}>
                      <button onClick={() => handleToCart(x.form_data)}
                        className=" p-1 hover:cursor-pointer"
                      >
                        <svg className=' text-info-700' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="currentColor" d="M19.5 22a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Zm-10 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Z" /><path d="M5 4h17l-2 11H7L5 4Zm0 0c-.167-.667-1-2-3-2m18 13H5.23c-1.784 0-2.73.781-2.73 2c0 1.219.946 2 2.73 2H19.5" /></g></svg>
                      </button>
                    </Tooltip>
                    <Tooltip title="Remove Invoice" arrow TransitionComponent={Zoom}>
                      <button onClick={() => handelOnDelete(x.id)}
                        className=" p-1 hover:cursor-pointer"
                      >
                        <svg className='text-red-700' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9ZM7 6v13V6Z"/></svg>
                      </button>
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
        count={invoices?.total ?? 0}
        rowsPerPage={invoices?.per_page ?? 0}
        page={(invoices?.current_page - 1) ?? 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  )
}

export default Proformalist