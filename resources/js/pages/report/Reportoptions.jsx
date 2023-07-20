import React from 'react'
import Optioncard from './partials/Optioncard'
import Addmotion from '../../components/Addmotion'
function Reportoptions({ setCurrentComponent }) {

    const handleOnReportSelected = (selected) => {
        setCurrentComponent(selected)
    }
    return (
        <>
            <Addmotion>
                <fieldset className=' max-w-6xl mt-5 mx-auto   bg-white shadow-medium border-gray-300 rounded-md p-1 md:p-5 min-h-[50px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    <legend className=' bg-white px-2 rounded-md '>Available Report Options</legend>
                    <Optioncard reportOption={'Productsalesreport'} onClick={handleOnReportSelected} caption="PRODUCT SALE REPORT" className='bg-info-100' />
                    <Optioncard reportOption={'Incomestatment'} onClick={handleOnReportSelected} caption="INCOME STATEMENT" className='bg-emerald-100' />
                </fieldset>
            </Addmotion>
        </>
    )
}

export default Reportoptions