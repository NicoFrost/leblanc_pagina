import { useDispatch, useSelector } from "react-redux";
import { onActiveMethod, onAddMethod, onDeleteMethod, onLoadMethods, onUpdateMethod } from "../store";
import Swal from "sweetalert2";

export const useMethodStore = () => {
    const {activeMethod, methods} = useSelector(state => state.method);
    const dispatch = useDispatch();

    const getMethodById = (methodID) => {
        const methodFounded = methods.find(m => m.id === methodID)
        return methodFounded
    }

    const setActiveMethod = async (methodID) => {
        const active = methods.find(m => m.id === methodID)

        if(active){
            dispatch(onActiveMethod(active))
        } else {
            dispatch(onActiveMethod({}))
        }
    }

    const startSavingMethod = async (methodData) => {
        let data = {msg:"complletado",helpMsg:"sip completado increible no?"}
        try {
            if(methodData.id){
                const dataDB = await window.api.updateMethod(methodData.id, {
                    ...methodData
                });
                dispatch(onUpdateMethod(methodData));
                if(dataDB.msg) data = {msg: dataDB.msg,helpMsg: dataDB.helpMsg}
            } else {
                const {success,method:dataDB} = await window.api.createMethod({
                    ...methodData
                });

                const method = {
                    ...dataDB
                };

                dispatch(onAddMethod(method));
                if(dataDB.msg) data = {msg: dataDB.msg || data.msg,helpMsg: dataDB.helpMsg || data.helpMsg}
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

    const startDeletingMethod = async () => {
        try {
            Swal.fire({
            title: "Deseas borrar " + activeMethod.name + " de la lista?",
            showDenyButton: true,
            showConfirmButton: true,
            confirmButtonText: "Borrar",
            confirmButtonColor: "red",
            denyButtonText:"No borrar",
            denyButtonColor: "grey",
            }).then(async (result) => {
                if(result.isConfirmed) {
                    const data = await window.api.deleteMethod(activeMethod.id);
                    dispatch(onDeleteMethod());
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

    const startLoadingMethods = async () => {
      try {
        const data = await window.api?.getMethod();
        if(data){ 
            const methodsArr = data.map(m => ({
                ...m.dataValues
            }));
            dispatch(onLoadMethods(methodsArr));
        }
      } catch (error) {
        console.log(error);
        Swal.fire('Error al cargar methods', error.message , 'error');
      }
    }

    return {
        methods,
        activeMethod,
        getMethodById,
        setActiveMethod,
        startSavingMethod,
        startDeletingMethod,
        startLoadingMethods
    }
}
