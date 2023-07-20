
import React, { useEffect } from 'react'

import Productcollection from '@/components/Productcollection'
function Productreporttable(props) {
    const { basic_quantity, data, date_range, product_name, models
    } = props.reportData
    
    return <div className=''>
        <nav className='text-center py-2 border-b-2 border-black'>
            <nav>
                <span className='text-gray-500'>Product:</span>
                <span className="uppercase">{product_name}</span>
            </nav>
            <nav className='text-gray-500'>
                <span>
                    Sale Quantity &nbsp;
                </span>
                <span>
                    {`${props.start} to ${props.end}`}
                </span>
            </nav>
        </nav>
        <table className="report-table min-w-full">
            <thead>
                <tr className="uppercase">
                    <th>
                        DATE
                    </th>
                    {models.map((model, i) => <th key={i}> {model + '(QTY)'} </th>)}
                    <th>
                        NET QUANTITY
                    </th>
                </tr>
            </thead>
            <tbody>
                {Object.values(data).map((dt, i) => {
                    return (
                        <tr key={i} className='py-2'>
                            <td>{dt['DATE']}</td>
                            {models.map((model, i) => {
                                return (<td key={i}>
                                    <Productcollection
                                        in_collections={dt[String(model).toUpperCase()]['in_collection']}
                                        collection_type={dt[String(model).toUpperCase()]['collection_method']}
                                        units_per_collection={dt[String(model).toUpperCase()]['quantity_per_collection']}
                                        quantity={dt[String(model).toUpperCase()]['quantity']}
                                        basic_quantity={basic_quantity}
                                    />
                                </td>)
                            })}
                            <td>
                                <Productcollection
                                    in_collections={false}
                                    collection_type={null}
                                    units_per_collection={null}
                                    quantity={dt["DAY TOTAL"] ?? 0}
                                    basic_quantity={basic_quantity}
                                />
                            </td>
                        </ tr >
                    )
                })}
            </tbody>
     
        </table>
    </div>
}

export default Productreporttable