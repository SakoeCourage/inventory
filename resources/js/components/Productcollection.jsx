import React from 'react'
import { formatnumber } from '../api/Util'

function Productcollection(props) {

    return (
        <nav>
            {Boolean(props.in_collections )? <nav
                className='flex items-center gap-1'>{formatnumber(Math.floor(Number(props.quantity) / Number(props.units_per_collection ?? 1)))}
                <span className="text-xs ">{props.collection_type + '(s)' ?? 'collection'}</span> &nbsp;
                <span className="inline ">{Number(props.quantity) % Number(props.units_per_collection ?? 1)}
                    <span className="text-xs mx-1 ">{props.basic_quantity? props.basic_quantity+'(s)' : 'units'}</span></span> </nav>:
             <span>
                {formatnumber(props.quantity)} {props.basic_quantity? props.basic_quantity+'(s)' : 'units'}
             </span>        
            }
        </nav>

    )
}

export default Productcollection