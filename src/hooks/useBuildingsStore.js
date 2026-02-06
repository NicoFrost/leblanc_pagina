import { useDispatch, useSelector } from "react-redux";
import { onActiveBuilding, onAddBuildings, onDeleteBuildings, onLoadBuildings, onUpdateBuildings } from "../store";
import { buildingsRows } from "../helpers/getDataExample";
import Swal from "sweetalert2";



export const useBuildingsStore = () => {
    // Aquí puedes implementar la lógica para interactuar con el store de edificios

    const {activeBuilding,buildings} = useSelector(state => state.building);
    const {status} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const getBuildingByID = (buildingID) => {
        const buildingFounded = buildings.find(b => b.id === buildingID)
        return buildingFounded
    }

    const setActiveBuilding = async (buildingID) => {
        const active = buildings.find(e => e.id === buildingID)
        // console.log(active,expenseID);
        if(active){
            dispatch(onActiveBuilding(active))
        } else {
            dispatch(onActiveBuilding({}))
        }
    }

    const startSavingBuilding = async (buildingData) => {
        // Aquí puedes implementar la lógica para guardar un edificio
        let data = {msg:"complletado",helpMsg:"sip completado increible no?"};
        try {

            if(buildingData.id){
                // const {data: dataDB} = await formApi.put('/building/' + buildingData.id, buildingData);
                const {msg,helpMsg,success} = await window.api.updateBuilding(buildingData.id, {
                    ...buildingData,
                    address: buildingData.address.join(" "),
                    phone: buildingData.phone.join(" ")
                });
                
                dispatch(onUpdateBuildings(buildingData));
                if(success) data = {msg,helpMsg}
            } else {
                // const {status,data: dataDB} = await formApi.post('/building', buildingData);
                const {msg,helpMsg,success,building: dataDB} = await window.api.createBuilding({
                    ...buildingData,
                    address: buildingData.address.join(" "),
                    phone: buildingData.phone.join(" ")
                });
                
                const building = {
                    ...dataDB,
                    address: dataDB.address ? dataDB.address.split(" ") : [],
                    phone: dataDB.phone ? dataDB.phone.split(" ") : []
                }
                
                // const id = dataDB.building.id;
                dispatch(onAddBuildings(building));
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

    const startDeletingBuilding = async () => {
      // TODO: llegar al backend
        try {
            Swal.fire({
            title: "Deseas borrar " + activeBuilding.buildingName + " de la lista?",
            showDenyButton: true,
            showConfirmButton: true,
            confirmButtonText: "Borrar",
            confirmButtonColor: "red",
            denyButtonText:"No borrar",
            denyButtonColor: "grey",
            }).then(async (result) => {
                if(result.isConfirmed) {
                    // const data = await formApi.delete('/building/' + activeBuilding.id)
                    const data = await window.api.deleteBuilding(activeBuilding.id);
                    dispatch(onDeleteBuildings());
                    Swal.fire(data.msg, activeBuilding.buildingName + " borrado", 'success');
                } else if (result.isDenied) {
                    Swal.fire("Cancelado", "", 'error');
                }
            })
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }
  
    }

    const startLoadingBuildings = async () => {

      try {
        // console.log(status);

        // const {data} = await formApi.get('/building')
            // console.log(window.api);
            
        const data = await window.api?.getBuildings();

        if(data){
          const building = data.map(b => ({
            ...b.dataValues,
            address: b.dataValues.address ? b.dataValues.address.split(" ") : [],
            phone: b.dataValues.phone ? b.dataValues.phone.split(" ") : []
          }));
          dispatch(onLoadBuildings(building));
        }

      } catch (error) {
        console.log({msg: 'Error cargando evento',error});
      }
    }

    return {
        buildings,
        activeBuilding,
        getBuildingByID,
        setActiveBuilding,
        startSavingBuilding,
        startDeletingBuilding,
        startLoadingBuildings
    }
}

