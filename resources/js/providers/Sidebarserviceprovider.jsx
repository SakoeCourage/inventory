import React, { useState, createContext, useContext, useEffect, useRef, useLayoutEffect } from 'react'
const sideBarContext = createContext({});

/**
 * @constant {string} miniSidebarLocalStorageKey - The key used for storing the mini sidebar state in local storage.
 */
const miniSidebarLocalStorageKey = "sidebar-mini";

/**
 * Provides sidebar-related state and functionality to child components.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The sidebar service provider component.
 */
function Sidebarserviceprovider({ children }) {
    const [sidebarStateOpen, setSidebarStateOpen] = useState({
        mini: false,
        full: false
    });

    const visibilityTimeout = useRef(null);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [sidebarItemLocation, setSidebarItemLocation] = useState({
        top: 0,
        left: ""
    });
    const [currentPopupElement, setCurrentPopupElement] = useState(null);

    /**
     * Handles the logic for when the mouse leaves the sidebar item, triggering a popup visibility timeout.
     */
    const handleLeave = () => {
        if (visibilityTimeout.current) {
            clearTimeout(visibilityTimeout.current);
        }
        visibilityTimeout.current = setTimeout(() => {
            setPopupVisible(false);
        }, 200);
    };

    /**
     * Toggles the full sidebar state off.
     */
    const toggleSideBar = () => setSidebarStateOpen({
        full: false,
        mini: sidebarStateOpen.mini
    });

    /**
     * Handles the window resize event and adjusts the sidebar state based on the window width.
     */
    const handleOnWindowResize = () => {
        if (window.innerWidth <= 768) {
            setSidebarStateOpen({
                full: false,
                mini: false
            });
        } else {
            setSidebarStateOpen({
                full: false,
                mini: Boolean(localStorage.getItem(miniSidebarLocalStorageKey)) ? true : false,
            });
        }
    };

    /**
     * Toggles the mini sidebar state and updates local storage accordingly.
     */
    const toggleMiniSidebar = () => {
        const isLocalStorageSet = Boolean(localStorage.getItem(miniSidebarLocalStorageKey));
        if (!isLocalStorageSet) {
            localStorage.setItem(miniSidebarLocalStorageKey, "true");
            setSidebarStateOpen((cv) => cv = { full: cv.full, mini: true });
        } else {
            localStorage.removeItem(miniSidebarLocalStorageKey);
            setSidebarStateOpen((cv) => cv = { full: cv.full, mini: false });
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleOnWindowResize, true);
        return () => window.removeEventListener('resize', handleOnWindowResize, true);
    }, []);

    useLayoutEffect(() => {
        setSidebarStateOpen({
            mini: Boolean(localStorage.getItem(miniSidebarLocalStorageKey)) ? true : false,
            full: false
        });
   
    }, []);

    const values = {
        sidebarStateOpen,
        setSidebarStateOpen,
        toggleSideBar,
        toggleMiniSidebar,
        isPopupVisible,
        setPopupVisible,
        currentPopupElement,
        setCurrentPopupElement,
        handleLeave,
        visibilityTimeout,
        setSidebarItemLocation,
        sidebarItemLocation
    };

    return (
        <sideBarContext.Provider value={values}>
            {children}
        </sideBarContext.Provider>
    );
}

export default Sidebarserviceprovider;

/**
 * Custom hook to access sidebar-related state and functionality.
 *
 * @returns {object} The sidebar context values.
 * @throws Will throw an error if the Sidebar service is not initialized.
 */
export function useSidebar() {
    if (sideBarContext.Provider == null) throw ("Unable to start Sidebar Service");
    return useContext(sideBarContext);
}
