import React from 'react'
import useForm from '../../../../hooks/useForm'
import FormInputText from '../../../../components/inputs/FormInputText'
import Button from '../../../../components/inputs/Button'
import Api from '../../../../api/Api'
import { enqueueSnackbar } from 'notistack'

function SaleCollectorView({
    sale_id, customer_name, customer_contact,
    invoice_id,
    onSuccess
}) {
    const { data, setData, errors, post, processing } = useForm({
        collector_name: null,
        collector_phone: null,
        sale_id: sale_id
    })

    const handleOnMarkAsCollected = () => {
        post("/sale/mark-as-collected",
            {
                onSuccess: () => {
                    enqueueSnackbar({ variant: "success", message: "Product marked as collected" })
                    onSuccess()
                },
                onError: () => {
                    enqueueSnackbar({ variant: "error", message: "Failed to mark sale as collected" })
                }
            }
        )
    }

    const handleOnMarkAsCollectedByCustomer = () => {
        setData('collector_name', customer_name);
        setData('collector_phone', customer_contact)
    }

    return (
        <div>
            <nav className='text-xs bg-info-200 text-info-900 p-5 rounded'>
                <h6>
                    {invoice_id}
                </h6>
                <h6 className='text-inherit text-xs'>
                    Please Provide <strong>Collectors</strong> information
                    to continue or <strong>use collected by customer</strong> if collection is done by
                    original customer
                </h6>
                <Button onClick={() => handleOnMarkAsCollectedByCustomer()} info>
                    <nav className='!text-xs'>
                        Collected by Customer
                    </nav>
                </Button>
            </nav>
            <nav className="py-5 flex border-t border-t-gray-300 mt-3 flex-col gap-3">
                <nav className='text-gray-500'>
                    Collector Details
                </nav>
                <FormInputText
                    InputLabelProps={{
                        shrink: data?.collector_name,
                    }}
                    error={errors['collector_name']}
                    value={data.collector_name}
                    onChange={(e) => setData("collector_name", e.target.value)}
                    label="Collector Name"
                />
                <FormInputText
                    error={errors['collector_phone']}
                    InputLabelProps={{
                        shrink: data?.collector_phone,
                    }}
                    value={data.collector_phone}
                    onChange={(e) => setData("collector_phone", e.target.value)}
                    label="Collecor Phone"
                />
                <Button onClick={() => handleOnMarkAsCollected()} className="">
                    Proceed as collected
                </Button>
            </nav>
        </div>
    )
}

export default SaleCollectorView