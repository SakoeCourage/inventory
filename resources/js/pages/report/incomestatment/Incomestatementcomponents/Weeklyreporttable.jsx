import React, { useEffect } from 'react'
import { formatcurrency } from '../../../../api/Util';

function Weeklyreporttable({ reportData }) {
  
    const { weeklyexpenses, weeklysaleincome,title } = reportData;
    const { accountReceivable, allPaidInvoicesByWeek,  weeklyCulmulatedTotal: saleCumulatedTotal, totalSale, totalRecievable,leaseSale,leaseTotal } = weeklysaleincome
    const { allApprovedExpenses, weeklyCulmulatedTotal: expenseCumulatedTotal, totalExpenses } = weeklyexpenses

    return (
        <div className=' w-full'>
            <table className=' report-table min-w-full'>
                <thead>
                    <tr className='text-center !py-4 border-b-2 bg-gray-600 text-white  border-black '>
                        <th>
                            ITEMS / WEEK (1-4)
                        </th>
                        <th>
                            WEEK 1
                        </th>
                        <th>
                            WEEK 2
                        </th>
                        <th>
                            WEEK 3
                        </th>
                        <th>
                            WEEK 4
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr className='bg-gray-200 border-t border-black !py-4'>
                        <td colSpan={5}>SALES</td>
                    </tr>
                    {
                        Object.entries(allPaidInvoicesByWeek).map((entry, i) => {
                            return (<tr key={i} className=' !py-4'>
                                <td>{`SALE OF ${entry[0]}`}</td>
                                <td>{formatcurrency(entry[1][1] ?? 0)}</td>
                                <td>{formatcurrency(entry[1][2] ?? 0)}</td>
                                <td>{formatcurrency(entry[1][3] ?? 0)}</td>
                                <td>{formatcurrency(entry[1][4] ?? 0)}</td>
                            </tr>)
                        })

                    }



                    <tr className='    !py-4 border-y border-black'>
                        <td>TOTAL SALE</td>
                        <td>{formatcurrency(saleCumulatedTotal[1] ?? 0)}</td>
                        <td>{formatcurrency(saleCumulatedTotal[2] ?? 0)}</td>
                        <td>{formatcurrency(saleCumulatedTotal[3] ?? 0)}</td>
                        <td>{formatcurrency(saleCumulatedTotal[4] ?? 0)}</td>
                    </tr>

                    <tr className=' bg-gray-200 !py-4'>
                        <td colSpan={5}>LIABILITY</td>
                    </tr>
             
                    <tr className='    !py-4 border-y border-black'>
                        <td>CREDIT SALE</td>
                        <td>{formatcurrency(leaseSale[1] ?? 0)}</td>
                        <td>{formatcurrency(leaseSale[2] ?? 0)}</td>
                        <td>{formatcurrency(leaseSale[3] ?? 0)}</td>
                        <td>{formatcurrency(leaseSale[4] ?? 0)}</td>
                    </tr>

                    <tr className=' bg-gray-200 !py-4'>
                        <td colSpan={5}>EXPENSES</td>
                    </tr>
                    {
                        Object.entries(allApprovedExpenses).map((entry, i) => {
                            return (<tr key={i} className=' !py-4'>
                                <td className=' uppercase'>{` ${entry[0]}`}</td>
                                <td>{formatcurrency(entry[1][1] ?? 0)}</td>
                                <td>{formatcurrency(entry[1][2] ?? 0)}</td>
                                <td>{formatcurrency(entry[1][3] ?? 0)}</td>
                                <td>{formatcurrency(entry[1][4] ?? 0)}</td>
                            </tr>)
                        })

                    }
                    <tr className='    !py-4 border-y border-black'>
                        <td>TOTAL EXPENSES</td>
                        <td>{formatcurrency(expenseCumulatedTotal[1] ?? 0)}</td>
                        <td>{formatcurrency(expenseCumulatedTotal[2] ?? 0)}</td>
                        <td>{formatcurrency(expenseCumulatedTotal[3] ?? 0)}</td>
                        <td>{formatcurrency(expenseCumulatedTotal[4] ?? 0)}</td>
                    </tr>

                    <tr className=' bg-gray-200  !py-4'>
                        <td colSpan={5}>ASSETS</td>
                    </tr>
                    <tr className='    !py-4 border-b border-black'>
                        <td>ACCOUNT RECEIVABLE</td>
                        <td>{formatcurrency(accountReceivable[1] ?? 0)}</td>
                        <td>{formatcurrency(accountReceivable[2] ?? 0)}</td>
                        <td>{formatcurrency(accountReceivable[3] ?? 0)}</td>
                        <td>{formatcurrency(accountReceivable[4] ?? 0)}</td>
                    </tr>
                </tbody>
            </table>

            <div className=' flex items-center justify-end my-5 font-mono text-gray-600 text-sm '>
                <div className="rounded-md grid grid-cols-1 border border-black p-2">
                    <nav className=' px-2 bg-gray-200 font-semibold '>MONTH SUMMARY</nav>
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
                            LIABIITY
                        </span>
                        <span>
                            {formatcurrency(leaseTotal ?? 0)}
                        </span>
                    </nav>
                </div>
            </div>

        </div>
    )
}

export default Weeklyreporttable