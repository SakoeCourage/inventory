import React, { useEffect, useState } from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Zoom from '@mui/material/Zoom';
import { Icon } from '@iconify/react'

function Modal(props) {
  const {
    open,
    fullWidth,
    maxWidth,
    onClose,
    icon,
    label,
    iconBg,
    iconText,
    labelStyle,
    hideHeader,
    hideDivider,
    hideCloseIcon,
    outSideClose
  } = props
  return (
    <Dialog
      open={open}
      fullWidth={fullWidth || true}
      maxWidth={maxWidth}
      onClose={outSideClose && onClose}
      TransitionComponent={Zoom}
    >
      {!hideHeader && (
        <DialogTitle>
          <div className="flex justify-between">
            <div className="flex gap-2">
              {icon && (
                <div
                  className={`rounded-full ${iconBg} p-2 text-sm font-semibold leading-5 ${iconText}`}
                >
                  <Icon icon={icon} fontSize={23} />
                </div>
              )}
              <span
                className={`mt-2 text-lg font-semibold text-gray-800 capitalize ${labelStyle}`}
              >
                {label}
              </span>
            </div>
            {!hideCloseIcon &&
              <IconButton onClick={onClose}>
                <Icon icon="carbon:close" />
              </IconButton>
            }
          </div>
        </DialogTitle>
      )}
      {!hideDivider &&
        <Divider />
      }
      <DialogContent>{props.children}</DialogContent>
    </Dialog>
  )
}

export default Modal
