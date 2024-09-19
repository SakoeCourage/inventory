import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Api from '../../../api/Api'
import ProductForm from '../productForm'
import IconifyIcon from '../../../components/ui/IconifyIcon'
import { enqueueSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Button from '../../../components/inputs/Button'

function UpdateOrNewProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectItems, setSelectItems] = useState({
        basicQuantityFromDB: null,
        collectionTypesFromDb: null,
        categoriesFromDb: null
    })
    const [data, setData] = useState([])

    const [edit, setEdit] = useState({
        open: id ? true : false,
        data: id
    })

    const fetchAllProducts = (url) => {

    }
    const getBasicQuantities = () => {
        return Api.get('/toselect/basicquantities')
    }
    const getCollectionTypes = () => {
        return Api.get('/toselect/collectiontypes')
    }
    const getCategories = () => {
        return Api.get('/toselect/categories')
    }

    const fetchDataToSelect = () => {
        axios.all([getBasicQuantities(), getCollectionTypes(), getCategories()])
            .then(axios.spread(function (res_basic_quantities, res_collection_types, res_categories) {
                setSelectItems({
                    basicQuantityFromDB: res_basic_quantities.data,
                    collectionTypesFromDb: res_collection_types.data,
                    categoriesFromDb: res_categories.data,
                })

            }
            )).catch(err => console.log(err))
    }

    const handleOnNewProductSuccess = () => {
        enqueueSnackbar({ message: "Product Data Saved", variant: "success" })
        navigate('/app-setup/products/definition')
    }

    useEffect(() => {
        fetchDataToSelect();
    }, [])

    useEffect(() => {
        console.log(id);
    }, [id])

    return (
        <div className=' bg-lime-50/20'>
            <nav className=" w-full  z-30   bg-info-900/50 p-5 pt-10">
                <nav className='mx-auto max-w-4xl   font-semibold text-lg flex items-center gap-1 justify-between'>
                    <nav className='flex items-end gap-2'>
                        <h2 className='text-white text-2xl'>
                            {id ? "Update Product" : "New Product"}
                        </h2>
                        {id == null && <IconifyIcon className="my-auto !p-0 bg-lime-50/20 text-lime-50" icon="ic:baseline-plus" />}
                    </nav>
                    <Button className="!py-0"  alert onClick={() => navigate(-1)}>
                        <nav className="flex items-center gap-1">
                        <IconifyIcon icon="icon-park-outline:back" className="!h-6 !w-8" />
                        <span> Back</span>
                        </nav>
                    </Button>
                </nav>
            </nav>
            <div className=' mx-auto max-w-4xl p-2 border border-gray-300 bg-white rounded my-2'>
                <ProductForm
                    setOpenModal={(value) => { navigate('/app-setup/products/definition') }}
                    handleOnSucess={handleOnNewProductSuccess}
                    selectItems={selectItems} edit={edit}
                    fetchAllProducts={fetchAllProducts}
                />
            </div>
        </div>
    )
}

export default UpdateOrNewProductPage