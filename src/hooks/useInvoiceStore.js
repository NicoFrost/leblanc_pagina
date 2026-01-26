import { useDispatch, useSelector } from "react-redux";
import { onActiveInvoice, onAddInvoice, onLoadInvoices, onUpdateInvoice } from "../store";
import {invoiceRows} from '../helpers/getDataExample'
import calcularHorasMensuales from "../helpers/calcularHorasMensuales";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
import Swal from "sweetalert2";
import { enqueueSnackbar } from "notistack";
dayjs.extend(isBetween)

export const useInvoiceStore = () => {
    // Aquí puedes implementar la lógica para interactuar con el store de gastos

    const {activeInvoice,invoices} = useSelector(state => state.invoices);
    const {contracts} = useSelector(state => state.contract);
    const {collections} = useSelector(state => state.collections);
    const dispatch = useDispatch();

    const setActiveInvoice = async (invoiceID) => {
        const active = invoices.find(e => e.id === invoiceID)
        if(active){
            dispatch(onActiveInvoice(active))
        } else {
            dispatch(onActiveInvoice({}))
        }        
        
    }

    const setSettleInvoice = async (invoiceId,newCollection) => {
      try {
        if(!invoiceId) throw new Error("Invalid invoice ID");
        const selected = invoices.find(e => e.id === invoiceId)
        if(!selected) throw new Error("Invoice not found");
        if(!newCollection) throw new Error("Invalid collection data");
        const collectionsMaded = collections.filter(c => c.invoiceId === invoiceId)
        let totalCollections = 0;
        
        collectionsMaded.forEach(collection => {
          totalCollections += collection.amount
        })
        
        console.log(collections,totalCollections + new Number(newCollection.amount));
        
        console.log(totalCollections,selected.total,{...selected,settled:true});
        if(totalCollections + new Number(newCollection.amount) == selected.total){
          const dataDB = await window.api.updateInvoice(selected.id, {...selected,settlementDate: selected.settlementDate.toDate(),settled:true})

          dispatch(onUpdateInvoice({...selected,settled:true}))
        } else {
          enqueueSnackbar("falta efectivo para saldar la factura", { variant: 'warning' });
          // throw new Error("Total collections do not match invoice total")
        }

        
      } catch (error) {
        Swal.fire(
          'Error al saldar factura',
          error.message,
          "error"
        );
        console.log({msg: 'Error saldando factura', error} )
      }
    }

    const startLoadingInvoices = async () => {

      try {
        
        const dataDB = await window.api.getInvoices();
        
        
        if(dataDB){
            const invoicesDB = dataDB.map(data => {
              const invoice = data.dataValues

              return {
                ...invoice,
                settlementDate: dayjs(invoice.settlementDate),
              }
            });
            
            dispatch(onLoadInvoices(invoicesDB));
        }
      } catch (error) {
        Swal.fire(
          'Error al cargar facturas',
          error.message,
          "error"
        );
        console.log({msg: 'Error cargando facturas', error})
      }
    }

    const startLiquidationIInvoices = async (settlementDate) => {
      try {

        if(!dayjs.isDayjs(settlementDate)) throw new Error("Invalid settlement date");
                    
        console.log(contracts);
        contracts.forEach(async contract => {
          
          if(contract.state && settlementDate.isBetween(contract.initialDate, contract.endDate, null, '[]')) {

            const horasMensuales = calcularHorasMensuales(contract.days,settlementDate.month(),settlementDate.year())
            const precioServicio = contract.hourlyRate
  
            const importeTotal = (precioServicio * horasMensuales) + ((precioServicio * horasMensuales) * 0.21 ) // con IVA 
            
            console.log(importeTotal,precioServicio,horasMensuales);
            
            const invoiceObject = {
              total: importeTotal,
              settlementDate: settlementDate.toDate(),
              buildingId: contract.buildingId,
              settled: false,
              state: true,
            }
            
            
            const invoiceExists = invoices.some(inv => 
              inv.buildingId === invoiceObject.buildingId && 
              inv.settlementDate.month() === settlementDate.month() && 
              inv.settlementDate.year() === settlementDate.year()
            );
            
            if (!invoiceExists) {
              
              const dataDB = await window.api.createInvoice(invoiceObject)
              // const dataDB = {id: Math.floor(Math.random() * 1000000), ...invoiceObject} // Mock ID generation
              console.log('INVOICE A DB',invoiceObject)
              
            const invoice = {
              ...invoiceObject,
              settlementDate: settlementDate
            }
            console.log({...dataDB,...invoice});

            dispatch(onAddInvoice({...dataDB,...invoice}))
            enqueueSnackbar(`Factura de ${settlementDate.format('MMMM YYYY')} creada exitosamente`, { variant: 'success' });
            } else {
              // TODO no se logro hacer las snackbars funcionar desde aquí
              enqueueSnackbar(
                `La factura para el edificio ${contract.buildingId} en ${settlementDate.format('MMMM YYYY')} ya existe. No se crea una nueva.`,
                { variant: 'info' }
              );
              // Swal.fire(
              //   'Factura existente',
              //   `La factura para el edificio ${contract.buildingId} en ${settlementDate.format('MMMM YYYY')} ya existe. No se crea una nueva.`,
              //   "info"
              // );              
            }
          };
        });

      } catch (error) {
        Swal.fire(
          'Error al liquidar facturas',
          error.message,
          "error"
        );
        console.log({msg: 'Error liquidando facturas', error})
      }
    }


    return {
        invoices,
        collections,
        activeInvoice,
        setActiveInvoice,
        setSettleInvoice,
        startLoadingInvoices,
        startLiquidationIInvoices,
    }
}