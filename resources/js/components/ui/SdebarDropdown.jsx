import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import React from 'react';
import { Icon } from '@iconify/react';
import classNames from "classnames";
import Sidebarpopup from './Sidebarpopup';
import { useSidebar } from '../../providers/Sidebarserviceprovider';
import { AccessByPermission } from '../../pages/authorization/AccessControl';
import { useLocation, Link } from 'react-router-dom';

export default function Sidebardropdown(props) {
    const { sidebarStateOpen, setSidebarItemLocation,setSidebarStateOpen, setCurrentPopupElement, setPopupVisible, handleLeave, visibilityTimeout } = useSidebar();
    const { mini } = sidebarStateOpen;
    const location = useLocation();
    const pathname = location?.pathname;
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isInCurrentPathname, setIsInCurrentPathname] = useState(false);
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
            const currentCp = <Sidebarpopup {...props} />;

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



    useEffect(() => {
        const items = listItemsRef.current;
        if (items) {
            const isInCurrentPathname = Object.values(props.links)
                .map((value) => value.link)
                .some((value) => pathname.startsWith(value));
            setIsInCurrentPathname(isInCurrentPathname);
            setIsCollapsed(!isInCurrentPathname);
        }
    }, [pathname, props.links]);

    useLayoutEffect(() => {
        const items = listItemsRef.current;
        if (items) {
            if (mini || isCollapsed) {
                items.style.height = '0';
            } else {
                items.style.height = `${items.scrollHeight}px`;
            }
        }
    }, [isCollapsed, mini]);

    return (
        <div
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            className="overflow-visible relative"
        >
            <nav
                className={classNames({
                    'cursor-pointer transition-all duration-200 w-full': true,
                    '!rounded-b-none': !isCollapsed && isInCurrentPathname && !mini,
                    'route-active': isInCurrentPathname,
                    'route-inactive': !isInCurrentPathname,
                })}
                onClick={() => { if (!mini) setIsCollapsed(!isCollapsed); }}
            >
                <nav  ref={sidebarItemRef} className={`route-icon  p-[0.4rem] rounded-full h-[2.5rem] w-[2.7rem] overflow-visible whitespace-nowrap aspect-square flex items-center justify-center transition-all duration-500 ${mini && "mr-4"}`}>
                    <Icon fontSize={40} className=" min-h-full min-w-full" icon={props.icon} />
                </nav>
                <span className={`route-title`}>{props.title}</span>
                <svg className={`transform text-[#c7d2fe] transition-transform !justify-self-end ml-auto ${mini ? 'hidden' : "transition-fadeIn"} ${!isCollapsed && 'rotate-180'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z" />
                </svg>
            </nav>
            <ul ref={listItemsRef} className={`${isInCurrentPathname && "rounded-b-md"} overflow-hidden transition-all add-customer-bezier duration-300 bg-gray-500/30 list-none px-1 py-[0.03rem]`}>
                {props.links.map((link, i) => (
                    <AccessByPermission key={i} abilities={link.permissions}>
                        <li className="list-none">
                            <Link
                                onClick={()=>setSidebarStateOpen({ full: false, mini: true })}
                                to={link.link}
                                className={classNames({
                                    'flex items-center gap-1 py-1 pl-2 w-full text-sm': true,
                                    'text-blue-400 rounded-md w-full font-semibold': pathname.startsWith(link.link),
                                    'text-[#c7d2fe]/80 font-normal': !pathname.startsWith(link.link),
                                })}
                            >
                                <svg className={`my-auto transition-all add-customer-bezier duration-300 ${mini && 'mx-auto'}`} xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2" />
                                </svg>
                                <nav className={`route-title my-auto pl-1 ${mini ? 'hidden' : "transition-fadeIn"}`}>{link.title}</nav>
                            </Link>
                        </li>
                    </AccessByPermission>
                ))}
            </ul>
        </div>
    );
}
