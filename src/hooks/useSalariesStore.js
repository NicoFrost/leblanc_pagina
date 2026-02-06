import { useDispatch, useSelector } from "react-redux";
import { onAddSalary, onLoadSalaries, onUpdateSalary, onDeleteSalary, onSetActiveSalary } from "../store/system/salariesSlice";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import calcularHorasMensuales from "../helpers/calcularHorasMensuales";


export const useSalariesStore = () => {

    const {salaries, activeSalary} = useSelector(state => state.salaries);
    const {payments} = useSelector(state => state.payments);
    const {employees} = useSelector(state => state.employee);
    const {contracts} = useSelector(state => state.contract);
    const dispatch = useDispatch();


    const startLoadingSalaries = async () => {

        try {
        const dataDB = await window.api.getSalaries();
        
        
        if(dataDB){
            const formattedSalaries = dataDB.map((salary) => {
                return {
                    ...salary.dataValues,
                    date: dayjs(salary.dataValues.paidDate),
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
    
    const startLiquidationSalaries = async (settlementDate) => {
        try {
            if(!settlementDate) throw new Error("Invalid settlement date");
            // Lógica de liquidación aquí

            employees.forEach(async employee => {

                const contract = contracts.find(contract => contract.employeeId === employee.id);



                const totalHoras = calcularHorasMensuales(contract.days,settlementDate.month(),settlementDate.year(), contract.endDate);
                
                const dataDB = await window.api.createSalary({
                    employeeId: employee.id,
                    grossAmount: (contract.hourlyRate * totalHoras),
                    period: settlementDate.year() + "-" + (settlementDate.month() + 1),
                    paidDate: settlementDate.toDate(),
                    paid: false,
                    state: true,
                });
                console.log(dataDB);
                
                dispatch(onAddSalary({
                    ...dataDB,
                    date: dayjs(dataDB.date),
                }));

                enqueueSnackbar("Salario de " + employee.name + " para " + settlementDate.year() + "-" + (settlementDate.month() + 1), { variant: 'success' });
            })


        } catch (error) {
            enqueueSnackbar(error.message || 'Error liquidando salario', {variant:"warning"})
            console.log({msg: 'Error liquidando salario', error})
        }
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
        startLiquidationSalaries,
    };
}
