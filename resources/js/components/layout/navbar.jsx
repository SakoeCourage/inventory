import React, { useState } from 'react'
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
import { getAuth } from '../../store/authSlice';
import { AccessByPermission } from '../../pages/authorization/AccessControl';
import { useNavigate } from 'react-router-dom';
import Loadingwheel from '../Loaders/Loadingwheel';

const Navbar = ({ setFullSideBar }) => {
  const [logingOut,setLogingOut] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate()
  const open = Boolean(anchorEl);
  const dispatch = useDispatch()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const Auth = useSelector(getAuth)
  const { auth } = Auth
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div className='flex justify-between items-center h-full px-4'>
      <IconButton onClick={() => setFullSideBar(prev => !prev)} size="small"><Icon className='text-gray-300 hidden xl:block' icon="ic:outline-menu-open" fontSize={26} /></IconButton>
      {logingOut && <Loadingwheel/>}
      <div>
        <div className='flex items-center gap-1'>

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
            <MenuItem onClick={()=>{handleClose();navigate('/account')}}>
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
  )
}

export default Navbar
