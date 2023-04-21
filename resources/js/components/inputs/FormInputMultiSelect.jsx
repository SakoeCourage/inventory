import {useState} from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useEffect } from 'react';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

;

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
const FormInputMultiSelect = (props) => {
    const {label, options, selectedData} = props
    const theme = useTheme();
    const [selectedOptions, setSelectedOptions] = useState([]);
    
  
    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setSelectedOptions(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };

    useEffect(() => {
        // i can decide to send the entire object or the value
        // selectedData(selectedOptions)
        let data = []
        selectedOptions.map((e) => {
            
            return(
                data.push(e.value)
            )
        })
       selectedData(data)
    },[selectedOptions])
  
    return (
      <div>
        <FormControl fullWidth>
          <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={selectedOptions}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value,i) => (
                  <Chip key={i} label={value.name} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {options.map((option, i) => (
              <MenuItem
                key={i}
                value={option}
                style={getStyles(option.value, selectedOptions, theme)}
              >
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
  )
}

export default FormInputMultiSelect
