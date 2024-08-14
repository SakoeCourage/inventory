import React from 'react'
import IconifyIcon from '../../../components/ui/IconifyIcon';

/**
 * 
 * @param {{ 
 *  icon?: string,
 *  onClick: ()=>void,
 *  active:boolean,
 *  className?: string,
 *  label: string | React.ReactNode
 *  }} props 
 * @returns 
 */
function NewStockTab(props) {
    const { icon, onClick, active, className, label } = props;
    return (
        <button onClick={onClick} className={`flex items-center gap-1 py-2 px-3 pb-3 text-xs font-medium ${className} ${active ? ' border-b border-green-900 bg-green-50/50 text-green-600 ' : '!text-gray-500'}`}>
            <IconifyIcon className='text-inherit !h-4 !w-4 !p-0' icon={icon} />
            <span className=''>  {label}</span>
        </button>
    )
}

export default NewStockTab