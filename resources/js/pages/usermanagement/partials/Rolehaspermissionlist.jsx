import React, { useState, useEffect, useCallback } from 'react'
import Button from '../../../components/inputs/Button'
import Api from '../../../api/Api'
import { SnackbarProvider, useSnackbar } from 'notistack'


import { Switch } from '@mui/material'
function Loader() {
    return <div role="status" className=" p-4 space-y-4 border border-gray-200 divide-y divide-gray-50 rounded shadow animate-pulse  md:p-6 ">
        <div className="grid grid-cols-2 ">
            <div className=' flex flex-col justify-center items-center'>
                <div className="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
                <div className="w-32 h-2 bg-gray-200 rounded-full "></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full  w-12 mx-auto"></div>
        </div>
        <span className="sr-only">Loading...</span>
    </div>
}


function Rolehaspermissionlist(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [allPermissions, setAllPermissions] = useState([])
    const [rolePermissions, setRolePermissions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAltered, setIsAltered] = useState(false)
    const [processing, setProcessing] = useState(false)

    function fetchData() {
        setIsLoading(true)
        Api.get(`roles/${props.roleName}/permissions`)
            .then(res => {
                setAllPermissions(res.data.permissions)
                setRolePermissions(res.data.rolePermissions)
                setIsLoading(false)
            }).catch(err => console.log(err))
    }

    function ApplyNewPermissions() {
        setProcessing(true)
        Api.post('/roles/permissions/new', {
            'roleName': props.roleName,
            'permissions': rolePermissions
        }).then(res => {
            console.log(res.data)
            setProcessing(false)
            setIsAltered(false)
            enqueueSnackbar('New permissions synced to role', { variant: 'success' })
        }).catch(err => {
            console.log(err.response)
            enqueueSnackbar(err?.response?.data?.message, { variant: 'error' })
            setProcessing(false)
        })
    }

    const togglePermission = (r_permission) => {
        rolePermissions.includes(r_permission) ? setRolePermissions(cv => cv = cv.filter(el => el !== r_permission)) :
            setRolePermissions(cv => cv = [...cv, r_permission])
            ;
        setIsAltered(true)
    }

    const checkStatus = useCallback((r_permission) => rolePermissions.includes(r_permission), [rolePermissions])


    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div className=' min-h-max w-full overflow-y-scroll pb-4'>
            <div className="grid grid-cols-2 sticky z-30 top-0 p-4 text-sm font-medium text-gray-900 bg-gray-100 border-t border-b border-gray-200 gap-x-16 ">
                <div className="flex items-center justify-center">Permissions</div>
                <div className='text-center'>Status</div>
            </div>

            {!isLoading && allPermissions && allPermissions.map((permission, i) => {
                return (
                    <React.Fragment key={i}>
                        <div className="grid grid-cols-2 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 ">
                            <div className="text-gray-800 w-full mx-auto flex items-center justify-center ">{permission} </div>
                            <div className=' mx-auto flex items-center justify-center w-full'>
                                <Switch checked={checkStatus(permission)} onChange={(e) => togglePermission(permission)} />
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
            {isAltered && <nav className='grid grid-cols-1 mt-auto px-4 w-full'>
                <Button processing={processing} onClick={ApplyNewPermissions} text="Sync new permissions " ClassName=" w-full" />
            </nav>}
            {isLoading && <div>
                {[...new Array(10)].map((value, i) => {
                    return (<Loader key={i} />)
                })}
            </div>}

        </div>

    )
}

export default Rolehaspermissionlist