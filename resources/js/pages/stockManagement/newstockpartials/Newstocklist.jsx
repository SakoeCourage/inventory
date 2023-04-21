import React from 'react'
import { Icon } from '@iconify/react'
import { Tooltip } from '@mui/material'
import Newstocklineitem from './Newstocklineitem'



function Newstocklist({ newStockList, errors,setShowProductSearchModal, addToNewStockList, AddEmptyRecordToList, productsFromDB, modelsFromDB }) {

    return (
        <div className=' flex flex-col gap-4 w-full py-4'>
            {newStockList.map((lineItem, i) => {
                return <Newstocklineitem
                    productsFromDB={productsFromDB}
                    key={i}
                    errors={errors}
                    index={i}
                    lineItem={lineItem}
                    modelsFromDB={modelsFromDB}
                    addToNewStockList={addToNewStockList}
                    newStockList={newStockList}
                />
            })}
            <nav className="mt-2 flex gap-2 items-center justify-evenly text-info-400 bg-info-100/30 border w-max mx-auto px-3 rounded-md">
                <Tooltip title="Add a product from search">
                    <Icon onClick={() => setShowProductSearchModal(true)} className=' h-12 cursor-pointer transform scale-125 w-full grid place-items-center  ' icon="fluent:search-square-24-regular" />
                </Tooltip>
                <hr className='w-full  border-2 transform rotate-90' />
                <Tooltip title=' Add a product to line '>
                    <Icon onClick={() => AddEmptyRecordToList()} className=' h-12 cursor-pointer w-full grid place-items-center  ' icon="streamline:interface-align-back-back-design-layer-layers-pile-stack" />
                </Tooltip>
            </nav>
        </div>
    )
}

export default Newstocklist