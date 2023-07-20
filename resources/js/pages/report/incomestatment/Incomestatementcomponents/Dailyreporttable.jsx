import React from 'react'
import { formatcurrency } from '../../../../api/Util';
function Dailyreporttable({ reportData }) {
    const { dailyexpenses, dailysaleincome, title } = reportData;
    const { accountReceivable, paidSaleInvoicesByDayWithProducts, dailyCumulatedTotal: saleCumulatedTotal, totalSale, totalRecievable, dateRange } = dailysaleincome
    const { allApprovedExpenses, dailyCumulatedTotal: expenseCumulatedTotal, totalExpenses } = dailyexpenses
    return (
        <div className=' w-full'>
            <table className=' report-table min-w-full'>
                <thead>
                    <tr className='text-center !py-4 border-b-2 bg-gray-600 text-white  border-black '>
                        <th>
                            ITEMS / DAYS
                        </th>
                        {dateRange.map((date, i) => {
                            return (
                                <th key={i}>
                                    {date}
                                </th>
                            )
                        })}
                    </tr>
                </thead>

                <tbody>
                    <tr className='bg-gray-200 border-t border-black !py-4'>
                        <td colSpan={8}>SALES</td>
                    </tr>
                    {
                        Object.entries(paidSaleInvoicesByDayWithProducts).map((entry, i) => {
                            return (<tr key={i} className=' !py-4'>
                                <td>{`SALE OF ${entry[0]}`}</td>
                                {dateRange.map((date, i) => {
                                    return (<td>{formatcurrency(entry[1][`${date}`] ?? 0)}</td>)
                                })}
                            </tr>)
                        })

                    }
                    <tr className='    !py-4 border-y border-black'>
                        <td>TOTAL INCOME</td>
                        {dateRange.map((date, i) => {
                            return (<td>{formatcurrency(saleCumulatedTotal[`${date}`] ?? 0)}</td>)
                        })}
                    </tr>

                    <tr className=' bg-gray-200 !py-4'>
                        <td colSpan={8}>EXPENSES</td>
                    </tr>
                    {
                        Object.entries(allApprovedExpenses).map((entry, i) => {
                            return (<tr key={i} className=' !py-4'>
                                <td>{`${entry[0]}`}</td>
                                {dateRange.map((date, i) => {
                                    return (<td>{formatcurrency(entry[1][`${date}`] ?? 0)}</td>)
                                })}
                            </tr>)
                        })
                    }
                
                    <tr className='    !py-4 border-y border-black'>
                        <td>TOTAL EXPENSES</td>
                        {dateRange.map((date, i) => {
                            return (<td>{formatcurrency(expenseCumulatedTotal[`${date}`] ?? 0)}</td>)
                        })}
                    </tr>

                    <tr className=' bg-gray-200  !py-4'>
                        <td colSpan={8}>ASSETS</td>
                    </tr>
                    <tr className='    !py-4 border-b border-black'>
                        <td>ACCOUNT RECEIVABLE</td>
                        {dateRange.map((date, i) => {
                            return (<td>{formatcurrency(accountReceivable[`${date}`] ?? 0)}</td>)
                        })}
                    </tr>
                </tbody>
            </table>
            
            <div className=' flex items-center justify-end my-5 font-mono text-gray-600 text-sm '>
                <div className="rounded-md grid grid-cols-1 border border-black p-2">
                    <nav className=' px-2 bg-gray-200 font-semibold '>WEEK SUMMARY</nav>
                    <nav className=' flex gap-5 justify-between px-2 border-b border-black'>
                        <span>
                            ACCOUNT RECEIVABLE
                        </span>
                        <span>
                            {formatcurrency(totalRecievable ?? 0)}
                        </span>
                    </nav>
                    <nav className=' flex gap-5 justify-between px-2 border-b border-black'>
                        <span>
                            EXPENSES
                        </span>
                        <span>
                            {formatcurrency(totalExpenses ?? 0)}
                        </span>
                    </nav>
                    <nav className=' flex gap-5 justify-between px-2 border-b '>
                        <span>
                            INCOME
                        </span>
                        <span>
                            {formatcurrency(totalSale ?? 0)}
                        </span>
                    </nav>
                </div>
            </div>

        </div>
    )
}

export default Dailyreporttable