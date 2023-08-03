import React, { useMemo } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import Expenseitemslist from './Expenseitemslist'
import Formhook from '../../../components/formcomponents/formhook'
import Button from '../../../components/inputs/Button'
import { formatcurrency } from '../../../api/Util'
import Loadingwheel from '../../../components/Loaders/Loadingwheel'
import { useDispatch } from 'react-redux'
import { getUnreadCount } from '../../../store/unreadCountSlice'

function NewExpense({ expenseItems }) {
    const dispatch = useDispatch()
    const { data, processing, setData, post, errors } = Formhook({
        description: '',
        expenseitems: [{
            item: '',
            amount: '',
        }],
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
            onSuccess: () => {
                dispatch(getUnreadCount());
            }
        })
    }


    return (
        <div className=' flex flex-col gap-7 md:py-6 md:px-6 my-5 '>
            {processing && <Loadingwheel />}
            <nav className=' p-5 rounded-md bg-white w-full'>
                <FormInputText value={data?.description} placeholder="Add small description" className="!w-full" onChange={(e) => setData('description', e.target.value)} error={errors?.description} multiline={true} rows={2} label='Description' />
            </nav>
            <nav className=' p-5 rounded-md bg-white w-full'>
                <Expenseitemslist l_items={data?.expenseitems} errors={errors} setData={setData} expenseItems={expenseItems} />
                <nav className=' flex items-center justify-end'>
                    <nav className=' flex items-center gap-2'>
                        <span>Total Amount</span>
                        <span>{formatcurrency(Number(totalAmount))}</span>
                    </nav>
                </nav>
            </nav>


            <nav className=' p-1 w-full'>
            <Button className="w-full" text="Submit" onClick={() => handlesubmit()} />
            </nav>
        </div>
    )
}

export default NewExpense