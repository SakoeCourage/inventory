import React from 'react'

/**
 * @typedef {"Available" | "Low Stock" | "Out of Stock"} StockLevelIndicator
 */

/**
 * @typedef {Object} StockLevelIndicatorTheme
 * @property {string} Available
 * @property {string} LowStock
 * @property {string} OutOfStock
 */

/**
 * @type {StockLevelIndicatorTheme}
 */
const stockLevelIndicatorTheme = {
    "Available": "",
    "LowStock": "",
    "OutOfStock": ""
};


function StockAvailability() {
    return (
        <div className='grow relative min-w-[30%] card  border-gray-400/40 bg-white overflow-hidden rounded-md pb-5'>
            <h1 className=' text-base px-5 py-4 '>Stock Availability</h1>
            <div className='px-5 py-3'>
                <nav className=' font-medium text-gray-700 text-lg'>1500</nav>
                <span className='text-sm text-gray-500'>Total Stock</span>
            </div>
            <div className='flex items-center flex-nowrap px-5 gap-5 lg:justify-between pt-3'>
                <nav className="flex items-center gap-2">
                    <nav className='h-4 w-4 aspect-square bg-green-500 rounded'></nav>
                    <nav className='text-gray-700 font-medium min-w-max text-sm truncate'>Available</nav>
                </nav>
                <nav className="flex items-center gap-2">
                    <nav className='h-4 w-4 aspect-square bg-yellow-500 rounded'></nav>
                    <nav className='text-gray-700 font-medium min-w-max text-sm truncate'>Low Stock</nav>
                </nav>
                <nav className="flex items-center gap-2">
                    <nav className='h-4 w-4 aspect-square bg-rose-500 rounded'></nav>
                    <nav className='text-gray-700 font-medium min-w-max text-sm truncate'>Out of Stock</nav>
                </nav>
            </div>
            <div className="px-5 py-2 pb-3 border-b ">
                <div className='flex items-center h-10 w-full rounded-lg overflow-hidden'>
                    <nav className=' h-full w-[50%] bg-green-500'></nav>
                    <nav className=' h-full w-[25%] bg-yellow-500'></nav>
                    <nav className=' h-full w-[25%] bg-rose-500'></nav>
                </div>
            </div>

            <div className='px-5 mt-3'>
                <h7 className="text-sm text-gray-500">Low Stock</h7>
                <ul className=' mt-3 space-y-2 '>
                    <li className='flex items-center gap-1'>
                        <span className='inline-block h-3 rounded mr-1 w-1 bg-yellow-500'>
                        </span>
                        <nav className='grow flex items-center justify-between'>
                            <nav className='flex items-end gap-1'>
                                <span className=' text-gray-700 text-sm'>Product Name</span>
                                <span className='text-xs text-gray-500'>Model Name</span>
                            </nav>
                            <nav className='text-sm'>
                                32 crates 3 model
                            </nav>
                        </nav>
                    </li>
                    <li className='flex items-center gap-1'>
                        <span className='inline-block h-3 rounded mr-1 w-1 bg-yellow-500'>
                        </span>
                        <nav className='grow flex items-center justify-between'>
                            <nav className='flex items-end gap-1'>
                                <span className=' text-gray-700 text-sm'>Product Name</span>
                                <span className='text-xs text-gray-500'>Model Name</span>
                            </nav>
                            <nav className='text-sm'>
                                32 crates 3 model
                            </nav>
                        </nav>
                    </li>
                    <li className='flex items-center gap-1'>
                        <span className='inline-block h-3 rounded mr-1 w-1 bg-yellow-500'>
                        </span>
                        <nav className='grow flex items-center justify-between'>
                            <nav className='flex items-end gap-1'>
                                <span className=' text-gray-700 text-sm'>Product Name</span>
                                <span className='text-xs text-gray-500'>Model Name</span>
                            </nav>
                            <nav className='text-sm'>
                                32 crates 3 model
                            </nav>
                        </nav>
                    </li>
          
                </ul>
            </div>
            <div className='px-5 mt-5'>
                <h7 className="text-sm text-gray-500">Out Of Stock</h7>
                <ul className=' mt-3 space-y-2 '>
                    <li className='flex items-center gap-1'>
                        <span className='inline-block h-3 rounded mr-1 w-1 bg-red-500'>
                        </span>
                        <nav className='grow flex items-center justify-between'>
                            <nav className='flex items-end gap-1'>
                                <span className=' text-gray-700 text-sm'>Product Name</span>
                                <span className='text-xs text-gray-500'>Model Name</span>
                            </nav>
                            <nav className='text-sm'>
                                32 crates 3 model
                            </nav>
                        </nav>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default StockAvailability