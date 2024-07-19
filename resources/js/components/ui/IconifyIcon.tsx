import React from "react";
import { Icon } from '@iconify/react'

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
 * IconifyIcon component
 * 
 * @param {IconifyIconProps} props 
 * @returns {JSX.Element}
 */
const IconifyIcon = ({
    icon,
    fontSize = "1.375rem",
    onClick,
    className,
    fill,
    ...rest
}) => {
    return (
        <div onClick={onClick}
            className={`p-1 rounded-full h-8 w-8 aspect-square flex items-center justify-center bg-transparent ${className}`}
            {...rest}>
            <Icon fill={fill} icon={icon} fontSize={fontSize} />
        </div>
    );
};

export default IconifyIcon;
