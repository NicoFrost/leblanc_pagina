import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    activeExpense: {},
    expenses: [],
    isLoadingExpenses: false,
}

export const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        onActiveExpenses: (state, {payload}) => {
            state.activeExpense = payload;
        },
        onLoadExpenses: (state, {payload}) => {
            state.isLoadingExpenses = false;
            state.expenses = payload;
            payload.forEach(expense => {
                const exists = state.expenses.some(dbExpense => dbExpense.id === expense.id);
                if(!exists){
                    state.expenses.push(expense);
                }
            });
        },
        onAddExpenses: (state, {payload}) => {
            (payload != null)
                && state.expenses.push(payload);
        },
        onUpdateExpenses: (state, {payload}) => {
            if (payload != null){
                state.expenses = state.expenses.map((expense) => {
                    if(expense.id === payload.id){
                        return payload
                    } 
                    return expense
                })
            }
        },
        onDeleteExpenses: (state) => {
            if(state.activeExpense.id != null){
                state.expenses = state.expenses.filter((expense => expense.id !== state.activeExpense.id))
            }
        },
        onLogoutExpenses: (state) => {
            state = initialState;
        }

    }
})

export const {
    onActiveExpenses,
    onLoadExpenses,
    onAddExpenses,
    onUpdateExpenses,
    onDeleteExpenses,
    onLogoutExpenses
} = expensesSlice.actions;
