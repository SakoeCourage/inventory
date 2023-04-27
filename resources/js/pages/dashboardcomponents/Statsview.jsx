import React from 'react'
import { Icon } from '@iconify/react'
import { formatMaximumValue } from '../stockManagement/partials/Productstockhistory'
import { formatcurrency, formatnumber } from '../../api/Util'
function Statsview({ dashboardData }) {
    return (
        <div className=' bg-info-600 p-6 '>
            <nav className=' max-w-[90rem] mx-auto grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:px-6 '>
                <nav className='flex item-center gap-3 p-5 ring-1 ring-offset-2 ring-offset-info-200 ring-white bg-white rounded-md '>
                    <nav className='flex items-center justify-center w-14 h-14 my-auto rounded-md shadow-md text-blue-700  p-5 bg-blue-200 '>
                        <Icon icon="mingcute:shopping-bag-2-fill" />
                    </nav >
                    <nav className='flex flex-col my-auto gap-1 px-1'>
                        <nav className='text-muted text-sm flex items-center gap-3 justify-between'>
                            <span>
                                Today's sales
                            </span>
                            {dashboardData?.daliy_sale_stats?.relative_percentage && <span className='text-green-600  p-1 rounded-full text-xs w-8 h-8 grid place-items-center whitespace-nowrap' > +{dashboardData?.daliy_sale_stats?.relative_percentage} %</span>}
                        </nav>
                        <nav className='text-slate-700 font-bold  '>{formatcurrency(dashboardData ? dashboardData?.daliy_sale_stats?.daily_sale : 0)}</nav>
                    </nav>
                </nav>
                <nav className='flex item-center gap-3 p-5 ring-1 ring-offset-2 ring-offset-info-200 ring-white bg-white rounded-md '>
                    <nav className='flex items-center justify-center w-14 h-14 my-auto   rounded-md shadow-md text-pink-700  p-5 bg-pink-200 '>
                        <Icon icon="fa6-solid:money-check-dollar" />
                    </nav >
                    <nav className='flex flex-col my-auto gap-1 px-1'>
                        <nav className='text-muted text-sm flex items-center gap-3 justify-between'>
                            <span>
                                Today's revenue
                            </span>
                            {/* <span className='text-white bg-red-500   p-1 rounded-full text-xs w-6 h-6 grid place-items-center ' >{formatMaximumValue(100)}</span> */}
                        </nav>
                        <nav className='text-slate-700 font-bold  '>{formatcurrency(dashboardData ? dashboardData?.daily_revenue : 0)}</nav>
                    </nav>
                </nav>
                <nav className='flex item-center gap-3 p-5 ring-1 ring-offset-2 ring-offset-info-200 ring-white bg-white rounded-md '>
                    <nav className='flex items-center justify-center w-14 h-14 my-auto   rounded-md shadow-md text-red-700  p-5 bg-red-200 '>
                        <Icon icon="fa6-solid:arrow-trend-up" />
                    </nav >
                    <nav className='flex flex-col my-auto gap-1 px-1'>
                        <nav className='text-muted text-sm flex items-center gap-3 justify-between'>
                            <span>
                                Products cycle
                            </span>
                        </nav>
                        <nav className='text-slate-700 font-bold flex items-center justify-between w-full  '>
                            <nav className=' pr-2 flex items-center '>
                                <nav className='  font-normal rounded-full text-green-700 h-8 w-8 text-xs grid place-items-center'>In</nav>
                                {formatnumber(dashboardData ? dashboardData?.products_cycle?.product_in : 0)}
                            </nav>
                            <nav className=' pl-2 flex items-center  border-l '>
                                <nav className='  font-normal rounded-full text-red-700 h-8 w-8 text-xs grid place-items-center'>Out</nav>
                                {formatnumber(dashboardData ? dashboardData?.products_cycle?.product_out : 0)}
                            </nav>

                        </nav>
                    </nav>
                </nav>
                <nav className='flex item-center gap-3 p-5 ring-1 ring-offset-2 ring-offset-info-200 ring-white bg-white rounded-md '>
                    <nav className='flex items-center justify-center w-14 h-14 my-auto   rounded-md shadow-md text-green-700  p-5 bg-green-200 '>
                        <Icon icon="streamline:money-cashier-tag-codes-tags-tag-product-label" />
                    </nav >
                    <nav className='flex flex-col justify-between'>
                        <nav className='text-muted text-sm flex items-center justify-between w-full gap-3 '>
                            <span>
                                Products
                            </span>
                            <nav className=' relative p-1 rounded-md grow-1 border-l pl-2 '>
                                stock value: <span className="font-bold">
                                {formatcurrency(dashboardData ? dashboardData?.products_value?.current_stock_value : 0)}
                                </span>
                            </nav>
                        </nav>
                        <nav className='text-slate-700 font-bold  flex gap-3 '>
                            <nav>
                                {formatnumber(dashboardData ? dashboardData?.products_value?.products : 0)} <span className=' text-gray-300 text-xs tracking-1'>products</span>
                            </nav>
                            <nav>
                                {formatnumber(dashboardData ? dashboardData?.products_value?.models : 0)} <span className=' text-gray-300 text-xs tracking-1'>models</span>
                            </nav>

                        </nav>
                    </nav>
                </nav>
            </nav>

        </div>
    )
}

export default Statsview