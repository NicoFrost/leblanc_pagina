import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    isLoadingCategory: false,
    categories: [],
    activeCategory: undefined,
};

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        onSetActiveCategory: (state,{payload} ) => {
            state.activeCategory = payload;
        },
        onLoadCategories: (state,{payload = []}) => {
            state.isLoadingProvider = false;
            state.categories = payload;
            payload.forEach(category => {
                const exists = state.categories.some(dbEvent => dbEvent === category)
                if(!exists) {
                    state.categories.push(category);
                }
            })
        },
        onAddNewCategory: (state,{payload}) => {
            (payload != null) 
                && state.categories.push(payload);
        },
        onUpdateCategory: (state,{payload}) => {
            if (payload != null){
                state.categories = state.categories.map((category) => {
                    if(category.id === payload.id){
                        return payload
                    } 
                    return category
                })
            }
        },
        onDeleteCategory: (state,) => {
            if(state.activeCategory.id != null){
                state.categories = state.categories.filter((category => category.id !== state.activeCategory.id))
            }
        },
        onLogoutCategory: (state) => {
            state.isLoadingEvents = true;
            state.categories = [];
            state.activeCategory = undefined;
        }
    }
})

export const {onSetActiveCategory,onLoadCategories,onAddNewCategory,onUpdateCategory,onDeleteCategory,onLogoutCategory} = categorySlice.actions