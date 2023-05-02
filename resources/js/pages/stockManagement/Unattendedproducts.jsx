import React, { useState } from 'react'
import Api from '../../api/Api'
import { useEffect } from 'react'
import { Icon } from '@iconify/react'
import Button from '../../components/inputs/Button'
import CategoryListItem from './unattendendproductpartials/CategoryListItem'
import FormInputSelect from '../../components/inputs/FormInputSelect'
import { addOrUpdateUrlParam } from '../../api/Util'
import Emptydata from '../../components/formcomponents/Emptydata'
import Loadingwheel from '../../components/Loaders/Loadingwheel'
function Unattendedproducts() {
    const [productsData, setProductsData] = useState([])
    const [filters, setFilters] = useState([])
    const [fullUrl, setFullUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [searchKey, setSearchKey] = useState('')
    const [categoriesFromDb, setCategoriesFromDB] = useState([])

    const fetchData = (url) => {
        setIsLoading(true)
        Api.get(url ?? 'product/all/unattended')
            .then(res => {
                const { products, filters, full_url } = res.data
                setProductsData(products)
                setFilters(filters)
                setFullUrl(full_url)
                setIsLoading(false)
            })
            .catch(err => console.log(err))
    }

    const fetchMoreData = () => {
        setIsLoading(true)
        Api.get(productsData.next_page_url)
            .then(res => {
                const { products, filters, full_url } = res.data
                let currentData = productsData.data
                currentData = { ...currentData, ...products.data }
                setProductsData(cv => cv = { ...cv, next_page_url: products.next_page_url, data: currentData })
                setFilters(filters)
                setFullUrl(full_url)
                setIsLoading(false)
            })
            .catch(err => console.log(err))
    }

    const handleProductSearch = () => {
        if (searchKey) {
            fetchData(`product/all/unattended?search=${searchKey}`)
        }
    }

    const getCategories = () => {
        Api.get('/toselect/categories').then(res => {
            setCategoriesFromDB(res.data)
        })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        fetchData()
        getCategories()
    }, [])


    return (
        <div className='mx-auto relative isolate p-0'>
            {isLoading && <Loadingwheel />
            }
            <nav className=' bg-orange-100/70 p-5 sticky top-0 z-[-1] mb-2'>
                <nav className='  max-w-7xl mx-auto flex items-center gap-2 '>
                    <Icon className=' text-red-600/70' icon="solar:danger-triangle-bold" fontSize={40} />
                    <nav>
                        The following products are either <b>Out of Stock</b> or <b>Never been stocked before</b>
                    </nav>
                </nav>
            </nav>
            <nav className='bg-gray-200/80'>
                <nav className='max-w-7xl mx-auto bg-white rounded-md p-2 flex gap-2 items-center '>
                    <FormInputSelect className="w-56 " type="text" value={filters?.category} label="Filter by Category" options={categoriesFromDb ? [...categoriesFromDb.map(entry => { return ({ name: entry.category, value: entry.id }) })] : []} name="Basic selling unit"
                        onChange={(e) => { fullUrl && fetchData(addOrUpdateUrlParam(fullUrl, 'category', e.target.value)) }}
                    />
                    {(filters?.search || filters?.category) != null && <Button
                        onClick={() => { setSearchKey(''); fetchData() }}
                        text="reset"
                    />}
                </nav>
            </nav>
            <div className=' min-h-screen backdrop-blur-sm bg-gray-200/80  z-10'>
                <div className=" max-w-7xl mx-auto  rounded-md flex flex-col gap-2 ">
                    {productsData?.data && Object.entries(productsData?.data).map((cateogry, i) => {
                        return (<CategoryListItem key={i} categoryname={cateogry[0]} products={cateogry[1]} />)
                    })

                    }
                    {(!productsData?.data || productsData?.data?.length == 0) && <div className=' min-h-[70vh] bg-white  flex items-center justify-center'>
                        <Emptydata caption="No Record found" />
                    </div>}
                </div>
                {productsData?.next_page_url && <nav className=' flex items-center justify-center'>
                    <Button processing={isLoading} onClick={() => fetchMoreData()} text="Load More Data" />
                </nav>}
            </div>
        </div>
    )
}

export default Unattendedproducts