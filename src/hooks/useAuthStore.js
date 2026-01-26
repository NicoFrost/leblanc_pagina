import { useDispatch, useSelector} from 'react-redux'
import Swal from 'sweetalert2';
// import CryptoJS from 'crypto-js';
// TODO CAMBIAR POR EDIFICIOS,CONTRATOS,EMPLEADAS
import { 
    clearErrorMessage, 
    onChecking, 
    onLogin, 
    onLogout,
    onLogoutEmployees,
    onLogoutContracts,
    onLogoutBuildings,
    onLogoutExpenses,
} from "../store";
import formApi from '../api/FormsApi';
import { getEnvVariables } from '../helpers/getEnvVariables'


// Datos de prueba
const TestData = {
    token: 'fake-jwt-token-123456',
    user: {
        name: 'Usuario Falso',
        uid: 'fake-uid-001',
        role: 'USER_ROLE'
    }
};
// realizar cualquier 
// interaccion con el auth del store
export const useAuthStore = () => {


    // console.log(process.env.VITE_PWD); // Access the environment variable directly
    const {status,user,errorMessage} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const {VITE_PWD} = getEnvVariables()
    const startLogin = async ({email,password}) => {

        try {
            dispatch(onChecking());
            
            // ! SE DESACTIVA ENCRIPTACION TEMPORALMENTE
            // const encryptedPassword = CryptoJS.AES.encrypt(password, VITE_PWD).toString();
            // console.log(encryptedPassword);
            // Enviar la contraseña encriptada al servidor
            // const {data} = await formApi.post('/auth/login',{email,password: encryptedPassword});
            // ! FIN CODIGO DE ENCRIPTACION

            // Pedido real 
            // const {data} = await formApi.post('/auth/login',{email,password: password});

            // Simulación de respuesta exitosa de autenticación
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Simula un retraso de 5 segundos
            const data = TestData;

            const {name,uid,role} = data.user;
            console.log(data.token);
            localStorage.setItem('token',data.token)
            localStorage.setItem('token-init-date',new Date().getTime());
            dispatch(onLogin({name,uid,role}));

        } catch (error) {
            console.log(error);
            
            dispatch(onLogout('Correo/Contraseña incorecto'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            },8000)
        }
    }

    const startRegister = async ({name,email,password}) => {

        
        const secretCODE = "FoxtrotClan2002FOREVER"
        try {
            
            if(user.role === "ADMIN_ROLE") {
                dispatch(onChecking());
                const {dataREGISTER} = await formApi.post('/auth/new',{name,email,password,secretCODE});
                Swal.fire({
                    title: dataREGISTER?.msg,
                    icon:'success',
                    text: dataREGISTER.user?.name,
                    showConfirmButton:false,
                    timer:2000,
                })
            } else {
                Swal.fire({
                    title: "Usted no tiene permisos para esta accion",
                    text: "llama a un administrador si ves este mensaje",
                    icon: "error",
                    showConfirmButton: false,
                    timer:2000
                })
            }
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                dispatch(clearErrorMessage());
            },10)
        }
    }
    
    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch(onLogout());

        try {
            // console.log(token);
            
            const {tokenData,user : data} = TestData; // Simulación de respuesta exitosa de autenticación
            // const {data} = await formApi.get('auth/renew')
            if(!data.uid) throw new Error('El usuario no trajo id');
            localStorage.setItem('token',tokenData);
            localStorage.setItem('token-init-date',new Date().getTime());
            dispatch(onLogin({name: data.name,uid: data.uid,role: data.role}));
        } catch (error) {
            console.log(error);
            localStorage.clear();
            dispatch(onLogout());
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());
        dispatch(onLogoutBuildings())
        dispatch(onLogoutEmployees())
        dispatch(onLogoutContracts())
        dispatch(onLogoutExpenses())
    }

    return {
        //* Propiedades
        errorMessage,
        status,
        user,
        //*  Metodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout
    }
}
