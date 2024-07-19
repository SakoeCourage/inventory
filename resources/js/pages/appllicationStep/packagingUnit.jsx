import React, { useEffect, useState } from 'react'
import { Card } from '@mui/material'
import { Icon } from '@iconify/react'
import Button from '../../components/inputs/Button'
import Api from '../../api/Api'
import BasicUnitTable from './basicUnitPartials/BasicUnitTable'
import NewBasicUnitForm from './basicUnitPartials/NewBasicUnitForm'
import SideModal from '../../components/layout/sideModal'
import PackagingUnitTable from './packagingUnitPartials/PackagingUnitTable'
import NewPackagingUnitForm from './packagingUnitPartials/NewPackagingUnitForm'


function PackagingUnit() {
    const [searchKey, setSearchKey] = useState(null)
    const [data, setData] = useState([])
    const [filters, setFilters] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPackagingUnitForm, setShowPackagingUnitForm] = useState({
        type: null,
        id: null,
        mode: null
    })

    const fetchPackagingUnitTable = (url) => {
        setIsLoading(true)
        Api.get(url ?? '/packaging-unit/all').then(res => {
            const { packages, filters } = res.data
            setData(packages)
            setFilters(filters)
            setIsLoading(false)
        })
            .catch(err => {
                console.log(err)
            })
    }

    const handleBranchSearch = () => {
        if (searchKey) {
            fetchPackagingUnitTable('/packaging-unit/all?search=' + searchKey)
        }
    }

    const handleClose = () => {
        setShowPackagingUnitForm({
            type: null,
            id: null,
            mode: null
        })
    }

    useEffect(() => {
        fetchPackagingUnitTable();
    }, [])


    return (
        <div className='text-sm h-max '>
            <div className='bg-info-900/90 h-[35vh] md:px-10 overflow-visible '>
                <div className='max-w-6xl mx-auto h-full '>
                    <h3 className='pb-3 text-info-100 ml-4 text-lg '><span className="mr-4">Package Selling Quantity Definition</span>
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
                                    onClick={() => { setSearchKey(''); fetchPackagingUnitTable() }}
                                    text="reset"
                                />}
                            </div>
                            <Button className="w-full  my-auto md:w-auto" onClick={() => setShowPackagingUnitForm(cv => cv = { ...cv, mode: "New Packaging Selling Quantity" })} info >
                                <div className='flex items-center gap-2 text-xs'>
                                    <Icon icon="carbon:tag-group" fontSize={22} />
                                    <span>Add A Packaging Unit</span>
                                </div>
                            </Button>

                        </div>
                        <PackagingUnitTable
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            setFilters={setFilters}
                            filters={filters}
                            fetchPackagingUnitTable={fetchPackagingUnitTable}
                            setData={setData}
                            data={data}
                            setShowPackagingUnitForm={setShowPackagingUnitForm}
                        />
                    </Card>
                </div>
            </div>
            <SideModal
                open={showPackagingUnitForm.mode}
                title={showPackagingUnitForm.mode}
                onClose={() => handleClose()}
                showDivider
                maxWidth="xl"
                showClose
            >
                <NewPackagingUnitForm
                    fetchPackagingUnitTable={fetchPackagingUnitTable}
                    showPackagingUnitForm={showPackagingUnitForm}
                    onClose={() => handleClose()}
                />
            </SideModal>
        </div>
    )
}

export default PackagingUnit