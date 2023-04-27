import { formatcurrency } from "../../../api/Util"
import Button from '../../../components/inputs/Button'
function ProductPricing({ basicUnit, collectionType, getCurrentModel, Incollection, lineItem, setShowPricingModal }) {
    return <div className=' min-h-full   p-2 flex flex-col'>
        <div className='p-3 mt-1 text-center bg-info-100/50 text-info-800'>Product should be price such that enough profit can be made</div>
        <div className='  my-auto  flex  flex-col justify-center gap-5 py-5  '>
            <nav className='uppercase text-center'>CURRENT PRICING MODEL:</nav>
            <div className="grid grid-cols-2">
                <nav className='flex flex-col gap-3 items-center'>
                    <nav className='text-sm font-normal capitalize'>Buying/Cost Price</nav>
                    <dl className=' text-capitalize flex items-center justify-between gap-2 border-b'>
                        <dt> Per {basicUnit}</dt>
                        <dd>{formatcurrency(lineItem?.cost_per_unit)}</dd>
                    </dl>
                    {Boolean(Incollection) &&
                        <dl className=' text-capitalize flex items-center justify-between gap-2 border-b'>
                            <dt> Per {collectionType}</dt>
                            <dd>{formatcurrency(lineItem?.cost_per_collection)}</dd>
                        </dl>}
                </nav>
                <nav className=' text-red-950  flex flex-col gap-3 items-center border-l border-gray-300'>
                    <nav className='text-sm font-normal capitalize'>Selling Price</nav>
                    <dl className=' text-capitalize flex items-center justify-between gap-2 border-b'>
                        <dt> Per {basicUnit}</dt>
                        <dd>{formatcurrency(getCurrentModel()?.unit_price)}</dd>
                    </dl>
                    {Boolean(Incollection) &&
                        <dl className=' text-capitalize flex items-center justify-between gap-2 border-b'>
                            <dt> Per {collectionType}</dt>
                            <dd>{formatcurrency(getCurrentModel()?.price_per_collection)}</dd>
                        </dl>}
                </nav>
            </div>
        </div>
        <Button text="I Understand" info onClick={() => setShowPricingModal(false)} otherClasses="   mt-auto" />
    </div>
}

export default ProductPricing