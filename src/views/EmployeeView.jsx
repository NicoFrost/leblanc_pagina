import React from 'react'
import { usePaymentsStore,useSalariesStore, useEmployeesStore, useForm, useUIStore } from '../hooks'
import { Box, Divider, Typography } from '@mui/material'
import { EditableGrid, FormCollection } from '../components'
import dayjs from 'dayjs'
import { enqueueSnackbar } from 'notistack'


const initialForm = {id: 0,date: new Date(),amount: '',methodId: '',type: '',salaryId: 0}
export const EmployeeView = () => {

  const {formState,onInputChange,onResetForm} = useForm(initialForm)
  const {salaries,activeSalary,setActiveSalary, setSettleSalary} = useSalariesStore()
  const {employees} = useEmployeesStore()
  const {payments,startSavingPayment} = usePaymentsStore();
  const {openSalaryModal,darkMode} = useUIStore();

  const [selection, setSelection] = React.useState({
    type: 'include', // or 'exclude'
    ids: new Set([]),
  });

  const salariesColumn = [
    { field: 'id', headerName: 'ID', width: 70 }, 
    { field: 'employeeId', headerName: 'Empleado', width: 150,
      valueGetter: (v,r) => {
        return employees.find(e => e.id == r.employeeId)?.name  || 'No asignado'
      }
    },
        { field: 'amountRemains',headerName: 'Deuda',width: 90,
      valueGetter: (v,r) => {
        let amountSettled = 0
        payments.map(c => {
          
          if(c.salaryId == r.id){
            amountSettled += c.amount
          }
        })
        
        return r.grossAmount - amountSettled
      }
    },
    { field: 'grossAmount', headerName: 'Monto Bruto', width: 90 },
    { field: 'date', headerName: 'Fecha', width: 150,
      valueGetter: (v) => v.format('DD/MM/YYYY')
    },
    { field: 'period', headerName: 'Período', width: 100 },
    { field: 'paid', headerName: 'Pagado?',width:100,type:'boolean' },
    { field: 'payments', headerName: 'Pagos', width:100,
      valueGetter: (v,r) => payments.filter((c) => c.salaryId == r.id).length,
      align: 'center' 
    }
  ]

  const onAddPayments = async (formData) => { 
      
    
    console.log(selection);
    
      if(!selection || selection.ids.size === 0) {
        enqueueSnackbar('Seleccione una factura para agregar el pago.',{variant:"info"})
        return
      }

      console.log(activeSalary);
      
      const payment = {
        ...formData,
        date: dayjs(formData.date),
        salaryId: activeSalary.id,
      }

      const response = await startSavingPayment(payment)
      console.log(response);
      
      (response.ok) && await setSettleSalary(formState)
  
      setSelection({
        type: 'include', // or 'exclude'
        ids: new Set([]),
      })
    }

  const handleClickInspect = (e) => {    
    openSalaryModal('edit')
    setActiveSalary(e.id)
  }
  
  return (
    <Box sx={{
      display:"flex",justifyContent:"center",
      marginLeft:{xs:"10px",sm:"5px",lg:"20px"},
      width:{xs:"85vw",sm:"54vw",md:"75vw",xl:"80vw"},
    }}>
      <Box width={"100%"}>
        <EditableGrid
          columns={salariesColumn}
          rows={salaries}
          
          title='Sueldos'
          colorTitle={'secondary'}
          CRUDButtons={false}
          rowSelection={true}
          checkboxSelection 
          disableRowSelectionOnClick
          height="100px"
          dataStyle={{
            maxWidth:"100%",
          }}
          onRowClick={handleClickInspect}
          isRowSelectable={(params) => params.row.paid == false}

          onSelection={({ids}) => {
            console.log(ids.values().next().value);
            if(ids.values().next().value == undefined){
              setSelection(undefined)
              setActiveSalary(undefined)
              return
            }
            setSelection({
              type: 'include', // or 'exclude'
              ids: new Set([ids.values().next().value]),
            })
            setActiveSalary(ids.values().next().value)
          }}
          rowSelectionModel={selection}
          // onRowSelectionModelChange={({ids}) => {                        
          //   setSelection({
          //     type: 'include', // or 'exclude'
          //     ids: new Set([ids.values().next().value]),
          //   })
          // }}
        />
      <Divider sx={{margin:"10px 0 30px 0","::before": { borderColor: "primary.main" }, "::after": { borderColor: "primary.main" }}}>
        <Typography sx={{color:darkMode ? "secondary.contrastText" : "secondary.main" }} variant='h5'>Pagos</Typography>
      </Divider>
      <FormCollection
        formState={formState}
        onInputChange={onInputChange}
        onAdd={onAddPayments}
        onReset={onResetForm}
        formType='payment'
      />
      </Box>
    </Box>
  )
}
