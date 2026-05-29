import {configureStore} from '@reduxjs/toolkit'
import {
  authSlice,
  uiSlice,
  buildingsSlice,
  contractsSlice,
  employeesSlice,
  methodsSlice,
  userSlice,
  expensesSlice,
  invoicesSlice,
  calendarSlice,
  salariesSlice,
  paymentsSlice,
  collectionsSlice,
  faultSlice,
} from "./";





export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        building: buildingsSlice.reducer,
        contract: contractsSlice.reducer,
        employee: employeesSlice.reducer,
        method: methodsSlice.reducer,
        expense: expensesSlice.reducer,
        invoices: invoicesSlice.reducer,
        collections: collectionsSlice.reducer,
        calendar: calendarSlice.reducer,
        salaries: salariesSlice.reducer,
        faults: faultSlice.reducer,
        payments: paymentsSlice.reducer,
        user: userSlice.reducer,
        ui: uiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})