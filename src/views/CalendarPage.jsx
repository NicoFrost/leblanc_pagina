/* eslint-disable no-unused-vars */
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import dayjs from 'dayjs'

import { getMessagesES } from '../helpers'
import { CalendarEventBox} from '../components'
import { useEffect, useState } from 'react'
import { useUIStore,useCalendarStore } from '../hooks'
import { Box } from '@mui/material'

const localizer = dayjsLocalizer(dayjs)

export const CalendarPage = () => {
  // const {user} = useAuthStore();
  const {events,setActiveEvent} = useCalendarStore()
  const {openDateModal} = useUIStore()
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week') 
  const eventStyleGetter = (event) => {
  
    // const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);
    const isMyEvent = true
    // Generate random color based on contractId
    const hue = (event.contractId * 245.5) % 360; // Golden angle approximation for even distribution
    const backgroundColor = `hsl(${hue}, 70%, 50%)`;
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: "white",
      overlay: {
        zIndex: 0,
    }
    }

    return {style}
  }

  const onDoubleClick = (event) => {
    openDateModal()
  }
  const onSelect = (event) => {
    setActiveEvent(event);
    
  }
  const onViewChanged = (event) => {
    localStorage.setItem('lastView',event)
  } 
  
  return (
    <Box sx={{width: 'calc(100vw - 310px)',pl:"10px",pt:"40px"}}>
      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        // defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height:'calc(100vh - 100px)' }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEventBox,
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
        />
      {/* <CalendarModal/> */}
      {/* <FabAddNew/>
      <FabDelete/> */}


    </Box>
  )
}
