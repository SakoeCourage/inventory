import React, { useEffect } from 'react'
import outofstockimage from '../../../../assets/out_of_stock.png'
import { Icon } from '@iconify/react'
import { Tooltip, Zoom } from '@mui/material'
import { motion } from 'framer-motion'
import { SlideUpAndDownAnimation } from '../../../../api/Util'
import ClickAwayListener from 'react-click-away-listener'
import Productcollection from '../../../../components/Productcollection'
import { useNavigate } from 'react-router-dom'

function OutofstockUi({ products, setOutOfStockProducts,formData }) {
 
  const navigate = useNavigate()

  const handleNavigate = (pid, pname) => {
     localStorage.setItem('interrupted_sale',JSON.stringify({datetime: new Date(),...formData}))
    navigate(`/stockmanagement/product/${pid}/${pname}/manage`)
  }
  return (
    <ClickAwayListener onClickAway={() => setOutOfStockProducts([])}>
      <motion.div
        variants={SlideUpAndDownAnimation}
        initial='initial'
        animate='animate'
        exit='exit'
        className=' min-h-[30rem] h-max bg-white w-full max-w-6xl mx-auto flex rounded-t-md overflow-hidden flex-col lg:flex-row'>
        <div className='w-full min-h-full grow p-5 bg-info-100/40  flex items-center justify-center flex-col gap-5  lg:basis-[30%]'>
          <img src={outofstockimage} alt="" className='  aspect-square min-h-[14rem] min-w-[12rem] ' />
          <nav className=' text-sm font-medium text-info-900/75 rounded-md bg-white p-2'>
            Stock Notification
          </nav>
        </div>
        <div className='w-full grow min-h-full bg-info-100/10 text-info-900'>
          <nav className=' uppercase p-3 text-center m-2 rounded-md shadow-md bg-info-100/40 ring-1 ring-info-100'>
            One or more product(s) are out of stock
          </nav>
          <div className="overflow-x-scroll min-w-full overflow-y-scroll h-full max-h-[50vh]">
            <table className="w-full overflow-hidden">
              <thead className=" ">
                <tr className='text-sm'>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    #
                  </th>

                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Qty Required
                  </th>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Qty In Stock
                  </th>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold dark:text-secondary-600">
                    Action
                  </th>

                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800 !text-sm">
                {Boolean(products.length) && products.map((product, i) => {
                  return (
                    <tr
                      key={i}
                      className={`${i % 2 !== 0 && 'bg-secondary-100 dark:bg-dark-bg'
                        }`}
                    >
                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center">
                          <h6 className="mb-0 ">
                            {i + 1}
                          </h6>
                        </div>
                      </td>
                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center">
                          <h6 className="mb-0  ">
                           <span className=''> {`${product.product_name}`}</span>
                            <span className='text-sm text-gray-500'>{` ${product.model_name}`}</span>
                          </h6>
                        </div>
                      </td>
                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center">
                          <h6 className="mb-0  ">
                            <Productcollection
                              in_collections={product.in_collection}
                              units_per_collection={product.quantity_per_collection}
                              quantity={product.quantity_required}
                              collection_type={product.collection_type}
                              basic_quantity={product.basic_selling_quantity}
                            />
                          </h6>
                        </div>
                      </td>

                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center ">
                          <h6 className="mb-0 !text-red-500 !text-sm ">
                            <Productcollection
                              in_collections={product.in_collection}
                              units_per_collection={product.quantity_per_collection}
                              quantity={product.quantity_in_stock}
                              collection_type={product.collection_type}
                              basic_quantity={product.basic_selling_quantity}
                            />
                          </h6>
                        </div>
                      </td>

                      <td className="px-6 py-2 !text-xs flex items-center gap-2 whitespace-nowrap">

                        <Tooltip title="Manage Stock" arrow TransitionComponent={Zoom}>
                          <button onClick={()=>handleNavigate(product.product_id, product.product_name)}
                            className=" p-1"
                          >
                            <Icon className='' icon="solar:round-arrow-right-up-outline" fontSize={20} />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </ClickAwayListener>

  )
}

export default OutofstockUi