import { useEffect, useState } from "react"
// import { ArrowBack } from "../landingPage/components/ArrowBack"
import { 
  useForm, 
  useAuthStore,
  useUIStore 
} from "../hooks"

import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  // duration,
} from "@mui/material";
// import { motion } from "framer-motion"


const formData = {
  email: '',
  password: ''
}

export const LoginPage = () => {

  const {email,password,onInputChange,onResetForm,formState} = useForm(formData);
  const {startLogin,errorMessage,status} = useAuthStore()
  
  const {SwitchMenu} = useUIStore()
  const [loading, setLoading] = useState(false);

  const handleLoadingEnd = () => {
    setLoading(false);
  };
  const handleLoadingStart = () => {
    setLoading(true);
  };

  useEffect(() => {
    // if(errorMessage == undefined && status == 'checking') {
    if(status == 'checking') {
      // handleLoadingEnd()
      handleLoadingStart()
    } else {
      handleLoadingEnd()
      // handleLoadingStart()
    }
  },[status,errorMessage])

  const onSubmit = async (e) => {
    e.preventDefault();
    handleLoadingStart()
    onResetForm();
    await startLogin({email,password})
    
    if(status === 'authenticated') {
      SwitchMenu('home')
      handleLoadingEnd()
    } else {
      handleLoadingEnd()
    }

  }

  return (
    // <motion.div
    //   initial={{opacity:0,transition: {duration: 1}}}
    //   animate={{opacity: 1,transition: {duration: 1}}}
    //   exit={{opacity: 0,transition: {duration: 1}}}
    // >
      <Box sx={{
        width:"100vw",
        height:"100vh",
        background: "white",
        paddingTop:"10px"
      }}>
        <Container maxWidth="sm" sx={{height:'90vh',display:'flex',justifyContent:'center',alignItems:'center'}}>        
          <Box padding={8} bgcolor={"#afcef5"} borderRadius={"20px"}>
            <img width={"300px"} src="../src\assets\Logo.png"/>
            <br />
            <br />
            <Typography textAlign={"center"} variant="h3" color="initial">Ingresar</Typography>
            <Box marginTop={"80px"} display={"flex"} justifyContent="center" flexDirection={"column"} component="form" onSubmit={onSubmit}>
              <TextField sx={{
                  marginBottom:"20px",
              }}
              label="Correo Electronico"
              name='email'
              value={email}
              onChange={onInputChange}
              // error={emailValidation}
              // helperText={emailValidation}
              />
              <TextField 
                sx={{
                    marginBottom:"20px"
                }}
                label="Contraseña"
                type="password"
                name='password'
                value={password}
                onChange={onInputChange}
                // error={passwordValidation}
                // helperText={passwordValidation}
              />
              {(errorMessage != undefined) && <Alert sx={{marginBottom:'20px'}} severity="error">{errorMessage}</Alert>}
              <Button sx={{marginX:5}} type="submit" variant="contained" color="primary">
                  Iniciar Sesion    
              </Button>
              <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
                onClick={handleLoadingStart}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </Box>
          </Box>
        </Container>
      </Box>
    // </motion.div>
  )
}
