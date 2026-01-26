import dayjs from "dayjs";

const contractsRows = [
  {
    id: 1,
    buildingID: 1, // idBuilding
    employeeID: 1, // idEmployee
    hoursPerDay: 200,
    days: [],
    importHoursEdif: 0,
    importHoursEmp: 0,
    initialDays: '2025-05-19',
    endDays: '2025-05-19',
  },
  {
    id: 2,
    buildingID: 2,
    employeeID: 2,
    hoursPerDay: 200,
    days: [],
    importHoursEdif: 0,
    importHoursEmp: 0,
    initialDays: '2025-05-19',
    endDays: '2025-05-19',
  },
  {
    id: 3,
    buildingID: 3,
    employeeID: 3,
    hoursPerDay: 200,
    days: [],
    importHoursEdif: 0,
    importHoursEmp: 0,
    initialDays: '2025-05-19',
    endDays: '2025-05-19',
  },
];

const buildingsRows = [
  {
    id: 1,
    buildingName: 'Building A',
    contactName: 'María López',
    address: ['Main St','123'],
    articuloLimpieza: ['Detergente', 'Escoba', 'Paños'],
    phone: ['+54','91134127788'],
    email: 'maria.lopez@edifA.com',
    IVA: true,
    CoordX: -34.6037,
    CoordY: -58.3816,
  },
  {
    id: 2,
    buildingName: 'Building B',
    contactName: 'Ramon',
    address: ['Elm St','456'],
    articuloLimpieza: [],
    phone: ['',''],
    email: '',
    IVA: false,
    CoordX: -30.22,
    CoordY: 2.21,
  },
  {
    id: 3,
    buildingName: 'Building C',
    contactName: 'Lucía García',
    address: ['Oak St','789'],
    articuloLimpieza: ['Guantes', 'Limpiavidrios'],
    phone: ['+54','91199881122'],
    email: 'lucia.garcia@edifC.com',
    IVA: false,
    CoordX: -33.4489,
    CoordY: -70.6693,
  },
]

const employeeRows = [
  { id: 1, name: 'Ariel', lastName: 'Fernández', phone: ['+54','91167239101'], address: ['Calle Falsa','742','Rosario'], arca: false },
  { id: 2, name: 'Camila', lastName: 'Torres', phone: ['+54','91122347788'], address: ['Boulevard Libertad','1234','Mendoza'], arca: true },
  { id: 3, name: 'Luis', lastName: 'Rodriguez',phone: ['+54','91155553333'], address: ['Insurgentes Sur',"789",'CDMX'], arca: true },
]

const expensesRows = [
  { id: 1, description: 'Rotura de crista', amount: 1200, date: '2023-01-01', reason: 'EDIF', idEmployee: 1, idBuilding: 1 },
  { id: 2, description: 'Gastos Obra S.', amount: 300, date: '2023-01-15', reason: 'EMP', idEmployee: 2, idBuilding: 2 },
  { id: 3, description: 'Articulos de Limpieza', amount: 150, date: '2023-01-20', reason: 'EDIF', idEmployee: 3, idBuilding: 3 },
  { id: 4, description: 'Transporte', amount: 500, date: '2023-01-25', reason: 'EMP', idEmployee: 1, idBuilding: 2 },
  { id: 5, description: 'Gastos Varios', amount: 500, date: '2023-01-25', reason: 'EMP', idEmployee: 2, idBuilding: 1 }
]

const invoiceRows = [
  {
    id: 1,
    buildingId: 1,
    settlementDate: dayjs('2025-08-20'),
    total: 1200,
    settled: true,
    state: true,
  },
  {
    id: 2,
    buildingId: 2,
    settlementDate: dayjs('2025-05-12'),
    total: 750,
    settled: true,
    state: true,
  },
  {
    id: 3,
    buildingId: 3,
    settlementDate: dayjs('2025-05-15'),
    total: 430,
    settled: false,
    state: false,
  },
];

const collectionRows = [
  {
    id: 1,
    invoiceId: 1,
    amount: 700.00,
    date: dayjs('2025-05-11'),
    method: 'transferencia',
    imageURL: 'https://res.cloudinary.com/du7nakzdh/image/upload/v1763514544/leblanc/private_sys/wmcu8hccp1twqpkhtqqo.png'
  },
  {
    id: 2,
    invoiceId: 1,
    amount: 500.00,
    date: dayjs('2025-05-16'),
    method: 'efectivo'
  },
  {
    id: 3,
    invoiceId: 2,
    amount: 750.00,
    date: dayjs('2025-05-12'),
    method: 'tarjeta',
    imageURL: 'https://res.cloudinary.com/du7nakzdh/image/upload/v1763514747/leblanc/private_sys/ryf6voyiwgq29f2k4w4h.png'
  }
]

const eventsExamples = [
  {
    title:"efwr",
    notes:"wefewf",
    start: dayjs("2025-12-15 10:00").toDate(),
    end: dayjs("2025-12-15 20:00").toDate(),
    id:"657cc602ea523943d8923bff",
    user: {name: 'nicolas'}
  }
]

export {
    contractsRows,
    buildingsRows,
    employeeRows,
    expensesRows,
    collectionRows,
    invoiceRows,
    eventsExamples
}