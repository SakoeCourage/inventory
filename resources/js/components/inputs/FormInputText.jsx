import React from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
const FormInputText = ({ label, name, type, onChange, variant, value, onClick, Adorm,className, ...props }) => {
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
