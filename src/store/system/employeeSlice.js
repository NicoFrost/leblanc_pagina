import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeEmployee: {},
    employees: [],
    isLoadingEmployees: false,
}

export const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        onActiveEmployee: (state, {payload}) => {
            state.activeEmployee = payload;
        },
        onLoadEmployees: (state, {payload}) => {
            state.isLoadingEmployees = false;
            state.employees = payload;
            payload.forEach(employee => {
                const exists = state.employees.some(dbEmployee => dbEmployee.id === employee.id);
                if(!exists){
                    state.employees.push(employee);
                }
            });
        },
        onAddEmployee: (state, {payload}) => {
            (payload != null)
                && state.employees.push(payload);
        },
        onUpdateEmployee: (state, {payload}) => {
            if (payload != null){
                state.employees = state.employees.map((employee) => {
                    if(employee.id === payload.id){
                        return payload
                    } 
                    return employee
                })
            }
        },
        onDeleteEmployee: (state) => {
            if(state.activeEmployee.id != null){
                state.employees = state.employees.filter((employee => employee.id !== state.activeEmployee.id))
            }
        },
        onLogoutEmployees: (state) => {
            state = initialState;
        }
    }
});

export const {
    onActiveEmployee,
    onLoadEmployees,
    onAddEmployee,
    onUpdateEmployee,
    onDeleteEmployee,
    onLogoutEmployees,
} = employeesSlice.actions;
