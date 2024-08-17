import { Card } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import IconifyIcon from '../../components/ui/IconifyIcon'
import { Link } from 'react-router-dom'
import Emptyresults from '../../components/inputs/Emptyresults'



const setupList = [
    {
        iconElement: <IconifyIcon className=" !h-14 !w-14 !bg-green-900 text-green-100 !rounded-md" fontSize='10rem' icon="dashicons:products" />,
        path: "/app-setup/products/definition",
        name: "Product Setup",
        description: " Define and setup store products and the pricing model."
    },
    {
        iconElement: <IconifyIcon className=" !h-14 !w-14 !bg-blue-900 text-blue-100 !rounded-md" fontSize='10rem' icon="bxs:category" />,
        path: "/app-setup/products/categories",
        name: "Product Categories",
        description: "Define name of various cateogories of products"
    },
    {
        iconElement: <IconifyIcon className=" !h-14 !w-14 !bg-orange-900 text-orange-100 !rounded-md" fontSize='10rem' icon="heroicons:users-solid" />,
        path: "/app-setup/products/suppliers",
        name: "Product Suppliers",
        description: "Define name and contact of suppliers of store products"
    },
    {
        iconElement: <IconifyIcon className=" !h-14 !w-14 !bg-rose-900 text-rose-100 !rounded-md" fontSize='10rem' icon="eos-icons:package" />,
        path: "/app-setup/selling-unit/packaging",
        name: "Packaging Unit",
        description: "Setup various way your products are packaged e.g crates, pieces etc"
    },
    {
        iconElement: <IconifyIcon className=" !h-14 !w-14 !bg-sky-900 text-sky-100 !rounded-md" fontSize='10rem' icon="material-symbols:climate-mini-split" />,
        path: "/app-setup/selling-unit/basic",
        name: "Basic Units of Sale",
        description: "Setup various Basic Unit of Sale of Your products"
    },

    {
        iconElement: <IconifyIcon className=" !h-14 !w-14 !bg-indigo-900 text-indigo-100 !rounded-md" fontSize='10rem' icon="material-symbols:store" />,
        path: "/app-setup/store/definition",
        name: "Store Setup",
        description: "Setup all available stores where your business operates"
    },
    {
        iconElement: <IconifyIcon className=" !h-14 !w-14 !bg-violet-900 text-violet-100 !rounded-md" fontSize='10rem' icon="solar:branching-paths-down-bold" />,
        path: "/app-setup/branch/definition",
        name: "Store Locations",
        description: "Setup Locations of your stores"
    },
    {
        iconElement: <IconifyIcon className=" !h-14 !w-14 !bg-red-900 text-red-100 !rounded-md" fontSize='10rem' icon="ion:card" />,
        path: "/app-setup/expense/definition",
        name: "Expense Definition",
        description: "Define name of expenses of the store"
    },
    {
        iconElement: <IconifyIcon className=" !h-14 !w-14 !bg-yellow-900 text-yellow-100 !rounded-md" fontSize='10rem' icon="mdi:business-card" />,
        path: "/app-setup/businessprofile/definition",
        name: "Business Profile",
        description: "Define details of your business to your audience"
    }
]

const SetUpItemCard = ({ iconElement, path, name, description }) => {
    return <div className='settings-card rounded-md flex bg-white'>
        <nav className=' p-5 gap-4 flex h-full w-full flex-col justify-between'>
            <nav className='flex  items-start justify-between'>
                {iconElement}
                <nav className='flex items-center gap-2 ml-auto'>
                    <Link to={path} target='_blank' className='text-gray-600'>Open in new tab</Link>
                    <IconifyIcon
                        className="!h-5 !w-5"
                        icon="quill:link-out"
                    />
                </nav>
            </nav>

            <nav className='flex flex-col gap-2 !grow'>
                <h1 className=' font-semibold text-base text-gray-700'>
                    {name}
                </h1>
                <p className='text-xs text-[0.8rem]'>
                    {description}
                </p>
            </nav>

            <Link to={path} className='pt-3 mt-3 font-semibold text-base text-gray-500 hover:!font-bold hover:!text-info-600  !justify-self-end border-t flex items-center gap-3 border-gray-300'>
                <IconifyIcon className="!p-0 !h-6 !w-6" icon="bi:gear" />
                <h6 className='my-auto text-inherit '>
                    Manage
                </h6>
            </Link>
        </nav>
    </div>
}

function SetupCategoryScreen() {
    const [setttingslist, setSettingsList] = useState(setupList)

    const handleOnSettingsSearch = (sk) => {
        if (!sk) {
            setSettingsList(setupList);
        } else {
            const filteredList = setupList.filter(item =>
                item.name.toLowerCase().includes(sk.toLowerCase())
            );
            setSettingsList(filteredList);
        }
    };


    return (
        <div className='text-sm h-max '>
            <div className='bg-info-900/90 h-[25vh] mb-5 flex flex-col items-end md:px-10 overflow-visible '>
                <div className='container px-7 flex flex-col sm:flex-row w-full items-center justify-between mx-auto mt-auto h-max py-3'>
                    <div className=' '>
                        <h3 className=' text-info-100 text-lg flex items-center '>
                            <IconifyIcon icon="bi:gear" />
                            <span className="mr-4 text-xl uppercase">App Setup</span>
                        </h3>
                    </div>
                    <div className={`w-full max-w-md rounded-lg mb-1 border focus-within:ring-2 focus-within:ring-info-200 transition-all duration-500 focus-within:border-none bg-white border-gray-400/70 flex items-center px-2 `}>
                        <Icon icon="ic:round-search" fontSize={30} className=' text-gray-700' />
                        <input onChange={(e) => handleOnSettingsSearch(e.target.value)} autoComplete='off' placeholder='Search Settings' id="setup-search-bar" type="search" name="" className='w-full text-gray-700 pl-1 pr-5 py-4 rounded-t-lg border-none outline-none bg-white focus:outline-none focus:border-none' />
                    </div>
                </div>
            </div>
            {Boolean(setttingslist?.length) ?
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 container mx-auto p-7'>
                    {setttingslist?.map((setup, i) => <SetUpItemCard key={i} {...setup} />)}
                </div> :
                <div className="flex items-center min-h-full justify-center">
                    <Emptyresults />
                </div>
            }

        </div>
    )
}

export default SetupCategoryScreen