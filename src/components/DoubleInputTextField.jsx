import { Label } from '@mui/icons-material'
import { Box, InputBase, InputLabel, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useForm } from '../hooks'


const styleBase = 
{
    "::before":{borderBottom:"none"},
    "::after":{borderBottom:"none"},
    border:"grey 1px solid",
    padding:"10px",
    boxSizing:"border-box"
}

export const DoubleInputTextField = ({errorMsg = "",name,values = [],onChange = () => {},placeholders = ["",""],inverted = false,BigInputSize = .80, helperText}) => {

    const inputHandle = (e) => {
        let newValue = [values[0],values[1]]
        if(e.target.name == name + "0"){
            newValue[0] = e.target.value
        } else {
            newValue[1] = e.target.value
        }  
        
        const event = {target: {
            name,
            value: newValue
        }}
        
        onChange(event)
    }


    return (
    <Box 
        sx={{
            display:"flex",
            justifyContent:"space-between",
            width:"500px",
            marginUp:"10px"
        }}
    >
        <Box 
            sx={{
                marginY:"10px",
                width:"100%"
            }}
        >
            <Box sx={{
                display:"flex",
                flexDirection:"row",


            }}>
                <TextField
                    value={values[0]}
                    onChange={inputHandle}
                    name={name + "0"}
                    sx={{flex: inverted ? BigInputSize : 1-BigInputSize,'div': {borderRadius:"5px 0px 0px  5px"}}}
                    label={placeholders[0]}
                    aria-label=''
                />
                <TextField
                    value={values[1]}
                    label={placeholders[1]}
                    name={name + "1"}
                    onChange={inputHandle}
                    sx={{flex: inverted ? 1-BigInputSize : BigInputSize,'div': {borderRadius:"0px 5px 5px  0px"}}}
                    aria-label=''
                />
            </Box>
            <Typography color={'error'} sx={{margin:0}} variant='caption'>{errorMsg}</Typography>
        </Box>
    </Box>
  )
}
