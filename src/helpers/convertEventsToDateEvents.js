// import { parseISO } from "date-fns"

export const convertEventsToDateEvents = (eventos = []) => {
   
    console.log(eventos);
    
    return eventos.map(evento => {
        evento.start = new Date(evento.start);
        evento.end = new Date(evento.end);
        return evento;
    })
}