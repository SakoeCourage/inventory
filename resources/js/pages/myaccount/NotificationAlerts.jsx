import React, { useEffect } from 'react'
import Formhook from '../../components/formcomponents/formhook'
import Button from '../../components/inputs/Button'
import { enqueueSnackbar } from 'notistack'
import { AccessByPermission } from '../authorization/AccessControl'


const NotificationGroupItem = ({ title, description, checked, onCheckTogle }) => {
    return <div className='flex items-start gap-2'>
        <input onClick={onCheckTogle} checked={checked} type="checkbox" className='accent-info-700 mt-1 rounded-md ' name="notification" id="notification" />
        <nav className='flex items-start justify-start gap-1 flex-col leading-0'>
            <label htmlFor="notification" className=''>
                <strong className=' text-sm font-normal'>
                    {title}
                </strong>
            </label>
            <p className='text-xs text-gray-500'>
                {description}
            </p>
        </nav>
    </div>
}
const NotificationAlerts = ({ userData, setComponent, fetchData }) => {
    const { settings } = userData
    const { data, setData, post, processing } = Formhook({
        settings: settings ?? {}
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/user/settings/create-or-new', {
            onError: (err) => enqueueSnackbar({ message: "Failed to save changes", variant: "error" }),
            onSuccess: (mess) => enqueueSnackbar({ message: "Changes saved succesfully", variant: "success" })
        })
    }

    useEffect(() => {
        if (settings == null) return;
        setData({
            settings: settings
        })
    }, [settings])

    return (
        <div className='max-w-4xl mx-auto py-5 md:py-7  border-y border-gray-300'>
            <div className='flex items-start max-w-2xl gap-10 justify-between '>
                <div className='hidden md:block'>
                    <strong className='text-gray-500'>
                        Email Notifications
                    </strong>
                </div>
                <div className='flex flex-col md:grow-0 gap-10'>

                    <AccessByPermission abilities={['authorize expense']}>
                        <NotificationGroupItem
                            onCheckTogle={() => setData('settings.mail_setting.new_expense_request', !data?.settings?.mail_setting?.new_expense_request)}
                            title={'New Expenses'}
                            description={'Check if you want to be notified when new expenses submitted'}
                            checked={data?.settings?.mail_setting?.new_expense_request}
                        />
                    </AccessByPermission>
                    <AccessByPermission abilities={['manage stock data', 'generate product order']}>
                        <NotificationGroupItem
                            title={'New Invoice'}
                            description={'Check if you want to be notified when new invoices are created'}
                            onCheckTogle={() => setData('settings.mail_setting.new_invoice', !data?.settings?.mail_setting?.new_invoice)}
                            checked={data?.settings?.mail_setting?.new_invoice}
                        />
                    </AccessByPermission>
                    <AccessByPermission abilities={['manage stock data']}>
                        <NotificationGroupItem
                            title={'Stock Reduction'}
                            description={'Check if you want to be notified when a product stock is reduced'}
                            onCheckTogle={() => setData('settings.mail_setting.stock_reduction', !data?.settings?.mail_setting?.stock_reduction)}
                            checked={data?.settings?.mail_setting?.stock_reduction}
                        />
                    </AccessByPermission>
                    <AccessByPermission abilities={['manage stock data']}>
                        <NotificationGroupItem
                            title={'Stock Alerts'}
                            description={'Check if you want to be notified about product stock levels'}
                            checked={data?.settings?.mail_setting?.out_of_stock}
                            onCheckTogle={() => setData('settings.mail_setting.out_of_stock', !data?.settings?.mail_setting?.out_of_stock)}
                        />
                    </AccessByPermission>


                    <Button disabled={processing} onClick={handleSubmit} info>
                        Save Change
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotificationAlerts