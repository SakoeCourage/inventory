import React, { useEffect } from 'react'
import { formatnumber } from '../api/Util'

function Productcollection({in_collections,collection_type,quantity,units_per_collection,basic_quantity}) {

    
    return (
        <nav>
            {Boolean(in_collections )? <nav
                className='flex items-center gap-1'>{formatnumber(Math.floor(Number(quantity) / Number(units_per_collection ?? 1)))}
                <span className="text-xs ">{collection_type + '(s)' ?? 'collection'}</span> &nbsp;
                <span className="inline ">{Number(quantity) % Number(units_per_collection ?? 1)}
                    <span className="text-xs mx-1 ">{basic_quantity? basic_quantity+'(s)' : 'units'}</span></span> </nav>:
             <span>
                {formatnumber(quantity)} {basic_quantity? basic_quantity+'(s)' : 'units'}
             </span>        
            }
        </nav>

    )
}

export default Productcollection