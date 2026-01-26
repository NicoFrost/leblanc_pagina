import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeContract: {employeeId: '',buildingId:''},
    contracts: [],
    isLoadingContracts: false,
}

export const contractsSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        onActiveContract: (state, {payload}) => {
            state.activeContract = payload;
        },
        onLoadContracts: (state, {payload}) => {
            state.isLoadingContracts = false;
            state.contracts = payload;
            payload.forEach(contract => {
                const exists = state.contracts.some(dbContract => dbContract.id === contract.id);
                if(!exists){
                    state.contracts.push(contract);
                }
            });
        },
        onAddContracts: (state, {payload}) => {
            (payload != null)
                && state.contracts.push(payload);
        },
        onUpdateContracts: (state, {payload}) => {
            if (payload != null){
                state.contracts = state.contracts.map((contract) => {
                    if(contract.id === payload.id){
                        return payload
                    } 
                    return contract
                })
            }
        },
        onDeleteContracts: (state) => {
            if(state.activeContract.id != null){
                state.contracts = state.contracts.filter((contract => contract.id !== state.activeContract.id))
            }
        },
        onLogoutContracts: (state) => {
            state = initialState;
        }
    },
});

export const {
    onActiveContract,
    onLoadContracts,
    onAddContracts,
    onUpdateContracts,
    onDeleteContracts,
    onLogoutContracts,
} = contractsSlice.actions;
