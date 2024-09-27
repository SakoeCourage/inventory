import React from 'react'
import classNames from 'classnames'

/**
 * @typedef {Object} TableInitialsProps
 * @property {string | React.ReactNode} address
 * @property {string } name
 * @property {React.HTMLAttributes<HTMLDivElement> & React.DOMAttributes<HTMLDivElement>} [rest]
 */

/**
 * @param {TableInitialsProps} props
 */

export function getInitials(name) {
    const parts = name?.split(' ');
  
    if (parts.length === 1) {
      return parts[0][0];
    }
  
    return parts[0][0] + (parts[1][0] ?? "");
  }

function TableInitials({ address, name, className, ...rest }) {
  return (
    <div
      {...rest}
      className={classNames({
        'flex rounded-md items-center gap-2 w-full ': true,
        [className]: true,
      })}
    >
      <nav className="overflow-hidden h-12 w-12 shadow text-primary font-medium rounded-full bg-info-500/10 p-1 aspect-square uppercase flex items-center justify-center gap-1">
        {getInitials(name)}
      </nav>
      <nav className="flex grow flex-col text-sm">
        <h1 className="font-medium text-gray-500 text-sm capitalize">{name}</h1>
        <h1 className="font-thin text-xs truncate">{address}</h1>
      </nav>
    </div>
  )
}

export default TableInitials
