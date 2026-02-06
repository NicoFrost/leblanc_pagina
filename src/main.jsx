import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './AppRouter.routes.jsx'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es'          // importa la locale

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Provider store={store}>
        <App />
      </Provider>
    </LocalizationProvider>
  </StrictMode>,
)
