import { useDispatch, useSelector } from "react-redux";
import { onAddSalary, onLoadSalaries, onUpdateSalary, onDeleteSalary, onSetActiveSalary } from "../store/system/salariesSlice";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";


export const useSalariesStore = () => {

    const {salaries, activeSalary} = useSelector(state => state.salaries);
    const {payments} = useSelector(state => state.payments);
    const dispatch = useDispatch();


    const startLoadingSalaries = async () => {

        try {
        const dataDB = await window.api.getSalaries();
        
        if(dataDB){
            const formattedSalaries = dataDB.map((salary) => {
                return {
                    ...salary.dataValues,
                    date: dayjs(salary.dataValues.date),
                }
            })

            dispatch(onLoadSalaries(formattedSalaries));
            
        } else {
            throw new Error('No data received from main process');
        }
        } catch (error) {
            console.log({msg: 'Error cargando salarios', error})
        }
    }

    const startSavingSalary = async (salaryData) => {
        try {
            const {id,...rest} = salaryData;
            
            const dataDB = await window.api.createSalary({
                ...rest,
                date: rest.date.toDate()
            });

            enqueueSnackbar("Salario guardado exitosamente", { variant: 'success' });

            if(dataDB) {
                dispatch(onAddSalary({
                    ...rest,
                    id: dataDB.id,
                }))
            }
            return {ok:true}
        } catch (error) {
            enqueueSnackbar(error.message || 'Error guardando salario',{variant:"warning"})
            console.log({msg: 'Error guardando salario', error})
            return {ok:false}
        }
    }

    const startUpdatingSalary = async (salaryData) => {
        try {
            const {id,...rest} = salaryData;

            const dataDB = await window.api.updateSalary(id, {
                ...rest,
                date: rest.date.toDate()
            });

            enqueueSnackbar("Salario actualizado exitosamente", { variant: 'success' });

            if(dataDB) {
                dispatch(onUpdateSalary({
                    ...rest,
                    id: dataDB.id,
                }))
            }
            return {ok:true}
        } catch (error) {
            enqueueSnackbar(error.message || 'Error actualizando salario',{variant:"warning"})
            console.log({msg: 'Error actualizando salario', error})
            return {ok:false}
        }
    }

    const startDeletingSalary = async (id) => {
        try {
            const dataDB = await window.api.deleteSalary(id);

            enqueueSnackbar("Salario eliminado exitosamente", { variant: 'success' });

            if(dataDB) {
                dispatch(onDeleteSalary())
            }
            return {ok:true}
        } catch (error) {
            enqueueSnackbar(error.message || 'Error eliminando salario',{variant:"warning"})
            console.log({msg: 'Error eliminando salario', error})
            return {ok:false}
        }
    }

    const setSettleSalary = async (newPayment) => {
        try {
            if(!activeSalary) throw new Error("Invalid salary ID");
            console.log(activeSalary);
            
            if(!activeSalary) throw new Error("Salary not found");
            if(!newPayment) throw new Error("Invalid payment data");
            const paymentsMade = payments.filter(s => s.salaryId === activeSalary.id)
            let totalPayments = 0;
            
            paymentsMade.forEach(payment => {
                totalPayments += payment.amount
            })
            
            // console.log(payments,paymentsMade, totalPayments + new Number(newPayment.amount));
            if(activeSalary.grossAmount < totalPayments + new Number(newPayment.amount)) throw new Error("El pago excede el monto del salario")

            console.log(totalPayments, activeSalary.grossAmount, {...activeSalary, paid:true});
            if(totalPayments + new Number(newPayment.amount) == activeSalary.grossAmount){
                const dataDB = await window.api.updateSalary(activeSalary.id, {...activeSalary,paid:true})

                dispatch(onUpdateSalary({...activeSalary, paid:true}))
                enqueueSnackbar("Salario pagado en su totalidad", { variant: 'success' });
            }
        } catch (error) {
            enqueueSnackbar(error.message || 'Error procesando pago', {variant:"warning"})
            console.log({msg: 'Error procesando pago', error})
        }
    }

    const setActiveSalary = (salary) => {

        console.log(salary, salaries.find(s => s.id === salary) );

        dispatch(onSetActiveSalary(salaries.find(s => s.id === salary)));
    }
    
    return {
        salaries,
        activeSalary,
        startLoadingSalaries,
        startSavingSalary,
        startUpdatingSalary,
        startDeletingSalary,
        setSettleSalary,
        setActiveSalary,
    };
}
