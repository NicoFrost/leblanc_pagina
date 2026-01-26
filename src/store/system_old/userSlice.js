import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    activeUser: undefined,
    isLoadingUser: true,
    users: undefined,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        onSetActiveUser: (state,{payload} ) => {
            state.activeUser = payload;
        },
        onLoadUsers: (state,{payload = []}) => {
            state.isLoadingUser = false;
            state.users = payload;
            payload.forEach(user => {
                const exists = state.users.some(dbEvent => dbEvent === user)
                if(!exists) {
                    state.users.push(user);
                }
            })
        },
        onAddNewUser: (state,{payload}) => {
            (payload != null) 
                && state.users.push(payload);
        },
        onUpdateUser: (state,{payload}) => {
            if (payload != null){
                state.users = state.users.map((user) => {
                    if(user.id === payload.id){
                        return payload
                    } 
                    return user
                })
            }
        },
        onDeleteUser: (state,) => {
            if(state.activeUser.id != null){
                state.users = state.users.filter((user => user.id !== state.activeUser.id))
            }
        }
    },
});

export const { onSetActiveUser,onLoadUsers,onAddNewUser,onUpdateUser,onDeleteUser} = userSlice.actions;