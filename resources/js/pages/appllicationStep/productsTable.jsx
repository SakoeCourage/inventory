import { Icon } from '@iconify/react';
import { TablePagination, Tooltip, Zoom } from '@mui/material'
import React, { useState, useEffect } from 'react'
import Api from '../../api/Api';
import { NavLink } from 'react-router-dom';
import { dateReformat ,formatnumber} from '../../api/Util';


const ProductsTable = ({ data, setData, isLoading, setIsLoading, updateProduct, setFilters }) => {


  const fetchPaginatedData = (url) => {
    setIsLoading(true)
    Api.get(url).then(res => {
      const { products, filters } = res.data
      setData(products)
      setFilters(filters)
      setIsLoading(false)
    })
      .catch(err => {
        console.log(err.response)
      })
  }

  const handleChangePage = (event, newPage) => {
    if ((newPage + 1) > data.current_page) {
      fetchPaginatedData(data.next_page_url)
    } else {
      fetchPaginatedData(data.prev_page_url)
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  };




  return (
    <div className="flex flex-col w-full min-h-[36rem] h-max relative ">
      <div className="flex flex-col  overflow-hidden w-full">
        <div className="flex-auto p-0">
          <div className="overflow-x-auto">
            <table className="w-full overflow-hidden">
              <thead className="bg-secondary-200 ">
                <tr>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Date modified
                  </th>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Product Category
                  </th>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Qty In Stock
                  </th>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Action
                  </th>

                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800">
                {data.data && data?.data.map((x, i) => {
                  return (
                    <tr
                      key={i}
                      className={`${i % 2 !== 0 && 'bg-secondary-100 dark:bg-dark-bg'
                        }`}
                    >
                    
                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center">
                          <h6 className="mb-0  ">
                            {dateReformat(x.updated_at)}
                          </h6>
                        </div>
                      </td>
                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center">
                          <h6 className="mb-0 ">
                            {x.category_name}
                          </h6>
                        </div>
                      </td>
                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center">
                          <h6 className="mb-0  ">
                            {x.product_name}
                          </h6>
                        </div>
                      </td>

                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center">
                          <h6 className="mb-0  ">
                            {`${formatnumber(x.quantity_in_stock)} ${x.basic_quantity}(s)`}
                          </h6>
                        </div>
                      </td>

                      <td className="px-6 py-2 !text-xs flex items-center gap-2 whitespace-nowrap">
                        <Tooltip title="Edit product details" arrow TransitionComponent={Zoom}>
                          <span
                            onClick={() => updateProduct(x.id)}
                            className=" p-1 rounded-full border border-gray-400/70 active:border-gray-400/40 text-red-900   text-sm font-semibold leading-5  hover:cursor-pointer"
                          >
                            <Icon className='' icon="mdi:database-edit-outline" fontSize={20}/>
                          </span>
                        </Tooltip>
                        <Tooltip title="Products Dashboard" arrow TransitionComponent={Zoom}>
                          <NavLink to={`/stockmanagement/product/${x.id}/${x.product_name}/manage`}
                            className=" p-1 rounded-full border border-gray-400/70 active:border-gray-400/40  text-blue-900 text-sm font-semibold leading-5  hover:cursor-pointer"
                          >
                            <Icon className='' icon="material-symbols:list-alt-outline" fontSize={20}/>
                          </NavLink>
                        </Tooltip>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {isLoading && <div className=' min-h-[100%] flex items-center justify-center absolute inset-0 bg-gray-100/50 bgack'>
            <Icon icon="svg-spinners:pulse-rings-3" className='text-blue-600' fontSize={60} />
            </div>
            }
          </div>
        </div>
      </div>
      <TablePagination className=" !mt-auto "
        rowsPerPageOptions={[10]}
        component="div"
        count={data?.total ?? 0}
        rowsPerPage={data?.per_page ?? 0}
        page={(data?.current_page - 1) ?? 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    </div>
  )
}

export default ProductsTable
