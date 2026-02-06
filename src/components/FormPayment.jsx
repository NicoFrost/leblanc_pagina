import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import MaterialDatePicker from './MaterialDatePicker'

import styled from '@emotion/styled';
import {fileUpload} from '../helpers/fileUpload'

import dayjs from 'dayjs'
import 'dayjs/locale/es'          // importa la locale
import localizedFormat from 'dayjs/plugin/localizedFormat'
import localeData from 'dayjs/plugin/localeData'
import { useMethodStore } from '../hooks/useMethodStore';
import { MethodField } from './MethodField';


dayjs.extend(localizedFormat)
dayjs.extend(localeData)

// establece español globalmente
dayjs.locale('es')

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const FormCollection = ({onInputChange,formState,onAdd,onReset,formType}) => {

    const {methods} = useMethodStore();
    
    const HandlerSubmit = async (e) => {
        e.preventDefault()
        // console.log((formState.imageURL) ? formState.imageURL[0] : []);
        console.log(formState);
        
        const respuesta = await fileUpload((formState.imageURL) ? formState.imageURL[0] : [])
        onAdd({...formState,amount: parseFloat(formState.amount),imageURL: respuesta?.url})
        onReset()
    }

    return (
    <Box component={"form"} onSubmit={HandlerSubmit}>
        <Box display={"flex"} justifyContent={'space-between'} width={"100%"} marginBottom={"10px"}>
            {
                formType === 'payment' ?  
                <Box sx={{width:"60%",display:"flex",justifyContent:"space-between"}}>
                    <TextField label="Importe" name='amount' sx={{width:"60%",marginRight:"10px"}} onChange={onInputChange} value={formState.amount}/>
                    <FormControl fullWidth sx={{width:"40%"}}>
                        <InputLabel id="type-label">Tipo de pago</InputLabel>
                        <Select id='type-label' label='Tipo de pago' name='type' value={formState.type} onChange={onInputChange} >
                            <MenuItem value='advance'>Adelanto</MenuItem>
                            <MenuItem value='full'>Completo</MenuItem>
                            <MenuItem value='partial'>Parcial</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                :
                <TextField label="Importe" sx={{width:"60%"}} name='amount' onChange={onInputChange} value={formState.amount}/>
            }
            <Box display={"flex"} sx={{justifyContent:"space-around"}} width={"40%"}>
                <Button 
                    size='small'
                    variant='contained'
                    tabIndex={-1}
                    role={undefined}
                    component="label"
                    sx={{height:"56px"}}
                    startIcon={<CloudUploadIcon/>}
                >
                    Subir Imagen
                    <VisuallyHiddenInput
                        onChange={onInputChange}
                        name="imageURL"
                        type="file"
                        accept="image/*"
                    />
                </Button>
                <MaterialDatePicker
                name='date'
                value={dayjs(formState.date)} 
                onChange={(date) => onInputChange({ target: { name: 'date', value: date } })} 
                format='DD/MM/YYYY'
                sx={{height:"56px"}}
                />
            </Box>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
            <MethodField methodId={formState.methodId} onInputChange={onInputChange}/>
        </Box>
        <Box  sx={{marginTop:"40px",textAlign:"center"}}>
            <Button type='submit' variant='outlined'>Agregar Pago</Button>
        </Box>
    </Box>
  )
}
