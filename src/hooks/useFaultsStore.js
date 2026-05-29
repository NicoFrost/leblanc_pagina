import { useDispatch, useSelector } from "react-redux";
// import { onAddSalary, onLoadSalaries, onUpdateSalary, onDeleteSalary, onSetActiveSalary } from "../store/system/salariesSlice";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import calcularHorasMensuales from "../helpers/calcularHorasMensuales";
import { onAddFault, onLoadFault } from "../store";


// 20 ausensias de ejemplo
const rowsAusencias = [
  { id: 1, employeeId: 1, date: dayjs('2026-05-01'), hours: 8, reason: 'Enfermedad' },
  { id: 2, employeeId: 2, date: dayjs('2026-05-15'), hours: 4, reason: 'Personal' },
  { id: 3, employeeId: 3, date: '2026-05-10', hours: 16, reason: 'Vacaciones' },
  { id: 4, employeeId: 1, date: dayjs('2026-05-05'), hours: 8, reason: 'Enfermedad' },
  { id: 5, employeeId: 2, date: dayjs('2026-05-20'), hours: 4, reason: 'Personal' },
  { id: 6, employeeId: 3, date: dayjs('2026-06-15'), hours: 16, reason: 'Vacaciones' },
  { id: 7, employeeId: 1, date: dayjs('2026-06-01'), hours: 8, reason: 'Enfermedad' },
  { id: 8, employeeId: 2, date: dayjs('2026-06-10'), hours: 4, reason: 'Personal' },
  { id: 9, employeeId: 3, date: dayjs('2026-06-05'), hours: 16, reason: 'Vacaciones' },
  { id: 10, employeeId: 1, date: dayjs('2026-06-25'), hours: 8, reason: 'Enfermedad' },
]

export const useFaultsStore = () => {

    const {faults, activeFault} = useSelector(state => state.faults);
    const {employees} = useSelector(state => state.employee);
    const {contracts} = useSelector(state => state.contract);
    const dispatch = useDispatch();


    const startLoadingFaults = async () => {

        try {
        const dataDB = await window.api.getFaults();
        console.log(dataDB);
        
        if(dataDB){
            
            const formattedFaults = dataDB.map((fault) => {
                return {
                    ...fault.dataValues,
                    date: dayjs(fault.dataValues.date),
                }
            })  


            dispatch(onLoadFault(formattedFaults));
            
        } else {
            throw new Error('No data received from main process');
        }
        } catch (error) {
            console.log({msg: 'Error cargando faults', error})
        }
    }

    const startSavingFault = async (faultData) => {
        try {
            const {id,...rest} = faultData;
            
            console.log(faultData);
            
            const dataDB = await window.api.createFault({
                ...rest,
                date: rest.date.toDate()
            });
            
            if(dataDB) {
                dispatch(onAddFault({
                    ...rest,
                    id: dataDB.id,
                }))
            }
            enqueueSnackbar("Fault guardado exitosamente", { variant: 'success' });

            return {ok:true}
        } catch (error) {
            enqueueSnackbar(error.message || 'Error guardando fault',{variant:"warning"})
            console.log({msg: 'Error guardando fault', error})
            return {ok:false}
        }
    }

    const startUpdatingFault = async (faultData) => {
        try {
            const {id,...rest} = faultData;

            const dataDB = await window.api.updateFault(id, {
                ...rest,
                date: rest.date.toDate()
            });

            enqueueSnackbar("Fault actualizado exitosamente", { variant: 'success' });

            if(dataDB) {
                dispatch(onUpdateFault({
                    ...rest,
                    id: dataDB.id,
                }))
            }
            return {ok:true}
        } catch (error) {
            enqueueSnackbar(error.message || 'Error actualizando fault',{variant:"warning"})
            console.log({msg: 'Error actualizando fault', error})
            return {ok:false}
        }
    }

    const startDeletingFault = async (id) => {
        try {
            const dataDB = await window.api.deleteFault(id);

            enqueueSnackbar("Fault eliminado exitosamente", { variant: 'success' });

            if(dataDB) {
                dispatch(onDeleteFault())
            }
            return {ok:true}
        } catch (error) {
            enqueueSnackbar(error.message || 'Error eliminando fault',{variant:"warning"})
            console.log({msg: 'Error eliminando fault', error})
            return {ok:false}
        }
    }

    const setActiveFault = (fault) => {

        console.log(fault, faults.find(s => s.id === fault) );

        dispatch(onSetActiveFault(faults.find(s => s.id === fault)));
    }
    
    return {
        faults,
        activeFault,
        startLoadingFaults,
        startSavingFault,
        startUpdatingFault,
        startDeletingFault,
        setActiveFault,

    };
}
