import React, { useEffect } from 'react'
import { formatcurrency, diffForHumans } from '../../api/Util'
import IconifyIcon from '../../components/ui/IconifyIcon'
import { Tooltip } from '@mui/material'
import TableInitials from '../../components/ui/TableInitials'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

function ExpenseCard({ dashboardData }) {
    const navigate = useNavigate();
    const { expenses } = dashboardData;
    const { pending_count, todays, my_submission_count, recent } = expenses

    useEffect(() => {
        console.log(recent)
    }, [recent])

    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    const getRelativeDay = () => {
        if (dayjs(dashboardData?.date).format("YYYY-MM-DD") == today) {
            return "Today's"
        }

        if (dayjs(dashboardData?.date).format("YYYY-MM-DD") == yesterday) {
            return "Yesterday's"
        }

        return diffForHumans(dashboardData?.date)

    }

    return (
        <div className='grow relative min-w-[30%] card h-max px-2 bg-indigo-50  border-gray-400/40  overflow-hidden rounded-md'>
            <nav className='p-5 flex flex-col gap-2 items-center'>
                <h2 className='text-sm text-gray-500 font-semibold'>
                    {getRelativeDay()} Store Expense
                </h2>
                <h6 className='text-2xl text-indigo-950/75 font-semibold'>
                    {formatcurrency(todays)}
                </h6>
            </nav>
            <nav className='rounded-t-3xl bg-indigo-950/80 flex items-start gap-2 px-7 py-5 pb-16 text-white'>
                <nav className='flex items-center justify-center basis-12 h-12 rounded-md bg-indigo-300/50'>
                    <IconifyIcon icon="mage:notification-bell-pending" />
                </nav>
                <nav className='grow flex flex-col gap-1'>
                    <span className=' inline-block text-xs text-gray-400'>
                        Pending Expenses
                    </span>
                    <span>
                        {pending_count}
                    </span>
                </nav>
                <Tooltip title='View Expenses'>
                    <Link to="/expenses?view=expenseHistory" className='flex items-center justify-center basis-12 h-10 my-auto rounded-full bg-indigo-300/50'>
                        <IconifyIcon icon="ion:arrow-redo-outline" />
                    </Link>
                </Tooltip>
            </nav>
            <nav className='rounded-t-3xl bg-blue-900 backdrop:!opacity-0 translate-y-[-2rem] flex items-start gap-2 px-7 py-5 pb-12 text-white'>
                <nav className='flex items-center justify-center basis-12 h-12 rounded-md bg-blue-800/80'>
                    <IconifyIcon icon="hugeicons:wallet-add-01" />
                </nav>
                <nav className='grow flex flex-col gap-1'>
                    <span className=' inline-block text-xs text-gray-400'>
                        My Submission Today
                    </span>
                    <span>
                        {my_submission_count}
                    </span>
                </nav>
                <Tooltip title='New Expense'>
                    <Link to="/expenses?view=newExpense"  className='flex items-center justify-center basis-12 h-10 my-auto rounded-full bg-blue-800/80'>
                        <IconifyIcon icon="gravity-ui:plus" />
                    </Link>
                </Tooltip>
            </nav>
            <nav className='rounded-3xl bg-gray-50 backdrop:!opacity-0 translate-y-[-3rem] flex  flex-col gap-2 px-7 py-5 pb-12 '>
                <nav className='flex items-center w-full  justify-between'>
                    <h6 className='text-sm'>Recent Store Expenses</h6>
                    <h6 className='text-xs'></h6>
                </nav>
                {Boolean(recent?.length)
                    ?
                    <nav className='flex flex-col'>
                        {
                            recent.map(({ id, status, total_amount, author, created_at }) => {
                                return <nav onClick={()=>navigate('/expenses?view=expenseHistory')} key={id} className='flex cursor-pointer items-start justify-between odd:bg-gray-100 p-1 rounded-md'>
                                    <TableInitials address={
                                        status == 0 ? <p className='text-blue-800'>Pending</p> : status == 1 ? <p className='text-green-900'>
                                            Approved

                                        </p> : <p className=' text-red-900'>
                                            Declined
                                        </p>
                                    }
                                        name={author?.name}
                                    />
                                    <nav className='flex flex-col items-center gap-2 h-full justify-between'>
                                        <nav className=' text-sm text-gray-600 font-semibold'>
                                            {formatcurrency(total_amount)}
                                        </nav>
                                        <nav className='text-xs mt-auto truncate whitespace-nowrap'>
                                            {diffForHumans(created_at)}
                                        </nav>
                                    </nav>
                                </nav>
                            })
                        }

                    </nav> :
                    <nav className=' flex text-xs text-gray-700  p-10 items-center justify-center'>
                        Empty Data
                    </nav>
                }
            </nav>
        </div>
    )
}

export default ExpenseCard