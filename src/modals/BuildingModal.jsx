import { useEffect, useMemo, useState } from 'react';
import PropTypes, { number } from 'prop-types'
import { useTheme } from '@emotion/react';

import '../CSS/styles.css'
import '../CSS/modalStyles.css'

import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useBuildingsStore, useForm, useUIStore} from '../hooks'

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
} from "@mui/material";

import { green } from '@mui/material/colors';
import { DoubleInputTextField } from '../components/DoubleInputTextField';
import { ModalLayout } from '../layout/ModalLayout';

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

const validCodeCountry = (text) => {
    const regex = /^\+\d{2}$/;
    return regex.test(text);
}

const validPhone = (text) => {
    const regex = /^\d{11}$/;
    return regex.test(text);
}

// const validatorPhone = {
//     codeCountry: {fn: validCodeCountry, errorMessage: "el numero de pais debe tener el formato +XX"},
//     phone: {fn: validPhone, errorMessage: "Se requiere un formato de 11 numeros"}
// }

const validNumber = (text) => {
    const regex = /^\d+$/;
    return regex.test(text);
}

const validStreet = (text) => {
    const regex = /^.+$/;
    return regex.test(text);
}

const initialFormShape = {buildingName:'', phone: ["",""], street: ["",""],email: ''  }
export const BuildingModal = ({initialForm = initialFormShape}) => {

    const {palette} = useTheme()
    
    const {isBuildingModalOpen, closeBuildingModal} = useUIStore();
    const {activeBuilding,setActiveBuilding,startSavingBuilding} = useBuildingsStore()
    const [errors,setErrors] = useState({name: false,size: false,price:false});



    // const validatorAddress = {
    const validations = {
        codeCountry: {fn: validCodeCountry, errorMessage: "el numero de pais debe tener el formato +XX"},
        phone: {fn: validPhone, errorMessage: "Se requiere un formato de 11 numeros"},
        street: {fn: validStreet, errorMessage: "La calle es requerida"},
        number: {fn: validNumber, errorMessage: "El número es requerido"},
    }
    
    const {onInputChange,formState,onResetForm,isFormValid} = useForm(initialForm,validations);
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
        closeBuildingModal()
        if(isBuildingModalOpen) {
            setFormSubmitted(false)
            setActiveBuilding({})
        }
    }

    //* VERIFICACIONES
    // TODO HACER NUEVAS VERIFICACIONES
    const nameMinLength = useMemo(() => {
        if(!formSubmitted) return false;


        if((formState.buildingName.length <= 2)){
                setErrors({
                    ...errors,
                    name:(formState.name.length <= 2)
                    })
                return (formState.name.length <= 2)
            } else {
                setErrors({
                    ...errors,
                    name:false
                })
                return false
        }
    },[formState,formSubmitted]);


    //* Subida
    const onSubmit = async (event) => {
        event.preventDefault()
        
        setFormSubmitted(true);
        setTimeout(() => {
            startSavingBuilding(formState)
            
            setFormSubmitted(false);
            closeBuildingModal()
        }, 3000);
    }

  return (
    <Modal
      open={isBuildingModalOpen}
      onClose={onClosingModal}
      style={{
        top: "50%",
        left: "50%",
      }}
    >
      <ModalLayout width={500}>
        {/* <h1>{(activeEmployee == undefined) ? "Nuevo Empleado/a" : "Editar Empleado/a" }</h1> */}
        <h2>
          Nuevo Edificio
        </h2>
        <Divider sx={{ marginY: "10px" }} />
        <Box
          sx={{ display: "flex", flexDirection: "column" }}
          component={"form"}
          onSubmit={onSubmit}
          className="container"
          id="building-form"
        >
            <Box>{/* FOTO DE EMPLEADA */}</Box>
            <Divider />
            <Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    {/* NOMBRE */}
                    <TextField
                      className={"form-control"}
                      name="buildingName"
                      value={formState.buildingName}
                      onChange={onInputChange}
                      error={nameMinLength}
                      id="outlined-helperText"
                      label="Razon Social"
                      helperText="Nombre para identificar el edificio"
                      variant="outlined"
                      sx={{ width: "100%" }}
                    />
                    <TextField
                      className={"form-control"}
                      name="contactName"
                      value={formState.contactName}
                      onChange={onInputChange}
                      error={nameMinLength}
                      id="outlined-helperText"
                      label="Nombre del Contacto"
                      // helperText="Nombre de quien habla por el edificio"
                      variant="outlined"
                      sx={{ width: "100%" }}
                    />
                </Box>
                <Box>
                    <DoubleInputTextField
                        placeholders={["Calle", "Numero"]}
                        onChange={onInputChange}
                        name={"address"}
                        values={formState.address}
                        errorMsg={isFormValid.formValidation.streetValid || isFormValid.formValidation.numberValid}
                        BigInputSize={0.6}
                        inverted
                    />
                    <DoubleInputTextField
                        placeholders={["+54", "Telefono"]}
                        onChange={onInputChange}
                        name={"phone"}
                        values={formState.phone}
                        errorMsg={isFormValid.formValidation.codeCountryValid || isFormValid.formValidation.phoneValid}
                        BigInputSize={0.8}
                    />
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    {/* EMAIL */}
                    <TextField
                        className={"form-control"}
                        name="email"
                        value={formState.email}
                        onChange={onInputChange}
                        error={nameMinLength}
                        id="outlined-helperText"
                        label="Email"
                        helperText="Email para contactar el edificio"
                        variant="outlined"
                        sx={{ width: "100%" }}
                    />
                    <FormControl id="invoice-type" className='form-selectors'>
                      <InputLabel id="invoice-type-label">Factura</InputLabel>
                      <Select
                        value={formState.type}
                        onChange={onInputChange}
                        name="type"
                        labelId="invoice-type-label"
                        label="Factura"
                      >
                        <MenuItem value={'A'}>A</MenuItem>
                        <MenuItem value={'B'}>B</MenuItem>
                        <MenuItem value={'R'}>R</MenuItem>
                      </Select>
                    </FormControl>
                    {/* <FormControlLabel
                    sx={{alignItems:"center"}}
                        control={
                            <Checkbox
                                sx={{
                                color: "#F6C768",
                                    "&.Mui-checked": { color: "#F6C768" },
                                }}
                                checked={formState.iva}
                                name="iva"
                                onChange={onInputChange}
                                aria-label='area-code'
                            />
                        }
                        label="¿Cobra IVA?"
                    /> */}
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
              <Button
                disabled={formSubmitted}
                startIcon={formSubmitted ? <CheckIcon /> : <SaveIcon />}
                type="submit"
                variant="contained"
                color="success"
                form='building-form'
              >
                Guardar
              </Button>
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
      </ModalLayout>
    </Modal>
  );
}
