import React, { useEffect, useMemo, useState } from 'react'
import Fieldset from '../../../components/formcomponents/Fieldset'
import FormInputText from '../../../components/inputs/FormInputText'
import Button from '../../../components/inputs/Button'
import Productcollection from '../../../components/Productcollection'
import Api from '../../../api/Api'
function Removefromstockform({ stockData, setShowStockingModal, fetchAllData }) {
    const [formData, setFormData] = useState({
        productsmodel_id: stockData.model.id,
        quantity: null,
        description: null
    })
    const [errors, setErrors] = useState({})
    const [calculatedFields, setCalculatedFields] = useState({
        collection: 0,
        units: 0
    })

    const getEstimatedQuantity = useMemo(() => {
        const result = Number(stockData?.stock_quantity) - ((Number(calculatedFields.collection) * (Number(stockData?.model.quantity_per_collection ?? 1))) + Number(calculatedFields.units))
        setFormData(cd => cd = { ...cd, quantity: (Number(calculatedFields.collection) * (Number(stockData?.model.quantity_per_collection ?? 1))) + Number(calculatedFields.units) })
        return result
    }, [stockData?.stock_quantity, calculatedFields])

    const handleSubmission = () => {
        if (getEstimatedQuantity >= 0) {
            Api.post(`product/stock/${stockData.model.id}/decrease`, formData)
                .then(res => {
                    setShowStockingModal({ option: null })
                    fetchAllData()
                }).catch(err => setErrors(err.response?.data?.errors))
        }
    }
    

    return (
        <div className='w-full h-full text-blue-950 px-2 py-5 flex flex-col gap-5'>
            <Fieldset className="flex flex-col gap-4 my-auto">
                <nav className='border-b border-gray-300 border-dotted'>    <nav className='border-b border-gray-300 border-dotted addleftline '>
                    <nav className='flex gap-3 items-center leading-8'>
                        <nav className=' font-semibold text-md'>{stockData?.product?.product_name}</nav>
                        <nav className='text-blue-900/70 font-normal'>{stockData?.model?.model_name}</nav>

                    </nav>
                </nav>
                </nav>
                {Boolean(stockData.model?.in_collection) && <FormInputText error={errors?.quantity} onChange={(e) => setCalculatedFields(cv => cv = { ...cv, collection: e.target.value })} required className="w-full" label={`Quantity of ${stockData.collection_method}(s)`} />}
                <FormInputText error={errors?.quantity} onChange={(e) => setCalculatedFields(cv => cv = { ...cv, units: e.target.value })} required className="w-full" label={`Quantity of ${stockData?.basic_quantity}(s)`} />
                <FormInputText error={errors?.description} onChange={(e) => setFormData(cd => cd = { ...cd, description: e.target.value })} required className="w-full" label='Description' />
                <div className={`addleftline flex  flex-col justify-center gap-5 py-5 shadow-md rounded-sm ${getEstimatedQuantity <= 0 && 'bg-red-200'}`}>
                    <nav className='uppercase text-center'>Stock Balance:</nav>
                    <div className="grid grid-cols-2">
                        <nav className='font-semibold uppercase flex flex-col gap-3 items-center'>
                            <nav className='text-sm font-normal capitalize'>Current</nav>
                            <Productcollection
                                in_collections={stockData?.model?.in_collection}
                                quantity={stockData?.stock_quantity}
                                units_per_collection={stockData?.model?.quantity_per_collection}
                                collection_type={stockData?.collection_method}
                                basic_quantity={stockData?.basic_quantity}
                            />
                        </nav>
                        <nav className='font-semibold text-red-950 uppercase flex flex-col gap-3 items-center border-l border-gray-300'>
                            <nav className='text-sm font-normal capitalize'>Balance</nav>
                            {getEstimatedQuantity <= 0 ? 0

                                :
                                <Productcollection
                                    in_collections={stockData?.model?.in_collection}
                                    quantity={getEstimatedQuantity}
                                    units_per_collection={stockData?.model?.quantity_per_collection}
                                    collection_type={stockData?.collection_method}
                                    basic_quantity={stockData?.basic_quantity}
                                />
                            }

                        </nav>
                    </div>
                </div>
            </Fieldset>
            <nav className="flex flex-col gap-2 mt-auto">
                <Button onClick={() => handleSubmission()} otherClasses="w-full" primary text="Update" />
                <Button onClick={() => setShowStockingModal({ option: null })} otherClasses="w-full" neutral text="Cancel" />
            </nav>
        </div>
    )
}

export default Removefromstockform