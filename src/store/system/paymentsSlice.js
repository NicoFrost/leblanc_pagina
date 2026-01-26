import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    payments: [],
    activePayment: {},
    isloadingPayments: false,
}


export const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        onLoadPayments: (state, {payload}) => {
            state.isloadingPayments = false;
            state.payments = payload;
            payload.forEach(payment => {
                const exists = state.payments.some(dbPayment => dbPayment.id === payment.id);
                if(!exists){
                    state.payments.push(payment);
                }
            });
        },
        onAddPayment: (state, {payload}) => {
            (payload != null)
                && state.payments.push(payload);
        },
        onUpdatePayment: (state, {payload}) => {
            if (payload != null){
                state.payments = state.payments.map((payment) => {
                    if(payment.id === payload.id){
                        return payload
                    }
                    return payment
                })
            }
        },
        onDeletePayment: (state) => {
            if(state.activePayment.id != null){
                state.payments = state.payments.filter((payment => payment.id !== state.activePayment.id))
            }
        },
        onSetActivePayment: (state, {payload}) => {
            state.activePayment = payload;
        },
        onLogoutPayments: (state) => {
            state = initialState;
        }
    }
});

export const { onLoadPayments, onAddPayment, onUpdatePayment, onDeletePayment, onSetActivePayment, onLogoutPayments } = paymentsSlice.actions;