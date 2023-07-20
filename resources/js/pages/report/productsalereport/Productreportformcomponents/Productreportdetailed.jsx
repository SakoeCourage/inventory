import React,{useEffect} from 'react'
import Productreportdailysales from './Productreportdailysales'
import Productreporttable from './Productreporttable'
function Productreportdetailed(props) {
    const {date_created,end,start,grand_daily_sale,grand_discounted_amount,grand_net_sale,product_sale,sale_summary,title} = props.reportData
 
    return (
        <div>
            <Productreportdailysales reportData={props.reportData} />
            
            {Object.values(product_sale).map((data, i) => <div className={`mb-20 report-page ${i > 0 && 'report-page-break print:break-before-page'}`} key={i} >
                    <Productreporttable start={start} end={end} reportData={data} />
            </div>)}
        </div>
    )
}

export default Productreportdetailed