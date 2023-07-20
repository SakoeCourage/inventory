import React, { useEffect, useMemo } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import Expenseitemslist from './Expenseitemslist'
import Formhook from '../../../components/formcomponents/formhook'
import Button from '../../../components/inputs/Button'
import { formatcurrency } from '../../../api/Util'
import Loadingwheel from '../../../components/Loaders/Loadingwheel'
function NewExpense({ expenseItems }) {
    const { data, processing, setData, post, errors } = Formhook({
        description: '',
        expenseitems: [],
        total_amount: ''
    })

    let calculateTotalAmount = () => {
        let totalamout = 0;
        for (const { amount } of data.expenseitems) {
            totalamout += Number(amount)
        }
        setData('total_amount', totalamout)
        return totalamout;
    }
    const totalAmount = useMemo(() => calculateTotalAmount(), [data.expenseitems])

    const handlesubmit = () => {
        post('/expense/submit', {
            onSucess: () => setData(cv=>cv={
                description: '',
                expenseitems: [],
                total_amount: ''
            })
        })
    }

    return (
        <div className=' flex flex-col gap-7 py-6 px-6 my-5 '>
            {processing && <Loadingwheel />}
            <nav className=' p-5 rounded-md bg-white w-full'>
            <FormInputText placeholder="Add small description" className="!w-full" onChange={(e) => setData('description', e.target.value)} error={errors?.description} multiline={true} rows={2} label='Description' />
            </nav>
            <nav className=' p-5 rounded-md bg-white w-full'>
            <Expenseitemslist errors={errors} setData={setData} expenseItems={expenseItems} />
            <nav className=' flex items-center justify-end'>
                <nav className=' flex items-center gap-2'>
                    <span>Total Amount</span>
                    <span>{formatcurrency(Number(totalAmount))}</span>
                </nav>
            </nav>
            </nav>
           

            <Button text="Submit" onClick={() => handlesubmit()} />
        </div>
    )
}

export default NewExpense