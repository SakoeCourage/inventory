import { Icon } from '@iconify/react';
import { TablePagination, Tooltip, Zoom } from '@mui/material'
import React, { useState } from 'react'

const CartTable = (props) => {
  const { data, hideActionButton, rows, isLoading } = props
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rows || 7);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
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
                    Product
                  </th>

                  <th className="px-6 py-2 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Quantity
                  </th>
                  <th className="px-6 py-2 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Unit Price (GH₵)
                  </th>
                  <th className="px-6 py-2 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Amount (GH₵)
                  </th>
                  {!hideActionButton &&
                    <th className="px-6 py-2 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                      Action
                    </th>
                  }
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
                        {/* <td className="px-6 py-2 whitespace-nowrap">
                          <div className=" h-6 w-8 bg-gray-300 rounded-full"></div>

                        </td> */}

                      </tr>
                    )
                  }) :

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
                              {x.productName}
                            </h6>
                          </div>
                        </td>

                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <h6 className="mb-0  ">
                              {x.quantity}
                            </h6>
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex text-center">
                            <h6 className="mb-0  ">
                              {x.unitPrice}
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
                        {!hideActionButton &&
                          <td className="px-6  py-3 whitespace-nowrap">
                            <Tooltip title="Remove product" arrow placement='right' TransitionComponent={Zoom}>
                              <span
                                onClick={() => props.removeProduct(x.id)}
                                className=" rounded-full bg-red-100 p-1.5 text-sm font-semibold leading-5 text-red-800 hover:cursor-pointer"
                              >
                                <Icon icon="ic:baseline-delete" fontSize={20} />
                              </span>
                            </Tooltip>
                          </td>

                        }
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
  )
}

export default CartTable
