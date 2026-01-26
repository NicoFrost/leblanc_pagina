import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeInvoice: {},
    invoices: [],
    isLoadingInvoices: false,
}

export const invoicesSlice = createSlice({
    name: 'invoices',
    initialState,   
    reducers: {
        onActiveInvoice: (state, {payload}) => {
            state.activeInvoice = payload;
        },
        onLoadInvoices: (state, {payload}) => {
            state.isLoadingInvoices = false;
            state.invoices = payload;
            payload.forEach(invoice => {
                const exists = state.invoices.some(dbInvoice => dbInvoice.id === invoice.id);
                if(!exists){
                    state.invoices.push(invoice);
                }
            });
        },
        onAddInvoice: (state, {payload}) => {
            (payload != null)
                && state.invoices.push(payload);
        },
        onUpdateInvoice: (state, {payload}) => {
            if (payload != null){
                state.invoices = state.invoices.map((invoice) => {
                    if(invoice.id === payload.id){
                        return payload
                    } 
                    return invoice
                })
            }
        },
        onDeleteInvoice: (state) => {
            if(state.activeInvoice.id != null){
                state.invoices = state.invoices.filter((invoice => invoice.id !== state.activeInvoice.id))
            }
        },
        onLogoutInvoice: (state) => {
            state = initialState;
        }
    }
})

export const {
    onActiveInvoice,
    onLoadInvoices,
    onAddInvoice,
    onUpdateInvoice,
    onDeleteInvoice,
    onLogoutInvoice
} = invoicesSlice.actions;