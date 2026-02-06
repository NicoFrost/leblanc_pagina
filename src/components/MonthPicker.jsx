import { Box, Button, Dialog, Divider, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import {esES} from '@mui/x-date-pickers/locales'
import { useState } from 'react'

import { useInvoiceStore, useSalariesStore } from '../hooks'

export const MonthPicker = (props) => {
    
    const { startLiquidationIInvoices,invoices} = useInvoiceStore()
    const {startLiquidationSalaries} = useSalariesStore()
    const [month, setMonth] = useState()
    
    const handleSelectMonth = async () => {
        await startLiquidationIInvoices(month)
        await startLiquidationSalaries(month)
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
                <Typography>Seleccionar un Mes a liquidar</Typography>
                <Divider sx={{marginY:"10px",borderColor:"black"}} />
                    <DatePicker 
                        value={month} 
                        onAccept={(newValue) => setMonth(newValue)} 
                        label={'Mes a Liquidar'} 
                        views={['month','year']} 
                        // disableFuture
                        shouldDisableMonth={isUsedMonth}
                    />
                <Divider sx={{marginY:"10px"}} />
                <Box sx={{marginLeft:"60px"}}>
                    <Button variant='contained' color='success' onClick={handleSelectMonth}>Seleccionar</Button>
                </Box>
            </Box>
        </Dialog>
    )
}
