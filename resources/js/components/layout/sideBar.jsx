import SidebarList from "./sidebarList"
import { Icon } from "@iconify/react"
import { IconButton } from "@mui/material"
const Routes = [
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
    icon: 'solar:money-bag-outline'
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
    name: 'Application Setup', subItems: [
      { title: 'Product definition', link: '/applicationsetup/products/definition' },
      { title: 'Suppliers', link: '/applicationsetup/products/suppliers' },
      { title: 'Categories', link: '/applicationsetup/products/categories' },
      { title: 'Expense definitions', link: '/applicationsetup/expense/definition' },

    ],
    icon: "bi:gear"
  }



]


const SideBar = (props) => {
  const { fullSideBar } = props

  return (

    <div
      className={` transition-all  h-full z-20  ${fullSideBar ? 'fixed inset-y-0 bg-white xl:relative w-72 xl:bg-info-100/30 xl:backdrop-opacity-10 xl:pr-2 ' : 'w-0 xl:w-16 !fixed bg-white/30 hover:bg-white hover:!w-72]'} `}
    >
      <div className='text-gray-400   h-full'>
        <nav className={`h-16  border-b mb-7 grid place-items-center ${fullSideBar ? '!bg-transparent ' :' '}`}>
        <IconButton onClick={() => props.setFullSideBar(prev => !prev)} size="small"><Icon className={ `text-gray-300 ${fullSideBar ? 'block xl:hidden': ''}`} icon="ic:outline-menu-open" fontSize={26} /></IconButton>
        </nav>
        <ul className="overflow-y-auto h-full whitespace-nowrap text-uppercase pb-20 flex flex-col gap-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          {Routes.map((route, i) => {
            return <SidebarList key={i} route={route} fullSideBar={fullSideBar} />
          })}

        </ul>

      </div>
    </div>


  )
}

export default SideBar
