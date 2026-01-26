import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    activeMenu: "home",
    productView: "Productos",
    isEmployeeModalOpen: false,
    isContractModalOpen: false,
    isBuildingModalOpen: false,
    isExpensesModalOpen: false,
    isInvoiceModalOpen: false,
    isDateModalOpen: false,
    isUserModalOpen: false
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        onSwitchMenu: (state,{payload}) => {
            state.activeMenu = payload;
        },
        // Employee
        onOpenEmployeeModal: (state,{payload}) => {
            state.isEmployeeModalOpen = payload || true;
        },
        onCloseEmployeeModal: (state) => {
            state.isEmployeeModalOpen = false;
        },
        // Contract
        onOpenContractModal: (state,{payload}) => {
            state.isContractModalOpen = payload || true;
        },
        onCloseContractModal: (state) => {
            state.isContractModalOpen = false;
        },
        // Building
        onOpenBuildingModal: (state,{payload}) => {
            state.isBuildingModalOpen = payload || true;
        },
        onCloseBuildingModal: (state) => {
            state.isBuildingModalOpen = false;
        },
        // Expenses
        onOpenExpensesModal: (state,{payload}) => {
            state.isExpensesModalOpen = payload || true;
        },
        onCloseExpensesModal: (state) => {
            state.isExpensesModalOpen = false;
        },
        // Invoice
        onOpenInvoiceModal: (state,{payload}) => {
            state.isInvoiceModalOpen = payload || true;
        },
        onCloseInvoiceModal: (state) => {
            state.isInvoiceModalOpen = false;
        },
        //Salary
        onOpenSalaryModal: (state,{payload}) => {
            state.isSalaryModalOpen = payload || true;
        },
        onCloseSalaryModal: (state) => {
            state.isSalaryModalOpen = false;
        },
        //Payments
        onOpenPaymentModal: (state,{payload}) => {
            state.isPaymentModalOpen = payload || true;
        },
        onClosePaymentModal: (state) => {
            state.isPaymentModalOpen = false;
        },
        // User
        onOpenUserModal: (state,{payload}) => {
            state.isUserModalOpen = payload || true;
        },
        onCloseUserModal: (state,{payload}) => {
            state.isUserModalOpen = payload || false;
        }   
    },
});

export const {
    onSwitchMenu,
    // USER
    onOpenUserModal,
    onCloseUserModal,

    // EMPLOYEE
    onOpenEmployeeModal,
    onCloseEmployeeModal,

    // CONTRACT
    onOpenContractModal,
    onCloseContractModal,

    // BUILDING
    onOpenBuildingModal,
    onCloseBuildingModal,

    // EXPENSES
    onOpenExpensesModal,
    onCloseExpensesModal,

    // INVOICE
    onOpenInvoiceModal,
    onCloseInvoiceModal,

    // SALARY
    onOpenSalaryModal,
    onCloseSalaryModal,

    // PAYMENT
    onOpenPaymentModal,
    onClosePaymentModal,
    
} = uiSlice.actions;