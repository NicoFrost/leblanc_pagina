import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    collections: [],
    aciveCollection: {},
    isloadingCollections: false,
}


export const collectionsSlice = createSlice({
    name: 'collections',
    initialState,   
    reducers: {
        onLoadCollections: (state, {payload}) => {
            state.isloadingCollections = false;
            state.collections = payload;
            payload.forEach(collection => {
                const exists = state.collections.some(dbCollection => dbCollection.id === collection.id);
                if(!exists){
                    state.collections.push(collection);
                }
            });
        },
        onAddCollection: (state, {payload}) => {
            (payload != null)
                && state.collections.push(payload);
        },
        onUpdateCollection: (state, {payload}) => {
            if (payload != null){   
                state.collections = state.collections.map((collection) => {
                    if(collection.id === payload.id){
                        return payload
                    }
                    return collection
                })
            }
        },
        onDeleteCollection: (state) => {
            if(state.aciveCollection.id != null){
                state.collections = state.collections.filter((collection => collection.id !== state.aciveCollection.id))
            }
        },
        onLogoutCollection: (state) => {
            state = initialState;
        }
    }
});

export const {
    onLoadCollections,
    onAddCollection,
    onUpdateCollection,
    onDeleteCollection,
    onLogoutCollection  
} = collectionsSlice.actions;