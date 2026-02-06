import { useEffect, useMemo, useState } from 'react';
import PropTypes, { number } from 'prop-types'
import { useTheme } from '@emotion/react';

import '../CSS/styles.css'
import '../CSS/modalStyles.css'

import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useExpensesStore, useForm, useUIStore} from '../hooks'

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  TextField,
  styled,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";

import { green } from '@mui/material/colors';
import { DoubleInputTextField } from '../components/DoubleInputTextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import 'dayjs/locale/es'          // importa la locale
import localizedFormat from 'dayjs/plugin/localizedFormat'
import localeData from 'dayjs/plugin/localeData'

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

const initialFormShape = {reason: '', amount: '', date: new Date(), description: ''}
export const ExpensesModal = ({initialForm = initialFormShape}) => {

    const {palette} = useTheme()
    
    const {isExpensesModalOpen, closeExpensesModal} = useUIStore();
    const {activeExpense,setActiveExpense,startSavingExpense} = useExpensesStore();

    const [errors,setErrors] = useState({name: false,size: false,price:false});
    
    // const validatorAddress = {
    // const validations = {
    //     codeCountry: {fn: validCodeCountry, errorMessage: "el numero de pais debe tener el formato +XX"},
    //     phone: {fn: validPhone, errorMessage: "Se requiere un formato de 11 numeros"},
    //     street: {fn: validStreet, errorMessage: "La calle es requerida"},
    //     number: {fn: validNumber, errorMessage: "El número es requerido"},
    // }
    // console.log(initialForm);    
    const {onInputChange,formState,onResetForm,isFormValid} = useForm(initialForm);
    const [formSubmitted, setFormSubmitted] = useState(false);

    
    
    const getProviderId = (object) => {
        
        if(object !== undefined && object !== ''){
            if(typeof object === "string"){
                return object
            } else {
                return object._id
            }
        }
        return '';
    }
    
    // const onOpen = () => {
    //     setformState(initialForm); 
    // }

    // TODO: FALTAN CRUD DE ESTOS PARA ACTIVARLOS
    // category: "",

    const [loadingFile, setLoadingFile] = useState(false)

    //* CIERRE INESPERADO
    const onClosingModal = () => {
        closeExpensesModal()
        if(isExpensesModalOpen) {
            setFormSubmitted(false)
            setActiveExpense({});
        }
        
        // console.log(activeProduct);
    }

    //* VERIFICACIONES
    // TODO HACER NUEVAS VERIFICACIONES
    const nameMinLength = useMemo(() => {
        if(!formSubmitted) return false;


        if((formState.description.length <= 2)){
                setErrors({
                    ...errors,
                    description:(formState.description.length <= 2)
                    })
                return (formState.description.length <= 2)
            } else {
                setErrors({
                    ...errors,
                    description:false
                })
                return false
        }
    },[formState,formSubmitted]);
    
    //* Subida
    const onSubmit = async (event) => {
        event.preventDefault()

        const date = new Date(formState.date || Date.now());
        // const {date,...form} = formState;
        // console.log({...form,date: date?.toISOString().split('T')[0]});
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          startSavingExpense({...formState,date})
          closeExpensesModal()
        }, 3000);
    }

    // useEffect(() => {
    //     if(activeExpense !== null){
    //         if(activeExpense === undefined){
    //             onInputChange({ target: { name: 'reason', value: '' } });
    //         } else {
    //             setFormValues({
    //                 ...activeExpense
    //             })
    //         }
    //     }
    // }, [activeExpense])
  
  
  return (
    <Modal
      open={!!isExpensesModalOpen}
      onClose={onClosingModal}
      style={{
        top: "50%",
        left: "50%",
      }}
      // className={'modal'}

      // overlayClassName='modal-fondo'
      // onAfterOpen={onOpen}
    >
      <Box
        sx={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          border: "2px solid #000",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* <h1>{(activeEmployee == undefined) ? "Nuevo Empleado/a" : "Editar Empleado/a" }</h1> */}
        <h2 style={{ color: "black", fontSize: "40px", textAlign: "center" }}>
          {(false) ? "Nuevo Gasto" : activeExpense?.description}
        </h2>
        <Divider sx={{ marginY: "10px" }} />
        <Box
          sx={{ display: "flex", flexDirection: "column" }}
          component={"form"}
          onSubmit={onSubmit}
          className="container"
          id='expense-form'
        >
            <Box>{/* FOTO DE EMPLEADA */}</Box>
            <Divider />
            <Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* DESCRIPCION */}
                <TextField
                    className={"form-control"}
                    name="description"
                    value={formState.description}
                    onChange={onInputChange}
                    error={nameMinLength}
                    id="outlined-helperText"
                    label="Descripción"
                    helperText="Descripción del gasto"
                    variant="outlined"
                    multiline
                    rows={2}
                />
                <Box sx={{display:"flex",justifyContent:"space-between"}}>
                  {/* IMPORTE */}
                  <TextField
                  className={"form-control"}
                  name="amount"
                  value={formState.amount}
                  onChange={onInputChange}
                  error={nameMinLength}
                  id="outlined-helperText"
                  label="Importe"
                  helperText="Importe del gasto"
                  variant="outlined"
                  sx={{ width: "49%" }}
                  />
                  <DatePicker
                    label="Controlled picker"
                    value={dayjs(formState.date)}  
                    onChange={(date) => onInputChange({ target: { name: 'date', value: date } })}
                  />
                </Box>
                <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Motivo</InputLabel>
                    <Select 
                      value={formState.reason}
                      defaultValue={''}
                      onChange={onInputChange}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Motivo"
                      name="reason"
                      sx={{ width: "67%" }}
                    >
                      <MenuItem value="EMP">Empleado</MenuItem>
                      <MenuItem value="EDIF">Edificio</MenuItem>
                    </Select>
                    <FormHelperText>Motivo del gasto</FormHelperText>
                  </FormControl>
                  <Button
                    disabled={formSubmitted}
                    startIcon={formSubmitted ? <CheckIcon /> : <SaveIcon />}
                    type="submit"
                    variant="contained"
                    color="success"
                    form="expense-form"
                    sx={{ width: "35%",height:"55px" }}
                  >
                    Guardar
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ marginY: "10px" }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ m: 1, position: "relative" }}>
              {formSubmitted && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500],
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Box>
        </Box>
      </Box>
    </Modal>
  );
}
