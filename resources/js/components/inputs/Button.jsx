import React from 'react'
import Loadingspinner from '../Loaders/Loadingspinner'

const Button = (props) => {
  const { onClick, text, className,otherClasses, type, danger, success, primary, alert, info, disabled, ghost,neutral,processing } = props
  return (
    <button type={type} disabled={disabled || processing}
      className={`btn  border-none rounded-[5px] ${otherClasses} ${className}
        ${danger && 'bg-red-600 hover:bg-red-800'}
        ${success && 'bg-green-600 hover:bg-green-800'}
        ${primary && 'bg-primary-600 hover:bg-primary-800'}
        ${info && 'bg-info-600 hover:bg-info-800'}
        ${alert && 'bg-orange-600 hover:bg-orange-800' }
        ${neutral && ' bg-transparent !ring-1 !ring-zinc-300 text-blue-950 hover:text-white' }
        ${ghost && "btn-ghost"}
      `}
      onClick={onClick}
    >
      <span>{!processing &&<span>{text || props.children}</span> }{processing && <Loadingspinner/>}</span>
    </button>
  )
}

export default Button
