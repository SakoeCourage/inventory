import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Icon } from '@iconify/react';
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../store/authSlice';
import { getAuth, getUser } from '../../store/authSlice';
import { AccessByPermission } from '../../pages/authorization/AccessControl';
import { useNavigate } from 'react-router-dom';
import Loadingwheel from '../Loaders/Loadingwheel';
import Logo from '../ui/Logo';
import IconifyIcon from '../ui/IconifyIcon';
import { useSidebar } from '../../providers/Sidebarserviceprovider';
import Modal from './modal';
import Api from '../../api/Api';
import { useSnackbar } from 'notistack';


const StoreListItem = ({ isChecked, store_name, onClick, index, loading }) => {
  return <li onClick={onClick} className={`px-3 border border-gray-400 ps-list-item flex items-center relative isolate hover:bg-green-800/10 overflow-hidden cursor-pointer py-5 gap-5 bg-green-800/5 rounded-md ${isChecked && ' !text-white inactive'} ${loading && '!pointer-events-none '}`}>
    <div className={`bg-green-900/70 z-[-1] ps-indicator  inset-0 h-full absolute transition-[width] ease-in-out duration-500  ${isChecked ? 'w-full' : 'w-[1.5px]'}`}>
    </div>
    <div className='text-white h-6 w-6 flex items-center justify-center aspect-square my-auto p-2 text-sm bg-green-950/60 rounded'>
      {index}
    </div>
    <nav className=' font-semibold'>{store_name}</nav>
    {isChecked ? <nav className='ml-auto flex items-center gap-2 text-xs'>
      <nav className=' ml-auto text-white flex items-center gap-1 uppercase'>
        <span>Current Store</span>
        <IconifyIcon className="!p-0 !h-5 !w-5" icon="mdi:checkbox-marked-circle" />
      </nav>

    </nav> : <nav className='ml-auto flex items-center gap-2 text-xs'>
      <nav className=' ml-auto text-black flex items-center gap-1 uppercase'>
        switch to store
      </nav>
    </nav>
    }
  </li>
}


const AvailableStoresList = () => {

  const dispatch = useDispatch()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [currentStoreId, setCurrentStoreId] = useState(null)

  const [showStoresModal, setShowStoresModal] = useState(false);

  const Auth = useSelector(getAuth)
  const { auth } = Auth



  const handleOnChangeStorePreference = (store_id) => {
    if (store_id == null) return;
    enqueueSnackbar("Changing Store Please wait...", { variant: "default" })

    Api.post("/user/store/change-preference", {
      store_id: store_id
    })
      .then(res => {
        enqueueSnackbar("Store Preference Changed", { variant: "success" })
        setCurrentStoreId(store_id)
        setTimeout(() => {
          dispatch(getUser())
        }, 400);
      })
      .catch(err => {
        enqueueSnackbar("Failed to Change Store", { variant: "error" })
      })
  }

  useEffect(() => {
    if (auth?.store_preference) {
      setTimeout(() => {
        setCurrentStoreId(auth?.store_preference?.store_id)
      }, 200);
    }
  }, [auth])


  return <div>
    {Array.isArray(auth?.stores) ? <>
      <nav>
        Please select from the list of available stores
      </nav>
      <div className='flex flex-col py-2 divide-y space-y-2'>
        {auth?.stores.map((store, i) => <StoreListItem
          onClick={() => handleOnChangeStorePreference(store?.id)}
          index={i + 1}
          isChecked={store?.id == currentStoreId}
          store_name={store?.store_name}
        />)
        }
      </div>
    </>
      :
      <div className='flex items-center justify-center'>
        stores not found
      </div>

    }
  </div>
}
/**
 * 
 * @param {{ 
 * fullSideBar: boolean
 * setFullSideBar: React.Dispatch<React.SetStateAction<boolean>>
 *  }}  
 * @returns 
 */
