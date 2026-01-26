import { createSlice } from '@reduxjs/toolkit';
// import { addDays, addHours, subDays } from 'date-fns';

// const tempEvent = {
//     _id: new Date().getTime(),
//     title: 'Cumpleaños de Papa',
//     notes: 'Hay que comprar el paster',
//     start: new Date(),
//     end: addHours(new Date(),2),
//     bgColor: '#fafafa',
//     user: {
//         _id: '123',
//         name: 'Nicolas'
//     }
// }


const initialState = {
    isLoadingEvents: true, 
    events: [
    ],
    activeEvent: null,
};

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
     reducers: {
        onSetActiveEvent: (state,{payload} ) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: (state,{payload}) => {
            state.events.push(payload);
            state.activeEvent = null;
        },
        onUpdateEvent: (state,{payload}) => {
            state.events = state.events.map((event) => {
                if(event.id === payload.id){
                    return payload;
                }
                return event
            })
        },
        onUpdateEventByContractId: (state,{payload}) => {
            state.events = state.events.map((event) => {
                if(event.contractId === payload.contractId){
                    return payload;
                }
                return event
            })
        },
        onDeleteEvent: (state) => {
            if(state.activeEvent != null){
                state.events = state.events.filter((event => event.id !== state.activeEvent._id))
                state.activeEvent = null
            }
        },
        onDeleteEventsByContractId: (state, {payload: contractId}) => {
            state.events = state.events.filter(event => event.contractId !== contractId);
        },
        onLoadEvents: (state,{payload = []}) => {
            state.isLoadingEvents = false;
            // state.events = payload;
            payload.forEach(event => {
                const exists = state.events.some(dbEvent => dbEvent.id === event.id)
                if(!exists) {
                    state.events.push(event);
                }
            })
        },
        onLogoutCalendar: (state) => {
            state.isLoadingEvents = true;
            state.events = [];
            state.activeEvent = undefined;
        }
    },
});

export const { onSetActiveEvent,onAddNewEvent,onUpdateEvent,onUpdateEventByContractId,onDeleteEvent,onDeleteEventsByContractId,onLoadEvents,onLogoutCalendar} = calendarSlice.actions;