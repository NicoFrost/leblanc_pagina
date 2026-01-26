// import { LogoutOutlined, MenuOutlined } from "@mui/icons-material"
import { AppBar, Box, Button, Grid, IconButton, Toolbar, Typography } from "@mui/material"
// import { useAuthStore } from "../../hooks/useAuthStore"
import { Event, LogoutOutlined, MenuOutlined } from "@mui/icons-material";
import LanguageIcon from '@mui/icons-material/Language';
import PropTypes from 'prop-types'
import { useAuthStore } from "../hooks";
//  TODO INSTALAR SWEET ALERTS 2
// import Swal from "sweetalert2";
import { Link } from "react-router-dom";


let menuOpen = 0;
export const NavBar = ({handleLiquidationOpen,setOpenMenu,drawerWidth}) => {

    const {user,startLogout} = useAuthStore();

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
        Swal.fire({
            title:"Esta seguro de salir?",
            icon:"info",
            showDenyButton:true,
            showConfirmButton:true,
            confirmButtonText: "Si, quiero salir",
            denyButtonText:"No, quiero quedarme"
        }).then(async (result) => {
            if(result.isConfirmed){
                startLogout(); 
            }
        })
   
        // console.log("SALIENDO!");
    }

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
                <Box>
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
                    >
                        <LogoutOutlined/>
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