import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useMethodStore, useUIStore } from '../hooks';

export const MethodField = ({methodId, onInputChange}) => {

    const {methods} = useMethodStore();
    const {openMethodModal} = useUIStore();
    return (
    <Box display={'flex'} sx={{justifyContent:'space-between'}} width={"100%"}>
        <FormControl id='method-field' fullWidth sx={{marginBottom:"10px"}}>
            <InputLabel id="method-label">Metodo</InputLabel>
            <Select id='method-label' label='Metodo' name='methodId' value={methodId} onChange={onInputChange}>
                {methods.map((method) => (
                    <MenuItem sx={{backgroundColor: method.color || 'white'}} key={method.id} value={method.id}>
                        {(method.name) ? method.name : method.type[0].toUpperCase() + method.type.slice(1)} 
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <Box sx={{marginX:'20px'}}>
            <Button variant='outlined' onClick={openMethodModal}>Agregar Método</Button>
        </Box>
    </Box> 
  )
}
