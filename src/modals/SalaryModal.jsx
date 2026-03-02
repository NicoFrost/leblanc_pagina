import { useEffect, useState } from 'react'
import { useMethodStore, usePaymentsStore, useSalariesStore, useUIStore } from '../hooks'
import { Box, Divider, List, ListItemButton, ListItemText, ListSubheader, Modal, Typography } from '@mui/material'
import { ModalLayout } from '../layout/ModalLayout'

    export const SalaryModal = () => {


    const {isSalaryModalOpen,closeSalaryModal} = useUIStore()
    const {activeSalary,setActiveSalary} = useSalariesStore()
    const {payments} = usePaymentsStore();
    const {getMethodById,methods} = useMethodStore()

    // console.log(methods);


    
    const onClosingModal = () => {
        closeSalaryModal()
        if(isSalaryModalOpen) {
            // setFormSubmitted(false)
            setActiveSalary({});
        }
        
        // console.log(activeProduct);
    }
    
    
    const [selectedIndex, setSelectedIndex] = useState({});

    useEffect(() => {
      setSelectedIndex({});
    }, [activeSalary])
    

  
    return (
        <Modal
            open={!!isSalaryModalOpen}
            onClose={onClosingModal}
            style={{
                top: "50%",
                left: "50%",
            }}
        >
            <Box>
                <ModalLayout offset='-100%' width={500}>
                    {/* <h1>{(activeEmployee == undefined) ? "Nuevo Empleado/a" : "Editar Empleado/a" }</h1> */}
                    <h2 style={{ color: "black", fontSize: "20px", textAlign: "center" }}>
                        Detalles de Sueldo {(activeSalary) ? activeSalary.id : ''}
                    </h2>
                    <Divider sx={{ marginY: "10px" }} />
                    <Box>
                        <Box display={"flex"} justifyContent={"space-around"}>
                            <Typography>Monto a pagar: {activeSalary?.grossAmount}</Typography>
                            <Typography>Fecha: {activeSalary?.date?.format('dddd DD/MM')}</Typography>
                            <Typography>Período: {activeSalary?.period}</Typography>
                        </Box>
                        <List>
                            <ListSubheader sx={{color:"black",fontWeight:800,fontSize:"20px"}}>Pagos</ListSubheader>
                            {
                            payments?.map((c) => {
                                let type = "";
                                if(c.salaryId == activeSalary?.id) {
                                    console.log(getMethodById(c.methodId));
                                    switch (c.type) {
                                        case 'full':
                                            type = "Completo"
                                            break;
                                        case 'advance':
                                            type = "Adelanto"
                                            break;
                                        case 'partial':
                                            type = "Parcial"
                                            break;
                                        default:
                                            type = "Desconocido"
                                            break;
                                    }
                                    return (
                                        <ListItemButton sx={{':hover':{backgroundColor: getMethodById(c.methodId)?.color || '#dddada'},padding: "5px",backgroundColor: getMethodById(c.methodId)?.color ? `${getMethodById(c.methodId).color}b3` : 'white' }} key={c.id} selected={selectedIndex.id === c.id} onClick={() => setSelectedIndex(c)}>
                                            {/* <ListItemText secondary={"Importe: " + c.amount} primary={`ID: ${c.id} Fecha: ${c.date.format('dddd DD/MM')}`} /> */}
                                            <ListItemText sx={{color: (selectedIndex.id === c.id) ? getMethodById(c.methodId)?.color + 'd6' : 'black'}} secondary={"Importe: " + c.amount} primary={`Fecha: ${c.date.format('dddd DD/MM')} Tipo: ${type}`} />
                                        </ListItemButton>
                                    )
                                }
                            })
                            }
                        </List>
                        <Typography>Monto Remanente: {activeSalary?.grossAmount - (payments?.filter(p => p.salaryId == activeSalary?.id)?.reduce((sum, p) => sum + p.amount, 0) || 0)}</Typography>
                        <ListSubheader sx={{color:"black",fontWeight:800,fontSize:"20px",marginTop:"20px"}}>Referencia de Métodos</ListSubheader>
                        <Box display={'flex'} flexWrap={"wrap"}>
                            {
                                methods?.filter(m => m.color).map((method) => (
                                    <Box key={method.id} sx={{display:"flex",alignItems:"center",padding:"8px",gap:"10px"}}>
                                        <Box sx={{width:"20px",height:"20px",backgroundColor:method.color,borderRadius:"3px"}}/>
                                        <Typography sx={{fontSize:"14px"}}>{method.name ? method.name : method.type[0].toUpperCase() + method.type.slice(1)}</Typography>
                                    </Box>
                                ))
                            }
                        </Box>

                    </Box>
                </ModalLayout>
                <ModalLayout
                    offset='10%'
                    width={500}
                >
                    <img width={"100%"} height={"100%"}
                        src={(selectedIndex.imageURL) ? selectedIndex.imageURL : "https://res.cloudinary.com/du7nakzdh/image/upload/v1763524852/leblanc/no-image_j12lcb.jpg"}
                        // src={}
                    />
                </ModalLayout>
        </Box>
        </Modal>
  )
}
