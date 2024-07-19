import SidebarList from "./sidebarList"
import { Icon } from "@iconify/react"
import { IconButton } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { getUnreadCount, getPendingCount } from "../../store/unreadCountSlice"
import React, { useEffect, useMemo } from "react"
import Logo from "../ui/Logo"


const SideBar = (props) => {
  const { fullSideBar } = props
  const unreadCount = useSelector(getPendingCount);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUnreadCount());
  }, [dispatch]);



  const Routes = useMemo(() =>
    [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'bi:grid-3x3-gap'
      },
      {
        name: 'Stock Management', subItems: [
          { title: 'New Stock', link: '/stockmanagement/newstock' },
        ],
        icon: "simple-line-icons:basket-loaded"
      },
      {
        name: 'Sales Management', subItems: [
          { title: 'Product Orders', link: '/salemanagement/newsale' },
          { title: 'Product Refund', link: '/salemanagement/refund' },
        ],
        icon: "ep:sold-out"
      },
      {
        name: 'Expense',
        path: '/expenses',
        icon: 'solar:money-bag-outline',
        unreadcount: {
          count: unreadCount?.unreadCount?.expenses,
          permissions: ['authorize expense']
        }
      },
      {
        name: 'Report', subItems: [
          { title: 'New Report', link: '/report' }
        ],
        icon: "carbon:report"
      },
      {
        name: 'User management', subItems: [
          { title: 'All Users', link: '/usermanagement/all' },
          { title: 'User Role and Permissions', link: '/usermanagement/rolesandpermissions' },

        ],
        icon: "ph:users"
      },
      {
        name: 'Application Setup',
        path: "/app-setup",
        icon: "bi:gear"
      }

    ], [unreadCount]
  )



  return (

    <div
      className={` transition-all flex flex-col gap-1  h-full z-20 bg-info-900  ${fullSideBar ? 'fixed inset-y-0  xl:relative w-72 xl:bg-info-900 xl:backdrop-opacity-10 xl:pr-2 ' : 'w-0 xl:w-16 !fixed  hover:!w-72]'} `}
    >
      <nav className={`  w-full px-5 py-4 text-info-100 my-auto h-[var(--navbar-height)] ${fullSideBar ? 'block ' : ' hidden'}`}>
        <Logo />
      </nav>
      <div className='text-gray-400 grow'>
        <nav className={`h-16  border-b mb-7 grid place-items-center ${fullSideBar ? '!bg-transparent ' : ' '}`}>
          <IconButton onClick={() => props.setFullSideBar(prev => !prev)} size="small"><Icon className={`text-gray-300 ${fullSideBar ? 'block xl:hidden' : ''}`} icon="ic:outline-menu-open" fontSize={26} /></IconButton>
        </nav>
        <ul className="overflow-y-auto h-full whitespace-nowrap text-uppercase pb-20 flex flex-col gap-3 custom-scroll">
          {Routes.map((route, i) => {
            return <SidebarList key={i} route={route} fullSideBar={fullSideBar} />
          })}
        </ul>

      </div>
    </div>


  )
}

export default SideBar