const Navbar = ({ fullSideBar, setFullSideBar }) => {
  const [logingOut, setLogingOut] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate()
  const open = Boolean(anchorEl);
  const dispatch = useDispatch()

  const [showStoresModal, setShowStoresModal] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const Auth = useSelector(getAuth)

  const { auth } = Auth

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { setSidebarStateOpen, toggleMiniSidebar, sidebarStateOpen } = useSidebar()


  return (
    <div className='bg-info-900/90 h-[var(--header-height)] flex items-center'>
      <nav>
        {
          sidebarStateOpen.full && <div className='opacity-100 md:opacity-0 block transition-all add-customer-bezier duration-300 md:hidden fixed z-40 bg-white/50 inset-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pl-[var(--sidebar-width)]'>
            <div onClick={() => setSidebarStateOpen(cv => cv = { mini: cv.mini, full: false })} className='w-full h-full flex items-center justify-center'>
              <IconifyIcon onClick={() => setSidebarStateOpen(cv => cv = { mini: cv.mini, full: false })} className=" cursor-pointer !text-red-200 !bg-transparent h-[3.5rem] w-[3.5rem]" fontSize="3.5rem" icon="gg:push-left" />
            </div>
          </div>
        }
        <IconifyIcon onClick={() => setSidebarStateOpen(cv => cv = { mini: false, full: true })} className=' !text-gray-100 cursor-pointer !bg-transparent md:hidden' icon='gravity-ui:bars-unaligned' />
        <IconifyIcon onClick={() => setSidebarStateOpen(cv => cv = { mini: !cv.mini, full: false })} className={`!text-gray-100 cursor-pointer !bg-transparent hidden md:block transform transition-transform add-customer-bezier ${!sidebarStateOpen.mini && " scale-x-[-1] "}`} icon='gravity-ui:bars-unaligned' />
      </nav>
      <Modal onClose={() => setShowStoresModal(false)} label="Stores" hideDivider={true} open={showStoresModal} show>
        <AvailableStoresList />
      </Modal>

      <div className=' container mx-auto flex justify-between items-center h-full px-8'>
        {logingOut && <Loadingwheel />}
        <div className='flex items-center divide-x-2 divide-green-800 ml-auto'>
          {auth?.current_store_branch?.branch_name &&
            <nav className='px-2 text-white hidden  lg:flex items-center gap-1'>
              <IconifyIcon icon="hugeicons:location-05" className="!p-0 !h-4 !w-4" />
              {auth?.current_store_branch?.branch_name}
              <span>
                -
              </span>
              <span>
                {auth?.store_preference?.store?.store_name}
              </span>
            </nav>
          }
          {(auth?.stores?.length > 1) && auth?.store_preference?.store &&
            <nav onClick={() => setShowStoresModal(true)} className='px-2 text-white flex items-center gap-1 cursor-pointer'>
              <IconifyIcon className="!h-6 !w-6" icon="solar:pen-2-broken" />
              <span className=' text-xs md:text-sm lg:text-base'>Change Store</span>
            </nav>
          }
          <div className='flex px-2 items-center gap-1 '>
            <button onClick={handleClick} className=' bg-info-100/70 flex items-center pr-5 rounded-full'>
              <IconButton
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar sx={{ width: 32, height: 32, fontSize: '14px' }}>
                  <span className=' uppercase'>{auth?.roles[0].charAt(0)}</span>
                </Avatar>
              </IconButton>
              <nav className=' text-sm text-info-900 capitalize'>
                {auth?.roles[0]}
              </nav>
            </button>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 35,
                    height: 35,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 70,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleClose}>
                <nav className=' flex flex-col w-full gap-5 px-10'>
                  <nav className=' flex w-full justify-center'>
                    <Avatar sx={{ width: 40, height: 40, fontSize: '18px' }}>
                      <span className=' uppercase'>{auth?.roles[0].charAt(0)}</span>
                    </Avatar>
                  </nav>
                  <nav>
                    <nav className='  w-full text-center'> {auth?.user?.name}</nav>
                    <nav className=' text-sm text-gray-500  w-full text-center capitalize'> {auth?.roles[0]}</nav>
                  </nav>
                </nav>
              </MenuItem>
              <Divider />
              <AccessByPermission abilities={['create user']}>
                <MenuItem onClick={() => { handleClose(); navigate('/usermanagement/all') }}>
                  <ListItemIcon>
                    <Icon icon="material-symbols:person-add-rounded" fontSize={20} />
                  </ListItemIcon>
                  Add another account
                </MenuItem>
              </AccessByPermission>
              <MenuItem onClick={() => { handleClose(); navigate('/account') }}>
                <ListItemIcon>
                  <Icon icon="iconamoon:profile-fill" fontSize={20} />
                </ListItemIcon>
                My Account
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); setLogingOut(true); dispatch(Logout()) }}>
                <ListItemIcon>
                  <Icon icon="solar:logout-3-bold" fontSize={20} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Navbar
