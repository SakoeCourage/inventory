import React from 'react'
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const FormInputTime = (props) => {
    const {label, value, onChange, required, name} = props
    const convertToDefEventPara = (name, value) => ({
        target: {name, value}
      })
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                label={label}
                name={name}
                value={value}
                onChange={ val => onChange(convertToDefEventPara(name,val))}
                renderInput={(params) => <TextField required={required} {...params} />}
            />
        </LocalizationProvider>
    )
}

export default FormInputTime
