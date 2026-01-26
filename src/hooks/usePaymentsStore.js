import { useDispatch, useSelector } from "react-redux";
import { onAddPayment, onLoadPayments, onUpdatePayment, onDeletePayment, onSetActivePayment } from "../store/system/paymentsSlice";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";


export const usePaymentsStore = () => {

    const {payments, activePayment} = useSelector(state => state.payments);
    const {activeSalary} = useSelector(state => state.salaries);
    const dispatch = useDispatch();


    const startLoadingPayments = async () => {

        try {
        const dataDB = await window.api.getPayments();

        if(dataDB){
            const formattedPayments = dataDB.map((payment) => {
                return {
                    ...payment.dataValues,
                    date: dayjs(payment.dataValues.date),
                }
            })

            dispatch(onLoadPayments(formattedPayments));

        } else {
            throw new Error('No data received from main process');
        }
        } catch (error) {
            console.log({msg: 'Error cargando pagos', error})
        }
    }

    const startSavingPayment = async (paymentData) => {
        try {
            const {id,...rest} = paymentData;

            console.log(rest);
            
            if(isNaN(rest.amount) || rest.amount <= 0) throw new Error("El monto del pago debe ser mayor a cero")

            const paymentsMade = payments.filter(s => s.salaryId === activeSalary.id)
            let totalPayments = 0;
            
            paymentsMade.forEach(payment => {
                totalPayments += payment.amount
            })

            console.log(paymentsMade,payments, totalPayments, activeSalary, rest.amount);
            
            if(activeSalary.grossAmount < totalPayments + new Number(rest.amount)) throw new Error("El pago excede el monto del salario")

                
            const dataDB = await window.api.createPayment({
                ...rest,
                date: rest.date.toDate()
            });
            
            if(dataDB) {
                dispatch(onAddPayment({
                    ...rest,
                    id: dataDB.id,
                }))
            }
            enqueueSnackbar("Pago guardado exitosamente", { variant: 'success' });
            return {ok:true}
        } catch (error) {
            enqueueSnackbar(error.message || 'Error guardando pago',{variant:"warning"})
            console.log({msg: 'Error guardando pago', error})
            return {ok:false}
        }
    }

    const startUpdatingPayment = async (paymentData) => {
        try {
            const {id,...rest} = paymentData;

            const dataDB = await window.api.updatePayment(id, {
                ...rest,
                date: rest.date.toDate()
            });

            enqueueSnackbar("Pago actualizado exitosamente", { variant: 'success' });

            if(dataDB) {
                dispatch(onUpdatePayment({
                    ...rest,
                    id: dataDB.id,
                }))
            }
            return {ok:true}
        } catch (error) {
            enqueueSnackbar(error.message || 'Error actualizando pago',{variant:"warning"})
            console.log({msg: 'Error actualizando pago', error})
            return {ok:false}
        }
    }

    const startDeletingPayment = async (id) => {
        try {
            const dataDB = await window.api.deletePayment(id);

            enqueueSnackbar("Pago eliminado exitosamente", { variant: 'success' });

            if(dataDB) {
                dispatch(onDeletePayment())
            }
            return {ok:true}
        } catch (error) {
            enqueueSnackbar(error.message || 'Error eliminando pago',{variant:"warning"})
            console.log({msg: 'Error eliminando pago', error})
            return {ok:false}
        }
    }

    const setActivePayment = (payment) => {
        dispatch(onSetActivePayment(payment));
    }

    return {
        payments,
        activePayment,
        startLoadingPayments,
        startSavingPayment,
        startUpdatingPayment,
        startDeletingPayment,
        setActivePayment,
    };
}