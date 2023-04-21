import React from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import FormInputSelect from "../../../components/inputs/FormInputSelect"
import Button from '../../../components/inputs/Button'
import { useForm } from "../../../components/inputs/useForm"
import uuid from 'react-uuid';
import { Icon } from '@iconify/react'

const formValues = {
  customerName: '',
  customerContact: '',
  product: '',
  noOfUnits: ''
}

const products = [
  { value: 'Product 1', name: 'Product 1', unitPrice: 10 },
  { value: 'Product 2', name: 'Product 2', unitPrice: 20 },
  { value: 'Product 3', name: 'Product 3', unitPrice: 30 },
  { value: 'Product 4', name: 'Product 4', unitPrice: 40 },
  { value: 'Product 5', name: 'Product 5', unitPrice: 50 },
  { value: 'Product 6', name: 'Product 6', unitPrice: 60 },
  { value: 'Product 7', name: 'Product 7', unitPrice: 70 },
  { value: 'Product 8', name: 'Product 8', unitPrice: 80 },
  { value: 'Product 9', name: 'Product 9', unitPrice: 90 },
  { value: 'Product 10', name: 'Product 10', unitPrice: 100 },
]

const SaleForm = (props) => {
  const { handleInputChange, values, resetForm } = useForm(formValues)

  const saveForm = (e) => {
    e.preventDefault()
    products.map(r => {
      if(r.name === values.product){

        let d = {
          id: uuid(),
          customerName: values.customerName,
          customerContact: values.customerContact,
          productName: values.product,
          quantity: values.noOfUnits,
          unitPrice: r.unitPrice,
          amount: r.unitPrice * Number(values.noOfUnits)
        }
        props.newItem(d)
      }
    })
    resetForm()
  }
  return (
    <div className='p-4'>
      <form className='flex flex-col gap-4' onSubmit={saveForm}>
        <FormInputText label="Enter customer name" name="customerName" value={values.customerName} onChange={handleInputChange} type="text" />
        <FormInputText label="Enter customer contact" name="customerContact" value={values.customerContact} onChange={handleInputChange} />
        <FormInputSelect label="Select a product" options={products} name="product" value={values.product} onChange={handleInputChange} required />
        <FormInputText label="Enter No. of units" name="noOfUnits" value={values.noOfUnits} onChange={handleInputChange} required type="number" />
        <div className='flex justify-center md:justify-end gap-2 mt-4'>
          {/* <Button text="clear" type="button" alert onClick={resetForm} /> */}
          <Button primary>
            <div className='flex gap-1 items-center'>
              add to cart
              <Icon icon="ic:outline-shopping-cart" fontSize={20}/>
            </div>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SaleForm
