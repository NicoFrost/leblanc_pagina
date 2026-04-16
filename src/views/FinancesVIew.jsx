import React, { useEffect, useState } from 'react'
import { EditableGrid } from '../components'
import { Box, Button } from '@mui/material'
import { useBuildingsStore, useEmployeesStore, useExpensesStore, useUIStore } from '../hooks'
import { useContractsStore } from '../hooks/useContractStore'

export const FinancesView = () => {

  const {openContractModal,openExpensesModal} = useUIStore()
  const {expenses,activeExpense,setActiveExpense,startDeletingExpense} = useExpensesStore();
  const {contracts,activeContract,setActiveContract,startDeletingContract} = useContractsStore();
  const {getEmployee} = useEmployeesStore()
  const {getBuildingByID} = useBuildingsStore()

  // console.log(contracts);
  
  const handleSelection = (ids,type) => {
    
    let val = -1
    ids.forEach((value) => {
      if(ids.size != 0) {
        val = value
      }
    });

    if(type === 'contract') {
      setActiveContract(val);
    } else {
      setActiveExpense(val);
    }
  }

  const expensesColumns = [
    { field: 'description', headerName: 'Descripción', width: 150 },
    { field: 'amount', headerName: 'Monto', width: 150 },
    { field: 'date', headerName: 'Fecha', width: 150,valueGetter: (value,row) => {
      return value.format('dddd DD/MM')
    }},
    { field: 'reason', headerName: 'Razón', width: 150 }
  ]
  
  const contractColumns = [
    { field: 'buildingId', headerName: 'Edificio', width: 120,valueGetter: (value,row) => {
      const building = getBuildingByID(row.buildingId)
      return building?.buildingName || ''
    }},
    { field: 'employeeId', headerName: 'Empleada', width: 120,valueGetter: (value,row) => {
      const employee = getEmployee(row.employeeId)
      return employee?.name || ''
    } },
    { field: 'days', headerName: 'Horarios', width: 360, valueGetter: (value, row) => {
      const dayNames = { L: 'Lun', M: 'Mar', X: 'Mié', J: 'Jue', V: 'Vie', S: 'Sáb' };
      return row.days?.filter(([day, time]) => time).map(([day, time]) => `${dayNames[day] || day}: ${time}`).join('; ') || 'Sin horarios';
    }},
    { field: 'initialDate', headerName: 'Inicio', width: 100, valueGetter: (value,row) => value.format('DD/MM/YY')},
    { field: 'endDate', headerName: 'Fin', width: 100,valueGetter: (value,row) => value.format('DD/MM/YY')},
  ]

  // console.log(activeExpense);
  
  return (
    <Box sx={{
      display:"flex",
      flexDirection:{xs:"column",sm:"row",},
      gap:"20px",
      width:{xs:"80vw",sm:"73vw",xl:"80vw"},
      marginLeft:{xs:"10px",sm:"5px",lg:"20px"},
      marginTop:{xs:"40px",sm:"40px"},  
      justifyContent:"center",
      // overflowY:"auto",
      overflowX:"hidden",
      paddingBottom:"20px"
    }}>
      <Box sx={{width:{xs:"100%",sm:"45%"}}}>
        <EditableGrid
          title='Contratos'
          collectionName="contracts"
          colorTitle={'secondary'}
          columns={contractColumns}
          rows={contracts}
          
          onAdd={openContractModal}
          onEdit={() => {openContractModal("edit")}}
          onDelete={startDeletingContract}
          onRowDoubleClick  ={(e) => (openContractModal('readonly'),setActiveContract(e.id))}

          onSelection={({ids}) => handleSelection(ids,'contract')}
          rowSelection={activeContract}
        
          buttonsPosition='end'
          spacing='20px'
        />
      </Box>
      <Box sx={{width:{xs:"100%",sm:"45%"}}}>
        <EditableGrid
          title='Gastos'
          collectionName="expenses"
          colorTitle={'secondary'}
          columns={expensesColumns}
          rows={expenses}
          buttonsPosition='end'
          
          onAdd={openExpensesModal}
          onEdit={() => {openExpensesModal('edit')}}
          onDelete={startDeletingExpense}

          onSelection={({ids}) => handleSelection(ids,'expense')}
          rowSelection={activeExpense}

        />
      </Box>
    </Box>
  )
}
