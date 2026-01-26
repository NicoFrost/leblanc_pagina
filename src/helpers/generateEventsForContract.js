import dayjs from 'dayjs';

export const generateEventsForContract = (contract, getEmployeeById, getBuildingByID) => {
  const dayMap = { L: 1, M: 2, X: 3, J: 4, V: 5, S: 6 }

  const start = dayjs(contract.initialDate)
  const end = dayjs(contract.endDate)
  const title = `${getEmployeeById(contract.employeeId)?.name || 'Empleada/o'} - ${getBuildingByID(contract.buildingId)?.buildingName || 'Edificio'}`
  const activeDays = contract.days?.filter(([day, time]) => time).map(([day, time]) => ({ day: dayMap[day], time })) || []
  const eventsForContract = []
  let current = start.clone()
  let eventId = contract.id * 1000 + 1
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    const dayOfWeek = current.day()
    const matchingDay = activeDays.find(d => d.day === dayOfWeek)
    if (matchingDay) {
      const [startTime, endTime] = matchingDay.time.split('-')
      const [startHour, startMin] = startTime.split(':').map(Number)
      const [endHour, endMin] = endTime.split(':').map(Number)
      const eventStart = current.hour(startHour).minute(startMin).toDate()
      const eventEnd = current.hour(endHour).minute(endMin).toDate()
      eventsForContract.push({
        id: eventId++,
        title,
        start: eventStart,
        end: eventEnd,
        notes: '',
        contractId: contract.id
      })
    }
    current = current.add(1, 'day')
  }

  return eventsForContract;
}