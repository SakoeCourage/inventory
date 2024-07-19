import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import { Divider, IconButton, Slide } from '@mui/material';
import { Icon } from '@iconify/react';


const SideModal = (props) => {
  const { open, showClose, onClose, title, showDivider, maxWidth } = props
  return (
    open &&
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <div aria-live="assertive" className="pointer-events-none fixed inset-0 flex items-end place-content-end sm:items-start z-30 ">
          <div 
            className={ `flex flex-col flex-grow pointer-events-none w-screen md:w-auto h-full
              ${maxWidth === 'md' && 'max-w-md'}
              ${maxWidth === 'lg' && 'max-w-lg'}
              ${maxWidth === 'xl' && 'max-w-xl'}
              ${maxWidth === '2xl' && 'max-w-2xl'}
              ${maxWidth === '3xl' && 'max-w-3xl'}
              ${!maxWidth  && 'max-w-md'}
            `}
          >
            {/* <div className="h-[53px]" >&nbsp;</div> */}
            <div className="pointer-events-auto flex-grow overflow-y-hidden bg-white flex flex-col shadow-lg border transition duration-700 ease-in-out">
              <div className='flex items-center justify-between px-2 pt-2'>
                <div className='ml-2'>

                  {
                    title &&
                    <h5 className=''>{title}</h5>
                  }
                </div>

                {showClose &&
                  <div className="flex  justify-end p-1">
                    <IconButton onClick={onClose}>
                      <Icon icon="ic:round-close" />
                    </IconButton>
                  </div>
                }
              </div>
              {showDivider &&
                <Divider className='text-black' />
              }
              <div className="flex-grow flex overflow-y-hidden">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </Slide>
    </Backdrop>

  )
}

export default SideModal
