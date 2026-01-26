import { Box, Button, ButtonGroup, Divider, MenuItem, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { esES } from '@mui/x-data-grid/locales'
import PropTypes from 'prop-types'

const ShowElements = [
  {
    label:'Activos',
    value:"active",
  },
  {
    label:'Inactivos',
    value:"inactive",
  },
  {
    label:'Todos',
    value:"All",
  },
]

const ExampleColumn = [
  {
    field: 'name',
    headerName: 'Nombre',
    width: 250,
  },
  {
    field: 'quantity',
    headerName: 'Cant.',
    width: 70,
    disableColumnMenu: true
  },
  {
    field: 'size',
    headerName: 'Tamaño',
    width: 100,
  },
];

const ExampleRow = [
  {
    id:0,
    name: 'Calabaza',
    quantity: "20",
    size: "20x2"
  },
  {
    id:1,
    name: 'Puerro',
    quantity: "49",
    size: "10x4"
  },
  {
    id: 2,
    name: 'Zanahoria',
    quantity: "100",
    size: "10x2"
  }
]



export const EditableGrid = ({loadState,buttonsPosition = 'start',pagination = [5,25,100,240],children,rowSelection = false,onSelection,onAdd,onEdit,onDelete,rows = ExampleRow,columns = ExampleColumn,activeElement = {},CRUDButtons = true,ActiveAndInactiveSelect = false,slots,title = "",spacing = "0px",...otherSettings}) => {
  
  // console.log(Object.keys(rowSelection).length == 0);
  
  const buttonGroup = <ButtonGroup            
            color="secondary"
          >
            <Button
              onClick={onAdd}
            >AGREGAR
            </Button>
            <Button
              disabled={Object.keys(rowSelection).length == 0}
              onClick={onEdit}
            >EDITAR
            </Button>
          <Button
            disabled={Object.keys(rowSelection).length == 0}
            onClick={onDelete}
          >BORRAR
          </Button>
</ButtonGroup>
  
  return (
    <Box sx={{marginBottom:spacing,display: "flex",flexDirection: "column"}}>
      {
        (title != '' && CRUDButtons == false) &&
        (<Divider sx={{ marginBottom: "10px", "::before": { borderColor: "primary.main" }, "::after": { borderColor: "primary.main" }}}>
          <Typography fontSize={"22px"}>
              {title}
          </Typography>
        </Divider>)
      }
      <Box sx={{
          width:"100%",
          display:"flex",
          justifyContent:(buttonsPosition === 'end') ? "center" : "space-between",
          alignItems:"center",
          marginBottom:'30px'
        }}
      >
        {
          (title != "" && CRUDButtons) &&
            (
              <Typography fontSize={"22px"}>
                {title}
              </Typography>
            ) 
        }
        {
          (CRUDButtons) &&
            buttonsPosition === 'start' &&
            buttonGroup
        }
        {
          (ActiveAndInactiveSelect) &&
          <TextField 
            sx={{height:"40px"}}
            select
            className='select'
            defaultValue={'active'}
          >
            {
              ShowElements.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            }
          </TextField>
        }
      </Box>
      <DataGrid
        {...otherSettings}
        rows={rows}
        // rowCount={20}
        columns={columns}
        sx={{
            bgcolor:"background.info",
            height:"80%",
            maxWidth:'168vh',
            minHeight:'371px',
            marginBottom:(buttonsPosition === "end") ? "20px" : "0px",
        }}
        // disableColumnMenu
        
        disableMultipleRowSelection
        rowSelection={rowSelection}
        // rowSelectionModel={rowSelection}
        onRowSelectionModelChange={onSelection}
        disableRowSelectionExcludeModel
        pageSizeOptions={pagination}
        initialState={{
          pagination: {
            paginationModel: {pageSize: 5, page:1}
          }
        }}
        loading={loadState}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        slots={slots}
      />
      {
        (CRUDButtons) &&
          buttonsPosition === 'end' &&
          buttonGroup
      }
    </Box>
  )
}

EditableGrid.propTypes = {
  loadState: PropTypes.bool,
  buttonsPosition: PropTypes.oneOf(['start', 'end']),
  pagination: PropTypes.arrayOf(PropTypes.number),
  children: PropTypes.node,
  rowSelection: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
  ]),
  onSelection: PropTypes.func,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  rows: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeElement: PropTypes.object,
  CRUDButtons: PropTypes.bool,
  ActiveAndInactiveSelect: PropTypes.bool,
  slots: PropTypes.object,
  title: PropTypes.string,
  spacing: PropTypes.string,
}