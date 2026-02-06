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
import { onActiveEmployee, onAddEmployee, onDeleteEmployee, onLoadEmployees, onUpdateEmployee } from "../store";
import Swal from "sweetalert2";
import { employeeRows } from "../helpers/getDataExample";


export const useEmployeesStore = () => {
    // Aquí puedes implementar la lógica para interactuar con el store de empleados

    const {activeEmployee,employees} = useSelector(state => state.employee);
    // const {status} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const getEmployee = (employeeID) => {
        const employeeFounded = employees.find(e => e.id === employeeID)
        return employeeFounded
    }

    const setActiveEmployee = async (emploeyeID) => {
        const active = employees.find(e => e.id === emploeyeID)

        // console.log(active,expenseID);
        if(active){
            dispatch(onActiveEmployee(active))
        } else {
            dispatch(onActiveEmployee({}))
        }
    }

    const startSavingEmployee = async (employeeData) => {
        // Aquí puedes implementar la lógica para guardar un empleado
        let data = {msg:"complletado",helpMsg:"sip completado increible no?"}
        try {
            if(employeeData.id){
                // const dataDB = undefined;
                // const {data: dataDB} = await formApi.put('/employee/' + employeeData.id, employeeData);
                const {msg,helpMsg,success} = await window.api.updateEmployee(employeeData.id, {
                    ...employeeData,
                    lastname: employeeData.lastName,
                    address: employeeData.address.join(" "),
                    phone: employeeData.phone.join(" ")
                });
                
                dispatch(onUpdateEmployee(employeeData));

                if(success) data = {msg, helpMsg}
            } else {
                // const dataDB = undefined;
                // const {status,data: dataDB} = await formApi.post('/employee', employeeData);
                const {msg,helpMsg,success,employee:dataDB} = await window.api.createEmployee({
                    ...employeeData,
                    lastname: employeeData.lastName,
                    address: employeeData.address.join(" "),
                    phone: employeeData.phone.join(" ")
                });
                
                const employee = {
                    ...dataDB,
                    lastName: dataDB.lastname,
                    lastname: undefined,
                    address: dataDB.address ? dataDB.address.split(" ") : [],
                    phone: dataDB.phone ? dataDB.phone.split(" ") : []
                };

                dispatch(onAddEmployee(employee));
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

    const startDeletingEmployee = async () => {
      // TODO: llegar al backend
        try {
            Swal.fire({
            title: "Deseas borrar " + activeEmployee.name + " de la lista?",
            showDenyButton: true,
            showConfirmButton: true,
            confirmButtonText: "Borrar",
            confirmButtonColor: "red",
            denyButtonText:"No borrar",
            denyButtonColor: "grey",
            }).then(async (result) => {
                if(result.isConfirmed) {
                    // const data = await formApi.delete('/employee/' + activeEmployee.id)
                    const data = await window.api.deleteEmployee(activeEmployee.id);
                    dispatch(onDeleteEmployee());
                    Swal.fire({
                        title: data.msg,
                        text: data.helpMsg,
                        icon: 'success',
                        timer: 2000
                    });
                } else if (result.isDenied) {
                    Swal.fire("Cancelado","",'error');
                }
            })
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar',error.message,'error');
        }
  
    }

    const startLoadingEmployees = async () => {

      try {
        // console.log(window);

        // const {data} = await formApi.get('/employee')    
        const data = await window.api?.getEmployees();
        
        if(data){ 
            const employee = data.map(emp => ({
                ...emp.dataValues,
                lastName: emp.dataValues.lastname,
                lastname: undefined,
                address: emp.dataValues.address ? emp.dataValues.address.split(" ") : [],
                phone: emp.dataValues.phone ? emp.dataValues.phone.split(" ") : []
            }));
            dispatch(onLoadEmployees(employee));
        }
        
        
  
      } catch (error) {
        console.log(error);
        Swal.fire('Error al cargar empleados', error.message , 'error');
      }
    }

    return {
        employees,
        activeEmployee,
        getEmployee,
        setActiveEmployee,
        startSavingEmployee,
        startDeletingEmployee,
        startLoadingEmployees
    }
}

