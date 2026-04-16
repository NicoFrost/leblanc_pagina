import { Box, Button, FormControl, InputBase, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import React from 'react'
import { useMethodStore, useUIStore } from '../hooks';
import styled from '@emotion/styled';



export const MethodField = ({methodId, onInputChange}) => {

    const {methods} = useMethodStore();
    const {openMethodModal} = useUIStore();
    const {darkMode} = useUIStore();

    const BootstrapInput = styled(InputBase)(({ theme }) => ({
        'label + &': {
            color: (darkMode) ? '#ffffff' : '#000000',
        },
        '& .MuiInputBase-input': {
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

    const BootstrapOutlined = styled(OutlinedInput)(({ theme }) => ({
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#8e8e8e',
            backgroundColor: darkMode ? 'grey' : '#fafafa'
        },
        '& .MuiOutlinedInput-input': {
            borderRadius: 4,
            padding: '10px 12px',
            color: darkMode ? '#fff' : '#000'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#b5b5b5'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: (darkMode) ? '#6e227f' : '#80bdff',
        }
    }));

    console.log(methods);
    
    return (
    <Box display={'flex'} sx={{justifyContent:'space-between'}}  width={"100%"}>
        <FormControl sx={{ height: "56px", justifyContent: "center" }} fullWidth>
            <InputLabel
                sx={{
                color: darkMode ? '#fff' : 'rgba(0,0,0,0.6)',
                '&.Mui-focused': {
                    color: darkMode ? '#80bdff' : 'rgb(0, 149, 255)'
                }
                }}
                id="method-label"
            >
                Método
            </InputLabel>

            <Select
                labelId="method-label"
                id="method-field"
                variant="outlined"
                input={<BootstrapInput darkMode={darkMode} label="Método" />}
                label="Método"
                value={methodId}
                onChange={onInputChange}
                name='methodId'
                sx={{
                    height: 1,
                    ".MuiSelect-select": {
                        boxSizing: "border-box",
                        padding: { sm: "10px 10px", lg: "15px 10px" }
                    }
                }}
            >
                {methods.map((method) => (
                <MenuItem
                    sx={{ backgroundColor: method.color || 'white' }}
                    key={method.id}
                    value={method.id}
                >
                    {method.name || method.type[0].toUpperCase() + method.type.slice(1)} {(method.name) && "(" + method.type + ")"}
                </MenuItem>
                ))}
            </Select>
        </FormControl>
        {/* <FormControl sx={{height:"56px",justifyContent:"center"}} id='method-field' fullWidth>
            <InputLabel sx={{color: (darkMode) ? '#ffffff' : 'rgba(0, 0, 0, 0.6)'}} id="method-label">Metodo</InputLabel>
            <Select 
                variant='outlined' sx={{height:1,".MuiSelect-select": {boxSizing:"border-box",padding:{sm:"10px 10px",lg:"15px 10px"}}}} 
                input={<BootstrapInput/>} id='method-label' labelId='method-label' label='Metodo' 
                name='methodId' value={methodId} onChange={onInputChange}>
                {methods.map((method) => (
                    <MenuItem sx={{backgroundColor: method.color || 'white'}} key={method.id} value={method.id}>
                        {(method.name) ? method.name : method.type[0].toUpperCase() + method.type.slice(1)} 
                    </MenuItem>
                ))}
            </Select>
        </FormControl> */}
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
