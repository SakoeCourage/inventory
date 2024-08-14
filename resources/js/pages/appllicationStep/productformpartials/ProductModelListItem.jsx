import React, { useEffect, useState } from 'react';
import { formatnumber, formatcurrency } from '../../../api/Util';
import { Icon } from '@iconify/react';
import IconifyIcon from '../../../components/ui/IconifyIcon';

/**
 * @typedef {Object} Store
 * @property {number} id - The unique identifier for the store.
 * @property {string} store_name - The name of the store.
 * @property {number} store_branch_id - The identifier for the store branch.
 * @property {string} created_at - The timestamp when the store was created.
 * @property {string} updated_at - The timestamp when the store was last updated.
 */


/**
 * @typedef {Object} StoreState
 * @property {boolean} open - Indicates whether something is open.
 * @property {Store[]} current_stores - Represents the current stores.
 * @property {string} model_name - Represents the model name.
 * @property {id} model_id - Represents the model id.
 */
/**
 * 
 * @param {{
 *  basic_selling_quantity: string,
 *  model: any
 *  removeItematIndex: (i: any) => void
 *  setIndexToEdit: (i: number)=>void
 *  removable: boolean,
 *  setShowStoreAvailabilityForm: React.Dispatch<React.SetStateAction<StoreState>>
 *  showStoreAvailabilityForm: StoreState
 * }
 * } props 
 * @returns 
 */
function ProductModelListItem(props) {
  const { setShowStoreAvailabilityForm, showStoreAvailabilityForm } = props
  const [isInStore, setIsInStore] = useState(false);

  useEffect(() => {
    if (Boolean(props?.model?.stores?.length)) {
      setIsInStore(true)
    }
  }, [props?.model])

  const handleOnShowStoreAvailability = () => {
    setShowStoreAvailabilityForm({
      open: true,
      model_name: props?.model?.model_name,
      current_stores: props?.model?.stores,
      model_id: props?.model?.id
    })
  }

  // useEffect(() => {
  //   console.log(props)

  // }, [props])


  return <nav className='flex flex-col gap-2 my-3 rounded-md border-green-500 border p-4 pt-5 relative model-list'>
    <nav className='absolute top-1 right-1  rounded-full  hidden icon-delete '>
      <button onClick={(e) => { e.preventDefault(); props.setIndexToEdit(props.index) }} className='text-green-600 bg-green-50 px-2 '>
        <span className='text-sm'>Edit this item </span>  <Icon className='' icon="mdi:edit" />
      </button>
      {props.removable && <button onClick={(e) => { e.preventDefault(); props.removeItematIndex(props.index) }} className='text-red-600 bg-red-50 px-2 '>
        <span className='text-sm'>Remove this item </span>  <Icon className='' icon="solar:trash-bin-minimalistic-bold-duotone" />
      </button>}

    </nav>
    <dl className='flex flex-col gap-2'>
      <nav className='flex items-center justify-between bg-gray-100 p-1 rounded-md'>
        <dt>Model Name</dt>
        <dd>{props.model?.model_name}</dd>
      </nav>
      <nav className='flex items-center justify-between bg-gray-100 p-1 rounded-md'>
        <dt> {props.basic_selling_quantity ? 'Price per ' + props.basic_selling_quantity : " Unit Price"}</dt>
        <dd>{formatcurrency(props.model?.unit_price)}</dd>
      </nav>
      <nav className='flex items-center justify-between bg-gray-100 p-1 rounded-md'>
        <dt> {props.basic_selling_quantity ? 'Cost per ' + props.basic_selling_quantity : " Unit Price"}</dt>
        <dd>{formatcurrency(props.model?.cost_per_unit)}</dd>
      </nav>
      <nav className='flex items-center justify-between bg-gray-50 p-1 rounded-md'>
        <dt>Selling option</dt>
        <dd>{props.model.in_collection ? `Sold in ${props.basic_selling_quantity ?? 'units'} and  ${props.model?.collection_method ?? 'collection'}  ` : `Only Sold in ${props.basic_selling_quantity ?? 'units'}`}</dd>
      </nav>
      {props.model.in_collection && <nav className="gap-2 flex flex-col">
        <nav className='flex items-center justify-between bg-gray-100 p-1 rounded-md'>
          <dt>Collection method</dt>
          <dd>{props.model?.collection_method}</dd>
        </nav>
        <nav className='flex items-center justify-between bg-gray-50 p-1 rounded-md'>
          <dt>Price Per {props.model?.collection_method ?? 'Collection'}</dt>
          <dd>{formatcurrency(props.model?.price_per_collection)}</dd>
        </nav>
        <nav className='flex items-center justify-between bg-gray-50 p-1 rounded-md'>
          <dt>Cost Per {props.model?.collection_method ?? 'Collection'}</dt>
          <dd>{formatcurrency(props.model?.cost_per_collection)}</dd>
        </nav>
        <nav className='flex items-center justify-between bg-gray-100 p-1 rounded-md'>
          <dt>{props.basic_selling_quantity ? `${props.basic_selling_quantity + 's'} ` : " Units "} per &nbsp;
            {props.model?.collection_method ?? 'Collection'}</dt>
          <dd>{formatnumber(props.model?.quantity_per_collection)}</dd>
        </nav>
      </nav>}
      <nav className='flex items-center justify-between bg-gray-100 p-1 rounded-md'>
        <dt>
          Store Availability
        </dt>
        <dd className='flex items-center gap-1'>
          {isInStore ?
            <nav className='rounded-full bg-green-100 flex items-center text-xs px-2 py-1 justify-center gap-1 text-green-600'>
              <IconifyIcon className="!h-4 !w-4" icon="octicon:dot-fill-16" />
              {props?.model?.stores?.length} store(s)
            </nav> :
            <nav className='rounded-full bg-red-100 flex items-center text-xs px-2 py-1 justify-center gap-1 text-red-600'>
              <IconifyIcon className="!h-4 !w-4" icon="octicon:dot-fill-16" />
              No Store
            </nav>
          }
          {(props?.isNewProduct == false) && <button onClick={handleOnShowStoreAvailability} className='rounded-full hover:bg-white  bg-gray-200 flex items-center text-xs px-2 py-1 justify-center gap-1 text-gray-600'>
            <IconifyIcon className="!h-4 !w-4" icon="lucide:pen-line" />
            Change
          </button>}
        </dd>
      </nav>
    </dl>
  </nav>
}

export default ProductModelListItem