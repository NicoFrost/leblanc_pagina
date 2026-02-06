import Modal from '@mui/material/Modal'
import React, { useState } from 'react'
import { useForm, useMethodStore, useUIStore } from '../hooks'
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { SketchPicker } from 'react-color';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';

const initialFormShape = {method: '', color: '#ffffff'}
export const MethodModal = () => {
    
    const {isMethodModalOpen,closeMethodModal} = useUIStore()
    const {activeMethod,setActiveMethod,startSavingMethod} = useMethodStore()
    const {onInputChange,formState} = useForm(initialFormShape)
    const [formSubmitted, setFormSubmitted] = useState(false);
    const onClosingModal = () => {
        closeMethodModal()
        if(isMethodModalOpen) {
            // setFormSubmitted(false)
            setActiveMethod({});
        }
        
        // console.log(activeProduct);
    }
    
    const state = {
        background: '#fff',
    };

    const handleChange = (color,event) => {        
        onInputChange({target:{name:'color',value:color.hex}})
    };

    const onSubmit = async (event) => {
        event.preventDefault()
        console.log(formState);
        setFormSubmitted(true);
        setTimeout(() => {
            setFormSubmitted(false);
            startSavingMethod(formState)
            closeMethodModal()
        }, 3000);

    }
    return (
    <Modal
        open={!!isMethodModalOpen}
        onClose={onClosingModal}
        style={{
            top: "50%",
            left: "60%",
        }}
    >
        <Box>
            <Box
                sx={{
                    position: "absolute",   
                    transform: "translate(-100%, -50%)",
                    width: 250,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    borderRadius: "10px",
                    boxShadow: 24,
                    color:"black",  
                    p: 4,
                }}
            >
                {/* <Box 

                    display={'flex'}
                > */}
                    <Box 
                    onSubmit={onSubmit}
                    component={'form'}
                    sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',marginRight:'20px'}}>
                        <TextField label='Nombre del método' 
                            name='method' 
                            onChange={onInputChange} 
                            value={formState.method} fullWidth
                            sx={{marginBottom:'10px'}}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tipo de gasto</InputLabel>
                            <Select
                            value={formState.type}
                            defaultValue={''}
                            onChange={onInputChange}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Tipo de gasto"
                            name="type"
                            >
                                <MenuItem value="efectivo">Efectivo</MenuItem>
                                <MenuItem value="transferencia">Transferencia</MenuItem>
                                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                            </Select>
                            <FormHelperText>Motivo del gasto</FormHelperText>
                        </FormControl>    
                        <SketchPicker
                            name='color'
                            color={ formState.color}
                            onChange={ handleChange }
                        />
                        <Button
                            disabled={formSubmitted}
                            startIcon={formSubmitted ? <CheckIcon /> : <SaveIcon />}
                            type="submit"
                            variant="contained"
                            color="success"
                            sx={{width: "100%", height:"35px", marginTop:"20px"}}
                        >Guardar</Button>
                    </Box>

                {/* </Box> */}
            </Box>
        </Box>
    </Modal>
  )
}
