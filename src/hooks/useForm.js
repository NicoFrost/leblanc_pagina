import { useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export const useForm = ( initialForm = {},formValidations = {}) => {
    const [ formState, setFormState ] = useState( initialForm );
    const [formValidation, setFormValidation] = useState({})

    useEffect(() => {
        createValidators();
    },[formState])
    
    useEffect(() => {
      setFormState(initialForm);
    }, [initialForm])
    
    const isFormValid = useMemo( () => {
        for (const formValue of Object.keys(formValidation)) {
            if(formValidation[formValue] !== null) return {isvalid: false,formValidation};
        }
        return {isvalid: true,formValidation};

    },[formValidation])

        const onValueChange = (e) => {
        if(e != undefined){            
            if(e.target.type == "file"){
                setFormState({
                    ...formState,
                    [e.target.name]: e.target.files
                })
            } else {
                setFormState({
                    ...formState,
                    [e.target.name]: e.target.value
                })
            } 
        }
    }

    const onInputChange = ({ target }) => {
        const { name, value,type,files,checked } = target;
        
        if(type == "file"){
            setFormState({
                ...formState,
                [name]: files
            })
            return
        } 
        
        if (type == "checkbox") {
            setFormState({
                ...formState,
                [name]: checked
            })
            return
        } 
        
        setFormState({
            ...formState,
            [name]: value
        });

    }   
                      
    const onResetForm = () => {
        setFormState( initialForm );
    }

    const createValidators = () => {
        
        const formCheckedValues = {};
        for (const formField of Object.keys(formValidations)) {
            const {fn,errorMessage = 'Este campo es requerido'} = formValidations[formField];
            
            formCheckedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessage;
            // console.log(fn(),formState,formValidations[formField]);
        }
        setFormValidation(formCheckedValues);
    }



    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
        isFormValid,
        ...formValidation
    }
}