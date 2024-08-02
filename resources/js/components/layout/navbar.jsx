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
import SelectInput from '@mui/material/Select/SelectInput';
import FormInputSelect from '../inputs/FormInputSelect';
import Modal from './modal';
import Api from '../../api/Api';
import { useSnackbar } from 'notistack';


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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [showStoresModal, setShowStoresModal] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const Auth = useSelector(getAuth)

  const { auth } = Auth
  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleOnChangeStorePreference = (store_id) => {
    if (store_id == null) return;
    enqueueSnackbar("Changing Store Please wait...", { variant: "default" })
    setShowStoresModal(false)
    Api.post("/user/store/change-preference", {
      store_id: store_id
    })
      .then(res => {
        enqueueSnackbar("Store Preference Changed", { variant: "success" })
        dispatch(getUser())
      })
      .catch(err => {
        enqueueSnackbar("Failed to Change Store", { variant: "error" })
      })
  }


  return (
    <div className='bg-info-900/90 h-full'>
      <Modal onClose={() => setShowStoresModal(false)} label="Stores" hideDivider={true} open={showStoresModal} show>
        <>
          {Array.isArray(auth?.stores) ? <>
            <nav>
              Please select from the list of available store
            </nav>
            <div className='flex flex-col py-2 divide-y'>
              {auth?.stores.map((store, i) => <nav key={i} className='store-list-item'> <nav className='flex items-start  p-2'>
                <nav className='bg-green-100 font-medium text-green-900 p-2 w-6 my-auto flex items-center justify-center h-6 text-sm rounded-md aspect-square'>
                  {i + 1}
                </nav>
                <nav className='flex items-center justify-between w-full px-5 '>
                  <nav className='text-green-950 font-medium'>
                    {store?.store_name}
                  </nav>
                  {store?.id == auth?.store_preference?.store_id ?
                    <nav className="flex items-center text-xs">
                      <span>Current</span>
                      <IconifyIcon className="h-6 w-6" icon="mdi:check-all" />
                    </nav> : <button onClick={() => handleOnChangeStorePreference(store?.id)} className='flex items-center text-xs gap-2 text-red-700'>
                      <span>
                        Switch to store
                      </span>
                      <IconifyIcon icon="mdi:arrow-right-thin" className="h-4 w-4" />
                    </button>
                  }
                </nav>
              </nav>
                <nav></nav></nav>)
              }
            </div>
          </>
            :
            <div className='flex items-center justify-center'>
              stores not found
            </div>

          }
        </>
      </Modal>

      <div className=' container mx-auto flex justify-between items-center h-full px-8'>
        <nav className='flex items-center gap-1'>
          {fullSideBar && <IconButton onClick={() => setFullSideBar(prev => !prev)} size="small"><Icon className='text-gray-300 hidden xl:block' icon="ic:outline-menu-open" fontSize={26} /></IconButton>}

          {!fullSideBar && <nav className='!text-info-100 h-10 w-40 hidden sm:block'>
            <Logo /></nav>}
        </nav>
        {logingOut && <Loadingwheel />}
        <div className='flex items-center divide-x-2 divide-green-800'>
          {auth?.current_store_branch?.branch_name &&
            <nav className='px-2 text-white  flex items-center gap-1'>
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
              <span className=''>Change Store</span>
            </nav>
          }
          <div className='flex px-2 items-center gap-1'>
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
