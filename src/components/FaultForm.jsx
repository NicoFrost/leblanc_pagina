import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react'
import { useForm } from '../hooks/useForm';
import { useEmployeesStore, useFaultsStore, useUIStore } from '../hooks';

const initialForm = {
    employeeId: '',
    date: null,
    hours: '',
    reason: ''
}
export const FaultForm = ({onClose = () => {}}) => {

    const {formState,onInputChange,onResetForm} = useForm(initialForm);
    const {employees} = useEmployeesStore();
    const {startSavingFault} = useFaultsStore();

    const [employeesList, setEmployeesList] = useState([]);

    const onSubmit = (e) => { 
        e.preventDefault();
        
        startSavingFault(formState);
        onClose();
        onResetForm();
    }
    
    useEffect(() => {
        // Initialize the form with employee data
        setEmployeesList(employees || []);
         
    }, [employees]);

    return (
        <Box component={"form"} onSubmit={onSubmit} paddingX={5} display={"flex"} flexDirection={"column"} gap={2}>
            {/* FORM WITH 1 employee selector, 1 date picker, 1 text field for hours, 1 text field for reason */}
            <Typography variant='h4' textAlign={'center'}>Ausencias</Typography>
            <Divider variant='fullWidth'/>
            <FormControl fullWidth size='small'>
                <InputLabel id="empleado-label-fault">Empleado</InputLabel>
                <Select
                    labelId="empleado-label-fault"
                    id="empleado-select-fault"
                    label="Empleado"
                    name='employeeId'
                    value={formState.employeeId ?? ''}
                    onChange={(e) => onInputChange(e)}
                >
                    {
                        employeesList.length > 0 ? (
                            employeesList.map(element => (
                                <MenuItem key={element.id} value={element.id}>{element.name}</MenuItem>
                            ))
                        ) : (
                            <MenuItem value="" disabled>No hay empleados disponibles</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
            <Box display={"flex"} flexDirection={"row"} gap={1}>
                <Typography margin={"auto"} variant='body1'>Fecha:</Typography>
                <DatePicker
                    sx={{".MuiPickersInputBase-root": { height: "40px" }}}
                    name='date'
                    value={formState.date}
                    onChange={(date) => onInputChange({ target: {name: 'date', value: date }})}
                />
            </Box>
            <TextField
                size='small'
                name='hours'
                label='Horas'
                type='number'
                value={formState.hours}
                onChange={(e) => {(e.target.value > 0 || e.target.value === '') && onInputChange(e)}}
            />
            <TextField
                size='small'
                name='reason'
                label='Motivo'
                value={formState.reason}
                onChange={(e) => onInputChange(e)}
                
            />
            <Button variant='contained' type='submit' color='primary'>Enviar</Button>
        </Box>
    )
}
