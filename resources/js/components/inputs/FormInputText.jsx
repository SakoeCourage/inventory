import React from 'react'
import TextField from '@mui/material/TextField'

const FormInputText = ({ label, name, type, onChange, variant, value, onClick, className, ...props }) => {
  return (
    <TextField
      // id="outlined-basic"
      className={className}
      inputProps={props?.inputProps}
      label={label}
      type={type}
      name={name}
      onChange={onChange}
      variant={variant || 'outlined'}
      value={value}
      onClick={onClick}
      size={props?.size ?? 'medium'}
      {...props}
    />
  )
}

export default FormInputText
