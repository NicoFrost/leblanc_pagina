import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    salaries: [],
    activeSalary: {},
    isloadingSalaries: false,
}


export const salariesSlice = createSlice({
    name: 'salaries',
    initialState,   
    reducers: {
        onLoadSalaries: (state, {payload}) => {
            state.isloadingSalaries = false;
            state.salaries = payload;
            payload.forEach(salary => {
                const exists = state.salaries.some(dbSalary => dbSalary.id === salary.id);
                if(!exists){
                    state.salaries.push(salary);
                }
            });
        },
        onAddSalary: (state, {payload}) => {
            (payload != null)
                && state.salaries.push(payload);
        },
        onUpdateSalary: (state, {payload}) => {
            if (payload != null){   
                state.salaries = state.salaries.map((salary) => {
                    if(salary.id === payload.id){
                        return payload
                    }
                    return salary
                })
            }
        },
        onDeleteSalary: (state) => {
            if(state.activeSalary.id != null){
                state.salaries = state.salaries.filter((salary => salary.id !== state.activeSalary.id))
            }
        },
        onSetActiveSalary: (state, {payload}) => {
            state.activeSalary = payload;
        },
        onLogoutSalaries: (state) => {
            state = initialState;
        }
    }
});

export const {
    onLoadSalaries,
    onAddSalary,
    onUpdateSalary,
    onDeleteSalary,
    onSetActiveSalary,
    onLogoutSalaries  
} = salariesSlice.actions;
