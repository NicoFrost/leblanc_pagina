import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    products: [],
    movements: [],
    providers: [],

};

export const systemSlice = createSlice({
    name: 'system',
    initialState,
    reducers: {
        onAddNewData: (state,{payload}) => {
            (payload.product != null) 
                && state.products.push(payload.product);
            (payload.movement != null) 
                && state.movements.push(payload.movement);
            (payload.provider != null) 
                && state.providers.push(payload.provider);
        },
        onUpdateData: (state,{payload}) => {
            if (payload.product != null){
                state.products = state.products.map((product) => {
                    if(product.id === payload.id){
                        return payload
                    } 
                    return product
                })
            }
            if (payload.movement != null) {
                state.movements = state.movements.map((movement) => {
                    if(movement.id === payload.id){
                        return payload
                    }
                    return movement
                });
            }
            if (payload.provider != null){
                state.providers = state.providers.map((provider) => {
                    if(provider.id === payload.id){
                        return payload
                    } 
                    return provider
                })
            }
        },
        onDeleteData: (state,{payload}) => {
            // if (payload.product != null){
                
            // }
            
            if(payload.id != null){
                state.events = state.events.filter((event => event.id !== state.activeEvent._id))
                state.activeEvent = null
            }
        }
    }
})