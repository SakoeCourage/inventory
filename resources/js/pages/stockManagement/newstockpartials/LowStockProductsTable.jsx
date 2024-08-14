import React, { useContext, useEffect, useState, useCallback } from 'react'
import { NewStockContext } from '../Newstock'
import { TablePagination } from '@mui/material'
import Productcollection from '../../../components/Productcollection'
import FormInputText from '../../../components/inputs/FormInputText'
import IconifyIcon from '../../../components/ui/IconifyIcon'
import { BasicSlider, PackagingSlider } from './sliderStyles'
import HelpToolTip from '../../../components/ui/HelpterToolTip'
import Rangeinput from '../../../components/inputs/Rangeinput'
import Api from '../../../api/Api'
import { debounce } from 'lodash-es'
import saveAs from 'file-saver'

const initialData = {
    search: null,
    min_basic_quantity: 0,
    max_basic_quantity: 30,
    min_packaging_quantity: 0,
    max_packaging_quantity: 3
}
export default function LowStockProductsTable({ data }) {
    const [filters, setFilters] = useState(structuredClone({ ...initialData }))
    const { lowSockProducts, setLowStockProducts } = useContext(NewStockContext)
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModelsId, setSelectedModelsId] = useState([]);

    const [value, setValue] = React.useState([20, 37]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const toggleModelId = (id) => {
        setSelectedModelsId(prevSelectedModelsId => {
            if (prevSelectedModelsId.includes(id)) {
                return prevSelectedModelsId.filter(modelId => modelId !== id);
            } else {
                return [...prevSelectedModelsId, id];
            }
        });
    };

    const handleOnChangeInBasicUnitSlider = (event) => {
        const [min, max] = event?.target.value
        setFilters(cv => cv = { ...cv, min_basic_quantity: min, max_basic_quantity: max })
    }
    const handleOnChangeInPackagingUnitSlider = (event) => {
        const [min, max] = event?.target.value
        setFilters(cv => cv = { ...cv, min_packaging_quantity: min, max_packaging_quantity: max })
    }
    function buildUrl(baseUrl, params) {
        const queryString = Object.keys(params)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
            .join('&');

        const separator = baseUrl.includes('?') ? '&' : '?';

        return `${baseUrl}${separator}${queryString}`;
    }

    const getLowStockProducts = (url) => {
        setIsLoading(true);
        Api.get(url ?? '/stock/low-products')
            .then(res => {
                // console.log(res.data)
                setLowStockProducts(res.data)
            })
            .catch(err => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })
    }

    const handleExportLowProducts = () => {
        Api.post('/stock/low-products/export', { model_ids: selectedModelsId, ...filters }, { responseType: "blob" })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'IL_Low_Stock_Products.xlsx');
            })
            .catch(err => {
                console.log(err)
            })
    }


    const fetchData = () => {
        const url = buildUrl('/stock/low-products', filters)
        getLowStockProducts(url)
    }

    const handleChangePage = (event, newPage) => {
        if ((newPage + 1) > data.current_page) {
            const newUrl = buildUrl(data?.next_page_url, filters)
            getLowStockProducts(newUrl)
        } else {
            const newUrl = buildUrl(data?.prev_page_url, filters)
            getLowStockProducts(newUrl)
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    };

    const delayedQuery = useCallback(debounce(() => {
        fetchData();
    }, 300), [filters])

    useEffect(() => {
        delayedQuery();
        return delayedQuery.cancel;
    }
        , [filters, delayedQuery])


    return <div className=' flex flex-col gap-1'>
        <div className='flex items-center flex-col lg:flex-row py-5 mb-2 border-b divide-x'>
            <div className='flex flex-col p-1 bg-green-50/50  pr-3'>
                <nav className='flex items-center gap-1'>
                    <h6 className='my-auto'>
                        Basic Quantity Threshold
                    </h6>
                    <HelpToolTip
                        content="Find between 0 to 50 min to max stock balance of product basic quantity"
                    />
                </nav>
                <BasicSlider
                    onChange={handleOnChangeInBasicUnitSlider}
                    valueLabelDisplay="auto"
                    aria-label="pretto slider"
                    value={[filters?.min_basic_quantity, filters?.max_basic_quantity]}
                    min={0}
                    max={50}
                />
                <div className="grid grid-cols-2 gap-1">
                    <Rangeinput
                        value={filters?.min_basic_quantity}
                        onChange={(e) => setFilters(cv => cv = { ...cv, min_basic_quantity: e.target.value })}
                        size="small"
                        className=""
                        min={0}
                        max={49}
                        label="min basic unit"
                    />
                    <Rangeinput
                        value={filters?.max_basic_quantity}
                        onChange={(e) => setFilters(cv => cv = { ...cv, max_basic_quantity: e.target.value })}
                        size="small"
                        min={0}
                        max={50}
                        className=""
                        label="max basic unit"
                    />
                </div>
            </div>
            <div className='flex flex-col bg-orange-50/30 p-1 px-3'>
                <nav className='flex items-center gap-1'>
                    <h6 className=' my-auto'>
                        Packaging Quantity Threshold
                    </h6>
                    <HelpToolTip
                        content="Find between 0 to 50 min to max stock balance of product packaging quantity"
                    />
                </nav>
                <PackagingSlider
                    min={0}
                    max={50}
                    onChange={handleOnChangeInPackagingUnitSlider}
                    valueLabelDisplay="auto"
                    aria-label="pretto slider"
                    value={[filters?.min_packaging_quantity, filters?.max_packaging_quantity]}
                />
                <div className="grid grid-cols-2 gap-1">
                    <Rangeinput
                        value={filters?.min_packaging_quantity}
                        onChange={(e) => setFilters(cv => cv = { ...cv, min_packaging_quantity: e?.target?.value })}
                        className=""
                        label="min pckg unit"
                        type="number"
                        min={0}
                        max={49}
                    />
                    <Rangeinput
                        value={filters?.max_packaging_quantity}
                        onChange={(e) => setFilters(cv => cv = { ...cv, max_packaging_quantity: e.target.value })}
                        size="small"
                        className=""
                        label="max pckg unit"
                        type="number"
                        min={0}
                        max={50}
                    />
                </div>
            </div>
            <button onClick={() => handleExportLowProducts()} className="flex items-center gap-1 mt-auto px-2 py-[0.1rem] mb-1 border rounded-md relative">
                {!!selectedModelsId.length && <span className='absolute top-[-20px] bg-red-600 text-red-50 right-[-20px] px-3 py-1 !text-xs rounded-full'>
                    {selectedModelsId?.length}
                </span>}
                <span className='inline-block !text-sm whitespace-nowrap'>
                    Export {!!selectedModelsId?.length ? `selected` : 'all'}
                </span>
                <IconifyIcon icon="vscode-icons:file-type-excel" />
            </button>
        </div>
        <div className="flex flex-col w-full min-h-[36rem] h-max relative ">
            <div className="flex flex-col  overflow-hidden w-full">
                <div className="flex-auto p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full overflow-hidden">
                            <thead className="bg-secondary-200 text-sm ">
                                <tr>
                                    <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                        Product Name
                                    </th>
                                    <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                        Model Name
                                    </th>
                                    <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                        Stock Qty
                                    </th>
                                    <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                        Action
                                    </th>

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-200 ">
                                {data?.data && data?.data.map((x, i) => {
                                    return (
                                        <tr
                                            onDoubleClick={() => toggleModelId(x?.productsmodel_id)}
                                            key={i}
                                            className={`transition-all duration-300 ease-in-out select-none cursor-pointer  ${i % 2 !== 0 && 'bg-secondary-100'}
                                                ${selectedModelsId.includes(x.productsmodel_id) && '!bg-indigo-50/75 scale-[0.995]'} }
                                                `
                                            }
                                        >

                                            <td className="px-6 py-2 !text-sm whitespace-nowrap">
                                                <input
                                                    checked={selectedModelsId.includes(x.productsmodel_id)}
                                                    onClick={() => toggleModelId(x?.productsmodel_id)}
                                                    type="checkbox"
                                                    name=""
                                                    id=""
                                                />
                                            </td>
                                            <td className="px-6 py-2 !text-sm whitespace-nowrap">
                                                {x?.product_name}

                                            </td>
                                            <td className="px-6 py-2 !text-sm whitespace-nowrap">
                                                {x?.model_name}

                                            </td>

                                            <td className="px-6 py-2 !text-sm whitespace-nowrap">
                                                <Productcollection
                                                    in_collections={Boolean(x?.in_collection)}
                                                    quantity={x?.quantity}
                                                    basic_quantity={x?.basic_quantity}
                                                    collection_type={x?.collection_type}
                                                    units_per_collection={x?.units_per_collection}
                                                />
                                            </td>
                                            <td className="px-6 py-2 !text-sm flex items-center gap-2 whitespace-nowrap">

                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
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


        </div>
    </div>
}