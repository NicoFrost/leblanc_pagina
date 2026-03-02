import React from 'react'
import { EditableGrid } from '../components'
import { use } from 'react'
import { useUIStore,useBuildingsStore, useEmployeesStore } from '../hooks'
import { Box } from '@mui/material'

const employeeColumns = [
  { field: 'fullname', headerName: 'Nombre Completo', width: 200,
    valueGetter: (value,row) => {    
      return `${row.name || ''} ${row.lastName || ''}`
    }
  },
  { field: 'phone', headerName: 'Teléfono', width: 100,headerAlign:'center', valueGetter: (value,row) => {
   return row.phone.join(' ') }},
  { field: 'address', headerName: 'Direccion', width: 200,headerAlign:'center' },
  { field: 'arca',headerName: 'ARCA?',width:100,type:'boolean',align:'center',headerAlign:'center' },
]

const buildingColumns = [
  { field: 'name', headerName: 'Edificio / Contacto', width: 200,valueGetter: (value,row) => row.buildingName + ' / ' + row.contactName },
  { field: 'address', headerName: 'Direccion', width: 150,headerAlign:'center' },
  { field: 'phone', headerName: 'Telefono', width: 140,valueGetter: (value,row) => row.phone.join(' '),headerAlign:'center' },
  { field: 'email', headerName: 'Mail', width: 200,headerAlign:'center'},
  { field: "type", headerName: 'Factura',width:100,align:'center',headerAlign:'center' ,},
]
export const BuildingsView = () => {

  const { openEmployeeModal, openBuildingModal } = useUIStore();
  const { activeBuilding,buildings,setActiveBuilding,startDeletingBuilding } = useBuildingsStore();
  const { activeEmployee,employees,setActiveEmployee,startDeletingEmployee } = useEmployeesStore();

  const handleSelection = (ids,type) => {
    
    let val = -1
    ids.forEach((value) => {
      if(ids.size != 0) {
        val = value
      }
    });
    if(type === 'building') {
      setActiveBuilding(val);
    } else {
      setActiveEmployee(val);
    }
  }
  
  return (
    <Box 
      sx={{display:"flex",flexDirection:"row",
        gap:"20px",
        width:"80vw",
        marginLeft:"40px",
        marginTop:"20px",
        justifyContent:"center"
      }}
    >
      <Box sx={{width:"45%",height:"80vh"}}>
        <EditableGrid
          colorTitle={'secondary'}
          title='Empleadas'
          collectionName="employees"

          onAdd={() => {openEmployeeModal()}}
          onEdit={() => {openEmployeeModal('edit')}}
          onDelete={startDeletingEmployee}
          
          columns={employeeColumns}
          rows={employees}
          onSelection={({ids}) => handleSelection(ids,'employees')}
          rowSelection={activeEmployee}
          
          buttonsPosition='end'
        />
      </Box>
      <Box sx={{width:"55%",height:"80vh"}}>
        <EditableGrid
          title="Buildings"
          colorTitle={'secondary'}
          collectionName="buildings"

          onAdd={() => {setActiveBuilding(-1);
              openBuildingModal()
          }}
          onEdit={() => {openBuildingModal('edit')}}
          onDelete={startDeletingBuilding}
          
          columns={buildingColumns}
          rows={buildings}
          onSelection={({ids}) => handleSelection(ids,'building')}
          rowSelection={activeBuilding}

          buttonsPosition='end'
        />
      </Box>
    </Box>
  )
}
