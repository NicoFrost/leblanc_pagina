import { Box, Button, FormControl, InputBase, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useMethodStore, useUIStore } from '../hooks';
import styled from '@emotion/styled';



export const MethodField = ({methodId, onInputChange}) => {

    const {methods} = useMethodStore();
    const {openMethodModal} = useUIStore();
    const {darkMode} = useUIStore();

    const BootstrapInput = styled(InputBase)(({ theme }) => ({
        'label + &': {
            color: 'white',
        },
        '& .MuiInputBase-input': {
            paddingTop: "4.5%",
            borderRadius: 4,
            position: 'relative',
            backgroundColor: (darkMode) ? 'grey' : '#fafafa',
            border: '1px solid #8e8e8e',
            fontSize: 16,
            // padding: '10px 26px 10px 12px',
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            '&:focus': {
                borderRadius: 4,
                borderColor: '#80bdff',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            },
        },
    }));

    return (
    <Box display={'flex'} sx={{justifyContent:'space-between'}} height={"56px"} width={"100%"}>
        <FormControl id='method-field' fullWidth sx={{marginBottom:"10px"}}>
            <InputLabel sx={{color: (darkMode) ? '#ffffff' : 'rgba(0, 0, 0, 0.6)',}} id="method-label">Metodo</InputLabel>
            <Select input={<BootstrapInput/>} id='method-label' label='Metodo' name='methodId' value={methodId} onChange={onInputChange}>
                {methods.map((method) => (
                    <MenuItem sx={{backgroundColor: method.color || 'white'}} key={method.id} value={method.id}>
                        {(method.name) ? method.name : method.type[0].toUpperCase() + method.type.slice(1)} 
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <Box sx={{marginX:'20px'}}>
            <Button variant='outlined'             
            sx={(darkMode) ? {
              '&': {color: 'buttons.contrastText',borderColor:'buttons.main'},
              '&:hover': {color: 'buttons.contrastText',borderColor:'buttons.main',backgroundColor:'buttons.main'}
            } : {
              '&:hover': {backgroundColor:'primary.main',color:'primary.contrastText',borderColor:'primary.main'}
            }} onClick={openMethodModal}>Agregar Método</Button>
        </Box>
    </Box> 
  )
}
