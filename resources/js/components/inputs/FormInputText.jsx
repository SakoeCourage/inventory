import React from 'react'
import TextField from '@mui/material/TextField'

const FormInputText = ({label, name, type, onChange, variant, value, onClick, ...props }) => {
  return (
    <TextField
          // id="outlined-basic"
          inputProps={props?.inputProps}
          label={label}
          type={type}
          name={name}
          onChange = {onChange}
          variant={variant || 'outlined'}
          value={value}
          onClick={onClick}
          size="medium"
          
          {...props}
        />
  )
}

export default FormInputText
