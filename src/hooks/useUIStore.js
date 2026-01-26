import { useDispatch, useSelector } from "react-redux"
import {

    onSwitchMenu, 

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

    // Invoice
    onOpenInvoiceModal,
    onCloseInvoiceModal,

    // USERS
    onOpenUserModal,
    onCloseUserModal,

    // Salary
    onOpenSalaryModal,
    onCloseSalaryModal,

    // Payments
    onOpenPaymentModal,
    onClosePaymentModal,
} from "../store/ui/uiSlice"
import {
    useBuildingsStore,
    useContractsStore,
    useEmployeesStore,
    useExpensesStore,
} from "../hooks"
import { useInvoiceStore } from "./useInvoiceStore"
export const useUIStore = () => {

    const {
        activeMenu,
        productView,
        isEmployeeModalOpen,
        isContractModalOpen,
        isBuildingModalOpen,
        isExpensesModalOpen,
        isInvoiceModalOpen,
        isDateModalOpen,
        isUserModalOpen,
        isSalaryModalOpen,
        isPaymentModalOpen,
    } = useSelector(state => state.ui)

    const {setActiveBuilding} = useBuildingsStore()
    const {setActiveEmployee} = useEmployeesStore()
    const {setActiveExpense} = useExpensesStore()
    const {setActiveContract} = useContractsStore()
    const {setActiveInvoice} = useInvoiceStore()
    const dispatch = useDispatch()

    const SwitchMenu = (menu) => {
        dispatch(onSwitchMenu(menu))
    }
    const timeout = 500
    //* EMPLOYEE

    const openEmployeeModal = (mode) => {
        if(mode != 'edit'){
            setActiveEmployee(-1)
        }
        setTimeout(() => {
            dispatch(onOpenEmployeeModal(mode))
        }, timeout);
    }

    const closeEmployeeModal = () => {
        dispatch(onCloseEmployeeModal())
    }
    const toggleEmployeeModal = () => {
        (isEmployeeModalOpen)
        ? openEmployeeModal()
        : closeEmployeeModal();
    }

    //* CONTRACT

    const openContractModal = (mode) => {
        if(mode != 'edit' && mode != 'readonly'){
            setActiveContract(-1)
        }
        setTimeout(() => {
            dispatch(onOpenContractModal(mode))
        }, timeout);
    }

    const closeContractModal = () => {
        dispatch(onCloseContractModal())
    }
    const toggleContractModal = () => {
        (isContractModalOpen)
        ? openContractModal()
        : closeContractModal();
    }

    //* Building

    const openBuildingModal = (mode) => {
        if(mode != 'edit'){
            setActiveBuilding(-1);
        }
        setTimeout(() => {
            dispatch(onOpenBuildingModal(mode))
        }, timeout);
    }

    const closeBuildingModal = () => {
        dispatch(onCloseBuildingModal())
    }

    const toggleBuildingModal = () => {
        (isBuildingModalOpen)
        ? openBuildingModal()
        : closeBuildingModal();
    }

    //* Expenses

    const openExpensesModal = (mode) => {
        if(mode != 'edit'){
            setActiveExpense(-1);
        }
        setTimeout(() => {
            dispatch(onOpenExpensesModal(mode))
        }, timeout);
    }

    const closeExpensesModal = () => {
        dispatch(onCloseExpensesModal())
    }

    const toggleExpensesModal = () => {
        (isExpensesModalOpen)
        ? openExpensesModal()
        : closeExpensesModal();
    }

    //* Invoice

    const openInvoiceModal = (mode) => {
        if(mode != 'edit'){
            setActiveInvoice(-1);
        }
        setTimeout(() => {
            dispatch(onOpenInvoiceModal(mode))
        }, timeout);
    }

    const closeInvoiceModal = () => {
        dispatch(onCloseInvoiceModal())
    }

    const toggleInvoiceModal = () => {
        (isInvoiceModalOpen)
        ? openInvoiceModal()
        : closeInvoiceModal();
    }

    const openDateModal = () => {
        dispatch(onOpenDateModal())
    }

    const closeDateModal = () => {
        dispatch(onCloseDateModal())
    }
    const toggleDateModal = () => {
        (isDateModalOpen)
            ? openDateModal()
            : closeDateModal();
    }

    const openSalaryModal = (mode) => {
        setTimeout(() => {
            dispatch(onOpenSalaryModal(mode))
        }, timeout);
    }

    const closeSalaryModal = () => {
        dispatch(onCloseSalaryModal())
    }

    const toggleSalaryModal = () => {
        (isSalaryModalOpen)
            ? openSalaryModal()
            : closeSalaryModal();
    }

    const openPaymentModal = (mode) => {
        setTimeout(() => {
            dispatch(onOpenPaymentModal(mode))
        }, timeout);
    }

    const closePaymentModal = () => {
        dispatch(onClosePaymentModal())
    }

    const togglePaymentModal = () => {
        (isPaymentModalOpen)
            ? openPaymentModal()
            : closePaymentModal();
    }

    //* FRONTEND
    // productPage View
    // const productOnView = (productCategory) => {
    //     dispatch(onEnterProductView(productCategory))
    // }

    const openUserModal = (isSelection) => {
        dispatch(onOpenUserModal(isSelection))
    }
    const closeUserModal = (isSelection) => {
        dispatch(onCloseUserModal(isSelection))
    }
    
    


    return {
        // MENU
        activeMenu,
        SwitchMenu,

        //Employee
        isEmployeeModalOpen,
        openEmployeeModal,
        closeEmployeeModal,
        toggleEmployeeModal,
        
        //Contract

        isContractModalOpen,
        openContractModal,
        closeContractModal,
        toggleContractModal,

        // Building
        isBuildingModalOpen,
        openBuildingModal,
        closeBuildingModal,
        toggleBuildingModal,
        
        // EXPENSES
        isExpensesModalOpen,
        openExpensesModal,
        closeExpensesModal,
        toggleExpensesModal,

        // INVOICE
        isInvoiceModalOpen,
        openInvoiceModal,
        closeInvoiceModal,
        toggleInvoiceModal,

        // USERS
        isUserModalOpen,
        openUserModal,
        closeUserModal,

        // SALARY
        isSalaryModalOpen,
        openSalaryModal,
        closeSalaryModal,
        toggleSalaryModal,

        // PAYMENTS
        isPaymentModalOpen,
        openPaymentModal,
        closePaymentModal,
        togglePaymentModal,
    }
}
