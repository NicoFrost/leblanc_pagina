import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    faults: [],
    activeFault: {},
    isloadingFaults: false,
}


export const faultSlice = createSlice({
    name: 'faults',
    initialState,   
    reducers: {
        onLoadFault: (state, {payload}) => {
            state.faults = payload;
            payload.forEach(fault => {
                const exists = state.faults.some(dbFault => dbFault.id === fault.id);
                if(!exists){
                    state.faults.push(fault);
                }
            });
            state.isloadingFaults = false;
        },
        onAddFault: (state, {payload}) => {
            (payload != null)
                && state.faults.push(payload);
        },
        onUpdateFault: (state, {payload}) => {
            if (payload != null){   
                state.faults = state.faults.map((fault) => {
                    if(fault.id === payload.id){
                        return payload
                    }
                    return fault
                })
            }
        },
        onDeleteFault: (state) => {
            if(state.activeFault.id != null){
                state.faults = state.faults.filter((fault) => fault.id !== state.activeFault.id)
            }
        },
        onSetActiveFault: (state, {payload}) => {
            state.activeFault = payload;
        },
        onLogoutFaults: (state) => {
            state = initialState;
        }
    }
});

export const {
    onLoadFault,
    onAddFault,
    onUpdateFault,
    onDeleteFault,
    onSetActiveFault,
    onLogoutSalaries  
} = faultSlice.actions;
