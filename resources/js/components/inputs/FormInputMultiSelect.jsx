import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import { InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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

function getStyles(value, selectedValues = [], theme) {
  return {
    fontWeight:
      selectedValues && selectedValues.indexOf(value) !== -1
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
  };
}

const MultipleSelect = ({ label, options, selectedOptions, setSelectedOptions, ...rest }) => {
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedOptions(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl fullWidth  sx={{ m: 1 }}>
      <InputLabel id="multiple-select-label">{label}</InputLabel>
      <Select 
        {...rest}
        labelId="multiple-select-label"
        id="multiple-select"
        multiple
        value={selectedOptions}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        MenuProps={MenuProps}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            style={getStyles(option.value, selectedOptions, theme)}
          >
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultipleSelect;
