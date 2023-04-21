import { useState, useEffect } from 'react'
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
import { Autocomplete, TextField } from '@mui/material';
// import {IconButton} from '@mui/material';    
// import { Icon } from '@iconify/react';

// import Select from '@mui/material/Select';
// import Select from 'react-select'

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

const FormInputSelect = ({ label, value, options, required, onChange, name, onClick, size, ...props }) => {
  const [receivedValue, setReceivedValue] = useState(null)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (value) {
      // console.log(value)
      options.map((r) => {
        // console.log(value, r.value)
        if (value == r.value) {
          let d = {
            value: r.value,
            name: r.name
          }
          setReceivedValue(d)
          setInputValue(r.name)
        }
      })
    } else {
      setReceivedValue(null)
      setInputValue('')
    }
  }, [value, options])



  const convertToDefEventPara = (name, value) => {
    return ({ target: { name, value } })
  }
  const isOptionEqualToValue = (option, receivedValue) => {
    return option.value == receivedValue.value;
  };

  return (
    <Autocomplete
      options={options}
      groupBy={(option) => option.firstLetter}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={isOptionEqualToValue}
      required={required}
      name={name}
      size={size}
      value={receivedValue}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      // clearText="go"
      // onClose={() => alert('hi')}
      {...props}
      onChange={(e, value) => onChange(convertToDefEventPara(name, value.value))}
      renderInput={(params) => <TextField {...props} required={required} {...params} label={label} variant="outlined"

        // InputProps={{
        //   ...params.InputProps,
        //   endAdornment: (
        //     <>
        //       {inputValue && ( // only show the clear button if there is a value
        //         <button className='hover:bg-gray-100 rounded-full w-7 h-7'>
        //           <Icon icon="material-symbols:close-rounded" fontSize={15}/>
        //         </button>
        //       )}
        //       {params.InputProps.endAdornment}
        //     </>
        //   ),
        // }}
      />}
    />
  )
}

export default FormInputSelect
