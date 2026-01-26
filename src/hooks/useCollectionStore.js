import { useDispatch, useSelector } from "react-redux";
import { collectionRows, invoiceRows } from "../helpers/getDataExample";
import { onAddCollection, onLoadCollections } from "../store/system/collectionSlice";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";


export const useCollectionStore = () => {

    const {collections} = useSelector(state => state.collections);
    const {invoices} = useSelector(state => state.invoices)
    const dispatch = useDispatch();


    const startLoadingCollections = async () => {

        try {
        const dataDB = await window.api.getCollections();
        
        if(dataDB){
            const formattedCollections = dataDB.map((collection) => {
                // let amountSettled = 0;
                // const invoice = invoices.find(i => i.id == rest.invoiceId)
            
            
                // collections.map(c => {
                //     if(c.invoiceId == invoice.id){
                //         amountSettled += c.amount
                //     }
                // })

                return {
                    ...collection.dataValues,
                    date: dayjs(collection.dataValues.date),
                    // amountSettled
                }
            })

            dispatch(onLoadCollections(formattedCollections));
            
        } else {
            throw new Error('No data received from main process');
        }
        } catch (error) {
            console.log({msg: 'Error cargando colecciones', error})
        }
    }

    const startSavingCollection = async (collectionData) => {
        try {
            const {id,...rest} = collectionData;

            let amountSettled = 0;
            const invoice = invoices.find(i => i.id == rest.invoiceId)
              
            // if(!invoice) throw new Error('Invoice not found')

            collections.map(c => {
                if(c.invoiceId == invoice.id){
                    amountSettled += c.amount
                }
            })
            
            amountSettled += rest.amount          

            console.log(rest.amount,invoice.total,amountSettled,invoice.total - amountSettled);
            
            if(invoice.total - amountSettled && rest.amount > invoice.total - amountSettled) throw new Error('El monto supera el monto a pagar')
            const dataDB = await window.api.createCollection({
                ...rest,
                date: rest.date.toDate()
            });

            enqueueSnackbar("Cobranza guardada exitosamente", { variant: 'success' });

            if(dataDB) {
                dispatch(onAddCollection({
                    ...rest,
                    id: dataDB.id,
                }))
            }
            return {ok:true}
        } catch (error) {
            enqueueSnackbar(error.message || 'Error guardando cobranza',{variant:"warning"})
            console.log({msg: 'Error guardando cobranza', error})
            return {ok:false}
        }
    }
    
    return {
        collections,
        startLoadingCollections,
        startSavingCollection,
    };
}