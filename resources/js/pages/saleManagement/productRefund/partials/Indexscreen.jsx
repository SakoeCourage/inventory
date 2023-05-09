import React, { useEffect, useRef, useState } from 'react'
import FormInputsearch from '../../../../components/inputs/FormInputsearch'
import { Card } from '@mui/material'
import { Icon } from '@iconify/react'
import { formatcurrency } from '../../../../api/Util'
import { Tooltip, Zoom } from '@mui/material'
import Loadingspinner from '../../../../components/Loaders/Loadingspinner'
import Productspopup from './Productspopup'
import Api from '../../../../api/Api'
import Button from '../../../../components/inputs/Button'
import Productcollection from '../../../../components/Productcollection'
import Emptydata from '../../../../components/formcomponents/Emptydata'
import Refundinfo from '../../../../components/inputs/Refundinfo'
import { useSearchParams,useNavigate } from 'react-router-dom'



function Productfetch({ sale_id }) {
    const [isLoading, setIsLoading] = useState(false)
    const [saleitems, setSaleitems] = useState([])

    const [mounted, setMounted] = useState(true)

    const getSaleData = () => {

    }

    useEffect(() => {
        const controller = new AbortController();
        if (sale_id) {
            setIsLoading(true)
            Api.get('/sale/get/' + sale_id, { signal: controller.signal })
                .then(res => {
                    const { sale_items } = res.data
                    console.log(res.data)
                    setSaleitems(sale_items)
                    setIsLoading(false)
                })
                .catch(err => {
                    if (err) {
                        console.log(err)
                    }
                })
        }
        return () => {
            controller.abort()
        }
    }, [])




    return <div className=' min-w-[24rem]  min-h-[10rem] h-full max-w-max w-full p-5 px-10 '>
        {isLoading && <div className=' flex items-center justify-center min-h-[10rem] '>
            <Loadingspinner />
        </div>}

       

        {!isLoading &&
            <div className=' flex flex-col gap-1 w-full min-h-[10rem] '>
                <ul className=' w-full customer-cart-list !text-xs'>
                    {saleitems.map((item, i) => {
                        return (<li data-index={i + 1} key={i} className=' grid grid-cols-3 py-3 px-2 !rounded-none  customer-cart-list-item'>
                            <nav className=' flex flex-col gap-2'>
                                <span className=' text-gray-400'>Product {item.is_refunded > 0 && <Refundinfo item/>}</span>
                                <span className=' flex items-center '>{item?.sale_product?.product?.product_name} <br /> {item?.sale_product?.model_name}</span>
                            </nav>
                            <nav className=' flex flex-col gap-2 items-center'>
                                <span className='text-gray-400'>Quantity</span>
                                <nav className=' flex items-center '>
                                    <Productcollection
                                        in_collections={item?.sale_product?.in_collection}
                                        quantity={item?.quantity}
                                        units_per_collection={item?.sale_product?.quantity_per_collection}
                                        collection_type={item?.sale_product?.collection_type?.type}
                                        basic_quantity={item?.basic_selling_quantity}
                                    />
                                </nav>
                            </nav>
                            <nav className=' flex flex-col gap-2 items-center'>
                                <span className='text-gray-400'>Amount</span>
                                <nav className=' flex items-center  '>
                                    {formatcurrency(item?.amount)}
                                </nav>
                            </nav>
                        </li>)
                    })}

                </ul>
            </div>
        }
    </div>
}

