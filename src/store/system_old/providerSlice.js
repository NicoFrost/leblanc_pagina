import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    isLoadingProvider: true,
    providers: [],
    activeProvider: undefined,
};

export const providerSlice = createSlice({
    name: 'provider',
    initialState,
    reducers: {
        onSetActiveProvider: (state,{payload} ) => {
            state.activeProvider = payload;
        },
        onLoadProviders: (state,{payload = []}) => {
            state.isLoadingProvider = false;
            state.providers = payload;
            payload.forEach(provider => {
                const exists = state.providers.some(dbEvent => dbEvent === provider)
                if(!exists) {
                    state.providers.push(provider);
                }
            })
        },
        onAddNewProvider: (state,{payload}) => {
            (payload != null) 
                && state.providers.push(payload);
        },
        onUpdateProvider: (state,{payload}) => {
            if (payload != null){
                state.providers = state.providers.map((provider) => {
                    if(provider.id === payload.id){
                        return payload
                    } 
                    return provider
                })
            }
        },
        onDeleteProvider: (state,) => {
            if(state.activeProvider.id != null){
                state.providers = state.providers.filter((provider => provider.id !== state.activeProvider.id))
            }
        },
        onLogoutProvider: (state) => {
            state.isLoadingEvents = true;
            state.providers = [];
            state.activeProvider = undefined;
        }
    }
})

export const {onSetActiveProvider,onLoadProviders,onAddNewProvider,onUpdateProvider,onDeleteProvider,onLogoutProvider} = providerSlice.actions