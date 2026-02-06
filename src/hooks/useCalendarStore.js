import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onDeleteEventsByContractId, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store"
import { convertEventsToDateEvents, eventsExamples, generateEventsForContract } from "../helpers"
import Swal from "sweetalert2"
import dayjs from "dayjs"
import { useEmployeesStore } from "./useEmployeeStore"
import { useBuildingsStore } from "./useBuildingsStore"



export const useCalendarStore = () => {

  const dispatch  = useDispatch()
    
  const {events, activeEvent} = useSelector(state => state.calendar)
  const {user} = useSelector(state => state.auth);
  const {contracts} = useSelector(state => state.contract)
  const {getEmployee : getEmployeeById} = useEmployeesStore()
  const {getBuildingByID} = useBuildingsStore()

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  }

  const startSavingEvent = async (calendarEvent) => {
    // TODO UPDATE EVENT
    try {
      if(calendarEvent.id){
        // actualizando
        // await calendarApi.put('/events/' + calendarEvent.id,calendarEvent)
        dispatch(onUpdateEvent({...calendarEvent,user}));
        return;
      } else {
        // creando
        // const {data} = await calendarApi.post('/events',calendarEvent)
        let data = {evento: {id: Math.floor(Math.random() * 100)}}
        console.log(data);
        dispatch(onAddNewEvent({...calendarEvent},data.evento.id,user))
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error al guardar',error.response.data.msg,'error')
    }
  }

  const startDeletingEvent = async () => {
    // TODO: llegar al backend
    try {
      console.log(activeEvent);
      // await calendarApi.delete('/events/' + activeEvent.id)
      dispatch(onDeleteEvent());
    } catch (error) {
      console.log(error);
      Swal.fire('Error al eliminar',error.response.data.msg,'error');
    }

  }

  const startLoadingEvents = async () => {
    try {      
      const events = contracts.flatMap((c) => generateEventsForContract(c, getEmployeeById, getBuildingByID))
      
      dispatch(onLoadEvents(events));
      
    } catch (error) {
      console.log({msg: 'Error cargando evento',error});
    }
  }
  
  const startUpdatingEventsForContract = async (contract) => {
    try {
      dispatch(onDeleteEventsByContractId(contract.id));

      const eventsForContract = generateEventsForContract(contract, getEmployeeById, getBuildingByID);

      dispatch(onLoadEvents(eventsForContract));
    } catch (error) {
      console.log({msg: 'Error updating events for contract', error});
    }
  }

  return {
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents,
    startUpdatingEventsForContract
  }

}
