import { Icon } from '@iconify/react';
import { TablePagination, Tooltip, Zoom, Card } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { dateReformat, formatcurrency, formatnumber } from '../../../api/Util';
import { addOrUpdateUrlParam } from '../../../api/Util';
import Loadingwheel from '../../../components/Loaders/Loadingwheel';
import FormInputSelect from '../../../components/inputs/FormInputSelect';
import Expenseaction from './Expenseaction';
import SideModal from '../../../components/layout/sideModal';

const filterenums = ['all submissions', 'my submissions']
const statusenums = ['all expenses', 'pending', 'declined', 'approved']

export const Statuscode = {
    0: {
        definition: 'Pending',
        style: {
            backgroundColor: '#dbeafe',
            color: '#0ea5e9'
        }

    },
    1: {
        definition: 'Approved',
        style: {
            backgroundColor: '#dcfce7',
            color: '#16a34a'

        }

    },
    2: {
        definition: 'Declined',
        style: {
            backgroundColor: '#fee2e2',
            color: '#dc2626'

        }

    },

}

function Statusindication({ status }) {
    const c_s = Statuscode[Number(status)]
    return <nav style={c_s.style} className=' rounded-md  p-2'>
        {c_s.definition}
    </nav>
}

const ExpenseHistory = ({ setFilters, getExpensesFromDB, filters, fullUrl, expensesfromDB }) => {
    const [takeActionByID, setTakeActionByID] = useState(null)

    const handleChangePage = (event, newPage) => {
        if ((newPage + 1) > expensesfromDB.current_page) {
            getExpensesFromDB(expensesfromDB.next_page_url)
        } else {
            getExpensesFromDB(expensesfromDB.prev_page_url)
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    };

    useEffect(() => {
        getExpensesFromDB()
    }, [])

    const handleClose = () =>{
        getExpensesFromDB(fullUrl)
        setTakeActionByID(null)
    }


    return (
        <Card className='py-6 my-3'>
            <div className=' flex items-center py-2 gap-2 justify-end px-4 w-full'>
                <FormInputSelect  onChange={(e) => fullUrl && getExpensesFromDB(addOrUpdateUrlParam(fullUrl, 'filter', e.target.value))} value={filters?.filter} label='filter' className='w-full  md:!min-w-[15rem]' options={[...filterenums.map(filter => { return ({ name: filter, value: filter }) })]} />
                <FormInputSelect  onChange={(e) => fullUrl && getExpensesFromDB(addOrUpdateUrlParam(fullUrl, 'status', e.target.value))} value={filters?.status} label='status' className='w-full  md:!min-w-[15rem]' options={[...statusenums.map(status => { return ({ name: status, value: status }) })]} />
            </div>
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
                                            Author
                                        </th>
                                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                            Total Amount
                                        </th>
                                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                                            Action
                                        </th>

                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-200 ">
                                    {expensesfromDB.data && expensesfromDB?.data.map((x, i) => {
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
                                                        <h6 className="mb-0 ">
                                                            {x.author?.name}
                                                        </h6>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <h6 className="mb-0  ">
                                                            {x.description}
                                                        </h6>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <h6 className="mb-0  ">
                                                            {`${formatcurrency(x.total_amount)}`}
                                                        </h6>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-2 !text-xs whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <h6 className="mb-0  ">
                                                            <Statusindication status={x.status} />
                                                        </h6>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-2 !text-xs flex items-center gap-2 whitespace-nowrap">
                                                    <Tooltip title="View details" arrow TransitionComponent={Zoom}>
                                                        <span
                                                            onClick={() => setTakeActionByID(x.id)}
                                                            className=" p-1 rounded-full border border-gray-400/70 active:border-gray-400/40 text-red-900   text-sm font-semibold leading-5  hover:cursor-pointer"
                                                        >
                                                            <Icon icon="fluent:open-32-filled" fontSize={20} />
                                                        </span>
                                                    </Tooltip>

                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
                <SideModal
                    open={takeActionByID}
                    title={'Action'}
                    onClose={() => setTakeActionByID(null)}
                    showDivider
                    maxWidth="xl"
                    showClose
                >
                    <Expenseaction id={takeActionByID} handleClose={() => handleClose()} />
                </SideModal>
                <TablePagination className=" !mt-auto "
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={expensesfromDB?.total ?? 0}
                    rowsPerPage={expensesfromDB?.per_page ?? 0}
                    page={(expensesfromDB?.current_page - 1) ?? 0}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </div>
        </Card>
    )
}

export default ExpenseHistory
