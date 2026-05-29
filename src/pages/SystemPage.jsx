import React, { useEffect } from 'react'
import { MenuLayout } from '../layout/MenuLayout'
import { BuildingsView, FinancesView, HomeView, UsersView } from '../views';
import { useBuildingsStore, useCalendarStore, useCollectionStore, useEmployeesStore, useExpensesStore, useFaultsStore, useInvoiceStore, useUIStore } from '../hooks';
import { useContractsStore } from '../hooks/useContractStore';
import { ReportsView } from '../views/ReportsView';
import { CalendarPage } from '../views/CalendarPage';
import { EmployeeView } from '../views/EmployeeView';
import { useMethodStore } from '../hooks/useMethodStore';
import { useSalariesStore } from '../hooks/useSalariesStore';
import { usePaymentsStore } from '../hooks/usePaymentsStore';


export const SystemPage = () => {
  const {activeMenu} = useUIStore();
  
  const {startLoadingExpenses} = useExpensesStore();
  const {startLoadingBuildings} = useBuildingsStore();
  const {startLoadingEmployees} = useEmployeesStore();
  const {startLoadingContracts, contracts} = useContractsStore();
  const {startLoadingInvoices} = useInvoiceStore();
  const {startLoadingCollections} = useCollectionStore();
  const {startLoadingEvents,startLoadingFeriados} = useCalendarStore()
  const {startLoadingMethods} = useMethodStore()
  const {startLoadingSalaries} = useSalariesStore()
  const {startLoadingPayments} = usePaymentsStore()
  const {startLoadingFaults} = useFaultsStore()
  let element;
  
  useEffect(() => {
    const loadData = async () => {
      await startLoadingExpenses();
      await startLoadingBuildings();
      await startLoadingEmployees();
      await startLoadingContracts();
      await startLoadingInvoices();
      await startLoadingCollections();
      await startLoadingMethods();
      await startLoadingSalaries();
      await startLoadingPayments();
      await startLoadingFaults();
    };
    loadData();
  }, [])

  useEffect(() => {
    if (contracts.length > 0) {
      startLoadingEvents();
    } else {
      startLoadingFeriados();
    }
  }, [contracts])

  switch (activeMenu) {
    case "home": 
      element = <HomeView/>
      break
    case "buildings":
      element = <BuildingsView/>
      break
    case "finances":
      element = <FinancesView/>
      break;
    case "users":
      element = <UsersView/>
      break;
    case "reports":
      element = <ReportsView/>
      break;
    case 'calendar':
      element = <CalendarPage/>
      break;
    case 'employee':
      element = <EmployeeView/>
  }


  return (
    <MenuLayout>
      {element}
    </MenuLayout>
  )
}
