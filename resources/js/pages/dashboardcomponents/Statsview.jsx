import React from 'react'
import { Icon } from '@iconify/react'
import { formatMaximumValue } from '../stockManagement/partials/Productstockhistory'
import { formatcurrency, formatnumber } from '../../api/Util'
import IconifyIcon from '../../components/ui/IconifyIcon'
import { AccessByPermission } from '../authorization/AccessControl'
import { diffForHumans } from '../../api/Util'
import dayjs from 'dayjs'
const StatsBgIcon = () => {
    return <svg className=' absolute bottom-[-30%] inset-x-[35%] w-28 h-28 text-white opacity-10' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m15.99 4.95l.53-.53zm3.082 3.086l-.53.53zM8.738 19.429l-.53.53zm-4.116-4.12l.53-.53zm12.945-.315l-.264-.702zm-1.917.72l.264.703zM8.332 8.383l-.704-.258zm.695-1.896l.704.258zm-3.182 4.188l.2.723zm1.457-.539l-.438-.609zm.374-.345l.57.487zm6.575 6.59l.491.568zm-.87 1.821l-.723-.199zm.536-1.454l-.61-.438zM2.719 12.755l-.75.005zm.212-.803l-.65-.374zm8.374 9.391l.001-.75zm.788-.208l-.371-.652zm-.396-19.099l.162.732zM15.46 5.48l3.082 3.086l1.061-1.06L16.52 4.42zM9.269 18.9l-4.117-4.12l-1.06 1.06l4.116 4.12zm8.034-4.607l-1.917.72l.528 1.405l1.917-.72zM9.036 8.64l.695-1.896l-1.408-.516l-.695 1.896zm-2.992 2.756c.712-.196 1.253-.334 1.696-.652l-.876-1.218c-.173.125-.398.198-1.218.424zm1.584-3.272c-.293.8-.385 1.018-.523 1.18l1.142.973c.353-.415.535-.944.79-1.637zm.112 2.62c.187-.135.357-.292.507-.467l-1.142-.973a1.366 1.366 0 0 1-.241.222zm7.646 4.268c-.689.26-1.214.445-1.626.801l.982 1.135c.16-.14.377-.233 1.172-.531zM14.104 18.4c.225-.819.298-1.043.422-1.216l-1.218-.875c-.318.443-.455.983-.65 1.693zm-.344-2.586c-.17.146-.322.313-.452.495l1.218.875c.063-.087.135-.167.216-.236zm-8.608-1.036c-.646-.647-1.084-1.087-1.368-1.444c-.286-.359-.315-.514-.315-.583l-1.5.009c.003.582.292 1.07.641 1.508c.35.44.861.95 1.481 1.57zm.494-4.828c-.845.234-1.542.424-2.063.634c-.52.208-1.012.49-1.302.994l1.3.748c.034-.06.136-.18.56-.35c.424-.17 1.022-.337 1.903-.58zm-2.177 2.8a.84.84 0 0 1 .111-.424l-1.3-.748a2.34 2.34 0 0 0-.311 1.182zm4.739 7.21c.624.624 1.137 1.139 1.579 1.49c.44.352.931.642 1.517.643l.002-1.5c-.069 0-.224-.029-.585-.316c-.36-.286-.802-.727-1.452-1.378zm4.45-1.958c-.245.888-.412 1.49-.583 1.917c-.172.428-.293.53-.353.564l.743 1.303c.51-.29.792-.786 1.002-1.309c.21-.524.402-1.225.637-2.077zm-1.354 4.091c.407 0 .807-.105 1.161-.307l-.743-1.303a.835.835 0 0 1-.416.11zm7.237-13.527c1.064 1.064 1.8 1.803 2.25 2.413c.444.598.495.917.441 1.167l1.466.317c.19-.878-.16-1.647-.701-2.377c-.533-.72-1.366-1.551-2.395-2.58zm-.71 7.13c1.361-.511 2.463-.923 3.246-1.358c.795-.44 1.431-.996 1.621-1.875l-1.466-.317c-.054.25-.232.52-.883.88c-.663.369-1.638.737-3.046 1.266zM16.52 4.42c-1.036-1.037-1.872-1.876-2.595-2.414c-.734-.544-1.508-.897-2.39-.702l.324 1.464c.25-.055.569-.005 1.172.443c.612.455 1.357 1.197 2.428 2.27zM9.731 6.744c.522-1.423.885-2.41 1.25-3.08c.36-.66.628-.84.878-.896l-.323-1.464c-.882.194-1.435.84-1.872 1.642c-.431.792-.837 1.906-1.341 3.282z" /><path fill="currentColor" d="M1.47 21.47a.75.75 0 0 0 1.06 1.06zm5.714-3.598a.75.75 0 0 0-1.061-1.06zM2.53 22.53l4.653-4.658l-1.061-1.06l-4.654 4.658z" opacity="0.5" /></svg>

}
function Statsview({ dashboardData }) {

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
        <div className='py-6'>
            <nav className=' container mx-auto grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:px-6 '>
                {/* Sales Card */}
                <nav className='relative flex bg-info-900/80 item-center gap-3  text-white justify-between  p-5 py-10 ring-1 ring-offset-2 ring-offset-info-200 ring-white  rounded-md '>
                    <nav className='flex flex-col my-auto gap-1 px-1'>
                        <nav className='text-muted text-sm flex items-center gap-3 grow justify-between uppercase whitespace-nowrap truncate'>
                            <span className=' text-lg font-semibold'>
                                {getRelativeDay()} Sales
                            </span>
                            {dashboardData?.daliy_sale_stats?.relative_percentage && <span className='text-green-600  p-1 rounded-full text-xs w-8 h-8 grid place-items-center whitespace-nowrap' > +{dashboardData?.daliy_sale_stats?.relative_percentage} %</span>}
                        </nav>
                        <nav className='text-info-100 font-medium  '>{formatcurrency(dashboardData ? dashboardData?.daliy_sale_stats?.daily_sale : 0)}</nav>
                    </nav>
                    <IconifyIcon className="!h-12 !w-12" fontSize='4rem' icon="cil:cart" />
                    <StatsBgIcon />
                </nav>

                <nav className='relative flex bg-yellow-900/80 item-center gap-3 text-white justify-between  p-5 py-10 ring-1 ring-offset-2 ring-offset-info-200 ring-white  rounded-md '>
                    <nav className='flex flex-col my-auto gap-1 px-1'>
                        <nav className='text-muted text-sm flex items-center gap-3 grow justify-between uppercase whitespace-nowrap truncate'>
                            <span className=' text-lg font-semibold'>
                                {getRelativeDay()} Revenue
                            </span>
                        </nav>
                        {AccessByPermission({ abilities: ["view revenue"], children: <nav className='text-yellow-100 font-bold  '>{formatcurrency(dashboardData ? dashboardData?.daily_revenue : 0)}</nav> }) ? <nav className='text-yellow-100 font-bold  '>{formatcurrency(dashboardData ? dashboardData?.daily_revenue : 0)}</nav> : "N/A"}
                    </nav>
                    <IconifyIcon className="!h-12 !w-12" fontSize='4rem' icon="ion:card-outline" />
                    <StatsBgIcon />

                </nav>

                <nav className='relative flex bg-blue-900/80 item-center gap-3 text-white justify-between  p-5 py-10 ring-1 ring-offset-2 ring-offset-info-200 ring-white  rounded-md '>
                    <nav className='flex flex-col my-auto gap-1 px-1'>
                        <nav className='text-muted text-sm flex items-center gap-3 grow justify-between uppercase'>
                            <span className=' text-lg font-semibold'>
                                Products Cycle
                            </span>
                        </nav>
                        <nav className='text-blue-100 font-bold flex items-center justify-between w-full  '>
                            <nav className=' pr-2 flex items-center '>
                                <nav className='  font-normal rounded-full text-green-100  h-8 w-8 text-xs grid place-items-center'>In</nav>
                                {formatnumber(dashboardData ? dashboardData?.products_cycle?.product_in : 0)}
                            </nav>
                            <nav className=' pl-2 flex items-center  border-l '>
                                <nav className='  font-normal rounded-full text-red-200 h-8 w-8 text-xs grid place-items-center'>Out</nav>
                                {formatnumber(dashboardData ? dashboardData?.products_cycle?.product_out : 0)}
                            </nav>

                        </nav>
                    </nav>
                    <IconifyIcon className="!h-12 !w-12 !text-white" fontSize='4rem' icon="icon-park-outline:change" />
                    <StatsBgIcon />

                </nav>

                <nav className='relative flex bg-red-900/80 item-center gap-3 text-white justify-between  p-5 py-10 ring-1 ring-offset-2 ring-offset-info-200 ring-white  rounded-md '>
                    <nav className='flex flex-col my-auto gap-1 px-1'>
                        <nav className='text-muted text-sm flex items-center gap-3 grow justify-between uppercase'>
                            <span className=' text-lg font-semibold'>
                                Products
                            </span>
                            <nav className=' relative p-1 rounded-md grow-1 border-l pl-2 '>
                                Stock Value: <span className="font-bold">
                                    {formatcurrency(dashboardData ? dashboardData?.products_value?.current_stock_value : 0)}
                                </span>
                            </nav>
                        </nav>
                        <nav className='text-red-100 font-bold  flex gap-3 '>
                            <nav>
                                {formatnumber(dashboardData ? dashboardData?.products_value?.products : 0)} <span className=' text-gray-300 text-xs tracking-1'>products</span>
                            </nav>
                            <nav>
                                {formatnumber(dashboardData ? dashboardData?.products_value?.models : 0)} <span className=' text-gray-300 text-xs tracking-1'>models</span>
                            </nav>

                        </nav>
                    </nav>
                    <IconifyIcon className="block lg:hidden !h-12 !w-12 !text-white" fontSize='4rem' icon="icon-park-outline:change" />
                    <StatsBgIcon />
                </nav>

            </nav>

        </div>
    )
}

export default Statsview