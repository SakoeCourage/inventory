import React, { useEffect, useState } from 'react'
import Api from '../../api/Api'
import Userstable from './partials/Userstable'
import Userform from './partials/Userform'
import { Icon } from '@iconify/react'
import SideModal from '../../components/layout/sideModal'
import Button from '../../components/inputs/Button'
import { Card } from '@mui/material'

function Allusers() {
    const [data, setData] = useState([])
    const [filters, setFilters] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [searchKey, setSearchKey] = useState(null)
    const [roles, setRoles] = useState(null)
    const [showUserForm, setShowUserForm] = useState({
        id: null,
        mode: null
      })
    const fetchUsersData = (url) => {
        setIsLoading(true)
        Api.get(url ?? '/user/all')
            .then(res => {
                console.log(res.data)
                const { users, filters } = res.data
                setData(users)
                setFilters(filters)
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleUserSearch =()=>{
        if(searchKey){
            fetchUsersData(`/user/all?search=${searchKey}`)
        }
    }
    const handleClose=()=>{
        setShowUserForm({
            id:null,
            mode:null
        })
    }

    const fetchRoles=()=>{
        Api.get('/toselect/roles')
        .then(res=>{
            setRoles(res.data.roles)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    useEffect(() => {
        fetchUsersData()
        fetchRoles()
    }, [])

    return (
        <div className='text-sm h-max '>
        <div className='bg-info-600 h-[35vh] px-10 overflow-visible '>
          <div className='max-w-6xl mx-auto h-full '>
            <h3 className='pb-3 text-info-100 ml-4 text-lg '><span className="mr-4">All Users</span>
              <Icon icon="bi:plus-circle" />
            </h3>
            <Card className='py-6 pb-36'>
              <div className='flex justify-between items-center px-6 pb-6'>
                <div className="flex items-center gap-3">
                  <div className='border rounded-lg flex items-center justify-between w-96'>
                    <input onKeyDown={(e) => { e.key === 'Enter' && handleUserSearch() }} className='bg-transparent outline-none px-4 w-full' placeholder='Search user...' value={searchKey} onChange={(e) => setSearchKey(e.target.value)} type="search" />
                    <button onClick={() => handleUserSearch()} className='bg-gray-300 px-3 py-2 grid place-content-center text-gray-600'>
                      <Icon icon="ic:round-search" fontSize={30} />
                    </button>
                  </div>
                  {filters?.search != null && <Button
                    onClick={() => { setSearchKey(''); fetchUsersData() }}
                    text="reset"
                  />}
                </div>
                <Button onClick={() => setShowUserForm(cv => cv = { ...cv, mode: "New User" })} info >
                  <div className='flex items-center gap-2 text-xs'>
                    <Icon icon="ph:user-plus" fontSize={22} />
                    <span>Add New User</span>
                  </div>
                </Button>
  
              </div>
              <Userstable
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setFilters={setFilters}
                filters={filters}
                fetchUsersData={fetchUsersData}
                setData={setData}
                data={data}
                setShowUserForm={setShowUserForm}
              />
            </Card>
          </div>
        </div>
        <SideModal
          open={showUserForm.mode}
          title={showUserForm.mode}
          onClose={() => handleClose()}
          showDivider
          maxWidth="xl"
          showClose
        >
          <Userform roles={roles} fetchUsersData={fetchUsersData}  showUserForm={showUserForm}  onClose={() => handleClose()} />
        </SideModal>
      </div>
    )
}

export default Allusers