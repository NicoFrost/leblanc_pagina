import React, { useState } from 'react'
import {Box, createTheme, Divider, ThemeProvider} from '@mui/material'
import { BarPlot, ChartContainer, ChartsLegend, ChartsTooltip, ChartsXAxis, ChartsYAxis, LinePlot } from '@mui/x-charts';
import { useCalendarStore, useEmployeesStore, useExpensesStore, useInvoiceStore, useSalariesStore } from '../hooks';
import dayjs from 'dayjs';

// Altura fija para el contenedor del gráfico
const chartHeight = 700

// Formateador de valores para mostrar en formato de moneda
export function valueFormatter(value) {
  if (value === null) return ''
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Definición de todas las series (Barras y Línea)
const series = [
  {
    type: 'bar',
    dataKey: 'revenue',
    label: 'Ingresos',
    valueFormatter: valueFormatter,
    color: '#00c853', // Verde para Ingresos
    id: 'revenueBar',
  },
  {
    type: 'bar',
    dataKey: 'cost',
    label: 'Costos',
    valueFormatter: valueFormatter,
    color: '#e53935', // Rojo para Costos
    id: 'costBar',
    stack: 'expenses', // Agrupar Costos y Salarios en la misma barra
  },
  {
    type: 'bar',
    dataKey: 'salaries',
    label: 'Salarios',
    valueFormatter: valueFormatter,
    color: '#ff9100', // Naranja para Salarios
    id: 'salariesBar',
    stack: 'expenses', // Agrupar en la misma barra que Costos
  },
  {
    type: 'line',
    dataKey: 'profit',
    label: 'Ganancia (Ingresos - Costos)',
    valueFormatter: valueFormatter,
    color: '#2979ff', // Azul para la Ganancia (línea)
    id: 'profitLine',
  },
]

export const HomeView = () => {
  // const [colorMode, setColorMode] = useState(theme.palette.mode);
  const [counter, setCounter] = useState(0)
  
  const dataset = [
  { month: 'Enero', revenue: 5000, cost: 3000, profit: 2000 },
  { month: 'Febrero', revenue: 7000, cost: 4000, profit: 3000 },
  { month: 'Marzo', revenue: 6000, cost: 3500, profit: 2500 },
  { month: 'Abril', revenue: 8000, cost: 4500, profit: 3500 },
  { month: 'Mayo', revenue: 7500, cost: 3800, profit: 3700 },
  { month: 'Junio', revenue: 9000, cost: 5000, profit: 4000 },
  { month: 'Julio', revenue: 8500, cost: 4200, profit: 4300 },
  { month: 'Agosto', revenue: 9500, cost: 4800, profit: 4700 },
  { month: 'Septiembre', revenue: 7000, cost: 3000, profit: 4000 },
  { month: 'Octubre', revenue: 8000, cost: 3500, profit: 4500 },
  { month: 'Noviembre', revenue: 9000, cost: 4000, profit: 5000 },
  { month: 'Diciembre', revenue: 10000, cost: 4500, profit: 5500 },
];
  // TODO: Pendiente de vincular con datos reales 
  const {invoices} = useInvoiceStore()
  const {expenses} = useExpensesStore();
  const {salaries} = useSalariesStore();
  const {events} = useCalendarStore();


  const eventsRecents = [...events].sort((a,b) => dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : -1);
  
  const dataset2 = invoices.reduce((acc, inv) => {
    const month = inv.settlementDate.format('MMMM');
    const monthName = month.charAt(0).toUpperCase() + month.slice(1);
    console.log(salaries,expenses);
    
    const expensesCost = expenses
      .filter(exp => exp.date.format('MMMM').charAt(0).toUpperCase() + exp.date.format('MMMM').slice(1) === monthName)
      .reduce((sum, exp) => sum + exp.amount, 0);

    const salariesCost = salaries
      .filter(sal => sal.date.format('MMMM').charAt(0).toUpperCase() + sal.date.format('MMMM').slice(1) === monthName)
      .reduce((sum, sal) => sum + sal.grossAmount, 0);

    const cost = expensesCost;
    const revenue = inv.total;
    const profit = revenue - expensesCost - salariesCost;

    const existing = acc.find(item => item.month === monthName);
    
    if (existing) {
      existing.revenue += revenue;
      existing.cost += cost;
      existing.profit = existing.revenue - existing.cost - (salaries
        .filter(sal => sal.date.format('MMMM').charAt(0).toUpperCase() + sal.date.format('MMMM').slice(1) === monthName)
        .reduce((sum, sal) => sum + sal.grossAmount, 0));
    } else {
      acc.push({ month: monthName, revenue, cost, profit });
    }
    
    return acc;
  }, []);

  const dataset2WithSalaries = dataset2.map(item => ({
    ...item,
    salaries: salaries
      .filter(sal => sal.date.format('MMMM').charAt(0).toUpperCase() + sal.date.format('MMMM').slice(1) === item.month)
      .reduce((sum, sal) => sum + sal.grossAmount, 0)
  }));

  console.log(dataset2WithSalaries);
  
  console.log(dataset2);

  const newTheme = createTheme({ palette: { mode: 'dark' } });
  return (
    <ThemeProvider theme={newTheme}>
      <Box sx={{display:"flex",flexDirection:'row',gap:2,marginTop:4}}>
        <Box sx={{ width: '70%', height: chartHeight }}>
          <ChartContainer
            series={series}
            className='graph'
            xAxis={[
              {
                id: 'months',
                dataKey: 'month',
                scaleType: 'band',
                // Etiqueta del eje X
                label: 'Mes', 
                height: 30,
              },
            ]}
            yAxis={[
              {
                id: 'money',
                scaleType: 'linear',
                valueFormatter: valueFormatter,
                // Etiqueta del eje Y
                label: 'Dinero ($)', 
                width: 80,
              },
            ]}
            dataset={dataset2WithSalaries}
            // Margen para dejar espacio a la leyenda en la parte inferior
            margin={{ bottom: 70, left: 80 }} // Aumentar el margen inferior
          >
            {/* Componentes de Plot: definen cómo se visualizan los datos */}
            <BarPlot />
            <LinePlot />
            
            {/* Componentes de Eje: enlazados por sus 'axisId' */}
            <ChartsXAxis fill='black' axisId="months" />
            <ChartsYAxis fill='black' axisId="money"/>

            {/* Componentes Auxiliares */}
            <ChartsTooltip trigger="axis" />
            <ChartsLegend direction="horizontal" position={{ vertical: 'bottom', horizontal: 'center' }} />
          </ChartContainer>
        </Box>
        <Box sx={{width:500,height:600,backgroundColor:"white",display:'flex',flexDirection:'column',paddingRight:5}}>
          <Box width={"100%"} height={"50%"} sx={{backgroundColor:"rgba(255, 0, 0, 0.47)",overflow:'auto',p:2,overflowY:'hidden'}}>
            <h3>Últimos Gastos</h3>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{borderBottom:'1px solid #ccc'}}>
                  <th style={{textAlign:'left',padding:'8px'}}>Concepto</th>
                  <th style={{textAlign:'left',padding:'8px'}}>Monto</th>
                  <th style={{textAlign:'left',padding:'8px'}}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {
                  expenses.slice(0, 5).map((exp) => (
                    <tr key={exp.id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'8px'}}>{exp.description}</td>
                      <td style={{padding:'8px'}}>${exp.amount}</td>
                      <td style={{padding:'8px'}}>{exp.date.format('DD/MM/YYYY')}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </Box>
          <Divider/>
          <Box sx={{width: '100%',height:"50%",overflow:'auto',p:2,backgroundColor:"rgba(0, 255, 0, 0.47)",overflowY:'hidden'}}>
            <h3>Próximos Eventos</h3>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{borderBottom:'1px solid #ccc'}}>
                  <th style={{textAlign:'left',padding:'8px'}}>Evento</th>
                  <th style={{textAlign:'left',padding:'8px'}}>Fecha</th>
                  <th style={{textAlign:'left',padding:'8px'}}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {
                  eventsRecents
                    .filter((e) => dayjs(e.start).isAfter(dayjs()) && dayjs(e.start).isBefore(dayjs().add(7, 'day')))
                    .slice(0, 3)
                    .map((e) => (
                      <tr key={e.id} style={{borderBottom:'1px solid #eee'}}>
                        <td style={{padding:'8px',width: "150px"}}>{e.title}</td>
                        <td style={{padding:'8px'}}>{dayjs(e.start).format('HH:mm DD/MM/YYYY')}</td>
                        <td style={{padding:'8px'}}>Próximo</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
