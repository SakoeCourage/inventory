import React, { useEffect, useState, useRef, useMemo } from "react";
import Sidebardropdown from "./SdebarDropdown";
import SimpleBar from "simplebar-react";
import { useSidebar } from "../../providers/Sidebarserviceprovider";
import { motion, AnimatePresence } from "framer-motion"
import { AccessByPermission } from "../../pages/authorization/AccessControl";
import { useSelector, useDispatch } from "react-redux"
import { getUnreadCount, getPendingCount } from "../../store/unreadCountSlice"
import Logo from "./Logo";
import SidebarSingleItem from "./SidebarSingleItem";
import { useSwipeable } from 'react-swipeable';

/**
 * @typedef {"view dashboard" | "create expense" | "authorize expense" | "manage stock data" | "generate product order" | "generate report" | "manage users" | "define system data"} AvailablePermission
 * This type represents one of the available permissions.
 */



/**
 * @typedef {Object} UnreadCount
 * @property {number} total - Total number of unread items.
 * @property {number} [critical] - Optional critical unread count.
 */

/**
 * @typedef {Object} Route
 * @property {string} title - The title of the route.
 * @property {string} icon - The icon class or reference for the route.
 * @property {string} link - The URL or link associated with the route.
 * @property {AvailablePermission[]} permissions - Array of permissions required to access this route.
 * @property {string} miniTitle - The abbreviation or short title for display.
 * @property {UnreadCount} [unreadcount] - Optional object representing unread counts.
 */

/**
 * @typedef {Object} RoutesSection
 * @property {string} sectionName - The name of the section.
 * @property {Route[]} routes - Array of route objects in this section.
 */



/**
 * Checks if the sidebar item is a single item without links.
 *
 * @param {object} ssbi - The sidebar item to check.
 * @returns {boolean} True if the sidebar item is a single item without links, otherwise false.
 */
export const isSingleSbItemGuard = function (ssbi) {
    return ssbi.links === undefined;
};

/**
 * Checks if the sidebar item is an item with links.
 *
 * @param {object} ssbi - The sidebar item to check.
 * @returns {boolean} True if the sidebar item is an item with links, otherwise false.
 */
export const isSbWithLinksGuard = function (ssbi) {
    return ssbi.link === undefined;
};






