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

import 'dayjs/locale/es'          // importa la locale
import localizedFormat from 'dayjs/plugin/localizedFormat'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(localizedFormat)
dayjs.extend(localeData)

// establece español globalmente
dayjs.locale('es')


function ButtonDateField(props) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);
  
  useEffect(() => {
        
  }, [valueStr])
  
  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      color={hasValidationError ? 'error' : 'buttons'}
      ref={handleRef}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ? `${pickerContext.label}: ${valueStr}` : valueStr}
    </Button>
  );
}


function ButtonFieldDatePicker(props) {  
  return (
    <DatePicker 
      {...props} 
      slots={{ ...props.slots, field: ButtonDateField }} 
      slotProps={{
        popper: {
          placement: 'bottom-end',
          modifiers: [
            {
              name: 'inset',
              options: { offset: [0, 4] },
            },
          ],
        },
      }}
    />
  );
}

export default function MaterialDatePicker(propsDates) {
  return (
    <ButtonFieldDatePicker {...propsDates}/>
  );
}