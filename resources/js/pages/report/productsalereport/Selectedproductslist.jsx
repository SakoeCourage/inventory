import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { Tooltip } from '@mui/material'
import Emptydata from '../../../components/formcomponents/Emptydata'
import Addmotion from '../../../components/Addmotion'
import { AnimatePresence } from 'framer-motion'
function Selectedproductslist({ selectedList, products, toggleFromSelectedListById }) {

    const getProductById = (id) => {
        return products.find(prd => prd.id == id)?.product_name
    }

    return (
        <div className=' bg-white rounded-md shadow-medium grow order-2  p-2 min-h-[20rem] relative'>
            <nav className=' text-gray-600 font-medium border-b p-3 flex items-center gap-2'>Selected Product List
                <Tooltip title="Select one or more (up to 10 ) products to generate report">
                    <Icon className=' text-red-300' fontSize={25} icon="ep:warning" />
                </Tooltip>
            </nav>
            <AnimatePresence>
                {Boolean(selectedList.length) ?
                    <div>
                        {selectedList.map((id, i) => <Addmotion key={i} className=' decoration-none relative  p-2 px-4 min-h-max hover:bg-blue-50 cursor-pointer model-item model-list  w-full'>
                            <span className='text-blue-950'>{getProductById(id)}</span>
                            <Icon onClick={() => toggleFromSelectedListById(id)} className='icon-delete hidden absolute right-2 inset-y-[20%]  text-red-400' icon="iconamoon:trash-fill" />
                        </Addmotion>)}
                    </div>
                    :
                    <nav className="absolute inset-0 flex items-center justify-center Mui-error">
                        <Emptydata caption="Empty List" />
                    </nav>
                }
            </AnimatePresence>


        </div>
    )
}

export default Selectedproductslist