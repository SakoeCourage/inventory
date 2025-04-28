import React, { useEffect, useState, useRef, useContext } from 'react'
import Api from '../../../../api/Api'
import { Tooltip, TablePagination, Zoom } from '@mui/material'
import { Icon } from '@iconify/react'
import { dateReformat, formatcurrency } from '../../../../api/Util'
import FormInputsearch from '../../../../components/inputs/FormInputsearch'
import FormInputDate from '../../../../components/inputs/FormInputDate'
import Button from '../../../../components/inputs/Button'
import { addOrUpdateUrlParam } from '../../../../api/Util'
import dayjs from 'dayjs'
import SideModal from '../../../../components/layout/sideModal'
import Viewsaleitem from './Viewsaleitem'
import Loadingwheel from '../../../../components/Loaders/Loadingwheel'
import { NavLink } from 'react-router-dom'
import Refundinfo from '../../../../components/inputs/Refundinfo'
import { useSnackbar } from 'notistack'
import { PrintPrevewContext } from '..'
import Modal from '../../../../components/layout/modal'
import SaleCollectorView from './SaleCollectorView'


function UncollectedSale({ sales, setSales, filters, setFilters }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [isLoading, setIsLoading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [fullUriWithQuery, setfullUriWithQuery] = useState()
    const [showSaleById, setShowSaleById] = useState({
        id: null,
        title: null
    })
    const { setInvoiceData } = useContext(PrintPrevewContext);

    const [showCollectorSaleById, setShowCollectorSaleById] = useState({
        sale_id: null,
        invoice_id: null,
        customer_name: null,
        customer_contact: null
    })

    const fetchSalesData = (url) => {
        setIsLoading(true)
        Api.get(url ?? '/sale/all?sale_type=un_collected').then(res => {
            const { sales, filters, full_url } = res.data
            setfullUriWithQuery(full_url)
            console.log(sales, filters)
            setFilters(filters)
            setSales(sales)
            setIsLoading(false)
            setProcessing(false)
        })
            .catch(err => {

            })
    }

    const handleChangePage = (event, newPage) => {
        if ((newPage + 1) > sales?.current_page) {
            fetchSalesData(sales?.next_page_url)
        } else {
            fetchSalesData(sales?.prev_page_url)
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    };
    useEffect(() => {
        fetchSalesData()
    }, [])

    const handleSearch = (value) => {
        if (fullUriWithQuery) {
            setProcessing(true);
            fetchSalesData(addOrUpdateUrlParam(fullUriWithQuery, 'search', value))
        }
    }

    const generateGenerateInvoice = (saleID) => {
        if (saleID) {
            enqueueSnackbar('Loading invoice', { variant: 'default', key: 'invoiceloadingstatus' })
            Api.get(`sale/view-invoice/${saleID}`)
                .then(res => {
                    closeSnackbar('invoiceloadingstatus')
                    setInvoiceData({
                        data: res.data,
                        type: 'SALE INVOICE'
                    })
                })
                .catch(err => {
                    enqueueSnackbar('Failed to load invoice', { variant: 'error' })
                })
        }
    }


    return (
        <div className=' max-w-6xl mx-auto bg-white min-h-[12rem] p-2 border border-gray-400/70 rounded-md'>

            {showCollectorSaleById?.sale_id && <Modal onClose={() => {
                setShowCollectorSaleById({
                    sale_id: null,
                    invoice_id: null,
                    customer_name: null,
                    customer_contact: null
                })
            }} label="Collector Details" hideDivider open={true}>
                <SaleCollectorView
                    sale_id={showCollectorSaleById?.sale_id}
                    customer_contact={showCollectorSaleById?.customer_contact}
                    customer_name={showCollectorSaleById?.customer_name}
                    invoice_id={showCollectorSaleById?.invoice_id}
                    onSuccess={()=>{
                        setShowCollectorSaleById({
                            sale_id: null,
                            invoice_id: null,
                            customer_name: null,
                            customer_contact: null
                        });
                        fetchSalesData();
                    }}
                />
            </Modal>}

            {showSaleById.id && showSaleById.title && <SideModal onClose={() => setShowSaleById({ id: null, title: null })} showClose title={showSaleById.title} showDivider={true} open={true} maxWidth='2xl'>
                <Viewsaleitem saleId={showSaleById?.id} setShowSaleById={setShowSaleById} />
            </SideModal>}
            <div className='flex flex-col md:flex-row items-center gap-4 justify-end my-2'>
                {(filters?.day || filters?.search) &&
                    <Button className='!grow md:!grow-0 w-full md:w-auto' onClick={() => { fetchSalesData(); setFilters([]) }} text='reset filters' />
                }
                <FormInputsearch
                    processing={processing}
                    getSearchKey={(value) => { handleSearch(value) }} placeholder='Search cutomer name' className='!w-full h-14 !mb-0' />
                <FormInputDate
                    value={filters?.day ? dayjs(filters?.day) : null}
                    onChange={(e) => fullUriWithQuery && fetchSalesData(addOrUpdateUrlParam(fullUriWithQuery, 'day', dayjs(e.target.value).format('YYYY-MM-DD')))}
                    className="!w-full"
                />
            </div>
            <div className="overflow-x-auto min-h-[32rem]">
                <table className="w-full overflow-hidden">
                    <thead className="bg-secondary-200 ">
                        <tr>
                            <th className="px-6 py-3  text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                #
                            </th>

                            <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                Date modified
                            </th>
                            <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                Customer Name
                            </th>
                            <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                Customer Contact
                            </th>
                            <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                Amount Payable
                            </th>
                            <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                Actions
                            </th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 ">
                        {sales?.data && sales?.data.map((x, i) => {
                            return (
                                <tr
                                    key={i}
                                    className={`${i % 2 !== 0 && 'bg-secondary-100 '
                                        }`}
                                >
                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0 !capitalize ">
                                                {x.sale_invoice} {x.refunds_count > 0 && <Refundinfo />}
                                            </h6>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0  ">
                                                {dateReformat(x.created_at)}
                                            </h6>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0  ">
                                                {x.customer_name}
                                            </h6>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0  ">
                                                {x.customer_contact}
                                            </h6>
                                        </div>
                                    </td>

                                    <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                        <div className="flex items-center">
                                            <h6 className="mb-0  ">
                                                {formatcurrency(x.total_amount)}
                                            </h6>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 !text-xs flex items-center gap-2 whitespace-nowrap text-gray-500">
                                        <Tooltip title="Mark As Collected" arrow TransitionComponent={Zoom}>
                                            <button onClick={() => {
                                                setShowCollectorSaleById({
                                                    sale_id: x.id,
                                                    customer_name: x.customer_name,
                                                    customer_contact: x.customer_contact,
                                                    invoice_id: x.sale_invoice
                                                })
                                            }}
                                                className=" p-1 hover:cursor-pointer"
                                            >
                                                <Icon className=' text-orange-700' fontSize={20} icon="solar:user-plus-rounded-broken" />
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="View Invoice" arrow TransitionComponent={Zoom}>
                                            <span
                                                onClick={() => generateGenerateInvoice(x.id)}
                                                className=" p-1 hover:cursor-pointer"
                                            >
                                                <Icon className=' text-info-700' icon="solar:round-arrow-right-up-outline" fontSize={20} />
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="View details" arrow TransitionComponent={Zoom}>
                                            <span
                                                onClick={() => setShowSaleById({ id: x.id, title: String(x.sale_invoice) })}
                                                className=" p-1 hover:cursor-pointer"
                                            >
                                                <svg className=' text-info-700' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M6.25 4.5A1.75 1.75 0 0 0 4.5 6.25v7.5c0 .966.784 1.75 1.75 1.75h7.5a1.75 1.75 0 0 0 1.75-1.75v-2a.75.75 0 0 1 1.5 0v2A3.25 3.25 0 0 1 13.75 17h-7.5A3.25 3.25 0 0 1 3 13.75v-7.5A3.25 3.25 0 0 1 6.25 3h2a.75.75 0 0 1 0 1.5h-2Zm4.25-.75a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V5.56l-3.72 3.72a.75.75 0 1 1-1.06-1.06l3.72-3.72h-3.19a.75.75 0 0 1-.75-.75Z" /></svg>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Refund Sale" arrow TransitionComponent={Zoom}>
                                            <NavLink to={`/salemanagement/refund?sale=` + x.sale_invoice}
                                                className=" p-1 hover:cursor-pointer"
                                            >
                                                <Icon className=' text-red-700' fontSize={20} icon="heroicons:receipt-refund" />
                                            </NavLink>
                                        </Tooltip>

                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {isLoading && <Loadingwheel />
                }
            </div>
            <TablePagination className=" !mt-auto "
                rowsPerPageOptions={[10]}
                component="div"
                count={sales?.total ?? 0}
                rowsPerPage={sales?.per_page ?? 0}
                page={(sales?.current_page - 1) ?? 0}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    )
}

export default UncollectedSale