function Indexscreen() {
    const [isLoading, setIsLoading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [sales, setSales] = useState([])
    const [filters, setFilters] = useState([])
    const [fullUrl, setFullUrl] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    // const [searchParams, setSearchParams] = useSearchParams()
    const getSales = (url) => {
        setIsLoading(true)
        Api.get(url ?? '/sale/to-search-deep')
            .then(res => {
                setProcessing(false)
                const { sales, filters, full_url } = res.data
                console.log(res.data)
                setSales(sales)
                setFilters(filters)
                setFullUrl(full_url)
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const getMoreSalesData = () => {
        setIsLoading(true)
        let curdata = sales.data;
        if (sales.next_page_url) {
            Api.get(sales.next_page_url)
                .then(res => {
                    const { sales, filters, full_url } = res.data
                    curdata = [...curdata, ...sales.data]
                    setSales(cv => cv = { ...cv,total:sales.total, data: curdata, next_page_url: sales.next_page_url })
                    setFilters(filters)
                    setFullUrl(full_url)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const handleSearch = (sk) => {
        if (sk) {
            setProcessing(true)
            getSales('/sale/to-search-deep?search=' + sk)
        } else {
            getSales()
            setProcessing(false)
        }
    }

    useEffect(() => {
        getSales()
    }, [])

    return (
        <div className=''>
            <section className='  mx-auto bg-info-600   '>
                <nav className=' max-w-6xl mx-auto pt-5 pb-2 transform translate-y-9'>
                    <FormInputsearch processing={processing} getSearchKey={(searchkey) => { handleSearch(searchkey) }} is placeholder="search sale id or customer name" />
                </nav>
            </section>
            <Card className=' text-sm min-h-[50vh] relative max-h-[60vh] h-full max-w-6xl mx-auto mt-7 !overflow-y-scroll'>
                <nav className=' sticky top-0 backdrop-blur-sm p-4 bg-slate-100 '>
                   {filters?.search ? 
                    <nav>Search results: <span className=' text-xs text-gray-500'>found {sales?.total} matches</span> </nav>
                   :<nav className='text-gray-500 flex items-center gap-3'>
                        <Icon icon="fluent-mdl2:recent" fontSize={20} />
                        <span>Recent Sales</span>
                    </nav>}
                </nav>
                <ul className=' h-full  py-1 flex flex-col product-search-result'>
                    {Boolean(sales?.data?.length) && sales?.data.map(((sale, i) => <li key={i} className='!py-3 !px-5 grid grid-cols-2 lg:grid-cols-4 gap-3'>
                        <nav className='flex flex-col gap-1'>
                            <span className=' text-xs '> Sale Number</span>
                            <span className=' flex items-center'> {`#${sale.sale_invoice}`} {sale.refunds_count > 0 && <Refundinfo/>}</span>
                        </nav>
                        <nav className='flex flex-col gap-1'>
                            <span className=' text-xs '> Amount</span>
                            <span> {formatcurrency(sale?.total_amount)}</span>
                        </nav>
                        <nav className='flex flex-col gap-1'>
                            <span className=' text-xs '>sale products</span>
                            <span>
                                <Productspopup Caption={
                                    <nav className=' flex items-center gap-3 text-sm hover:underline hover:text-blue-700'>
                                        <span>show </span>
                                        <Icon fontSize={15} icon="carbon:popup" />
                                    </nav>

                                } >
                                    <Productfetch sale_id={sale.id} />

                                </Productspopup>
                              
                            </span>

                        </nav>
                        <nav className='flex flex-col gap-1'>
                            <span className=' text-xs '> Action</span>
                            <span>
                                <Tooltip title="Refund Sale" arrow TransitionComponent={Zoom}>
                                    <button onClick={()=>setSearchParams({sale:sale.sale_invoice })} className=' bg-info-600 text-info-100 p-1 px-2 rounded-full text-xs hover:!text-info-100'> refund sale</button>
                                </Tooltip>
                            </span>

                        </nav>
                    </li>))}

                </ul>
                {filters?.search && sales?.data.length == 0 &&
                 <div className=' w-full h-full flex items-center justify-center'>
                    <Emptydata caption="Result item not found" />
                 </div>
                }
                {sales?.next_page_url && <nav className=' mt-10 flex items-center justify-center'>
                    <Button onClick={() => getMoreSalesData()} text="More data" />
                </nav>}

            </Card>


        </div>
    )
}

export default Indexscreen