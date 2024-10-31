import React from 'react'
import { getAuth } from '../../store/authSlice'
import { useSelector } from 'react-redux'
import Unauthorizedaccess from './Unauthorizedaccess'
import { Navigate } from 'react-router-dom'
import { SnackbarProvider, useSnackbar } from 'notistack'

/**
 * @typedef {"view dashboard" | "create expense" | "authorize expense" | "manage stock data" | "generate product order" | "generate report" | "manage users" | "define system data","view revenue"} AvailablePermission
 * This type represents one of the available permissions.
 */


/**
 * 
 * @param {{
*  abilities: AvailablePermission[],
*  children: React.ReactNode
* }}  
* @returns 
*/
export function AcessControlPage({ abilities, children }) {
   
    if (abilities?.length == 0) {
        return <> {children}</>;
    }


    function checkPermissionWithAbilities(abilities, permissions) {
        for (const permission of permissions) {
          if (abilities.includes(permission)) {
            return true; 
          }
        }
        return false; 
      }


    if (useSelector(getAuth).loadingState == 'success' && useSelector(getAuth).auth) {
        const { auth } = useSelector(getAuth)
        const { permissions, roles, loadingState } = auth
        if (roles.includes('Super Admin')) {
            return <> {children}</>;
        } else if (!roles.includes('Super Admin')) {
            if (checkPermissionWithAbilities(abilities,permissions)) {
                return <> {children}</>;
            } else {
                // <Navigate to={window.history.back()} />
                return <><Unauthorizedaccess /></>
            }
        }
    }

}


/**
 * 
 * @param {{
 *  abilities: AvailablePermission[],
 *  children: React.ReactNode
 * }}  
 * @returns 
 */
export function AccessByPermission({ abilities, children }) {
    if (abilities?.length == 0) {
        return <> {children}</>;
    }
    if (useSelector(getAuth).loadingState == 'success' && useSelector(getAuth).auth) {
        const { auth } = useSelector(getAuth)
        const { permissions, roles } = auth
        if (roles.includes('Super Admin')) {
            return <> {children}</>;
        }
        if (!roles.includes('Super Admin')) {
            for (const ability of abilities) {
                if (permissions.some((c_permission, i) => c_permission === ability)) {
                    return <> {children}</>;
                }
            }

        }
    }

}


