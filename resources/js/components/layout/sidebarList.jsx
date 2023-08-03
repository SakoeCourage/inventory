import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Collapse from '@mui/material/Collapse'
import { Icon } from '@iconify/react'
import { Tooltip, Zoom } from '@mui/material'
import { formatMaximumValue } from '../../pages/stockManagement/partials/Productstockhistory'
import { AccessByPermission } from '../../pages/authorization/AccessControl'
const SidebarList = (props) => {
  const { route, fullSideBar } = props
  const location = useLocation()
  const [isColapsed, setisColapsed] = useState(true)
  const [isIncurrentRoute, setisIncurrentRoute] = useState(false)
  const [collapseTwo, setCollapseTwo] = useState(true)

  const changeState = (val) => {
    let state = false;
    if (!val?.subItems) {
      if (route?.path === location.pathname) {
        state = true
      }
    }
    else {
      val.subItems.map((x) => {
        if (x.subItems) {
          x.subItems.map((a) => {
            if (a.link === location.pathname)
              state = true
          })
        } else {
          if (x.link === location.pathname) {
            state = true
          }

        }
      })
    }
    return state
  }

  useEffect(() => {
    setisIncurrentRoute(changeState(route))
    setisColapsed(!changeState(route))
    
  }, [location])
  return (
    <>
      {!route?.subItems ? (
        <li className={` w-full  py-2 ${fullSideBar ? 'px-4' : 'px-3'} ${isIncurrentRoute ? 'bg-gray-100/70' : 'hover:bg-gray-100/50'} rounded-r-3xl relative`}>
          <NavLink
            to={route.path}
            className={(props) =>
              props.isActive ? 'text-info-500' : 'text-gray-500  hover:text-gray-500/70 '
            }
          >
            <div className="flex items-center gap-3">
              {fullSideBar ?
                <Icon icon={route.icon} fontSize={25} />
                :
                <Tooltip title={route.name} arrow placement='right' TransitionComponent={Zoom}>
                  <Icon icon={route.icon} fontSize={25} className={isIncurrentRoute && 'text-info-600'} />
                </Tooltip>
              }
              {fullSideBar &&
                <span className={`item-name font-medium ${isIncurrentRoute && '!text-info-600'}`}>{route.name}</span>
              }
            </div>
          </NavLink>
          {route?.unreadcount && route?.unreadcount?.count > 0 &&
            <AccessByPermission abilities={route?.unreadcount?.permissions}>
              <nav className=' absolute right-2 inset-y-[20%] aspect-square bg-red-400 text-white rounded-full grid place-items-center text-xs '>{formatMaximumValue(route?.unreadcount?.count)}</nav>
            </AccessByPermission>
          }
        </li>
      ) : (
        <li className={` w-full  py-2 ${fullSideBar ? "px-4" : 'px-3'} ${isIncurrentRoute ? 'bg-info-100/60' : 'hover:bg-gray-100/50'} rounded-r-3xl`}>
          <button
            onClick={(_) => setisColapsed(!isColapsed)}
            className={`flex justify-between w-full text-gray-500 items-center ${isIncurrentRoute ? '' : 'hover:text-gray-500/70'}
            }`}
          >
            <div className="flex items-center gap-3 tracking-1 ">
              {fullSideBar ?
                <Icon icon={route.icon} fontSize={25} className={isIncurrentRoute && 'text-info-500'} /> :
                <Tooltip title={route.name} arrow placement='right' TransitionComponent={Zoom}>
                  <Icon icon={route.icon} fontSize={25} className={isIncurrentRoute && 'text-info-500'} />
                </Tooltip>
              }
              {fullSideBar &&
                <span className={` font-medium ${isIncurrentRoute && 'text-info-600'}`}>{route.name}</span>
              }
            </div>
            {fullSideBar &&
              <p
                className={` transfrom transition-transform justify-self-end   ${!isColapsed && ' rotate-180'
                  }`}
              >
                <Icon icon="material-symbols:arrow-drop-down" fontSize={20} />
              </p>
            }
          </button>

          <Collapse orientation="vertical" in={!isColapsed}>
            <ul
              className="overflow-hidden transition-[height] duration-200 mt-1 list-inside"
              style={{ maxHeight: '100%' }}
            >
              {route.subItems.map((link, i) => {
                return (
                  !link.subItems ?
                    <li key={i} className={`text-sm ${fullSideBar ? 'pl-10' : 'pl-1'} py-1.5 flex items-center gap-3 `}>
                      {fullSideBar && <Icon fontSize={10} icon="octicon:dot-fill-16" />}
                      <NavLink
                        to={link.link}
                        className={(props) =>
                          props.isActive ? 'text-info-600' : 'text-gray-500 hover:text-gray-900 '
                        }
                      >
                        {fullSideBar ?
                          <span className="">{link.title}</span>
                          :
                          <Tooltip title={link.title} arrow placement='right' TransitionComponent={Zoom}>
                            <span className="">{link.title.slice(0, 1)}</span>
                          </Tooltip>
                        }
                      </NavLink>
                    </li>
                    :
                    <li
                      className={`w-full  py-2 ${fullSideBar ? "pl-5" : 'px-0'} `}
                    >
                      <button
                        onClick={(_) => setCollapseTwo(!collapseTwo)}
                        className={`flex justify-between w-full text-gray-500 items-center ${isIncurrentRoute ? 'text-blue-600 ' : 'hover:text-gray-500/70'}`}
                      >
                        <div className="flex items-center gap-3 tracking-1 ">
                          {fullSideBar ?
                            <Icon icon={link.icon} fontSize={20} />

                            :
                            <Tooltip title={link.title} arrow placement='right' TransitionComponent={Zoom}>
                              <Icon icon={link.icon} fontSize={20} />
                            </Tooltip>
                          }
                          {fullSideBar &&
                            <span className=" ">{link.title}</span>
                          }
                        </div>
                        {fullSideBar &&
                          <p
                            className={` transfrom transition-transform justify-self-end   ${!collapseTwo && ' rotate-180'}`}
                          >
                            <Icon icon="material-symbols:arrow-drop-down" fontSize={20} />
                          </p>
                        }
                      </button>
                      <Collapse in={!collapseTwo} orientation="vertical">
                        <ul
                          className="overflow-hidden transition-[height] duration-200 mt-1 list-inside"
                          style={{ maxHeight: '100%' }}
                        >
                          {
                            link.subItems.map((x, index) => {
                              return (
                                <li
                                  key={index} className={`${fullSideBar ? 'pl-8' : 'pl-1'} py-1.5`}
                                >
                                  <NavLink
                                    to={x.link}
                                    className={(props) =>
                                      props.isActive ? 'text-blue-800' : 'text-gray-500 hover:text-gray-900 '
                                    }
                                  >
                                    {fullSideBar ?
                                      <span className="">{x.title}</span>
                                      :
                                      <Tooltip title={x.title} arrow placement='right' TransitionComponent={Zoom}>
                                        <span className="">{x.title.slice(0, 1)}</span>
                                      </Tooltip>
                                    }
                                  </NavLink>
                                </li>
                              )
                            })
                          }
                        </ul>
                      </Collapse>
                    </li>
                )
              })}
            </ul>
          </Collapse>
        </li>
      )}
    </>
  )
}

export default SidebarList
