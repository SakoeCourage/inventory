import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

function FormInputDate({label, value, onChange,views, minDate, maxDate, name,inputFormat, ...props}) {
    
  const convertToDefEventPara = (name, value) => ({
      target: {name, value}
    })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker 
            disableMaskedInput={true}
            {...props}
            name={name}
            label={label}
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            views={views ?? null}
            inputFormat={"DD MMM YYYY"}
            onChange={ date => onChange(convertToDefEventPara(name,date))}
            renderInput={(params) => <TextField {...props} {...params}/>}
        />

  </LocalizationProvider>
  )
}

export default FormInputDate
