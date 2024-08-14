import React from 'react';
import IconifyIcon from './IconifyIcon';
import { Tooltip, Zoom } from '@mui/material';

/**
 * @typedef {Object} IconifyIconProps
 * @property {string} icon - The icon to display
 * @property {string|number} [fontSize] - The font size of the icon
 * @property {string} [fill] - The fill color of the icon
 * @property {function} [onClick] - The click handler function
 * @property {string} [className] - Additional CSS classes for the div
 * @property {...Object} rest - Other properties passed to the div
 */

/**
 * @param {{ 
 *  content: React.ReactNode;
 *  className?: string;
 *  iconProps?: IconifyIconProps;
 * }} props 
 * @returns {JSX.Element}
 */
function HelpToolTip(props) {
    const { content, className, iconProps } = props;

    return (
        <Tooltip 
            TransitionComponent={Zoom} 
            arrow 
            title={<nav className='text-xs'>{content}</nav>}
        >
            <div className={`w-max inline-block ${className}`}>
                <IconifyIcon 
                    {...iconProps} 
                    className={`text-gray-600 cursor-pointer ${iconProps?.className}`} 
                    icon={iconProps?.icon ?? 'raphael:question'} 
                />
            </div>
        </Tooltip>
    );
}

export default HelpToolTip;
