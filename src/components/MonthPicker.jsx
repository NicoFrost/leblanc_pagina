import { Box, Button, Dialog, Divider, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import {esES} from '@mui/x-date-pickers/locales'
import { useState } from 'react'

import { useCalendarStore, useInvoiceStore, useSalariesStore } from '../hooks'
import dayjs from 'dayjs'

export const MonthPicker = (props) => {
    
    const { startLiquidationIInvoices,invoices} = useInvoiceStore()
    const {startLiquidationSalaries} = useSalariesStore()
    const [month, setMonth] = useState()
    const [multiplier,setMultiplier] = useState()

    const handleSelectMonth = async () => {
        // console.log(month,multiplier);
        
        // await startLiquidationIInvoices(month)
        await startLiquidationSalaries(month,multiplier)
        setMonth()
        props.onClose()
    }

    const isUsedMonth = (date) => {
        if (!invoices) return false
        return invoices.some(invoice => 
            invoice.settlementDate.get('year') === date.get('year') && 
            invoice.settlementDate.get('month') === date.get('month')
        )
    }
    


    return (
        <Dialog {...props}>
            <Box sx={{padding:"20px"}}>
                <Typography textAlign={"center"}>Seleccionar un Mes a liquidar</Typography>
                <Divider sx={{marginY:"10px",borderColor:"black"}} />
                <Box display={"flex"} flexDirection={"column"} gap={2}>
                    <DatePicker 
                        value={month} 
                        onAccept={(newValue) => setMonth(newValue)} 
                        label={'Mes a Liquidar'} 
                        views={['month','year']} 
                        // disableFuture
                        shouldDisableMonth={isUsedMonth}
                    />
                    <TextField 
                        label="Multiplicador por feriados"
                        value={multiplier}
                        type='number'
                        onChange={(e) => setMultiplier(e.target.value)}
                    />
                </Box>
                <Divider sx={{marginY:"10px"}} />
                <Box sx={{marginLeft:"60px"}}>
                    <Button variant='contained' color='success' onClick={handleSelectMonth}>Seleccionar</Button>
                </Box>
            </Box>
        </Dialog>
    )
}
