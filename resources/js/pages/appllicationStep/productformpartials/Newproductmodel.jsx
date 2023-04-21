import { object, string, number, date, boolean } from 'yup';
import Fieldset from '../../../components/formcomponents/Fieldset';
import { Checkbox, Radio } from '@mui/material';
import FormInputSelect from '../../../components/inputs/FormInputSelect';
import Button from '../../../components/inputs/Button';
import React, { useEffect, useState } from 'react';
import FormInputText from '../../../components/inputs/FormInputText';
import { handleValidation } from '../../../api/Util';

function Newproductmodel(props) {
    const [modelData, setModelData] = useState({
        model_name: '',
        in_collection: '',
        collection_method: '',
        price_per_collection: '',
        quantity_per_collection: '',
        unit_price: ''
    })
    const [errors, setErrors] = useState({})
    const [choosenmodels, setChoosenModel] = useState([])

    useEffect(() => {
        if (props.models !== []) {
            if (props.editIndex === null) {
                props.models.forEach(model => setChoosenModel(cv => cv = [...cv, model.model_name]))
            } else {
                props.models.forEach((model, i) => i !== props.editIndex && setChoosenModel(cv => cv = [...cv, model.model_name]))
            }
        }
    }, [])

    useEffect(() => {
        if (props.editIndex !== null) {
            setModelData(props.models[props.editIndex])
        }
    }, [props.editIndex])



    let schema = object({
        model_name: string().required('This field is required').notOneOf(choosenmodels, 'Model name already exist'),
        unit_price: number().required('This field is required').typeError('This field is required'),
        in_collection: boolean().required('This field is required').typeError('no selection made'),
        price_per_collection: number().when('in_collection', {
            is: (value) => value === true,
            then: () => number().required('This field is required').typeError('This field is required'),
            otherwise: () => string().notRequired()
        }),
        quantity_per_collection: number().when('in_collection', {
            is: (value) => value === true,
            then: () => number().required('This field is required').typeError('This field is required'),
            otherwise: () => string().notRequired()
        }),
        collection_method: string().when('in_collection', {
            is: (value) => value === true,
            then: () => string().required('This field is required').typeError('This field is required'),
            otherwise: () => string().notRequired()
        })

    })


    const handleNewModel = () => {
        handleValidation(schema, modelData)
            .then(res => {
                props.handelNewProductModel(modelData)
            })
            .catch(err => {
                setErrors(err)
            })
    }
    const handleModelEdit = () => {
        handleValidation(schema, modelData)
            .then(res => {
                props.handleModelEdit(props.editIndex, modelData)
            })
            .catch(err => {
                setErrors(err)
            })
    }


    return <nav className="flex flex-col gap-2 border bg-gray-100/60 border-gray-400 rounded-md p-2 min-w-full">

        <Fieldset>
            <nav>
                <nav className='text-sm text-blue-950 addleftline flex items-center justify-between uppercase bg-white/25 py-2 border-b'><span>Model selling option </span>
                    {errors.in_collection && <span className='text-red-600 underline'>{errors.in_collection}</span>}
                </nav>
                <nav className='flex items-center gap-2 my-4 mt-8'>
                    <FormInputText value={modelData.model_name} error={errors?.model_name} onChange={(e) => setModelData(cv => cv = { ...cv, model_name: e.target.value })} className="w-full" type="text" label='Model name'
                    />
                    <FormInputText value={modelData.unit_price} error={errors?.unit_price} onChange={(e) => setModelData(cv => cv = { ...cv, unit_price: e.target.value })} className="w-full" type="text" label={props.basic_selling_quantity ? `Price per ${props.basic_selling_quantity}` : 'Unit Price'}
                    />
                </nav>
                <nav className='flex items-start   gap-10 text-sm w-full my-3'>

                    <nav className='flex items-center gap-1'>
                        <Checkbox
                            onChange={() => setModelData((cd) => cd = { ...cd, in_collection: true })}
                            checked={modelData.in_collection === true}
                        />
                        <span>Product can be sold in collection</span>
                    </nav>
                    <nav className="flex items-center gap-1">
                        <Checkbox
                            onChange={() => setModelData((cd) => cd = { ...cd, in_collection: false })}
                            checked={modelData.in_collection === false}
                        />
                        <span>Only sold per {props.basic_selling_quantity ?? "Unit"}</span>
                    </nav>
                </nav>
                {modelData.in_collection === true && <nav className="my-2">
                    <FormInputSelect error={errors?.collection_method} value={modelData.collection_method} onChange={(e) => setModelData(cv => cv = { ...cv, collection_method: e.target.value })} label='Select collection method' className="my-4"
                        options={props.selectItems.collectionTypesFromDb && [...props.selectItems.collectionTypesFromDb.map(entry => { return ({ name: entry.type, value: entry.type }) })]}
                    />
                    <nav className='flex items-center gap-2'>
                        <FormInputText value={modelData.price_per_collection} error={errors?.price_per_collection} onChange={(e) => setModelData(cv => cv = { ...cv, price_per_collection: e.target.value })} className="w-full" type="text" label={modelData.collection_method ? `Price per ${modelData.collection_method}` : 'Price per collection'}
                        />
                        <FormInputText value={modelData.quantity_per_collection} error={errors?.quantity_per_collection} onChange={(e) => setModelData(cv => cv = { ...cv, quantity_per_collection: e.target.value })} className="w-full" type="text" label={`${props.basic_selling_quantity ?? 'Units'} per ${modelData.collection_method ?? 'collection'}`}
                        />
                    </nav>
                </nav>

                }
            </nav>
        </Fieldset>
        {props.editIndex !== null ? <Button type="button" onClick={() => handleModelEdit()} text="Save Changes" primary /> :
            <Button type="button" onClick={() => handleNewModel()} text="Add" primary />
        }

        <Button onClick={() => props.setShowNewModelForm(false)} type="button" text="Cancel" neutral />
    </nav>
}

export default Newproductmodel