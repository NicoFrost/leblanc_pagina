import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { TimePicker } from '@mui/x-date-pickers';
import { FormControlLabel, styled, Switch } from '@mui/material';
import { useState } from 'react';

import 'dayjs/locale/es'          // importa la locale
import localizedFormat from 'dayjs/plugin/localizedFormat'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(localizedFormat)
dayjs.extend(localeData)

// establece español globalmente
dayjs.locale('es')


const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        "white",
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        "white",
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

// ---- CUSTOM FIELD WITH SWITCH ----
function CheckBoxField({ label, horariohandler, value }) {
  useEffect(() => {
    if (value) horariohandler?.(value.format("HH:mm"));
  }, [value]);

  return (
    <FormControlLabel
      sx={{ color: "black", display: "flex", flexDirection: "column-reverse" }}
      control={<Android12Switch />}
      label={label}
    />
  );
}

// ---- MAIN PICKER COMPONENT ----
function IconHourPicker(props) {
  const [openSecond, setOpenSecond] = useState(false);
  const [firstValue, setFirstValue] = useState(null);
  const [secondValue, setSecondValue] = useState(null);

  return (
    <>
      {!openSecond ? (
        <TimePicker
          {...props}
          label="Primer horario"
          value={firstValue}
          onChange={(newVal) => setFirstValue(newVal)}
          onAccept={() => setOpenSecond(true)}
          renderInput={(params) => (
            <CheckBoxField
              {...params}
              label={props.label}
              value={firstValue}
              horariohandler={props.horariohandler}
            />
          )}
        />
      ) : (
        <TimePicker
          {...props}
          label="Segundo horario"
          value={secondValue}
          onChange={(newVal) => setSecondValue(newVal)}
          renderInput={(params) => (
            <CheckBoxField
              {...params}
              label="Segundo horario"
              value={secondValue}
              horariohandler={props.horariohandler}
            />
          )}
        />
      )}
    </>
  );
}

export default function MaterialHourPicker(propsDates) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <IconHourPicker {...propsDates}/>
    </LocalizationProvider>
  );
}