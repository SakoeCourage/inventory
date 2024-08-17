import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Sidebardropdown from "./SdebarDropdown";
import { sidebarRoutes } from "./sidebarRoutesList";
import { Icon } from '@iconify/react'
import SimpleBar from "simplebar-react";
import { useSidebar } from "../../providers/Sidebarserviceprovider";
import { motion, AnimatePresence } from "framer-motion"
// import { AccessByPermission, getAllRequiredAbilitiesPerRoute, getAllSidebarSectionAbilities } from "../accescontrol/accesscontrol";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import { getUnreadCount, getPendingCount } from "../../store/unreadCountSlice"
import Logo from "./Logo";

function SidebarSingleItem(props) {
    const { sidebarStateOpen, setSidebarItemLocation, setSidebarStateOpen,setCurrentPopupElement, setPopupVisible, handleLeave, visibilityTimeout } = useSidebar();
    const { mini, full } = sidebarStateOpen
    const location = useLocation();
    const pathname = location?.pathname;
    const listItemsRef = useRef(null);
    const sidebarItemRef = useRef(null);

    const handleHover = () => {
        if(sidebarStateOpen.mini == false) return;
        clearTimeout(visibilityTimeout?.current);
        if (sidebarItemRef.current) {
            const { top } = sidebarItemRef.current.getBoundingClientRect();
            const documentTop = window.scrollY || document.documentElement.scrollTop;
            const root = document.documentElement;
            const sbWidth = getComputedStyle(root).getPropertyValue('--sidebar-mini-width');
            const currentCp = <ul ref={listItemsRef} className="z-50 rounded-md overflow-hidden h-[3.6rem] bg-gray-100/95 flex items-center  add-customer-bezier duration-300 w-[var(--sidebar-width)]  list-none pl-2 pr-3 py-[0.03rem] ">
                <li className=" list-none my-auto">
                    <Link
                        onClick={() => setPopupVisible(false)}
                        to={props.link}
                        className={
                            classNames({
                                'flex item-center gap-1 hover:text-blue-500  py-1 pl-2 w-full text-sm   ': true,
                                ' text-blue-400 rounded-md w-full font-semibold': pathname.startsWith(props.title),
                                ' text-gray-600 font-normal': !pathname.startsWith(props.title)
                            })}>
                        <svg className="my-auto" xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2" /></svg>
                        <nav className="route-title my-auto pl-1 "> {props.title}</nav>
                    </Link>
                </li>
            </ul>;

            const items = listItemsRef.current;
            if ((documentTop + top + (items?.scrollHeight ?? 0)) >= window.innerHeight) {
                setSidebarItemLocation({
                    top: window.innerHeight - 2 - (items?.scrollHeight ?? 0),
                    left: sbWidth,
                });
            } else {
                setSidebarItemLocation({
                    top: top + documentTop - 4,
                    left: sbWidth,
                });
            }
            setCurrentPopupElement(currentCp);
            setPopupVisible(true);
        }
    };

    return <Link
        onClick={()=>setSidebarStateOpen({ full: false, mini: true })}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        to={props.link}
        className={
            classNames({
                'flex-row': true,
                'route-active': pathname.startsWith(props.link),
                'route-inactive': !pathname.startsWith(props.link),

            })
        } >
        <nav ref={sidebarItemRef} className={`route-icon  p-[0.4rem] rounded-full h-[2.5rem] w-[2.7rem] overflow-visible whitespace-nowrap aspect-square flex items-center justify-center transition-all duration-500 ${mini && "mr-4"}`}>
            <Icon fontSize={40} className=" min-h-full min-w-full" icon={props.icon} />
        </nav>
        <span className={`route-title  `}>{props.title}</span>
        {/* <nav className={`${mini ? 'block' : 'hidden'} text-[#bae6fd] truncate text-center px-0 w-full text-[0.65rem] font-semibold`}>{props.miniTitle}</nav> */}
    </Link>
}
export default SidebarSingleItem