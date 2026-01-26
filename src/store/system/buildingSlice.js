import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeBuilding: {},
    buildings: [],
    isLoadingBuildings: false,
}

export const buildingsSlice = createSlice({
    name: 'buildings',
    initialState,
    reducers: {
        onActiveBuilding: (state, {payload}) => {
            state.activeBuilding = payload;
        },
        onLoadBuildings: (state, {payload}) => {
            state.isLoadingBuildings = false;
            state.buildings = payload;
            payload.forEach(building => {
                const exists = state.buildings.some(dbBuilding => dbBuilding.id === building.id);
                if(!exists){
                    state.buildings.push(building);
                }
            });
        },
        onAddBuildings: (state, {payload}) => {
            (payload != null)
                && state.buildings.push(payload);
        },
        onUpdateBuildings: (state, {payload}) => {
            if (payload != null){
                state.buildings = state.buildings.map((building) => {
                    if(building.id === payload.id){
                        return payload
                    } 
                    return building
                })
            }
        },
        onDeleteBuildings: (state) => {
            if(state.activeBuilding.id != null){
                state.buildings = state.buildings.filter((building => building.id !== state.activeBuilding.id))
            }
        },
        onLogoutBuildings: (state) => {
            state = initialState;
        }
    },
});

export const {
    onActiveBuilding,
    // onClearActiveBuilding,
    onLoadBuildings,
    onAddBuildings,
    onUpdateBuildings,
    onDeleteBuildings,
    onLogoutBuildings,
} = buildingsSlice.actions;
