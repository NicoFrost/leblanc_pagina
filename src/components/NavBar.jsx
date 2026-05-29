// import { LogoutOutlined, MenuOutlined } from "@mui/icons-material"
import { AppBar, Box, Button, CircularProgress, Grid, IconButton, Toolbar, Tooltip, Typography } from "@mui/material"
// import { useAuthStore } from "../../hooks/useAuthStore"
import { Event, LogoutOutlined, MenuOutlined } from "@mui/icons-material";
import LanguageIcon from '@mui/icons-material/Language';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PropTypes from 'prop-types'
import { useAuthStore, useUIStore } from "../hooks";
//  TODO INSTALAR SWEET ALERTS 2
// import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';

let menuOpen = 0;
export const NavBar = ({handleLiquidationOpen,setOpenMenu,drawerWidth}) => {

    const {user,startLogout} = useAuthStore();
    const {darkMode,toggleDarkMode} = useUIStore()
    let UserModified;

    if(typeof user.name == "string"){
        UserModified = user.name.charAt(0).toUpperCase() + user.name.slice(1);
    }

    const onOpenMenu = () => {
        if(menuOpen == 0){
            setOpenMenu({left:'-0px',top:'50px'});
            menuOpen=1;
        } else {
            setOpenMenu({left:"-281px"});
            menuOpen=0;
        }
    }
    // const {startLogout} = useAuthStore();

    const onLogout = () => {
        // Select the button
        toggleDarkMode()
        // Then toggle (add/remove) the .dark-theme class to the body
        document.body.classList.toggle('dark-theme');  
    }
    const [statusUpdate, setStatusUpdate] = useState('null')

    useEffect(() => {
        switch(document.getElementById("message")?.innerHTML){
            case "Buscando actualización...":
            case "Status Message...":
                setStatusUpdate('searching')
            break;
            case "Nueva actualización disponible. Descargando...":
                setStatusUpdate('downloading')
            break;
            case "No hay actualizaciones disponibles.":
            default:
                setStatusUpdate('success')
                break;
        }
    }, [document.getElementById("message")?.innerHTML]);
  return (
    <AppBar 
    position="fixed"
    sx={{
        width: {sm: `calc(100% - ${drawerWidth}px)`},
        ml: {sm: `${drawerWidth}px`},
        zIndex:1
        }}
    >
        <Toolbar>

            <IconButton
                onClick={onOpenMenu}
                edge='start'
                sx={{mr: 2,display: {sm: 'none'},color:'red'}}
            >
                <MenuOutlined/>
            </IconButton>

            <Grid 
                container direction="row" 
                justifyContent='space-between' 
                alignItems="center"
                width={"100%"}
            >
                <Typography variant="h6" noWrap component='div'>{UserModified}</Typography>
                <Typography sx={{display:'none'}} variant="body1" id="message">Status Message...</Typography>
                
                <Box display={"flex"} alignItems="center">
                    <Tooltip title={(document.getElementById("message")) ? document.getElementById("message").innerHTML : "None"} placement="bottom">
                        <CheckCircleIcon color="success" sx={{mr:2,display:statusUpdate === 'success' ? 'block' : 'none'}}/>
                        <CircularProgress size={20} color="inherit" sx={{mr:2,display:statusUpdate === 'searching' ? 'block' : 'none'}}/>
                        <BrowserUpdatedIcon color="white" sx={{mr:2,display:statusUpdate === 'downloading' ? 'block' : 'none'}}/>
                    </Tooltip>
                    <Button onClick={handleLiquidationOpen}
                        variant='contained' 
                        color='success'
                        edge='start'
                        endIcon={<Event/>}
                        // sx={{mr: 2,display: {sm: 'none'},color:'red'}}
                    >
                        Liquidar Mes
                    </Button>
                    {/* <Link to={"/"}>
                        <IconButton>
                            <LanguageIcon/>
                        </IconButton>
                    </Link> */}
                    <IconButton 
                        color="error"
                        onClick={onLogout}
                        aria-label="Logout"
                        sx={{marginLeft:2}}
                    >
                        {darkMode === false ? <LightModeIcon sx={{color:"white"}}/> : <DarkModeIcon sx={{color:"black"}}/>}
                    </IconButton>
                </Box>

            </Grid>

        </Toolbar>
    </AppBar>
  )
}

NavBar.propTypes = {
    setOpenMenu: PropTypes.func.isRequired,
    drawerWidth: PropTypes.number
}