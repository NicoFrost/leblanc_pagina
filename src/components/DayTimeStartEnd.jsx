import { Box, Typography } from '@mui/material'
import TimeIconPicker from './TimeIconPicker'
import dayjs from 'dayjs';

export const DayTimeStartEnd = ({title,dayActive,horarios = [],handlerInicio,handlerFinal,disabled}) => { 
    
    
    const definedRange = horarios.find(hrs => hrs[0] == dayActive)
   
    return (
        <Box component={"div"} sx={{display:"flex",alignItems:"center",justifyContent:'space-around'}}>
            <Typography sx={{minWidth: "70px"}}>{title}</Typography>
            <Box display={disabled ? 'none' : 'block'} >
                <TimeIconPicker disabled={disabled} poppertitle={'Inicio'} handler={(e) => handlerInicio(e,`day-${dayActive}`)}/> - <TimeIconPicker disabled={disabled} minTime={dayjs(`10/10/2025 ${definedRange[1].split('-')[0]}`) || false} poppertitle={'Fin'} handler={(e) => handlerFinal(e,`day-${dayActive}`)}/>
            </Box>
            <Box sx={{minWidth:"200px",minHeight:"50px",display:"flex",alignItems:"center",justifyContent: 'flex-end'}}>
            {(definedRange) ? definedRange[1] : '' }
            </Box>
        </Box>
    )
}
