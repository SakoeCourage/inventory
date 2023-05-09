import React from 'react'
import { Icon } from '@iconify/react'
import { Tooltip } from '@mui/material'
function Refundinfo({ className, info,item }) {
    return (
        <nav className={`inline ${className}`}>
            <Tooltip title={item ? 'Some items were refunded': 'Sale have some  products refunded'}>
                <Icon fontSize={20} className=' text-red-400' icon="clarity:info-line" />
            </Tooltip>
        </nav>
    )
}

export default Refundinfo