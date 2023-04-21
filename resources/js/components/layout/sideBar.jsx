import SidebarList from "./sidebarList"

const Routes = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'ri:dashboard-3-fill'
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
      


    ],
    icon: "solar:hand-money-linear" 
  },
  {
    name: 'Application Setup', subItems: [
      { title: 'Product definition', link: '/applicationsetup/productdefinition' },


    ],
    icon: "material-symbols:settings"
  },

  // {
  //   name: 'Administrator', subItems: [
  //     { title: 'User management', link: '/layout/admin/users' },

  //   ],
  //   icon: "clarity:administrator-solid"
  // }
]


const SideBar = (props) => {
  const { fullSideBar } = props

  return (

    <div
      className={`absolute bg-gray-200 h-full z-20 md:relative ${fullSideBar ? 'w-64' : 'w-14'} `}
    >
      <div className='text-gray-400  pt-4 h-full'>

        <ul className="overflow-y-auto h-full pb-20 flex flex-col gap-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          {Routes.map((route, i) => {
            return <SidebarList key={i} route={route} fullSideBar={fullSideBar} />
          })}

        </ul>

      </div>
    </div>


  )
}

export default SideBar
