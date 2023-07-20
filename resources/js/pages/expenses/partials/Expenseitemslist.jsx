import React, { useEffect, useState } from 'react'
import FormInputText from '../../../components/inputs/FormInputText'
import FormInputSelect from '../../../components/inputs/FormInputSelect'
import { Icon } from '@iconify/react'

function Expenseitemslist({ expenseItems, setData, errors }) {
  const [itemsList, setitemsList] = useState([{
    item: '',
    amount: '',
  }])
  let handleChange = (i, [name, value]) => {
    let newitems = [...itemsList];
    newitems[i][name] = value;
    setitemsList(newitems);
  }

  let addNewItem = () => {
    setitemsList((ci => ci = [...ci, {
      item: '',
      amount: '',
    }]))

  }

  let removeItemat = (i) => {
    if (!(itemsList.length <= 1)) {
      let newitems = [...itemsList];
      newitems.splice(i, 1);
      setitemsList(newitems)
    }
  }

  useEffect(() => {
    setData('expenseitems', itemsList)
  }, [itemsList])


  return (
    <div className=' flex flex-col gap-5 '>
      {itemsList.map((item, i) => {
        return (<nav className=' flex items-center gap-4'>
          <FormInputSelect error={errors[`expenseitems.${i}.item`]} value={itemsList[i]['item']}
            onChange={(e) => handleChange(i, ['item', e.target.value])}
            options={Boolean(expenseItems.length) ? [...expenseItems.map((item) => { return ({ value: item.id, name: item.name }) })] : []} className="!w-full" label='Select an item' />
          <FormInputText error={errors[`expenseitems.${i}.amount`]} type='number'
            onChange={(e) => handleChange(i, ['amount', e.target.value])}
            value={itemsList[i]['amount']} className="!w-full" label='amount' />
          <button onClick={() => removeItemat(i)} className=' text-red-500'>
            <Icon fontSize={30} icon="mdi:trash" />
          </button>
        </nav>)
      })}
      <button onClick={addNewItem} className=' self-center mb-5'>
      <Icon fontSize={30} className=' text-green-900' icon="uiw:plus-circle" />
      </button>
    </div>
  )
}

export default Expenseitemslist