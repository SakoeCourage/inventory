import React from 'react'
import { getAuth } from '../../store/authSlice'
import { useSelector } from 'react-redux'
import Unauthorizedaccess from './Unauthorizedaccess'
import { Navigate } from 'react-router-dom'
import { SnackbarProvider, useSnackbar } from 'notistack'

export function AcessControlPage({ abilities, children }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    if (abilities?.length == 0) {
        return <> {children}</>;
    }


    if (useSelector(getAuth).loadingState == 'success' && useSelector(getAuth).auth) {
        const { auth } = useSelector(getAuth)
        const { permissions, roles, loadingState } = auth
        if (roles.includes('Super Admin')) {
            return <> {children}</>;
        } else if (!roles.includes('Super Admin')) {
            for (const ability of abilities) {
                if (permissions.some((permision, i) => permision === ability)) {
                    return <> {children}</>;
                } else {
                    // <Navigate to={window.history.back()} />
                    return <><Unauthorizedaccess /></>
                }
            }
        }
    }

}


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


