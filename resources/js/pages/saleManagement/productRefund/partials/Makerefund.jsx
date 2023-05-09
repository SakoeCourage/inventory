import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, Switch } from '@mui/material'
import { formatcurrency } from '../../../../api/Util'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Api from '../../../../api/Api'
import Button from '../../../../components/inputs/Button'
import Refundtable from './Refundtable'
import Refundpayment from './Refundpayment'
import Loadingwheel from '../../../../components/Loaders/Loadingwheel'
import Indexscreen from './Indexscreen'


const components = {
    Refundtable: Refundtable,
    Refundpayment: Refundpayment
}


function Makerefund() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [sale, SetSale] = useState(null)
    const [paymentmethod, setPaymentMethod] = useState(null)
    const [lineitems, SetLineitems] = useState([])
    const [component, setComponent] = useState('Refundtable')
    const [saleDiscountAmount, setSaleDiscountAmount] = useState(0)
    const [originalDiscount, setoriginalDiscount] = useState(0)
    const Component = components[component]
    const [maxDiscount, setMaxDiscount] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const purchase_total = useMemo(() => lineitems.reduce((accumulator, currentValue) => accumulator + currentValue.row_total, 0), [lineitems, saleDiscountAmount])
    const canContinue = useMemo(() => lineitems.some(value => value.quantity_to_refund > 0), [lineitems])
    const storeCredit = useMemo(() => Number(purchase_total) - Number(saleDiscountAmount), [purchase_total, saleDiscountAmount])

    const SetLineItemsFromSales = (line_items) => {
        let data = []
        line_items.forEach(item => {
            const { basic_selling_quantity, collection_method, product, product_model, sale_item } = item
            data = [...data, {
                return_to_stock: true,
                product_name: product.product_name,
                model_name: product_model.model_name,
                quantity: sale_item.quantity,
                amount: sale_item.amount,
                in_collection: Boolean(product_model.in_collection),
                price_per_collection: product_model.price_per_collection,
                quantity_per_collection: product_model.quantity_per_collection,
                price_per_unit: product_model.unit_price,
                cost_per_unit: product_model.cost_per_unit,
                cost_per_collection: product_model.cost_per_collection,
                collection_type: collection_method?.type,
                basic_quantity: basic_selling_quantity?.name,
                quantity_to_refund: 0,
                row_total: 0,
                model_id: product_model.id,
                saleitem_id: sale_item.id,

            }]
        })
        SetLineitems(data)
    }

    function getSaleData() {
        setIsLoading(true)
        Api.get(`/sale/get/sale-from-invoice/${searchParams.get('sale')}`)
            .then(res => {
                const { payment_method, sale, line_items } = res.data
                setoriginalDiscount(sale?.discount_rate)
                // console.log(sale)
                setPaymentMethod(payment_method)
                SetLineItemsFromSales(line_items)
                SetSale(sale)
                setIsLoading(false)

            })
            .catch(err => {
                console.log(err)
            })
    }

    const maxRefund = () => {
        let newData = [...lineitems]
        newData.forEach(item => { item['quantity_to_refund'] = item['quantity'] })
        setMaxDiscount(true)
        SetLineitems(newData)

    }

    useEffect(() => {
        if (searchParams.get('sale')) {
            getSaleData()
        }
    }, [searchParams.get('sale')])




    const submitRefundData = () => {
        Api.post('/refund/new', { sale_items: lineitems, sale_discount_amount: saleDiscountAmount, store_credit: storeCredit, purchase_total: purchase_total, sale_id: sale?.id })
            .then(res => {
                console.log(res.data)
                navigate('/salemanagement/refund')
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className=' '>
            {isLoading && <Loadingwheel />}
            {searchParams.get('sale') ? <Card className=' min-h-[70vh] flex flex-col max-w-6xl mx-auto mt-6'>
                <nav className=' flex items-center justify-between text-gray-500 p-5 border-b shadow'>
                    {component == 'Refundtable' ? <button onClick={()=> navigate('/salemanagement/refund')}>Cancel</button>
                        : <button onClick={() => setComponent('Refundtable')}>Reset</button>
                    }
                    <span>Refund {`#${sale?.sale_invoice}`}</span>
                    <span className='  font-semibold'>
                        <span> <span className=' text-gray-400 '>Gross refund: </span></span> <span>{formatcurrency(purchase_total)}</span>
                    </span>
                </nav>
                <Component
                    sale={sale}
                    SetSale={SetSale}
                    saleDiscountAmount={saleDiscountAmount}
                    purchase_total={purchase_total}
                    paymentmethod={paymentmethod}
                    lineitems={lineitems}
                    SetLineitems={SetLineitems}
                    setSaleDiscountAmount={setSaleDiscountAmount}
                    storeCredit={storeCredit}
                    originalDiscount={originalDiscount}
                    maxDiscount={maxDiscount}
                    setMaxDiscount={setMaxDiscount}
                />
                <nav className=' flex justify-end items-center mt-auto p-2'>
                    <nav className=' flex items-center gap-2'>
                        {component == 'Refundtable' && <Button onClick={() => maxRefund()} text="Max Refund" />}
                        {canContinue &&
                            <>
                                {component == 'Refundtable' ? <Button info text="Continue" onClick={() => setComponent('Refundpayment')} />
                                    : <Button onClick={() => submitRefundData()} text={`refund ${formatcurrency(storeCredit)}`} />}
                            </>

                        }
                    </nav>
                </nav>
            </Card> :
                <Indexscreen />
            }

        </div>
    )
}

export default Makerefund