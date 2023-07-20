
import React from 'react'
import { formatnumber } from '../../../../api/Util'
function Productreportdailysales(props) {
    const { sale_summary, start, end, grand_daily_sale, grand_discounted_amount
    } = props.reportData
    return <div className=''>
        <nav className='text-center py-2 border-b-2 border-black'>
            <nav>
                <span className='text-gray-500'> Daily sale amount to date on all products</span>
            </nav>
            <nav className='text-gray-500'>
                <span>
                   Sale from {`${start} to ${end}`}
                </span>
            </nav>
        </nav>
        <table className="report-table min-w-full">
            <thead>
                <tr className="uppercase">
                    <th>
                        DATE
                    </th>
                    <th>
                        GROSS SALE AMOUNT (GHS)
                    </th>
                    <th>
                        DISCOUNTED SALE AMOUNT (GHS)
                    </th>
                    <th>
                        DAILY SALE (GHS)
                    </th>
                </tr>
            </thead>
            <tbody>
                {Object.values(sale_summary).map((dt, i) => {
                    return (
                        <tr key={i} className='py-2'>
                            <td>{dt['DATE']}</td>
                            <td>{formatnumber(dt['SUB TOTAL'])}</td>
                            <td>{formatnumber(dt['DISCOUNTED AMOUNT'])}</td>
                            <td>{formatnumber(dt['DAILY SALE'])}</td>
                        </ tr >
                    )
                })}
            </tbody>
            <tfoot className='!mt-4'>
                <tr className=' bg-gray-700 text-white py-2'>
                    <td className=' whitespace-nowrap'>Grand Total</td>
                    <td></td>
                    <td>
                        {formatnumber(grand_discounted_amount)}
                    </td>
                    <td>
                        {formatnumber(grand_daily_sale)}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
}

export default Productreportdailysales