import { formatnumber, formatcurrency } from '../../../api/Util';
import { Icon } from '@iconify/react';
function ProductModelListItem(props) {
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
      <nav className='flex items-center justify-between bg-gray-50 p-1 rounded-md'>
        <dt>Selling option</dt>
        <dd>{props.model.in_collection ? 'Sold in collection' : 'Sold in units'}</dd>
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
        <nav className='flex items-center justify-between bg-gray-100 p-1 rounded-md'>
          <dt>{props.basic_selling_quantity ? `${props.basic_selling_quantity + 's'} ` : " Units "} per &nbsp;
            {props.model?.collection_method ?? 'Collection'}</dt>
          <dd>{formatnumber(props.model?.quantity_per_collection)}</dd>
        </nav>
      </nav>}
    </dl>
  </nav>
}

export default ProductModelListItem