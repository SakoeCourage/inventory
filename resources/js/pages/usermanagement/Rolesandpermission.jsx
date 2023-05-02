import React, { useEffect, useState } from 'react'
import Api from '../../api/Api'
import Roleform from './partials/Roleform'
import { Icon } from '@iconify/react'
import SideModal from '../../components/layout/sideModal'
import Button from '../../components/inputs/Button'
import { Card } from '@mui/material'
import Rolestable from './partials/Rolestable'
import Rolehaspermissionlist from './partials/Rolehaspermissionlist'

function Rolesandpermission() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showRoleForm, setShowRoleForm] = useState({
    id: null,
    mode: null,
    name: null
  })
  const [showRolePermissionList, setShowRolePermissionList] = useState(null)

  const fetchRolesData = () => {
    setIsLoading(true)
    Api.get('/roles/all')
      .then(res => {
        console.log(res.data?.roles)
        setData(res.data?.roles)
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }


  const handleClose = () => {
    setShowRoleForm({
      id: null,
      mode: null,
      name: null
    })
  }



  useEffect(() => {
    fetchRolesData()
  }, [])

  return (
    <div className='text-sm h-max '>
      <div className='bg-info-600 h-[35vh] px-10 overflow-visible '>
        <div className='max-w-6xl mx-auto h-full '>
          <h3 className='pb-3 text-info-100 ml-4 text-lg '><span className="mr-4">All Roles</span>
            <Icon icon="bi:plus-circle" />
          </h3>
          <Card className='py-6 pb-36'>
            <div className='flex justify-end items-center px-6 pb-6'>
              <Button onClick={() => setShowRoleForm(cv => cv = { ...cv, mode: "New Role" })} info >
                <div className='flex items-center gap-2 text-xs'>
                  <Icon icon="carbon:user-role" fontSize={22} />
                  <span>Add New Role</span>
                </div>
              </Button>
            </div>
            <Rolestable
              setShowRolePermissionList={setShowRolePermissionList}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              fetchRolesData={fetchRolesData}
              setData={setData}
              data={data}
              setShowRoleForm={setShowRoleForm}
            />
          </Card>
        </div>
      </div>
      {/* Create or update modal */}
      <SideModal
        open={showRoleForm.mode}
        title={showRoleForm.mode}
        onClose={() => handleClose()}
        showDivider
        maxWidth="xl"
        showClose
      >
        <Roleform fetchRolesData={fetchRolesData} showRoleForm={showRoleForm} onClose={() => handleClose()} />
      </SideModal>

      {/* Roles Permission modal */}
      <SideModal
        open={showRolePermissionList}
        title={`${showRolePermissionList}'s permissions`}
        onClose={() => setShowRolePermissionList(null)}
        showDivider
        maxWidth="xl"
        showClose
      >
        <Rolehaspermissionlist roleName={showRolePermissionList} onClose={() => setShowRolePermissionList(null)} />
      </SideModal>
    </div>
  )
}

export default Rolesandpermission