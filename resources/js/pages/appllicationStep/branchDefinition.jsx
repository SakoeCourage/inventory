import React, { useEffect, useState } from 'react'
import BranchTable from './branchpartials/BranchTable'
import { Card } from '@mui/material'
import { Icon } from '@iconify/react'
import SideModal from '../../components/layout/sideModal'
import Button from '../../components/inputs/Button'
import Api from '../../api/Api'
import NewBranchForm from './branchpartials/NewBranchForm'


function branchDefinition() {
    const [searchKey, setSearchKey] = useState(null)
    const [data, setData] = useState([])
    const [filters, setFilters] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showBranchForm, setShowBranchForm] = useState({
        branch_name: null,
        id: null,
        mode: null
    })

    const fetchBranchedTable = (url) => {
        setIsLoading(true)
        Api.get(url ?? '/branch/all').then(res => {
            const { branches, filters } = res.data
            setData(branches)
            setFilters(filters)
            setIsLoading(false)
            console.log(branches)
        })
            .catch(err => {
                console.log(err)
            })
    }

    const handleBranchSearch = () => {
        if (searchKey) {
            fetchBranchedTable('/branch/all?search=' + searchKey)
        }
    }

    const handleClose = () => {
        setShowBranchForm({
            branch_name: null,
            id: null,
            mode: null
        })
    }

    useEffect(() => {
        fetchBranchedTable();
    }, [])


    return (
        <div className='text-sm h-max '>
            <div className='bg-info-900/90 h-[35vh] md:px-10 overflow-visible '>
                <div className='max-w-6xl mx-auto h-full '>
                    <h3 className='pb-3 text-info-100 ml-4 text-lg '><span className="mr-4">Store Location Setup</span>
                        <Icon icon="bi:plus-circle" />
                    </h3>
                    <Card className='py-6 pb-36'>
                        <div className='flex flex-col md:flex-row gap-3  justify-between items-center px-6 pb-6'>
                            <div className="flex grow items-center flex-col md:flex-row gap-3 w-full ">
                                <div className='border rounded-lg flex items-center justify-between !w-full md:!w-96'>
                                    <input onKeyDown={(e) => { e.key === 'Enter' && handleBranchSearch() }} className='bg-transparent outline-none px-4 w-full' placeholder='Search category...' value={searchKey} onChange={(e) => setSearchKey(e.target.value)} type="search" />
                                    <button onClick={() => handleBranchSearch()} className='bg-gray-300 px-3 py-2 grid place-content-center text-gray-600'>
                                        <Icon icon="ic:round-search" fontSize={30} />
                                    </button>
                                </div>
                                {filters?.search != null && <Button
                                    onClick={() => { setSearchKey(''); fetchBranchedTable() }}
                                    text="reset"
                                />}
                            </div>
                            <Button className="w-full  my-auto md:w-auto" onClick={() => setShowBranchForm(cv => cv = { ...cv, mode: "New Branch" })} info >
                                <div className='flex items-center gap-2 text-xs'>
                                    <Icon icon="carbon:tag-group" fontSize={22} />
                                    <span>Add A Location</span>
                                </div>
                            </Button>
                        </div>
                        <BranchTable
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            setFilters={setFilters}
                            filters={filters}
                            fetchBranchedTable={fetchBranchedTable}
                            setData={setData}
                            data={data}
                            setShowBranchForm={setShowBranchForm}
                        />
                    </Card>
                </div>
            </div>
            <SideModal
                open={showBranchForm.mode}
                title={showBranchForm.mode}
                onClose={() => handleClose()}
                showDivider
                maxWidth="xl"
                showClose
            >
                <NewBranchForm
                    fetchBranchedTable={fetchBranchedTable}
                    showBranchForm={showBranchForm}
                    onClose={() => handleClose()}
                />
            </SideModal>
        </div>
    )
}

export default branchDefinition