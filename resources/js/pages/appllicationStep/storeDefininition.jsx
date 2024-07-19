import React, { useEffect, useState } from 'react'
import { Card } from '@mui/material'
import { Icon } from '@iconify/react'
import SideModal from '../../components/layout/sideModal'
import Button from '../../components/inputs/Button'
import Api from '../../api/Api'
import StoreTable from './storepartials/StoreTable'
import NewStoreForm from './storepartials/NewStoreForm'
import { SnackbarProvider, useSnackbar } from 'notistack'
import FormInputSelect from '../../components/inputs/FormInputSelect'
import { addOrUpdateUrlParam } from '../../api/Util'

function StoreDefinition() {
    const [searchKey, setSearchKey] = useState(null)
    const [data, setData] = useState([])
    const [filters, setFilters] = useState(null)
    const [fullUrl, setFullUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showStoreForm, setShowStoreForm] = useState({
        branch_name: null,
        id: null,
        mode: null
    })

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    /**
     * @typedef storeBranchesType
     * @property  {string} branch_name 
     * @property  {number} id 
     */

    /**
     * @type {[storeBranchesType[],React.Dispatch<React.SetStateAction<storeBranchesType[]>>]}
     */
    const [storeBranches, setStoreBranches] = useState([])

    const fetchStoreTable = (url) => {
        setIsLoading(true)
        Api.get(url ?? '/store/all').then(res => {
            const { stores, filters,full_url } = res.data
            setData(stores)
            setFilters(filters)
            setIsLoading(false)
            setFullUrl(full_url)
        })
            .catch(err => {
                console.log(err)
            })
    }

    const handleStoreSearch = () => {
        if (searchKey) {
            fetchStoreTable('/store/all?search=' + searchKey)
        }
    }

    const handleClose = () => {
        setShowStoreForm({
            branch_name: null,
            id: null,
            mode: null
        })
    }

    const fetchAvailableBranchesAsync = async () => {
        try {
            var branches = await Api.get('toselect/branches')
            setStoreBranches(branches?.data)
        } catch (error) {
            enqueueSnackbar('Failed to load branch list', { variant: 'error' })
        } finally {
        }
    }

    useEffect(() => {
        fetchStoreTable();
        fetchAvailableBranchesAsync()
    }, [])


    return (
        <div className='text-sm h-max '>
            <div className='bg-info-900/90 h-[35vh] md:px-10 overflow-visible '>
                <div className='max-w-6xl mx-auto h-full '>
                    <h3 className='pb-3 text-info-100 ml-4 text-lg '><span className="mr-4">Store Definition</span>
                        <Icon icon="bi:plus-circle" />
                    </h3>
                    <Card className='py-6 pb-36'>
                        <div className='flex flex-col md:flex-row gap-3  justify-between items-center px-6 pb-6'>
                            <div className="flex grow items-center flex-col md:flex-row gap-3 w-full ">
                                <div className='border rounded-lg flex items-center justify-between !w-full md:!w-96'>
                                    <input onKeyDown={(e) => { e.key === 'Enter' && handleStoreSearch() }} className='bg-transparent outline-none px-4 w-full' placeholder='Search category...' value={searchKey} onChange={(e) => setSearchKey(e.target.value)} type="search" />
                                    <button onClick={() => handleStoreSearch()} className='bg-gray-300 px-3 py-2 grid place-content-center text-gray-600'>
                                        <Icon icon="ic:round-search" fontSize={30} />
                                    </button>
                                </div>
                                {filters?.search != null && <Button
                                    onClick={() => { setSearchKey(''); fetchStoreTable() }}
                                    text="reset"
                                />}
                                <FormInputSelect className="w-full md:w-56 "
                                    type="text"
                                    value={filters?.branch}
                                    label="Filter by Branch"
                                    options={Boolean(storeBranches?.length) ?
                                        storeBranches.map(br => ({ name: br.branch_name, value: br.id })) : []
                                    }
                                    name="Branch"
                                    onChange={(e) =>{fullUrl && fetchStoreTable(addOrUpdateUrlParam(fullUrl,'branch',e.target.value))}}
                                    
                                />
                            </div>

                            <Button className="w-full  my-auto md:w-auto" onClick={() => setShowStoreForm(cv => cv = { ...cv, mode: "New Store" })} info >
                                <div className='flex items-center gap-2 text-xs'>
                                    <Icon icon="carbon:tag-group" fontSize={22} />
                                    <span>Add A Store</span>
                                </div>
                            </Button>
                        </div>
                        <StoreTable
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            setFilters={setFilters}
                            filters={filters}
                            fetchStoreTable={fetchStoreTable}
                            setData={setData}
                            data={data}
                            setShowStoreForm={setShowStoreForm}
                        />
                    </Card>
                </div>
            </div>
            <SideModal
                open={showStoreForm.mode}
                title={showStoreForm.mode}
                onClose={() => handleClose()}
                showDivider
                maxWidth="xl"
                showClose
            >
                <NewStoreForm
                    fetchStoreTable={fetchStoreTable}
                    showStoreForm={showStoreForm}
                    onClose={() => handleClose()}
                />
            </SideModal>
        </div>
    )
}

export default StoreDefinition