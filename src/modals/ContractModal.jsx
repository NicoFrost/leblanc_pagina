import { Box, Button, CircularProgress, Divider, Fade, FormControl, FormControlLabel, InputLabel, MenuItem, Modal, Paper, Popper, Select, Switch, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CheckIcon from '@mui/icons-material/Check';
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useBuildingsStore, useEmployeesStore, useForm, useUIStore } from '../hooks';
import styled from '@emotion/styled';
import { useContractsStore } from '../hooks/useContractStore';
import dayjs from 'dayjs';
import { DayTimeStartEnd } from '../components/DayTimeStartEnd';

// import 'dayjs/locale/es'          // importa la locale
import localizedFormat from 'dayjs/plugin/localizedFormat'
import localeData from 'dayjs/plugin/localeData'
import calcularHorasMensuales from '../helpers/calcularHorasMensuales';
import Swal from 'sweetalert2';

dayjs.extend(localizedFormat)
dayjs.extend(localeData)

// establece español globalmente
dayjs.locale('es')



const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        "white",
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        "white",
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const initialFormShape = {initialDate: undefined,endDate: undefined,days: [''],hourlyRate:"",hoursPerDay:"",employeeId: '',buildingId:''}
export const ContractModal = ({initialForm = initialFormShape}) => {

    
    const {isContractModalOpen,isEmployeeModalOpen,isBuildingModalOpen , closeContractModal,openBuildingModal,openEmployeeModal} = useUIStore();
    const {activeContract,contracts,setActiveContract,startSavingContract} = useContractsStore();
    const {buildings,getBuildingByID} = useBuildingsStore();
    const {employees,getEmployee : getEmployeeByID} = useEmployeesStore();
    
    const {onInputChange,formState,onResetForm,isFormValid} = useForm(initialForm)
    const [formSubmitted, setFormSubmitted] = useState(false);
    
    // const [employee, setEmployee] = useState('');
    // const [building, setBuilding] = useState('');
    
    const [buildingList, setBuildingList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);

    // Refs para detectar cambios en el tamaño de arrays
    const prevEmployeesLength = useRef(employees.length);
    const prevBuildingsLength = useRef(buildings.length);

    useEffect(() => {
        setBuildingList(buildings);
        setEmployeeList(employees);
    }, [buildings, employees])    

    // const [dias,setDias] = useState(formState.days)
    const [localDays,setLocalDays] = useState([])
    const [horarioInicio, setHorarioInicio] = useState('');

    // Derivar dias de localDays (incluye todos, incluso sin horario)
    const dias = useMemo(() => localDays?.map(([d]) => d) || [], [localDays]);

    useEffect(() => {      
          
        setLocalDays(formState.days || [])
    },[formState.days])

    const [horaXMes, setHoraXMes] = useState('')
    const [totalXMes, setTotalXMes] = useState('')
    const [salarioEmpleada, setSalarioEmpleada] = useState('')
    const [ganancia, setGanancia] = useState('')
    
    useEffect(() => {
        
        if(!localDays) return
        
        // const totalHoras = calcularHorasMensuales(localDays,dayjs("1/1/26").month(),dayjs("1/1/26").year())
        const totalHoras = calcularHorasMensuales(localDays,dayjs(formState.initialDate).month(),dayjs(formState.initialDate).year(),dayjs(formState.endDate));
        if(isNaN(totalHoras)) return
        setHoraXMes(totalHoras);
        
        if(!formState.hourlyRate || !formState.hoursPerDay) return
        const gananciaBruta = totalHoras * formState.hourlyRate
        const SalarioMensualEmpleada = totalHoras * formState.hoursPerDay
        setTotalXMes(gananciaBruta)
        setSalarioEmpleada(SalarioMensualEmpleada)
        setGanancia(gananciaBruta - SalarioMensualEmpleada)
        
    },[localDays,formState.initialDate,formState.hourlyRate,formState.hoursPerDay,formState.endDate])

    // TODO SE DEBE MODIFICAR PARA CUANDO SE CREA UNO INSITU SE PONGA EL NUEVO ID DEL BUILDING/EMPLOYEE EN formState.employeeId/formState.buildingId
    useEffect(() => {
        if (!isEmployeeModalOpen && formState.employeeId == 0 && employees.length > prevEmployeesLength.current) {
            // Se añadió un nuevo empleado mientras el modal estaba abierto
            const newEmployeeId = employees[employees.length - 1].id;
            onInputChange({ target: { name: 'employeeId', value: newEmployeeId } });
        }
        prevEmployeesLength.current = employees.length;
    }, [isEmployeeModalOpen, employees, formState.employeeId, onInputChange]);

    useEffect(() => {
        if (!isBuildingModalOpen && formState.buildingId == 0 && buildings.length > prevBuildingsLength.current) {
            // Se añadió un nuevo edificio mientras el modal estaba abierto
            const newBuildingId = buildings[buildings.length - 1].id;
            onInputChange({ target: { name: 'buildingId', value: newBuildingId } });
        }
        prevBuildingsLength.current = buildings.length;
    }, [isBuildingModalOpen, buildings, formState.buildingId, onInputChange]);


    const onClosingModal = () => {
        
        if(Object.keys(formState).length > 2 && isContractModalOpen != 'readonly') {
            Swal.fire({
                title:'Seguro que quiere salir?',
                html: 'se perderan los datos ingresados',
                icon: 'question',
                showConfirmButton: true,
                showCancelButton: true, 
            }).then(result => {
                if(result.isConfirmed){
                    closeContractModal()

                    if(isContractModalOpen) {
                        setFormSubmitted(false)
                        setActiveContract({})
                        onResetForm()
                
                        setLocalDays([])
                        setHoraXMes('')
                        setTotalXMes('')
                        setSalarioEmpleada('')
                        setGanancia('')
                        // setEmployee('')
                        // setBuilding('')
                    }
                }
            })
        } else {
            closeContractModal()
        }
        
    }

    const handleStartHoursChange = (inicio,day = 'day-U') => {
        setHorarioInicio(inicio)

        const dayKey = day.split('-')[1];
        const start = inicio ?? '';
        const newEntry = [dayKey, `${start.format('HH:mm')}-`];
        
        setLocalDays(prev => {
            
            if(prev) {
                const others = prev.filter(([d]) => d !== dayKey);
                return [...others, newEntry];
            }
            return [newEntry]
        });
    }
    
    // turnos = ["L_15:00-19:00","X_06:30-09:30"]
    // mes = 3
    // año = 2025
    
    const handleEndHoursChange = (end,day = 'day-U') => {      
        
        const dayKey = day.split('-')[1];
        const start = horarioInicio ?? '';
        const newEntry = [dayKey, `${start.format('HH:mm')}-${end.format('HH:mm')}`];

        // actualizar de forma inmutable: reemplaza la entrada del mismo día o la añade
        setLocalDays(prev => {
            
            if(prev) {
                const others = prev.filter(([d]) => d !== dayKey);
                return [...others, newEntry];
            }
            return [newEntry]
        });
    }

    const handleDaysChange = (event) => {
        const { value, checked } = event.target;
        
        if (checked) {
            // Añadir el día con horario vacío si no existe
            setLocalDays(prev => {
                if (prev.some(([d]) => d === value)) return prev;
                return [...prev, [value, '']];
            });
        } else {
            // Remover el día
            setLocalDays(prev => prev.filter(([d]) => d !== value));
        }
    }


    const handleChange = (event) => {
        if(event.target.name === "employee") {
            // setEmployee(event.target.value)
            if(event.target.value == 0){
                openEmployeeModal()
            }
            onInputChange({ target: { name: 'employeeId', value: event.target.value } })
        };
        if(event.target.name === "building") {
            // setBuilding(event.target.value)
            if(event.target.value == 0){
                openBuildingModal()
            }
            onInputChange({ target: { name: 'buildingId', value: event.target.value } })
        };
        
    };
        
    //* PRUEBAS DE NUEVO SISTEMA DE HORA POR DIA

    const onSubmit = async (event) => {
        event.preventDefault()

        setFormSubmitted(true);
        setTimeout(() => {
            startSavingContract({
                ...formState,
                hourlyRate: parseInt(formState.hourlyRate),
                hoursPerDay: parseInt(formState.hoursPerDay),
                days: localDays,
                state: true,
            })
            setFormSubmitted(false);
            setActiveContract({})
            onResetForm()

            setLocalDays([])
            setHoraXMes('')
            setTotalXMes('')
            setSalarioEmpleada('')
            setGanancia('')
            closeContractModal()
        }, 3000);
    }
    
    const isEmployeeOccupied = (idEmployee) => {
        
        const activeDaysWithRanges = localDays
            ?.filter(day => day[0] && day[1]);

        const rangesOverlap = (range1, range2) => {
            const [start1, end1] = range1.split('-').map(t => dayjs(`2000-01-01 ${t}`));
            const [start2, end2] = range2.split('-').map(t => dayjs(`2000-01-01 ${t}`));
            return start1.isBefore(end2) && start2.isBefore(end1);
        };

        // Al editar, excluir el contrato actual para no bloquear al empleado asignado
        const contractsToCheck = isContractModalOpen === 'edit' ? contracts.filter(c => c.id !== activeContract?.id) : contracts;

        return contractsToCheck.some(contract => {
            if (contract.employeeId !== idEmployee) return false;
            
            return contract.days?.some(contractDay => {
                const [contractDayKey, contractTimeRange] = contractDay;
                const formDay = activeDaysWithRanges?.find(([d]) => d === contractDayKey);
                if (formDay) {
                    const [, formTimeRange] = formDay;
                    return rangesOverlap(formTimeRange, contractTimeRange);
                }
                return false;
            });
        });
    }

    return (
        <Modal
            open={!!isContractModalOpen}
            onClose={onClosingModal}
            style={{
                top: '50%',
                left: '50%',
                zIndex:50,
            }}
        >
            <Box sx={{width:0,backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
                <Box

                    component={'form'}
                    onSubmit={onSubmit}
                    sx={{
                        position: "absolute",   
                        transform: "translate(-100%, -50%)",
                        width: 500,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        borderRadius: "10px",
                        boxShadow: 24,
                        color:"black",
                        p: 4,
                    }}
                    id="contract-form"
                >
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es"> */}
                    {/* <h1>{(activeEmployee == undefined) ? "Nuevo Empleado/a" : "Editar Empleado/a" }</h1> */}
                    <h2 style={{fontSize: "40px", textAlign: "center",margin:"0px"}}>CONTRATO</h2>
                    <h2 style={{fontSize: "30px",fontWeight:"normal", textAlign: "center",margin:"0px",marginBottom:"30px"}}>
                        {(isContractModalOpen != 'edit' && isContractModalOpen != 'readonly') ? "Nuevo Contrato" : getBuildingByID(activeContract?.buildingId)?.buildingName}
                    </h2>
                    <Box sx={{display:"flex",justifyContent:"space-around",mt:4}}>
                        {["L","M","X","J","V","S"].map(day => (
                            (isContractModalOpen !== 'readonly') &&
                                <FormControlLabel
                                // disabled={isContractModalOpen === 'readonly'}
                                sx={{color:"black",display:"flex",flexDirection:"column-reverse",margin:"0px"}}
                                    control={<Android12Switch />}
                                    label={day}
                                    value={day}
                                    // checked={formState.days?.includes('L')}
                                    key={day}
                                    checked={dias?.includes(day)}
                                    onChange={handleDaysChange}
                                />

                        ))}
                    </Box>
                    <Box>
                            {
                                [['L','Lunes'],['M','Martes'],['X','Miercoles'],['J','Jueves'],['V','Viernes'],['S','Sabado']].map(day => {
                                    return (dias?.includes(day[0])) && <DayTimeStartEnd key={day[0]} disabled={isContractModalOpen === 'readonly'} title={day[1]} dayActive={day[0]} horarios={localDays} handlerInicio={handleStartHoursChange} handlerFinal={handleEndHoursChange}/>
                                })
                            }
                    </Box>  
                    <Box sx={{display:"flex",justifyContent:"space-around",marginY:"15px"}}>
                        <Box sx={{display:"flex",flexDirection:"column",margin:"auto",maxWidth:"80%"}}>
                            <Typography color='primary' textAlign={'center'} >Inicio del contrato</Typography>
                            {
                                (isContractModalOpen === 'readonly') ?
                                    <Typography marginY={2} textAlign={'center'}>{dayjs(formState.initialDate).format('DD/MM/YYYY')}</Typography>
                                    :
                                    <DatePicker 
                                        name='initialDate'
                                        // disablePast  
                                        disabled={isContractModalOpen === 'readonly'}
                                        defaultValue={undefined}
                                        value={formState.initialDate ? dayjs(formState.initialDate) : null} 
                                        onChange={(date) => {onInputChange({ target: { name: 'initialDate', value: date }})}} 

                                    />
                            }
                        </Box>
                        <Box sx={{display:"flex",flexDirection:"column",margin:"auto",maxWidth:"80%"}}>
                            <Typography color='primary' textAlign={'center'} >Fin del contrato</Typography>
                            {
                                (isContractModalOpen === 'readonly') ?
                                <Typography marginY={2} textAlign={'center'}>{dayjs(formState.endDate).format('DD/MM/YYYY')}</Typography>
                                :
                                <DatePicker 
                                    disabled={!formState.initialDate || isContractModalOpen === 'readonly'}
                                    name='endDate' 
                                    // disablePast
                                    localeText={{ start: 'lunes', end: 'domingo' }}
                                    minDate={formState.initialDate ? dayjs(formState.initialDate) : null} 
                                    value={formState.endDate ? dayjs(formState.endDate) : null} 
                                    onChange={(date) => onInputChange({ target: { name: 'endDate', value: date } })}
                                />
                            }
                        </Box>
                    </Box>
                    <Divider/>
                    <Box marginY={"15px"}>
                        <Box sx={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:"15px"}}>
                            <Typography color='secondary'>Importe por hora para Edificio</Typography>
                            { (isContractModalOpen === 'readonly') ? <Typography>{formState.hourlyRate.toLocaleString('es-ES')}</Typography> : <TextField onChange={onInputChange} name='hourlyRate' value={formState.hourlyRate} type='text'/>}
                            {/* IMPORTE X HORA */}
                        </Box>
                        <Box sx={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:"15px"}}>
                            <Typography color='secondary'>Sueldo Emp. por hora</Typography>
                            <Box ></Box>
                            { (isContractModalOpen === 'readonly') ? <Typography>{formState.hoursPerDay.toLocaleString('es-ES')}</Typography> : <TextField onChange={onInputChange} name='hoursPerDay' value={formState.hoursPerDay} type='number'/>}
                        </Box>
                    </Box>
                    <Box marginY-={"15px"} sx={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        {
                            (isContractModalOpen === 'readonly') ? <Box className='form-selectors' textAlign={'center'}><Typography color='primary' fontWeight={'bold'}>- Empleado -</Typography><Typography variant='h5' sx={{marginTop:1.5}} >{getEmployeeByID(formState.employeeId).name}</Typography></Box>
                            :
                            <FormControl className='form-selectors'>
                                <InputLabel id="employee-label">Empleado</InputLabel>
                                <Select
                                    value={formState.employeeId}
                                    label="Empleado"
                                    name='employee' 
                                    onChange={handleChange}
                                >
                                    <MenuItem value={0}>Crear</MenuItem>
                                    {
                                        employeeList.length > 0 ? (
                                            employeeList.map(element => (
                                                <MenuItem disabled={isEmployeeOccupied(element.id)}  key={element.id} value={element.id}>{element.name}</MenuItem>
                                            ))
                                        ) : (
                                            <h4>No hay empleados disponibles</h4>
                                        )
                                    }
                                </Select>
                            </FormControl>
                        }
                        {
                            (isContractModalOpen === 'readonly') ? <Box className='form-selectors' textAlign={'center'}><Typography color='primary' fontWeight={'bold'}>- Edificio -</Typography><Typography variant='h5' sx={{marginTop:1.5}} >{getBuildingByID(formState.buildingId).buildingName}</Typography></Box>
                            :
                            <FormControl className='form-selectors'>
                                <InputLabel id='building-label'>Edificio</InputLabel>
                                <Select
                                    value={formState.buildingId}
                                    label="Edificio"
                                    name='building'
                                    disabled={isContractModalOpen === 'readonly'}
                                    onChange={handleChange}

                                >
                                    <MenuItem value={0}>Crear</MenuItem>
                                    {
                                        buildingList.length > 0 ? (
                                            buildingList.map(element => (
                                                <MenuItem key={element.id} value={element.id}>{element.buildingName}</MenuItem>
                                            ))
                                        ) : (
                                            <h4>No hay edificios disponibles</h4>
                                        )
                                    }
                                </Select>
                            </FormControl>
                        }    
                    </Box>
                    <Box sx={{display:"flex",justifyContent:"center",mt:4}}>
                        {(isContractModalOpen !== 'readonly') &&
                        <Button disabled={formSubmitted} variant='contained' sx={{width:"170px",height:"40px"}} color='success' type='submit' form={"contract-form"}>
                            {
                                formSubmitted ?                           
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: "white",
                                        // top: '50%',
                                        // left: '50%',
                                        // marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                                : "Crear Contrato"
                            }

                        </Button>
                        }
                    </Box>
                    {/* </LocalizationProvider> */}
                </Box>
                <Box
                    sx={{
                        // position: "absolute",
                        transform: "translate(10%, -50%)",
                        width: 500,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        borderRadius: "10px",
                        boxShadow: 24,
                        color:"black",
                        p: 4,
                    }}
                >
                    <Typography variant='h6'>Hora x Mes: {horaXMes}</Typography>
                    {(getBuildingByID(formState.buildingId)?.type !== "A") && <Typography variant='h6'>Hora $ c/IVA: {(new Number(formState.hourlyRate) * 0.21 + new Number(formState.hourlyRate)).toLocaleString('es-ES')}</Typography>}
                    <Typography variant='h6'>Total x Mes (neto) $: {totalXMes.toLocaleString('es-ES')}</Typography>
                    <Typography variant='h6'>IVA: {new Number((horaXMes * formState.hourlyRate) * 0.21).toLocaleString('es-ES')}</Typography>
                    <Typography variant='h6'>Salario Empleada x Mes: {new Number(salarioEmpleada).toLocaleString('es-ES')}</Typography>
                    <Typography variant='h6'>Facturacion Mensual Aprox $ (con IVA): {((horaXMes * formState.hourlyRate) + ((horaXMes * formState.hourlyRate) * 0.21 )).toLocaleString('es-ES')}</Typography>
                    <Typography variant='h5' color={(ganancia > 0) ? 'green' : (ganancia) ? 'red' : 'black' }>Ganancia (sin iva): {ganancia.toLocaleString('es-ES')} (%{Math.floor((ganancia/totalXMes) * 100)})</Typography>
                    <Typography variant='subtitle1'>*datos calculados con mes actual</Typography>
                </Box>
            </Box>
        </Modal>
    )
}
