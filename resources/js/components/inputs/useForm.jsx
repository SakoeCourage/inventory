import React, { useState } from 'react'

export function useForm (formValues) {
    const [values, setValues] = useState(formValues)

    const handleInputChange = (e) => {
        // console.log(e.target)
        // let itemName 
        // let itemValue
        // if('target' in e){
        //     itemName = e.target.name
        //     itemValue = e.target.value
        // }else{
        //     itemName = e.name
        //     itemValue = e.value
        // }
        const {name, value} = e.target
        // console.log(itemName, itemValue)
        setValues({
            ...values,
            [name]: value
        })
    }

    const resetForm = () => {
        setValues(formValues);
        // setErrors({})
    }
    
    const handleImageChange = event => { 
        const {name, fileUploaded} = event.target.files[0];
        setValues({
            ...values,
            [name]:fileUploaded
        })
        console.log(fileUploaded)
    }

  return {
    values,
    setValues,
    handleInputChange,
    handleImageChange,
    resetForm
  }
}




export function Form(props){
    return(
        <form>
            {props.children}
        </form>
    )
}

