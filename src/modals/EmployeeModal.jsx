import { useEffect, useMemo, useState } from 'react';
import PropTypes, { number } from 'prop-types'
import { useTheme } from '@emotion/react';

import '../CSS/styles.css'
import '../CSS/modalStyles.css'

import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useEmployeesStore, useForm, useUIStore} from '../hooks'

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
    const regex = /^\d{13}$/;
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

const initialFormShape = {name:'',lastName:'', phone: ['',''],address: ['','',''], arca: false}
export const EmployeeModal = ({initialForm = initialFormShape}) => {

    const {palette} = useTheme()

    
    const validations = {
      codeCountry: {fn: validCodeCountry, errorMessage: "el numero de pais debe tener el formato +XX"},
      phone: {fn: validPhone, errorMessage: "Se requiere un formato de 11 numeros"},
      street: {fn: validStreet, errorMessage: "La calle es requerida"},
      number: {fn: validNumber, errorMessage: "El número es requerido"},
    }
    
    const {isEmployeeModalOpen, closeEmployeeModal} = useUIStore();
    const {onInputChange,formState,onResetForm,isFormValid} = useForm(initialForm,validations);
    const [errors,setErrors] = useState({name: false,size: false,price:false});
    const [formSubmitted, setFormSubmitted] = useState(false);
    const {setActiveEmployee,activeEmployee,startSavingEmployee} = useEmployeesStore()
    
    
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
        closeEmployeeModal()
        if(isEmployeeModalOpen) {
            setFormSubmitted(false)
            setActiveEmployee()
        }
        
        // console.log(activeProduct);
    }

    //* VERIFICACIONES
    // TODO HACER NUEVAS VERIFICACIONES
    const nameMinLength = useMemo(() => {
        if(!formSubmitted) return false;


        if((formState.name.length <= 2)){
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
      setFormSubmitted(true)
      setTimeout(() => {
        setFormSubmitted(false)
        startSavingEmployee(formState)
        closeEmployeeModal()
      }, 3000);
        // setLoadingFile(true)
        // setFormSubmitted(true);

        // const regex = /^\d+x\d+$/i;

        // const {name,size,price} = errors;

        // if(
        //     Object.keys(formState).length === 0 || 
        //     formState.name.length <= 2          || 
        //     !regex.test(formState.size)         ||
        //     formState.price == null             ||
        //     (
        //         isNaN(formState.price) &&
        //         !(parseInt(formState.price) >= 0)
        //     )
        // ) return 
        
        // if(!(name || size || price)){
                        
            // let formFinal = {...formState,provider:providerSelect,category:categorySelect}
        //     formState.price = parseFloat(formState.price);
        //     formState.quantity = parseInt(formState.quantity);
            
        //     console.log(formState);
            
            //* ENVIO LOS ARCHIVOS A EL HOOK PERO EL SOLO RECIBE EL DE INDICE 0

        //     let ImageUrl = false;
            
        //     if(typeof(formState.img) != "string"){
        //         ImageUrl = await startUploadingFiles(formState.img);

        //         formState.img = ImageUrl;

        //     }
            
            
            
        //     await startSavingProduct(formState);
            
        //     closeProductModal();
        //     setFormSubmitted(false);
        //     setLoadingFile(false)
        //     startLoadingProducts();
            
        //     if(!activeProduct || Object.keys(activeProduct).length != 0) setActiveProduct({})
        // } else {
        //     console.log(2);
        // }
    }


  return (
    <Modal
      open={!!isEmployeeModalOpen}
      onClose={onClosingModal}
      style={{
        top: "50%",
        left: "50%",
      }}
      // className={'modal'}

      // overlayClassName='modal-fondo'
      // onAfterOpen={onOpen}
    >
      <ModalLayout width={500}>
        {/* <h1>{(activeEmployee == undefined) ? "Nuevo Empleado/a" : "Editar Empleado/a" }</h1> */}
        <h2 style={{ fontSize: "40px", textAlign: "center" }}>
          {(isEmployeeModalOpen != 'edit') ? "Nuevo Empleado/a" : "Editar empleado " + activeEmployee?.name}
        </h2>
        <Divider sx={{ marginY: "10px" }} />
        <Box
          sx={{ display: "flex", flexDirection: "column" }}
          component={"form"}
          id="employee-form"
          onSubmit={onSubmit}
          className="container"
        >
            <Box>{/* FOTO DE EMPLEADA */}</Box>
            <Divider />
            <Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    {/* NOMBRE */}
                    <TextField
                        className={"form-control"}
                        name="name"
                        value={formState.name}
                        onChange={onInputChange}
                        error={nameMinLength}
                        id="outlined-helperText"
                        label="Nombre"
                        helperText="Nombre del empleado"
                        variant="outlined"
                        sx={{ width: "49%" }}
                    />
                    {/* APELLIDO */}
                    <TextField
                    className={"form-control"}
                    name="lastName"
                    value={formState.lastName}
                    onChange={onInputChange}
                    error={nameMinLength}
                    id="outlined-helperText"
                    label="Apellido"
                    helperText="Apellido del empleado"
                    variant="outlined"
                    sx={{ width: "49%" }}
                    />
                </Box>
                <Box>
                    <DoubleInputTextField
                        placeholders={["Calle", "Numero"]}
                        onChange={onInputChange}
                        name={"address"}
                        values={formState.address}
                        // errorMsg={isFormValid.formValidation.streetValid || isFormValid.formValidation.numberValid}
                        BigInputSize={0.6}
                        inverted
                    />
                    <DoubleInputTextField
                        placeholders={["+54", "Telefono"]}
                        onChange={onInputChange}
                        name={"phone"}
                        values={formState.phone}
                        // errorMsg={isFormValid.formValidation.codeCountryValid || isFormValid.formValidation.phoneValid}
                        BigInputSize={0.8}
                    />
                </Box>
                <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                sx={{
                                color: "#F6C768",
                                    "&.Mui-checked": { color: "#F6C768" },
                                }}
                                checked={formState.arca}
                                name="arca"
                                onChange={onInputChange}
                                aria-label='area-code'
                            />
                        }
                        label="En Blanco"
                    />
                    <Button
                        sx={{ width: "160px" }}
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        Subir Imagen
                        <VisuallyHiddenInput
                        onChange={onInputChange}
                        name="img"
                        type="file"
                        accept="image/*"
                        />
                    </Button>
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
                form="employee-form"
                type="submit"
                variant="contained"
                color="success"
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
