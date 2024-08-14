import React, { useEffect, useMemo, useState } from 'react';
import FormInputText from "../../components/inputs/FormInputText";
import Button from '../../components/inputs/Button';
import Fieldset from '../../components/formcomponents/Fieldset';
import { Icon } from '@iconify/react';
import Newproductmodel from './productformpartials/Newproductmodel';
import ProductModelListItem from './productformpartials/ProductModelListItem';
import FormInputSelect from '../../components/inputs/FormInputSelect';
import Api from '../../api/Api';
import Loadingspinner from '../../components/Loaders/Loadingspinner';
import { AnimatePresence, motion } from 'framer-motion';
import { SlideUpAndDownAnimation } from '../../api/Util';
import ProductStoreAvailabilityForm from './productformpartials/ProductStoreAvailabilityForm';
import { enqueueSnackbar } from 'notistack';

const ProductForm = ({ selectItems, handleOnSucess, edit, setOpenModal, setEdit, fetchAllProducts, data }) => {
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    product_name: '',
    basic_selling_quantity: '',
    category: '',
    product_models: []
  });
  const [editIndex, setEditIndex] = useState(null);
  const [modelSearchKey, setModelSearchKey] = useState('');



  const [showNewModelForm, setShowNewModelForm] = useState(false);

  const [showStoreAvailabilityForm, setShowStoreAvailabilityForm] = useState({
    open: false,
    current_stores: null,
    model_name: null
  });


  const removeItematIndex = (i) => {
    let model = formValues.product_models.filter((_, index) => i !== index);
    setFormValues(cv => ({ ...cv, product_models: model }));
  };

  const submitNewProduct = (e = null) => {
    if (e) {
      e?.preventDefault();
    }
    setProcessing(true);
    Api.post('/product/new', formValues).then(res => {
      setProcessing(false);
      handleOnSucess();
    })
      .catch(err => {
        if (err.response?.status === 422) {
          setErrors(err.response.data.errors);
          setProcessing(false);
        }
      });
  };

  const EditCurrentProduct = (e = null) => {
    if (e) {
      e?.preventDefault();
    }
    setProcessing(true);
    Api.put('/product/update/' + edit?.data, formValues)
      .then(res => {
        setProcessing(false);
        handleOnSucess();
      })
      .catch(err => {
        if (err.response?.status === 422) {
          setErrors(err.response.data.errors);
          setProcessing(false);
        }
      });
  };

  const findProductById = (id) => {
    if (id) {
      setIsLoading(true);
      Api.get('/product/find/' + id).then((res) => {
        const { product, basic_selling_quantity, models } = res.data;
        setFormValues({
          product_models: models,
          product_name: product.product_name,
          category: product.category_id,
          basic_selling_quantity: basic_selling_quantity.name
        });
        setIsLoading(false);
      }).catch(err => {
        console.log(err);
      });
    }
  };


  const findCurrentProduct = () => {
    if (edit?.data) {
      findProductById(edit.data);
    }
  }


  const saveCurrentConfig = (data) => {
    if (edit?.data == null) return
    if (data == null) return
    enqueueSnackbar("Saving Configuration", { variant: "info" })

    Api.put('/product/update/' + edit?.data, data).then(res => {
      enqueueSnackbar("Current Configuration Saved", { variant: "success" })
      findCurrentProduct();
    })
      .catch(err => {
        if (err.response?.status === 422) {
          setErrors(err.response.data.errors);
        }
        enqueueSnackbar("Failed to save configuration", { variant: "error" })
      });
  }

  const handelNewProductModel = (modelData) => {
    let data = formValues;
    let model = formValues.product_models;
    model = [modelData, ...model];
    data['product_models'] = model
    setFormValues(cv => ({ ...cv, product_models: model }));
    setShowNewModelForm(false);

    saveCurrentConfig(data)
  };

  const handleModelEdit = (i, value) => {
    console.log(value)
    let data = formValues;
    let model = formValues.product_models;
    model[i] = value;
    data['product_models'] = model
    setFormValues(cv => ({ ...cv, product_models: model }));
    setEditIndex(null);
    saveCurrentConfig(data)
  };


  useEffect(() => {
    findCurrentProduct()
  }, [edit]);

  const filteredModels = modelSearchKey
    ? formValues.product_models.filter(model => new RegExp(modelSearchKey, 'i').test(model?.model_name))
    : formValues.product_models;

  var isModalIndex = useMemo(() => {
    return showNewModelForm || showStoreAvailabilityForm?.open == true || editIndex == null
  }, [showNewModelForm, showStoreAvailabilityForm?.open, editIndex])


  return (
    <div className={`text-blue-950 flex-grow m-6 relative py-5 ${showNewModelForm || showStoreAvailabilityForm?.open == true || editIndex == null && 'overflow-y-scroll'}  `}>
      {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-white z-30">
        <Loadingspinner />
      </div>}
      <div className={`flex flex-col gap-6  ${(showNewModelForm || showStoreAvailabilityForm?.open == true || editIndex == null) == false && '!hidden'}`} >
        <FormInputText type="text" required label="Product name" name="product_name" value={formValues.product_name} onChange={(e) => setFormValues(cv => ({ ...cv, product_name: e.target.value }))}
          helperText={errors.product_name && errors?.product_name}
          error={errors.product_name && errors?.product_name}
        />

        <FormInputSelect type="text" required label="Basic unit of sale" options={selectItems?.basicQuantityFromDB ? selectItems.basicQuantityFromDB.map(entry => ({ name: entry.name, value: entry.name })) : []} name="Basic selling unit"
          value={formValues.basic_selling_quantity}
          onChange={(e) => setFormValues(cv => ({ ...cv, basic_selling_quantity: e.target.value }))}
          helperText={errors.basic_selling_quantity && errors?.basic_selling_quantity}
          error={errors.basic_selling_quantity && errors?.basic_selling_quantity}
        />

        <FormInputSelect type="text" required label="Category of Product" options={selectItems?.categoriesFromDb ? selectItems.categoriesFromDb.map(entry => ({ name: entry.category, value: entry.id })) : []} name="Basic selling unit"
          value={formValues.category}
          onChange={(e) => setFormValues(cv => ({ ...cv, category: e.target.value }))}
          helperText={errors.category && errors?.category}
          error={errors.category && errors?.category}
        />

        <Fieldset className={`${errors.product_models && '!border-red-400 !rounded-md'}`}>
          <div className='border overflow-hidden rounded-md border-gray-300 my-2 focus-within:ring-1 focus-within:ring-gray-700 focus-within:ring-offset-1 transition-all duration-500'>
            <input
              type="search"
              className='bg-white p-3 w-full focus:border-none active:border-none focus:outline-none active:outline-none'
              placeholder="Search product model name"
              name=""
              id=""
              value={modelSearchKey}
              onChange={(e) => setModelSearchKey(e.target.value)}
            />
          </div>
          <nav className='text-sm text-info-600 border-b mb-1 flex items-center justify-between w-full py-2'>
            <span>Products type pricing model</span>
            <button onClick={(e) => { e.preventDefault(); setShowNewModelForm(true) }} className='text-info-600 font-medium'>
              <span className='mr-2'>Add new model</span>
              <Icon fontSize='1.2rem' icon="mdi:plus-circle-outline" />
            </button>
          </nav>
          {!Boolean(formValues.product_models.length) ? <nav className="py-2 rounded-md flex items-center justify-center min-h-[7rem]">
            <nav className='my-32 flex items-center flex-col'>
              <Button onClick={(e) => { e.preventDefault(); setShowNewModelForm(true) }} neutral text='new pricing model' />
            </nav>
          </nav> : <nav className='flex flex-col gap-2 h-full'>
            {/* Product Models List Starts Here */}
            {filteredModels.map((model, i) => (
              <ProductModelListItem
                isNewProduct={edit?.data ? false : true}
                basic_selling_quantity={formValues.basic_selling_quantity}
                model={model}
                removeItematIndex={removeItematIndex}
                setIndexToEdit={(index) => setEditIndex(index)}
                key={i} index={i}
                removable={Boolean(!edit?.data)}
                setShowStoreAvailabilityForm={setShowStoreAvailabilityForm}
                showStoreAvailabilityForm={showStoreAvailabilityForm}
              />
            ))}
          </nav>
          }
        </Fieldset>

        <div className='flex justify-end gap-2'>
          <Button onClick={() => setOpenModal(false)} type="button" text="Cancel" neutral />
          {edit?.data ? <Button info processing={processing} onClick={(e) => EditCurrentProduct(e)} type="submit" text="Save Changes" />
            :
            <Button processing={processing} type="submit" onClick={(e) => submitNewProduct(e)} text="Save" info />}
        </div>
      </div>
      {/* Product Model form with overlay */}

      <AnimatePresence>
        {showStoreAvailabilityForm?.open &&
          <motion.div
            variants={SlideUpAndDownAnimation}
            initial="initial"
            animate="animate"
            exit='exit'
            className="absolute inset-0 bg-white/50  backdrop-grayscale-0 backdrop-blur-sm  z-30 flex items-end justify-center">
            <ProductStoreAvailabilityForm
              handleOnSaveOrCancel={findCurrentProduct}
              showStoreAvailabilityForm={showStoreAvailabilityForm}
              setShowStoreAvailabilityForm={setShowStoreAvailabilityForm}
              current_stores={showStoreAvailabilityForm?.current_stores}
              model_name={showStoreAvailabilityForm?.model_name}
            />
          </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {(showNewModelForm || editIndex !== null) &&
          <motion.div
            variants={SlideUpAndDownAnimation}
            initial="initial"
            animate="animate"
            exit='exit'
            className="absolute inset-0 bg-white/50  backdrop-grayscale-0 backdrop-blur-sm  z-30 flex items-end justify-center">
            <Newproductmodel
              editIndex={editIndex}
              handleModelEdit={handleModelEdit}
              basic_selling_quantity={formValues.basic_selling_quantity}
              selectItems={selectItems} 
              models={formValues.product_models}
              handelNewProductModel={handelNewProductModel}
              setShowNewModelForm={() => { setShowNewModelForm(false); setEditIndex(null) }}
            />
          </motion.div>}
      </AnimatePresence>

    </div>
  );
}

export default ProductForm;
