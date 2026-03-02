import { useState } from 'react'
import { EditableGrid } from '../components'
import { FormCollection } from '../components/FormPayment'

import { useBuildingsStore, useEmployeesStore, useCollectionStore, useInvoiceStore, useForm, useUIStore } from '../hooks'
import dayjs from 'dayjs'

import { collectionRows } from '../helpers/getDataExample'
import { Alert, Box, Button, Divider, Snackbar, Typography } from '@mui/material'
import { enqueueSnackbar } from 'notistack'

const initialForm = {id: 0,date: new Date(),amount: '',method: ''}
export const ReportsView = () => {
  
  const {buildings} = useBuildingsStore()
  const {setActiveInvoice,setSettleInvoice,invoices} = useInvoiceStore()
  const {darkMode,openInvoiceModal} = useUIStore()
  const {collections, startSavingCollection} = useCollectionStore()
  // Prueba de agregado y eliminacion
  
  const {formState,onInputChange,onResetForm} = useForm(initialForm)

  const invoiceColumn = [
    // { field: 'description', headerName: 'Descripción', width: 150 },
    { field: 'total', headerName: 'Monto', width: 90 },
    { field: 'amountRemains',headerName: 'Deuda',width: 90,
      valueGetter: (v,r) => {
        let amountSettled = 0
        collections.map(c => {
          if(c.invoiceId == r.id){
            amountSettled += c.amount
          }
        })

        return r.total - amountSettled
      }
    },
    { field: 'settlementDate', headerName: 'Fecha', width: 150,
      valueGetter: (v) => v.format('MMMM YYYY')
    },
    { field: 'buildingId', headerName: 'Edificio', width: 150,
      valueGetter: (v) => v ? buildings.find((b) => b.id == v).buildingName : 'No asignado'
    },
    { field: 'settled', headerName: 'Saldado?',width:100,type:'boolean' },
    { field: 'collections', headerName: 'Cobranzas', width:100,
      valueGetter: (v,r) => collections.filter((c) => c.invoiceId == r.id).length,
      align: 'center'
    }
  ]

  const [selection, setSelection] = useState({})
  
  const onAddCollection = async (formData) => { 
    
    console.log(selection);
    
    if(!selection.ids || selection.ids.size === 0) {
      enqueueSnackbar('Seleccione una factura para agregar el pago.',{variant:"info"})
      return
    }
    const selectionId = selection.ids.values().next().value
    
    const collection = {
      ...formData,
      date: dayjs(formData.date),
      invoiceId: selectionId,
    }

    const response = await startSavingCollection(collection)
    console.log(response);
    
    (response.ok) && await setSettleInvoice(selectionId,formState)

    setSelection(undefined)
  }
  const handleClickInspect = (e) => {    
    openInvoiceModal('edit')
    setActiveInvoice(e.id)
  }
  
  // const [alertOpen, setAlertOpen] = useState(false)

  // const handleAlertOpen = (resolve) => {
  //   setAlertOpen(resolve)
  // }
  // const handleAlertClose = () => {  
  //   setAlertOpen(false)
  // }  
  console.log(darkMode);
  
  return (
    <Box sx={{width:"85vw",display:"flex",justifyContent:"center"}}>
      <Box>
      <EditableGrid
          mTop="20px"
          columns={invoiceColumn}
          rows={invoices.filter(i => i.state === true)}
          colorTitle={'secondary'}
          title='Facturas'
          CRUDButtons={false}
          onRowClick={handleClickInspect}
          isRowSelectable={(params) => params.row.settled == false}
          checkboxSelection 
          onSelection={(ids) => setSelection(ids)}
          rowSelection={selection}
          disableRowSelectionOnClick
          height="100px"
      />
      <Divider sx={{margin:"10px 0 30px 0","::before": { borderColor: "primary.main" }, "::after": { borderColor: "primary.main" }}}>
        <Typography sx={{color:(darkMode) ? 'secondary.contrastText' : 'secondary.main' }} variant='h5'>Cobranzas</Typography>
      </Divider>
      <FormCollection
        formState={formState}
        onInputChange={onInputChange}
        onAdd={onAddCollection}
        onReset={onResetForm}
      />
      </Box>
    </Box>
  )
}
