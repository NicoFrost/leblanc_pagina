import { useState } from "react";

import { Alert, Box, createTheme, Snackbar, ThemeProvider } from "@mui/material"
import PropTypes from 'prop-types';
// import { motion } from "framer-motion";


import { NavBar, SideBar } from "../components";
import { BuildingModal, EmployeeModal, InvoiceModal } from "../modals";
import { ContractModal } from "../modals/ContractModal";
import { ExpensesModal } from "../modals/ExpensesModal";
import { useBuildingsStore, useEmployeesStore, useExpensesStore, useMethodStore, useSalariesStore } from "../hooks";
import { useContractsStore } from "../hooks/useContractStore";
import { useInvoiceStore } from "../hooks/useInvoiceStore";
import { MonthPicker } from "../components/MonthPicker";
import { SnackbarProvider } from "notistack";
import { SalaryModal } from "../modals/SalaryModal";
import { MethodModal } from "../modals/MethodModal";
// TODO CREAR NUEVOS MODALS Y IMPORTARLOS
// import { MovementModal, ProviderModal, SelectionModal } from "../modals";
// import { ProductModal } from "../modals/ProductModal";
// import { CategoryModal } from "../modals/CategoryModal";
// import { TypeModal } from "../modals/TypeModal";
// import { TypeSelModal } from "../modals/TypeSelModal";
// import { CategorySelModal } from "../modals/CategorySelModal";
// import { UserModal } from "../modals/UserModal";

const drawerWidth = 280;

const menus = [
  {
    title: 'Leblanc Systems',
    id: 'home'
  },
  {
    title: 'Gestion de Edificios',
    id: 'buildings'
  },
  {
    title: 'Finanzas',
    id: 'finances'
  },
  {
    title: 'Liquidacion',
    id: 'reports'
  },
  {
    title: 'Calendario',
    id: 'calendar'
  },
  {
    title: 'Empleadas',
    id: 'employee'
  },
  {
    title: 'Usuarios',
    id: 'users'
  }
]

export const MenuLayout = ({children}) => {

  const [openMenu, setOpenMenu] = useState({left:'-281px',top:'20px'})
  const {activeEmployee} = useEmployeesStore()
  const {activeBuilding} = useBuildingsStore()
  const {activeExpense} = useExpensesStore()
  const {activeContract} = useContractsStore()
  const {activeInvoice} = useInvoiceStore()
  const {activeSalary} = useSalariesStore()
  const {activeMethod} = useMethodStore()
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const customTheme = createTheme({
    palette: {
      dark: {
        main: '#606060',
        contrastText: '#fff',
      },
      light: {
        main: '#fff',
        contrastText: '#000',
      },
      primary: {
        main: '#1470da',
        contrastText: '#fff',
      },
      secondary: {
        main: '#10345d',
        contrastText: '#fff',
      },
      buttons: {
        main: '#2e274a',
        contrastText: '#fff',
      },
    },
  });
  return (
    // <motion.div
    //   initial={{opacity:0,transition: {duration: 1}}}
    //   animate={{opacity: 1,transition: {duration:1 }}}
    //   exit={{opacity: 0,transition: {duration: 1}}}
    // >
    <ThemeProvider theme={customTheme}>

      <SnackbarProvider maxSnack={5}>
        <Box 
          sx={{
            display:"flex",
          }}
        >

          {/* NavBar drawerWidth*/}
          <NavBar handleLiquidationOpen={handleClickOpen} setOpenMenu={setOpenMenu} drawerWidth={drawerWidth}/>        
          {/* SideBar drawerWidth*/}
          <SideBar openMenu={openMenu} drawerWith={drawerWidth} menus={menus}/>

          <Box 
              component="main"
              sx={{
                flexGrow:1, 
                p: 3,
                paddingBottom:"0px",
                mt:"10px",
                ml:{sm:'260px'},
              }}
              
          >
              {/* Toolbar */}
              {children}
          </Box>
          <EmployeeModal initialForm={activeEmployee}/>
          <BuildingModal initialForm={activeBuilding}/>
          <ContractModal initialForm={activeContract}/>
          <ExpensesModal initialForm={activeExpense}/>
          <InvoiceModal initialForm={activeInvoice}/>
          <SalaryModal initialForm={activeSalary}/>
          <MethodModal/> 
          <MonthPicker 
            open={open} 
            onClose={handleClose} 
          />
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
    // </motion.div>
  )
}

MenuLayout.propTypes = {
  children: PropTypes.element.isRequired
}