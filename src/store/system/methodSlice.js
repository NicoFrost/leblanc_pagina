import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeMethod: {},
    methods: [],
    isLoadingMethods: false,
}

export const methodsSlice = createSlice({
    name: 'methods',
    initialState,
    reducers: {
        onActiveMethod: (state, {payload}) => {
            state.activeMethod = payload;
        },
        onLoadMethods: (state, {payload}) => {
            state.isLoadingMethods = false;
            state.methods = payload;
            payload.forEach(method => {
                const exists = state.methods.some(dbMethod => dbMethod.id === method.id);
                if(!exists){
                    state.methods.push(method);
                }
            });
        },
        onAddMethod: (state, {payload}) => {
            (payload != null)
                && state.methods.push(payload);
        },
        onUpdateMethod: (state, {payload}) => {
            if (payload != null){
                state.methods = state.methods.map((method) => {
                    if(method.id === payload.id){
                        return payload
                    }
                    return method
                })
            }
        },
        onDeleteMethod: (state) => {
            if(state.activeMethod.id != null){
                state.methods = state.methods.filter((method => method.id !== state.activeMethod.id))
            }
        },
        onLogoutMethods: (state) => {
            state = initialState;
        }
    }
});

export const {
    onActiveMethod,
    onLoadMethods,
    onAddMethod,
    onUpdateMethod,
    onDeleteMethod,
    onLogoutMethods,
} = methodsSlice.actions;
