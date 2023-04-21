import { Icon } from '@iconify/react';
import { TablePagination, Tooltip, Zoom } from '@mui/material'
import React, { useState } from 'react'
import SideModal from "../../../components/layout/sideModal"
import CartTable from './cartTable';
import Button from '../../../components/inputs/Button';

const HistoryTable = (props) => {
  const { data, isLoading } = props
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadData, setLoadData] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getSaleDetails = (id) =>{
    setShowDetails(true)
    setLoadData(true)
    setTimeout(() => {
      setLoadData(false)
    },600)
  }
  return (
    <div>
      <div className="flex-auto w-full">
        <div className="flex flex-col  overflow-hidden w-full">
          <div className="flex-auto p-0">
            <div className="overflow-x-auto">
              <table className="w-full overflow-hidden">
                <thead className="bg-secondary-200 ">
                  <tr>
                    <th className="px-6 py-2 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                      #
                    </th>

                    <th className="px-6 py-2 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                      Recorded
                    </th>

                    <th className="px-6 py-2 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                      Customer name
                    </th>
                    <th className="px-6 py-2 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                      Customer contact
                    </th>
                    <th className="px-6 py-2 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                      Amount (GH₵)
                    </th>
                    <th className="px-6 py-2 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                      Sales Rep.
                    </th>
                    <th className="px-6 py-2 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800">
                  {isLoading ?
                    [...Array(3)].map((x, i) => {
                      return (
                        <tr key={i} className="animate-pulse w-full">
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className=" h-6  bg-gray-300 rounded-md"></div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className=" h-6  bg-gray-300 rounded-md"></div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className=" h-6  bg-gray-300 rounded-md"></div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className=" h-6  bg-gray-300 rounded-md"></div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className=" h-6  bg-gray-300 rounded-md"></div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className=" h-6  bg-gray-300 rounded-md"></div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className=" h-6 w-8 bg-gray-300 rounded-full"></div>

                          </td>

                        </tr>
                      )
                    })
                    :

                    data?.length > 0 && data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((x, i) => {
                      return (
                        <tr
                          key={i}
                          className={`${i % 2 !== 0 && 'bg-secondary-100 dark:bg-dark-bg'
                            }`}
                        >
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <h6 className="mb-0 ">
                                {i + 1}
                              </h6>
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <h6 className="mb-0  ">
                                {x.recorded}
                              </h6>
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <h6 className="mb-0  ">
                                {x.customerName}
                              </h6>
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex text-center">
                              <h6 className="mb-0  ">
                                {x.customerContact}
                              </h6>
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <h6 className="mb-0  ">
                                {x.amount}
                              </h6>
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <h6 className="mb-0  ">
                                {x.salesRep}
                              </h6>
                            </div>
                          </td>
                          <td className="px-6  py-3 whitespace-nowrap">
                            <Tooltip title="View sale details" placement="right" arrow TransitionComponent={Zoom}>
                              <span
                                onClick={() => getSaleDetails(x.id)}
                                className=" rounded-full bg-primary-100 p-1.5 text-sm font-semibold leading-5 text-primary-800 hover:cursor-pointer"
                              >
                                <Icon icon="mdi:file-eye" fontSize={20} />
                              </span>
                            </Tooltip>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={data?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <SideModal
        open={showDetails}
        title="Sale Item"
        showClose
        onClose={() => setShowDetails(false)}
        showDivider
        maxWidth="2xl"
      >
        <div className='flex-grow text-black p-2'>
          <div className='flex flex-col gap-4'>
            <CartTable hideActionButton rows={10} isLoading={loadData}/>
            <section className='bg-blue-100 flex justify-between  p-2'>
              <h6>Total</h6>
              <h6>GH₵ 1000.00</h6>
            </section>
            <div className='flex justify-center my-4'>
              <Button primary>
                <div className='flex items-center gap-1'>
                  generate invoice
                  <Icon icon="dashicons:printer" fontSize={20} />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </SideModal>

    </div>
  )
}

export default HistoryTable
