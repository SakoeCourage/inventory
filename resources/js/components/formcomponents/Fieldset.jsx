import React from 'react'

function Fieldset(props) {
  return (
    <fieldset className={`border border-gray-300 rounded-sm p-5 ${props.className}`}>
        <legend>{props.legend ?? ''}</legend>
        {props.children}
    </fieldset>
  )
}

export default Fieldset