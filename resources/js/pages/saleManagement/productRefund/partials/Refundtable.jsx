import React, { useEffect } from 'react'
import Refundlinerow from './Refundlinerow'
function Refundtable({ lineitems, SetLineitems,setMaxDiscount }) {
  
    
    return <table className=' w-full'>
        <thead className=' bg-slate-200/30'>
            <tr className=' border-y'>
                <th className='px-6 py-3 text-left rtl:text-right  whitespace-nowrap !font-normal'>Product</th>
                <th className='px-6 py-3 text-left rtl:text-right  whitespace-nowrap !font-normal'>Qty</th>
                <th className='px-6 py-3 text-left rtl:text-right  whitespace-nowrap !font-normal'>Qty to refund</th>
                <th className='px-6 py-3 rtl:text-right  whitespace-nowrap !font-normal text-center'>Return to Stock</th>
                <th className='px-6 py-3 text-left rtl:text-right  whitespace-nowrap !font-normal'>Row Total</th>
            </tr>
        </thead>
        <tbody>
            {Boolean(lineitems.length) && lineitems.map((item, i) => {
                return (<Refundlinerow items={lineitems} line_item={item} key={i} index={i} SetLineitems={SetLineitems} />)
            })}
        </tbody>
    </table>
}


export default Refundtable