import React from 'react'
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Icon } from '@iconify/react';
import Badge from '@mui/material/Badge';

const Navbar = ({ setFullSideBar }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className='flex justify-between items-center h-full px-4'>
      <IconButton onClick={() => setFullSideBar(prev => !prev)} size="small"><Icon className='text-gray-300 hidden xl:block' icon="ic:outline-menu-open" fontSize={26} /></IconButton>
      <div>
        <div className='flex items-center gap-1'>
          <IconButton
            size="small"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={17} color="error">
              <Icon icon="material-symbols:notifications-sharp" className='text-gray-300' fontSize={25}/>
            </Badge>
          </IconButton>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, fontSize: '14px' }}>AD</Avatar>
          </IconButton>
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
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
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
              <Avatar /> Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Avatar /> My account
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Icon icon="material-symbols:person-add-rounded" fontSize={20} />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Icon icon="material-symbols:settings" fontSize={20} />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleClose}>
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
