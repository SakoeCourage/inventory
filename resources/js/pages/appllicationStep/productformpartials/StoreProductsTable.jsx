import { Icon } from '@iconify/react';
import { TablePagination, Tooltip, Zoom } from '@mui/material'
import React, { useState, useEffect } from 'react'
import Api from '../../../api/Api';
import { NavLink } from 'react-router-dom';
import { dateReformat, formatnumber } from '../../../api/Util';
import Loadingwheel from '../../../components/Loaders/Loadingwheel';
import Productcollection from '../../../components/Productcollection';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideUpAndDownAnimation } from '../../../api/Util';
import Button from '../../../components/inputs/Button';
import { useSelector } from 'react-redux'
import { getAuth } from '../../../store/authSlice'
import { enqueueSnackbar } from 'notistack';

const StoreProductsTable = ({
    data,
    setData,
    isLoading,
    setIsLoading,
    updateProduct,
    filters,
    setFilters,
    setFullUrl,
    full_url,
    selectedProducts,
    setSelectedProducts
}) => {

    const [removeModelFromStore, setRemoveModelFromStore] = useState(null)
    const Auth = useSelector(getAuth)
    const { auth } = Auth
    const toggleSelectedByIDProduct = (id) => {

        setSelectedProducts((prevSelected) => {
            if (prevSelected.includes(id)) {
                // If the ID is already selected, remove it
                return prevSelected.filter((productId) => productId !== id);
            } else {
                // If the ID is not selected, add it
                return [...prevSelected, id];
            }
        });
    };



    const fetchPaginatedData = (url) => {
        setIsLoading(true)
        Api.get(url).then(res => {
            const { products, filters, full_url } = res.data
            setData(products)
            setFilters(filters)
            setFullUrl(full_url)

        })
            .catch(err => {
                console.log(err.response)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleChangePage = (event, newPage) => {
        if ((newPage + 1) > data.current_page) {
            fetchPaginatedData(data.next_page_url)
        } else {
            fetchPaginatedData(data.prev_page_url)
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    };

    const handleOnRemoveModel = () => {
        const store_id = auth?.store_preference?.store_id;
        setIsLoading(true)
        Api.post("store/toggle-product", {
            model_id: removeModelFromStore,
            store_id: store_id
        }).then(res => {
            enqueueSnackbar("Product Removed From Store", { "variant": "success" })
            fetchPaginatedData(full_url)
        }).catch(err => {
            enqueueSnackbar("Failed To Remove Product From Store", { "variant": "error" })
        }).finally(() => {
            setRemoveModelFromStore(null)
            setIsLoading(false)
        })
    }




    return (
        <div className="flex flex-col w-full min-h-[36rem] h-max relative ">
            <div className="flex flex-col  overflow-hidden w-full">
                <div className="flex-auto p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full overflow-hidden">
                            <thead className="bg-secondary-200 ">
                                <tr>
                                    <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                        Date modified
                                    </th>
                                    <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                        Model Name
                                    </th>
                                    <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                        Product Name
                                    </th>
                                    <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                        Product Category
                                    </th>
                                    <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                        Quantity In Stock
                                    </th>
                                    <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                        Action
                                    </th>

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-200 ">
                                {data.data && data?.data.map((x, i) => {
                                    return (
                                        <tr
                                            key={i}
                                            className={`${i % 2 !== 0 && 'bg-secondary-100 '
                                                }`}
                                        >


                                            <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <h6 className="mb-0  ">
                                                        {dateReformat(x.updated_at)}
                                                    </h6>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <h6 className="mb-0  ">
                                                        {x?.model_name}
                                                    </h6>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <h6 className="mb-0  ">
                                                        {x.product_name}
                                                    </h6>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <h6 className="mb-0 ">
                                                        {x.category_name}
                                                    </h6>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <h6 className="mb-0 ">
                                                        <Productcollection
                                                            className=" "
                                                            in_collections={x.in_collection}
                                                            quantity={x.quantity}
                                                            units_per_collection={x.units_per_collection}
                                                            collection_type={x.collection_type}
                                                            basic_quantity={x.basic_quantity}
                                                        />
                                                    </h6>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2 !text-xs flex items-center gap-2 whitespace-nowrap">
                                                <Tooltip title="Products Dashboard" arrow TransitionComponent={Zoom}>
                                                    <NavLink to={`/stockmanagement/product/${x.product_id}/${x.product_name}/manage?model=${x.model_id}`}
                                                        className=" p-1 rounded-full border border-gray-400/70 active:border-gray-400/40  text-blue-900 text-sm font-semibold leading-5  hover:cursor-pointer"
                                                    >
                                                        <Icon className='' icon="material-symbols:list-alt-outline" fontSize={20} />
                                                    </NavLink>
                                                </Tooltip>
                                                <Tooltip title="Remove From Store" arrow TransitionComponent={Zoom}>
                                                    <button
                                                        onClick={() => setRemoveModelFromStore(x?.model_id)}
                                                        className=" p-1 rounded-full border border-gray-400/70 active:border-gray-400/40  text-red-900 text-sm font-semibold leading-5  hover:cursor-pointer"
                                                    >
                                                        <Icon className='' icon="material-symbols:delete-outline" fontSize={20} />
                                                    </button>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {isLoading && <Loadingwheel />
                        }
                        <AnimatePresence>
                            {removeModelFromStore && <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className=' fixed inset-0 z-30 flex h-full items-end bg-black/30'>
                                <motion.div
                                    variants={SlideUpAndDownAnimation}
                                    initial='initial'
                                    animate='animate'
                                    exit='exit'
                                    className=' max-w-2xl bg-white w-full mx-auto min-h-[18rem] rounded-t-md flex flex-col'>
                                    <nav className='flex flex-col items-center justify-center grow'>
                                        <nav className=' text-gray-400 p-2 bg-gray-100 rounded-full my-3'><Icon icon="ph:warning-circle-light" fontSize={70} /></nav>
                                        <nav className='max-w-lg mx-auto text-center '>
                                            This action will not delete product.<><br /></>
                                            Product will not be available to current store.<br />
                                            Product current stock balance in current store will be cleared.

                                        </nav>
                                        <nav className=' mt-2 text-sm'>Do want to continue? </nav>
                                    </nav>
                                    <nav className="mt-auto flex items-center w-full pb-1 px-2 gap-1 flex-col lg:flex-row">
                                        <Button onClick={() => handleOnRemoveModel()} otherClasses="w-full basis-[100%] lg:basis-[50%]" info text="Yes Remove" />
                                        <Button onClick={() => setRemoveModelFromStore(null)} otherClasses="w-full basis-[100%] lg:basis-[50%]" neutral text="No Cancel" />
                                    </nav>
                                </motion.div>
                            </motion.div>}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <TablePagination className=" !mt-auto "
                rowsPerPageOptions={[10]}
                component="div"
                count={data?.total ?? 0}
                rowsPerPage={data?.per_page ?? 0}
                page={(data?.current_page - 1) ?? 0}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

        </div>
    )
}

export default StoreProductsTable
