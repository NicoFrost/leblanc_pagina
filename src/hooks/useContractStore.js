import { useDispatch, useSelector } from "react-redux";
import { onActiveContract, onAddContracts, onDeleteContracts, onLoadContracts, onUpdateContracts } from "../store";
import { onDeleteEventsByContractId, onLoadEvents } from "../store";
import { generateEventsForContract } from "../helpers";
import { contractsRows } from "../helpers/getDataExample";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import 'dayjs/locale/es'          // importa la locale
import localizedFormat from 'dayjs/plugin/localizedFormat'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(localizedFormat)
dayjs.extend(localeData)

// establece español globalmente
dayjs.locale('es')




export const useContractsStore = () => {
    // Aquí puedes implementar la lógica para interactuar con el store de contratos

    const {activeContract,contracts} = useSelector(state => state.contract);
    const {buildings} = useSelector(state => state.building)
    const {employees} = useSelector(state => state.employee)
    const {status} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const getEmployeeById = (id) => employees.find(e => e.id === id);
    const getBuildingByID = (id) => buildings.find(b => b.id === id);

    const setActiveContract = (contractID) => {
        const active = contracts.find(e => e.id === contractID)
        // console.log(active,expenseID);
        if(active){
            dispatch(onActiveContract(active))
        } else {
            dispatch(onActiveContract({}))
        }
    } 
    

    const startSavingContract = async (contractData) => {
        
        
        // Aquí puedes implementar la lógica para guardar un contrato
        let data = {msg:"complletado",helpMsg:"sip completado increible no?"};
        try {

            const formattedDays = contractData.days.map((timeDay) => {
                const dayJoin = timeDay.join('_')
                
                return dayJoin
            }).join(',')

            if(contractData.id){
                // const {data: dataDB} = await formApi.put('/contract/' + contractData.id, contractData);
                


                const {msg,success,helpMsg, contract: dataDB} = await window.api.updateContract(contractData.id, {
                    ...contractData,
                    days: formattedDays,
                    initialDate: contractData.initialDate.toDate(),
                    endDate: contractData.endDate.toDate()
                });
                console.log({
                    ...contractData,
                    days: contractData.days.join("_"),
                    initialDate: contractData.initialDate,
                    endDate: contractData.endDate
                });
                

                
                if(success) {
                    dispatch(onUpdateContracts(contractData));
                    // Update events
                    dispatch(onDeleteEventsByContractId(contractData.id));
                    const events = generateEventsForContract(contractData, getEmployeeById, getBuildingByID);
                    dispatch(onLoadEvents(events));
                }
                if(dataDB) data = {msg,helpMsg}
            } else {
                
                const {msg,helpMsg,contract: dataDB} = await window.api.createContract({
                    ...contractData,
                    initialDate: contractData.initialDate.toDate(),
                    endDate: contractData.endDate.toDate(),
                    days: formattedDays,
                });

                if(dataDB) {
                    const newContract = {id: dataDB.id, ...contractData};
                    dispatch(onAddContracts(newContract));
                    // Update events
                    dispatch(onDeleteEventsByContractId(newContract.id));
                    const events = generateEventsForContract(newContract, getEmployeeById, getBuildingByID);
                    dispatch(onLoadEvents(events));
                } else {
                    throw new Error('No se pudo crear el contrato');
                }
                console.log(dataDB);
                if(dataDB) data = {msg,helpMsg}
            }

            
            Swal.fire({
                title: data.msg,
                text: data?.helpMsg,
                timer: 2000,
                icon: 'success'
            });
        } catch (error) {
            console.log({error});
            Swal.fire('Error al guardar',error.message,'error');
        }
        
    }

    const startDeletingContract = async () => {
        console.log(activeContract);
        
        const selBuilding = buildings.find(b => b.id === activeContract.buildingId)
        const selEmployee = employees.find(e => e.id === activeContract.employeeId)
        
      // TODO: llegar al backend
        try {
            Swal.fire({
            title: "Deseas borrar el contrato " + selEmployee.name + "<=>" + selBuilding.buildingName + " de la lista?",
            showDenyButton: true,
            showConfirmButton: true,
            confirmButtonText: "Borrar",
            confirmButtonColor: "red",
            denyButtonText:"No borrar",
            denyButtonColor: "grey",
            }).then(async (result) => {
                if(result.isConfirmed) {
                    // const data = await formApi.delete('/contract/' + activeContract.id)
                    const data = await window.api.deleteContract(activeContract.id);
                    if(data.success) {
                        dispatch(onDeleteContracts());
                        dispatch(onDeleteEventsByContractId(activeContract.id));
                    }
                    Swal.fire(selEmployee.name + " <=> " + selBuilding.buildingName + " borrado","",'success');
                } else if (result.isDenied) {
                    Swal.fire("Cancelado","",'error');
                }
            })
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar',error.response.data.msg,'error');
        }
  
    }

    const startLoadingContracts = async () => {

      try {

        const dataDB = await window.api.getContracts();
        
        
        if(dataDB){
            const contractsDB = dataDB.map(contract => {
                
                const daySplitted = contract.dataValues.days.split(',');
                const formattedDays = daySplitted.map(timeDay => timeDay.split('_')) 
                            
                return {
                    ...contract.dataValues,
                    days: formattedDays,
                    initialDate: dayjs(contract.dataValues.initialDate),
                    endDate: dayjs(contract.dataValues.endDate),
                }
            });
            
            dispatch(onLoadContracts(contractsDB));
        } else {
            throw new Error('No se pudieron cargar los contratos desde la base de datos');
        }
        
        
      } catch (error) {
        console.log({msg: 'Error cargando evento',error});
      }
    }

    return {
        contracts,
        activeContract,
        setActiveContract,
        startSavingContract,
        startDeletingContract,
        startLoadingContracts
    }
}

