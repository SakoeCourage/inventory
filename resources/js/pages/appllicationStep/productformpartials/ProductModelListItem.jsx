import React, { useEffect, useState } from 'react';
import { formatnumber, formatcurrency } from '../../../api/Util';
import { Icon } from '@iconify/react';
import IconifyIcon from '../../../components/ui/IconifyIcon';
import QuestionAnswerSection from '../../../components/ui/QuestionAnswerSection';

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


  return <nav className='flex flex-col gap-2 odd:bg-gray-100 even:bg-gray-100/30 shadow-sm overflow-hidden  rounded-md  border p-4 pt-5 relative model-list'>
    <nav className='absolute top-0 left-0 bg-red-100 text-red-900 rounded-br-md shadow p-2 w-6 h-6 flex items-center justify-center !aspect-square text-xs truncate'>{props?.index + 1} </nav>
    <nav className='flex flex-col gap-2 pt-2'>
      <QuestionAnswerSection
        className='mb-3'
        question="Model Name"
        answer={props.model?.model_name}
      />
      <nav className=' grid grid-cols-1 md:grid-cols-3 gap-7'>
        <QuestionAnswerSection
          question="Selling Option"
          answer={props.model.in_collection ? `Sold in ${props.basic_selling_quantity ?? 'units'} and  ${props.model?.collection_method ?? 'collection'}  ` : `Only Sold in ${props.basic_selling_quantity ?? 'units'}`}
        />

        <QuestionAnswerSection
          question={props.basic_selling_quantity ? 'Price per ' + props.basic_selling_quantity : " Unit Price"}
          answer={formatcurrency(props.model?.unit_price)}
        />

        <QuestionAnswerSection
          question={props.basic_selling_quantity ? 'Cost per ' + props.basic_selling_quantity : " Unit Price"}
          answer={formatcurrency(props.model?.cost_per_unit)}
        />
      </nav>
      {props.model.in_collection &&

        <div className=' border-t py-2 mt-2'>
          <QuestionAnswerSection
            question={"Packaging"}
            className='my-3 '
            answer={props.model?.collection_method}
          />
          <nav className="grid grid-cols-1 md:grid-cols-3 gap-7">
            <QuestionAnswerSection
              question={<>{props.basic_selling_quantity ? `${props.basic_selling_quantity + 's'} ` : " Units "} per &nbsp;
                {props.model?.collection_method ?? 'Collection'}</>}
              answer={formatnumber(props.model?.quantity_per_collection)}
            />
            <QuestionAnswerSection
              question={<>Price Per {props.model?.collection_method ?? 'Collection'}</>}
              answer={formatcurrency(props.model?.price_per_collection)}
            />

            <QuestionAnswerSection
              question={<>Cost Per {props.model?.collection_method ?? 'Collection'}</>}
              answer={formatcurrency(props.model?.cost_per_collection)}
            />
          </nav>
        </div>
      }
      <nav className=' grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 border-t py-2 bg-gray-200/60 px-1'>
        <nav className='flex flex-col gap-2 items-center   p-2 rounded shadow border bg-white/10 hover:bg-white hover:scale-105 transition-all'>
          <nav className='flex flex-col gap-2 text-red-500 text-xs font-semibold'>
            Store Availability
          </nav>
          <nav className='flex items-center gap-1 divide-x-2'>
            {isInStore ?
              <nav className='  flex items-center text-xs px-2 py-1 justify-center gap-1 text-green-600'>
                <IconifyIcon className="!h-4 !w-4" icon="octicon:dot-fill-16" />
                {props?.model?.stores?.length} store(s)
              </nav> :
              <nav className=' flex items-center text-xs px-2 py-1 justify-center gap-1 text-red-600'>
                <IconifyIcon className="!h-4 !w-4" icon="octicon:dot-fill-16" />
                No Store
              </nav>
            }
            {(props?.isNewProduct == false) && <button onClick={handleOnShowStoreAvailability} className='  flex items-center text-xs px-2 py-1 justify-center gap-1 '>
              <IconifyIcon className="!h-4 !w-4" icon="lucide:pen-line" />
              Change
            </button>}
          </nav>
        </nav>
        <nav className='flex flex-col gap-2 items-center  p-2 rounded shadow border bg-white/10 hover:bg-white hover:scale-105 transition-all'>
          <nav className='flex flex-col gap-2 text-pink-500 text-xs font-semibold'>
            Edit Product Details
          </nav>
          <nav className='flex items-center gap-1 divide-x-2'>
            {<button onClick={(e) => { e.preventDefault(); props.setIndexToEdit(props.index) }} className='  flex items-center text-xs px-2 py-1 justify-center gap-1 '>
              <IconifyIcon className="!h-4 !w-4" icon="lucide:pen-line" />
              Edit
            </button>}
          </nav>
        </nav>

        {props.removable ? <nav onClick={(e) => { e.preventDefault(); props.removeItematIndex(props.index) }} className='flex flex-col gap-2 items-center  p-2 rounded shadow border bg-white/10 hover:bg-white hover:scale-105 transition-all'>
          <nav className='flex flex-col gap-2 text-red-500 text-xs font-semibold'>
            Delete Model
          </nav>
          <nav className='flex items-center gap-1 divide-x-2'>
            {<button onClick={(e) => { e.preventDefault(); props.removeItematIndex(props.index) }} className='  flex items-center text-xs px-2 py-1 justify-center gap-1 '>
              <IconifyIcon className="!h-4 !w-4" icon="material-symbols:delete-outline" />
              Delete
            </button>}
          </nav>
        </nav>
          : <nav className='flex flex-col gap-2  items-center p-2 rounded shadow border bg-white/10 hover:bg-white hover:scale-105 transition-all'>
            <nav className='flex flex-col gap-2 text-rose-500 text-xs font-semibold'>
              Move Product Model
            </nav>
            <nav className='flex items-center gap-1 divide-x-2'>
              {<button onClick={(e) => { e.preventDefault(); props.setIndexToEdit(props.index) }} className='  flex items-center text-xs px-2 py-1 justify-center gap-1'>
                <IconifyIcon className="!h-4 !w-4" icon="tabler:transfer" />
                Move
              </button>}
            </nav>
          </nav>
        }
      </nav>
    </nav>
  </nav>
}

export default ProductModelListItem