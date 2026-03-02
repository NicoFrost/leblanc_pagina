import { Box, Button, FormControl, InputBase, InputLabel, MenuItem, Select, TextField } from '@mui/material'
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
import { useUIStore } from '../hooks';


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
    const {darkMode} = useUIStore();
    const HandlerSubmit = async (e) => {
        e.preventDefault()
        // console.log((formState.imageURL) ? formState.imageURL[0] : []);
        console.log(formState);
        
        const respuesta = await fileUpload((formState.imageURL) ? formState.imageURL[0] : [])
        onAdd({...formState,amount: parseFloat(formState.amount),imageURL: respuesta?.url})
        onReset()
    }

    const CssTextField = styled(TextField)({
        backgroundColor: 'background.paper',
        '&  label.Mui-focused': {
            color: (darkMode) ? '#ffffff' : '#000000',
        },
        '& .MuiInputBase-input': {
            borderRadius: 4,
            backgroundColor: (darkMode) ? 'grey' : '#fafafa',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#B2BAC2',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
            borderColor: '#8e8e8e',
            },
            '&:hover fieldset': {
            borderColor: '#B2BAC2',
            },
            '&.Mui-focused fieldset': {
            borderColor: '#6F7E8C',
            },
        },
        "& .MuiInputLabel-root": {
            color: (darkMode) ? '#ffffff' : 'rgba(0, 0, 0, 0.6)',
        }
    });

    const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        color: (darkMode) ? '#ffffff' : '#000000',
    },
    "& .MuiInputLabel-root": {
        color: (darkMode) ? '#ffffff' : 'rgba(0, 0, 0, 0.6)',
    },

    '& .MuiInputBase-input': {
        paddingTop: "12%",
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
    <Box component={"form"} onSubmit={HandlerSubmit}>
        <Box display={"flex"} justifyContent={'space-between'} width={"100%"} marginBottom={"10px"}>
            {
                formType === 'payment' ?  
                <Box sx={{width:"60%",display:"flex",justifyContent:"space-between"}}>
                    <CssTextField label="Importe" name='amount' sx={{width:"60%",marginRight:"10px"}} onChange={onInputChange} value={formState.amount}/>
                    <FormControl  fullWidth sx={{width:"40%"}}>
                        <InputLabel sx={{color:"white"}} id="type-label">Tipo de pago</InputLabel>
                        <Select input={<BootstrapInput/>} id='type-label' label='Tipo de pago' name='type' value={formState.type} onChange={onInputChange} >
                            <MenuItem value='advance'>Adelanto</MenuItem>
                            <MenuItem value='full'>Completo</MenuItem>
                            <MenuItem value='partial'>Parcial</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                :
                <CssTextField label="Importe" sx={{width:"60%"}} name='amount' onChange={onInputChange} value={formState.amount}/>
            }
            <Box display={"flex"} sx={{justifyContent:"space-around"}} width={"40%"}>
                <Button 
                    size='small'
                    tabIndex={-1}
                    variant='outlined'
                    role={undefined}
                    component="label"
                    sx={{height:"56px",...(darkMode) ? {
                        color: 'buttons.contrastText',borderColor:'buttons.main',
                        '&:hover': {color: 'buttons.contrastText',borderColor:'buttons.main',backgroundColor:'buttons.main'}
                    } : {
                        '&:hover': {backgroundColor:'primary.main',color:'primary.contrastText',borderColor:'primary.main'}
                    }}}

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
                    color='buttons'
                    value={dayjs(formState.date)} 
                    onChange={(date) => onInputChange({ target: { name: 'date', value: date } })} 
                    format='DD/MM/YYYY'
                    sx={{height:"56px",...(darkMode) ? {
                        color: 'buttons.contrastText',borderColor:'buttons.main',
                        ':hover': {color: 'buttons.contrastText',borderColor:'buttons.main',backgroundColor:'buttons.main'}
                    } : {
                        ':hover': {backgroundColor:'primary.main',color:'primary.contrastText',borderColor:'primary.main'}
                    }}}
                />
            </Box>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
            <MethodField methodId={formState.methodId} onInputChange={onInputChange}/>
        </Box>
        <Box  sx={{marginTop:"40px",textAlign:"center"}}>
            <Button type='submit' 
            sx={(darkMode) ? {
                    color: 'buttons.contrastText',borderColor:'buttons.main',
                    '&:hover': {color: 'buttons.contrastText',borderColor:'buttons.main',backgroundColor:'buttons.main'}    
                } : {
                    '&:hover': {backgroundColor:'primary.main',color:'primary.contrastText',borderColor:'primary.main'}
            }}
            variant='outlined'
            >Agregar Pago</Button>
        </Box>
    </Box>
  )
}
