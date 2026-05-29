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

      const response = await fetch('https://api.argentinadatos.com/v1/feriados/2026');
      const feriados = await response.json();
      
      const events = contracts.flatMap((c) => generateEventsForContract(c, getEmployeeById, getBuildingByID))
      const eventsWithFeriados = convertEventsToDateEvents(events).concat(
        feriados.map(f => ({
          id: `f-${dayjs(f.fecha).format('YYYYMMDD')}`,
          title: f.nombre,
          start: dayjs(f.fecha).startOf('day').toDate(),
          end: dayjs(f.fecha).endOf('day').toDate(),
          notes: 'Feriado Nacional',
          feriado: true
        }))
      );
      // console.log(eventsWithFeriados);
      
      dispatch(onLoadEvents(eventsWithFeriados));
      
    } catch (error) {
      console.log({msg: 'Error cargando evento',error});
    }
  }

  const startLoadingFeriados = async () => {
    try {
      const response = await fetch('https://api.argentinadatos.com/v1/feriados/2026');
      const feriados = await response.json();
      const eventsFeriados = feriados.map(f => ({
        id: `f-${dayjs(f.fecha).format('YYYYMMDD')}`,
        title: f.nombre,
        start: dayjs(f.fecha).startOf('day').toDate(),
        end: dayjs(f.fecha).endOf('day').toDate(),
        notes: 'Feriado Nacional',
        feriado: true
      }));
      dispatch(onLoadEvents(eventsFeriados));
    } catch (error) {
      console.log({msg: 'Error cargando feriados',error});
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
    startLoadingFeriados,
    startUpdatingEventsForContract
  }

}
