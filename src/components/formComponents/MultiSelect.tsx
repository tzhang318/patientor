import { useEffect, useState } from 'react';
import { useField } from 'react-final-form';
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Chip,
  OutlinedInput,
  Box,
  // useTheme,
  SelectChangeEvent
} from '@mui/material';

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

type MultiSelectProps = {
  menuItems: string[],
  label: string,
  field: string
};

export const MultiSelect = (props: MultiSelectProps) => {
  // const theme = useTheme();
  const inputProps = useField(props.field);
  const [menuItem, setMenuItem] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof menuItem>) => {
    const {
      target: { value },
    } = event;
    setMenuItem(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    if (menuItem.length > 0) {
      inputProps.input.onChange(menuItem);
    }
  }, [menuItem]);

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-multiple-chip-label">{props.label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={menuItem}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={props.label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {props.menuItems.map((item) => (
            <MenuItem
              key={item}
              value={item}
            >
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
