import { Box, createTheme, ThemeProvider } from '@mui/material'
import React from 'react'
import { useUIStore } from '../hooks';

export const ModalLayout = ({children,width,offset = "-50%"}) => {

    const {darkMode} = useUIStore()
      const customTheme = createTheme({
        palette: {
          dark: {
            main: '#606060',
            mainLight: '#8a8a8a',
            contrastText: '#fff',
          },
          light: {
            main: '#fff',
            contrastText: '#000',
          },
          primary: {
            main: '#1470da',
            light: '#0073f6',
            main_2: '#062f4d',

            contrastText: '#fff',
          },
          secondary: {
            main: '#10345d',
            contrastText: '#00b3ff',
          },
          buttons: {
            main: '#2e274a',
            contrastText: '#fff',
          },
        },
      });
  return (
    <ThemeProvider theme={customTheme}>
        <Box
            component={'form'}
            sx={{
                position: {sm: "block",lg:"absolute"},   
                transform: "translate(" + offset +", -50%)",
                width: width || 250,
                bgcolor: darkMode ? "dark.mainLight" : "background.paper",
                border: "2px solid #000",
                borderRadius: "10px",
                boxShadow: 24,
                color: darkMode ? "white" : "black  ",   
                "h2": {
                  color: darkMode ? "primary.contrastText" : "primary.main",
                  fontSize: "40px",
                  textAlign: "center",
                },
                p: 4,
                "& .MuiSwitch-thumb": {
                    backgroundColor: (darkMode) ? 'primary.contrastText' : 'primary.main',
                },
                "& .MuiSwitch-track": {
                    backgroundColor: (darkMode) ? 'primary.light' : 'secondary.main',
                },
                "& .Mui-checked+.MuiSwitch-track": {
                    backgroundColor: (darkMode) ? 'light.contrastText' : 'secondary.contrastText', 
                },
                "& .MuiInputBase-root": {
                    height: {sm:"43px",xl:"56px"},  
                    color: darkMode ? "white" : "black"
                },
                "& .MuiPickersOutlinedInput-root": {
                  height: {sm:"40px",xl:"56px"},
                  ".MuiSvgIcon-root": {color: (darkMode) ? "primary.main" : "black"},
                },
                "& .MuiInputLabel-root": {color: (darkMode) ? "white" : "black",top: "-5px"},
                "& .MuiInputLabel-root.Mui-focused": {top: "-0px"},
                ".MuiPickersInputBase-root":{color:(darkMode) ? "white" : "black",fill: (darkMode) ? "white" : "black"},
                // "& .MuiOutlinedInput-root": {
                //     "& fieldset": {
                //         borderColor: darkMode ? "dark.main" : "light.main",
                //     },
                //     "&:hover fieldset": {
                //         borderColor: darkMode ? "primary.main" : "primary.main",
                //     },
                //     "&.Mui-focused fieldset": {
                //         borderColor: darkMode ? "primary.main" : "primary.main",
                //     },
                // },
            }}
        >
            {children}
        </Box>
    </ThemeProvider>
  )
}