export default function Sidebar() {
    const { toggleSideBar, sidebarStateOpen, setSidebarStateOpen, isPopupVisible, currentPopupElement, handleLeave, setPopupVisible, visibilityTimeout, sidebarItemLocation } = useSidebar()

    const unreadCount = useSelector(getPendingCount);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUnreadCount());
    }, [dispatch]);


    /**
    * @type {RoutesSection[]}
    */
    const Routes = useMemo(() =>
        [
            {
                sectionName: "Basics",
                routes: [
                    {
                        title: 'Dashboard',
                        icon: "bi:grid-3x3-gap",
                        link: '/dashboard',
                        permissions: ['view dashboard'],
                        miniTitle: "Dashboard"
                    },
                    {
                        title: 'Expense',
                        icon: "solar:money-bag-outline",
                        link: '/expenses',
                        permissions: ["create expense", "authorize expense"],
                        miniTitle: "Dashboard",
                        unreadcount: {
                            count: unreadCount?.unreadCount?.expenses,
                            permissions: ['authorize expense']
                        },
                    },
                    {
                        title: 'Report',
                        icon: "carbon:report",
                        link: '/report',
                        permissions: ['generate report'],
                        miniTitle: "Dashboard",
                    }
                ]
            },

            {
                sectionName: "Sales Management",
                routes: [
                    {
                        title: 'Product Orders',
                        icon: "mdi:cart-sale",
                        link: '/salemanagement/newsale',
                        permissions: ['generate product order'],
                        miniTitle: "New Stock"
                    },
                    {
                        title: 'Product Refund',
                        icon: "heroicons:receipt-refund",
                        link: '/salemanagement/refund',
                        permissions: ['generate product order'],
                        miniTitle: "Dashboard",
                        unreadcount: {
                            count: unreadCount?.unreadCount?.expenses,
                            permissions: ['authorize expense']
                        },
                    }
                ]
            },
            {
                sectionName: "Stock Management",
                routes: [
                    {
                        title: 'New Stock',
                        icon: "simple-line-icons:basket-loaded",
                        link: '/stockmanagement/newstock',
                        permissions: ['manage stock data'],
                        miniTitle: "New Stock"
                    },
                    {
                        title: 'Stock History',
                        icon: "solar:cart-check-broken",
                        link: '/stockmanagement/stock-history',
                        permissions: ['manage stock data'],
                        miniTitle: "New Stock"
                    }
                ]
            },

            {
                sectionName: "Settings",
                routes: [
                    {
                        title: 'Users Setup',
                        icon: "ph:users",
                        link: '/usermanagement/all',
                        permissions: ['manage users'],
                        miniTitle: "New Stock"
                    },
                    {
                        title: 'User Roles & Permission',
                        icon: "majesticons:scan-user-line",
                        link: '/usermanagement/rolesandpermissions',
                        permissions: ['manage users'],
                        miniTitle: "New Stock"
                    },
                    {
                        title: 'app setup',
                        icon: "bi:gear",
                        link: '/app-setup',
                        permissions: ['define system data'],
                        miniTitle: "New Stock"
                    },
                ]
            }

        ], [unreadCount]
    )

    /**
     * 
     * @param {Route[]} route 
     */
    const getAllSidebarSectionAbilities = (route) => {
        const permissionsSet = new Set();

        route.forEach(rt => {
            rt.permissions.map(p => permissionsSet.add(p))
        });
        // Convert the Set to an array and return it
        return Array.from(permissionsSet);
    }

    const handlers = useSwipeable({
        onSwipedLeft: (eventData) => {
            if (eventData.initial[0] < 80) {
                setSidebarStateOpen({
                    full: true,
                    mini: sidebarStateOpen.mini
                });
            }
        },
        preventDefaultTouchmoveEvent: true, // Prevent default swipe behavior
        trackTouch: true, // Track touch events
    });

    return (
        <div
            {...handlers}
            className={`h-screen  overflow-hidden   fixed  inset-0 z-50 md:z-auto md:relative md:block  !bg-white  transition-all duration-500 add-sidebar-bezier  ${sidebarStateOpen.mini ? 'w-[var(--sidebar-mini-width)]' : 'w-[var(--sidebar-width)]'}  ${sidebarStateOpen.full ? 'sidebaropened' : 'sidebarclosed'}`}
        >
            <AnimatePresence>
                {sidebarStateOpen.mini
                    && isPopupVisible
                    && <motion.div initial={{ opacity: 0.7 }}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        onMouseOver={() => { clearTimeout(visibilityTimeout?.current); setPopupVisible(true) }}
                        onMouseOut={() => handleLeave()}
                        className=" transition-all add-customer-bezier" style={{ position: 'fixed', zIndex: "50", left: sidebarItemLocation.left, top: sidebarItemLocation.top }}>
                        {currentPopupElement}
                    </motion.div>
                }
            </AnimatePresence>
            <AnimatePresence>
                {sidebarStateOpen.mini
                    && isPopupVisible
                    && <motion.div initial={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }} className=" fixed  inset-0 left-[var(--sidebar-mini-width)]  block transition-all add-customer-bezier duration-300  z-40 bg-gray-600/60">
                    </motion.div>
                }
            </AnimatePresence>

            <div

                className={'h-full w-full' + sidebarStateOpen.mini ? ' !bg-info-900' : '!bg-info-900/80'}>
                <nav className="   h-[var(--header-height)] z-50 flex items-center justify-between  w-full   text-white py-1 ">
                    <nav className="px-5 flex items-center z-50 h-3/4  object-contain">
                        <Logo className=" whitespace-nowrap h-10 w-50" />
                    </nav>
                </nav>
                <SimpleBar className="w-full overflow-x-hidden   z-50 basis-auto flex flex-col gap-5  list-none py-1 h-[calc(100dvh-var(--header-height))]">
                    {Routes?.map((section, i) => <AccessByPermission key={i}
                        abilities={getAllSidebarSectionAbilities(section.routes)}
                    >
                        <nav key={i} className="w-full flex flex-col gap-3 text-sm tracking-tight capitalize whitespace-nowrap"  >
                            <nav className={` flex items-center transition-all  px-4 pt-6 py-2 truncate w-full uppercase tracking-wide text-gray-300/60 text-xs font-medium ${sidebarStateOpen.mini && '  w-full !text-[0.6rem]'}`}>{sidebarStateOpen.mini ? "------------" : section.sectionName}</nav>
                            <ul className=" w-full basis-auto px-3  flex flex-col gap-1 h-full min-h-max list-none">
                                {section.routes.map((route, i) => <AccessByPermission key={i}
                                    abilities={route.permissions}
                                >
                                    <li className="w-full text-sm tracking-tight capitalize whitespace-nowrap"  >
                                        {isSingleSbItemGuard(route) ?
                                            <SidebarSingleItem
                                                toggleSidebar={toggleSideBar}
                                                {...route}
                                            /> :
                                            <Sidebardropdown
                                                toggleSidebar={toggleSideBar}
                                                {...route}
                                            />
                                        }
                                    </li>
                                </AccessByPermission>
                                )
                                }
                            </ul>
                        </nav>
                    </AccessByPermission >
                    )}
                </SimpleBar>
            </div>
        </div>
    );
}