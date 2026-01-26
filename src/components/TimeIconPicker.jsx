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
import { useEffect } from 'react';
import { PickersLayout, renderTimeViewClock, TimePicker } from '@mui/x-date-pickers';
import { Box, ButtonBase, FormControlLabel, IconButton, styled, Switch, Typography } from '@mui/material';
import { useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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

let handleRef = null;

const clocker = (props) => {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  
  return (
    <IconButton 
      {...forwardedProps}
      ref={handleRef} 
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      <AccessTimeIcon/>
    </IconButton>
  )
}

function CustomLayout(props) {
  
  return (
    <div>
      <div style={{ padding: 8, fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
        Hora {props.slotProps?.popper.title}
      </div>
      <PickersLayout {...props} />
    </div>
  );
}


function IconHourPicker(props) {   
    
    const commonSlotProps = {
        field: {
            ...(props.slotProps?.field || {}),
            horariohandler: props.horariohandler,
            label: props.label,
            ref: handleRef
        },
        popper: {placement: 'bottom',title: props.poppertitle},
    
    };
    
    return (
        <>
            {/* Visible field -> primer desplegable */}
            <TimePicker
                {...props}
                slots={{ ...props.slots, field: clocker,layout: CustomLayout}}
                slotProps={commonSlotProps}
                onAccept={(e) => props.handler(e)}
                ampm={false}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
            />
        </>
    );
}

export default function TimeIconPicker(propsDates) {
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <IconHourPicker {...propsDates}/>
    </LocalizationProvider>
  );
}