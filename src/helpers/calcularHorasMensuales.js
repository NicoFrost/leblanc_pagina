import dayjs from "dayjs";

function countWeekdayInMonth(weekday, month, year) {
  let date = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-01`);
  
  let count = 0;
   
  
  while (
    date.month() === month
  ) {
    if (date.day() === weekday) count++;
    date = date.add(1, 'day');
  }

  return count;
}

/**
 * Calcula el total de horas mensuales basado en los turnos asignados.
 * 
 * @param {Array<[string, string]>} turnos - Array de tuplas [día, rango horario].
 *                                            El día es una letra (D, L, M, X, J, V, S)
 *                                            y el rango es una cadena "HH:mm-HH:mm"
 * @param {number} mes - Número del mes (1-12) para el cual calcular las horas
 * @param {number} año - Año para el cual calcular las horas
 * @returns {number|undefined} Total de horas mensuales. Retorna undefined si algún parámetro es falsy
 * 
 * @example
 * const turnos = [
 *   ['L', '08:00-16:00'],
 *   ['M', '14:00-22:00']
 * ];
 * calcularHorasMensuales(turnos, 3, 2024); // Retorna total de horas en marzo 2024
 */
export default function calcularHorasMensuales(turnos, mes, año) {
  
  if(!(turnos || mes || año)) return;

  const map = { D: 0, L: 1, M: 2, X: 3, J: 4, V: 5, S: 6 };

  let total = 0;
  
  for (const [dia,rango] of turnos) {
    
    const [ini, fin] = rango.split("-");

    const start = dayjs(`2020-01-01 ${ini}`);
    const end   = dayjs(`2020-01-01 ${fin}`);
    
    const horas = end.diff(start, 'minute') / 60;
    const ocurrencias = countWeekdayInMonth(map[dia], mes, año);
    
    // console.log(`Día: ${dia} - Horas por turno: ${horas} - Ocurrencias en mes: ${ocurrencias}`);
    // console.log(horas,ocurrencias,total)
    total += horas * ocurrencias;
    
  }

  return total;
}
