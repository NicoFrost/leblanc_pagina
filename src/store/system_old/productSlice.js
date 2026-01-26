import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    isLoadingProduct: true,
    products: [],
    activeProduct: undefined,
    detailMovement: [],
    productsInCart: [],
};

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        onSetActiveProduct: (state,{payload} ) => {
            state.activeProduct = payload;
        },
        onLoadProducts: (state,{payload = []}) => {
            state.isLoadingEvents = false;
            state.products = payload;
            payload.forEach(product => {
                const exists = state.products.some(dbEvent => dbEvent === product)
                if(!exists) {
                    state.products.push(product);
                }
            })
        },
        onLoadDetailMovements: (state,{payload}) => {
            state.detailMovement = payload;
            payload.forEach(detMov => {
                const exists = state.detailMovement.some(dbEvent => dbEvent === detMov)
                if(!exists) {
                    state.detailMovement.push(detMov)
                }
            })
        },
        onAddNewProduct: (state,{payload}) => {
            (payload != null) 
                && state.products.push(payload);
        },
        onUpdateProduct: (state,{payload}) => {
            if (payload != null){
                state.products = state.products.map((product) => {
                    if(product.id === payload.id){
                        return payload
                    } 
                    return product
                })
            }
        },
        onDeleteProduct: (state,) => {
            if(state.activeProduct.id != null){
                state.products = state.products.filter((product => product.id !== state.activeProduct.id))
            }
        },
        onLogoutProduct: (state) => {
            state.isLoadingEvents = true;
            state.products = [];
            state.activeProduct = undefined;
        },
        onAddProductInCart: (state,{payload}) => {
            if(payload != null) {
                console.log(payload);
                
                if(state.productsInCart.filter(({product}) => product.id == payload.id).length == 0){
                    state.productsInCart.push({product: payload,quantity: 1});
                } else {
                    state.productsInCart.forEach(({product},index) => {
                        if(product.id == payload.id){
                            state.productsInCart[index].quantity++
                        }
                    })
                }

            }
        },
        onDeleteProductInCart: (state,{payload}) => {
            if(payload != null) {
                let item = state.productsInCart.find((item) => item.product.id == payload)

                if(item.quantity > 1) {
                    state.productsInCart.forEach(({product},index) => {
                        if(product.id == payload){
                            state.productsInCart[index].quantity--
                        }
                    })                    
                } else {
                    state.productsInCart = state.productsInCart.filter(({product}) => (product.id !== payload))
                }
            }
        }
    }
})

export const {onSetActiveProduct,onLoadProducts,onLoadDetailMovements,onAddNewProduct,onUpdateProduct,onDeleteProduct,onLogoutProduct,onAddProductInCart,onDeleteProductInCart} = productSlice.actions