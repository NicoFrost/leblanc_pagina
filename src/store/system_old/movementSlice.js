import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    isLoadingMovement: true,
    movements: [],
    detMovements: [],
    activeMovement: undefined,
    tempProducts: [],
    typesMovements: [],
    activeTypeMov: undefined,
};

export const movementSlice = createSlice({
    name:"movement",
    initialState,
    reducers: {
        //* TIPO DE MOVIMIENTOS
        onSetActiveTypeMov: (state,{payload}) => {
            state.activeTypeMov = payload
        },
        onLoadTypeMovements: (state,{payload}) => {
            state.typesMovements = payload;
            payload.forEach(typeMov => {
                const exists = state.typesMovements.some(dbEvent => dbEvent === typeMov)
                if(!exists){
                    state.typesMovements.push(typeMov)
                }
            });
        },
        onAddNewTypeMovement: (state,{payload}) => {
            if(payload != null) {
                const exists = state.typesMovements.some(dbEvent => dbEvent === payload)
                if(!exists){
                    state.typesMovements.push(payload)
                }
            }
        },
        onUpdateTypeMovement: (state,{payload}) => {
            if (payload != null){
                console.log(payload);
                state.typesMovements = state.typesMovements.map((type) => {
                    if(type.id === payload.id){
                        return payload
                    } 
                    return type
                })
            }
        },
        onDeleteTypeMovement: (state) => {
            if(state.activeTypeMov.id != null){
                state.typesMovements = state.typesMovements.filter((type => type.id !== state.activeTypeMov.id))
            }
        },
        //* Movements
        onSetActiveMovement: (state,{payload}) => {
            state.activeMovement = payload;
        },
        onLoadMovement: (state,{payload}) => {
            state.isLoadingMovement = false;
            state.movements = payload;
            payload.forEach(movement => {
                const exists = state.movements.some(dbEvent => dbEvent === movement)
                if(!exists) {
                    state.movements.push(movement);
                }
            })
        },
        onAddNewMovement: (state,{payload}) => {
            (payload != null) 
                && state.movements.push(payload);
        },
        onUpdateMovement: (state,{payload}) => {
            if (payload != null){
                console.log(payload);
                state.movements = state.movements.map((movement) => {
                    if(movement.id === payload.id){
                        return payload
                    } 
                    return movement
                })
            }
        },
        onDeleteMovement: (state,{payload}) => {
            if(payload){
                state.movements = state.movements.filter((movement => movement.id !== payload))
            } else if(state.activeMovement.id != null){
                state.movements = state.movements.filter((movement => movement.id !== state.activeMovement.id))
            }
        },
        
        //* DetMovement
        // CARGA DE DETMOVEMENTS
        onLoadDetMovement: (state,{payload}) => {
            if(payload[0].head){
                state.detMovements = payload;
            } else {   
                payload.forEach(detMovement => {
                    const exists = state.detMovements.some(dbEvent => dbEvent === detMovement)
                    if(!exists) {
                        state.detMovements.push(detMovement);
                    }
                })
            }
        },
        // agregar UN DetMovement
        onAddNewDetMovement: (state,{payload}) => {
            const exists = state.detMovements.some(dbEvent => dbEvent.id === payload.id)
            console.log(payload,exists);
            if(!exists) {
                state.detMovements.push(payload);
            }
        },
        onUpdateDetMovement: (state,{payload}) => {
            if (payload != null){
                state.detMovements = state.detMovements.map((movement) => {
                    if(movement.id === payload.id){
                        return payload
                    } 
                    return movement
                })
            }
        },onDeleteDetMovement: (state,{payload}) => {
            if(payload != null){
                console.log(payload);
                state.detMovements = state.detMovements.filter((movement => movement.id !== payload))
                console.log(state.detMovements);
            }
        },
        onEmptyDetMovement: (state) => {
            state.detMovements = [];
        },

        onLogoutMovement: (state) => {
            state.isLoadingMovement = true;
            state.movements = [];
            state.activeMovement = undefined;
            state.typesMovements = []
        },       


    }
})

export const {
    onSetActiveTypeMov,
    onLoadTypeMovements,
    onAddNewTypeMovement,
    onUpdateTypeMovement,
    onDeleteTypeMovement,
    
    onSetActiveMovement,
    onLoadMovement,
    onloadTempProducts,
    onAddNewMovement,
    onUpdateMovement,
    onDeleteMovement,
    onLogoutMovement,

    onLoadDetMovement,
    onAddNewDetMovement,
    onUpdateDetMovement,
    onEmptyDetMovement,
    onDeleteDetMovement

} = movementSlice.actions