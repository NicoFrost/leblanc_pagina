/**
 * Hook personalizado para interactuar con el store de empleados en Redux.
 * Proporciona métodos para cargar, agregar, actualizar y eliminar empleados.
 *
 * @returns {Object} API del hook
 * @returns {Array} employees - Lista de empleados desde el store.
 * @returns {Object|null} activeEmployee - Empleado seleccionado actualmente.
 * @returns {Function} startSavingEmployee - Guarda un empleado nuevo o existente en el backend y actualiza el store.
 * @param {Object} employeeData - Datos del empleado a guardar o actualizar.
 * @returns {Promise<void>}
 * @returns {Function} startDeletingEmployee - Elimina el empleado activo del backend y actualiza el store.
 * @returns {Promise<void>}
 * @returns {Function} startLoadingEmployees - Carga los empleados desde el backend y actualiza el store.
 * @returns {Promise<void>}
 */

import { useDispatch, useSelector } from "react-redux";
import { onActiveExpenses, onAddExpenses, onDeleteExpenses, onLoadExpenses, onUpdateExpenses } from "../store";
import Swal from "sweetalert2";
import { expensesRows } from "../helpers/getDataExample";
import { Snackbar } from "@mui/material";

import dayjs from 'dayjs'
import 'dayjs/locale/es'          // importa la locale
import localizedFormat from 'dayjs/plugin/localizedFormat'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(localizedFormat)
dayjs.extend(localeData)

// establece español globalmente
dayjs.locale('es')



export const useExpensesStore = () => {
    // Aquí puedes implementar la lógica para interactuar con el store de gastos

    const {activeExpense,expenses} = useSelector(state => state.expense);
    const {status} = useSelector(state => state.auth);
    const dispatch = useDispatch();


    const setActiveExpense = (expenseID) => {
        const active = expenses.find(e => e.id === expenseID)
        // console.log(active,expenseID);
        if(active){
            dispatch(onActiveExpenses(active))
        } else {
            dispatch(onActiveExpenses({}))
        }
    };

    const startSavingExpense = async (expenseData) => {
        // Aquí puedes implementar la lógica para guardar un gasto
        let data = {msg:"complletado",helpMsg:"sip completado increible no?"};
        try {

            if(expenseData.id){
                // const {data: dataDB} = await formApi.put('/expense/' + expenseData.id, expenseData);
                const {msg,helpMsg,success} = await window.api.updateExpense(expenseData.id, expenseData);

                if(success) {
                    dispatch(onUpdateExpenses(expenseData)); 
                    data = {msg,helpMsg};
                }
            } else {
                // const {status,data: dataDB} = await formApi.post('/expense', expenseData);
                // const id = dataDB.expense.id;
                const {msg,helpMsg,success,expense:dataDB} = await window.api.createExpense(expenseData);

                if(dataDB) {
                    dispatch(onAddExpenses({...dataDB,date: dayjs(dataDB.date)}));
                } else {
                    throw new Error('No se pudo crear el gasto')
                }
                if(success) data = {msg,helpMsg}
            }
            Swal.fire({
                title: data.msg,
                text: data?.helpMsg,
                timer: 2000,
                icon: 'success'
            });
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error , 'error');
        }
        
    }

    const startDeletingExpense = async () => {
      // TODO: llegar al backend
        try {
            Swal.fire({
            title: "Deseas borrar " + activeExpense.description + " de la lista?",
            showDenyButton: true,
            showConfirmButton: true,
            confirmButtonText: "Borrar",
            confirmButtonColor: "red",
            denyButtonText:"No borrar",
            denyButtonColor: "grey",
            }).then(async (result) => {
                if(result.isConfirmed) {
                    // const data = await formApi.delete('/expense/' + activeExpense.id)
                    const data = await window.api.deleteExpense(activeExpense.id);
                    if(data.success) dispatch(onDeleteExpenses());
                    Swal.fire(activeExpense.description + " borrado","",'success');
                } else if (result.isDenied) {
                    Swal.fire("Cancelado","",'error');
                }
            })
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar',error.response.data.msg,'error');
        }
  
    }

    const startLoadingExpenses = async () => {

      try {
        // console.log(status);

        // const {data} = await formApi.get('/expense')
        const dataDB = await window.api.getExpenses();

        
        if(dataDB){
            const expense = dataDB.map(exp => ({
                ...exp.dataValues,
                id: exp.dataValues.id,
                date: dayjs(exp.dataValues.date)
            }));
            dispatch(onLoadExpenses(expense));
        }
        
  
      } catch (error) {
        console.log({msg: 'Error cargando evento',error});
      }
    }

    return {
        expenses,
        activeExpense,
        setActiveExpense,
        startSavingExpense,
        startDeletingExpense,
        startLoadingExpenses
    }
}

