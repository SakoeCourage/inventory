import React from 'react'
// import invoice from "../../assets/invoice.png"
// import chart from "../../assets/chart.png"
import pic from "../../assets/concept.png"

const Info = () => {
    return (
        <div className='flex justify-center items-center h-full'>
            <div>
                <h2>Easily - Track your Inventory, detailed and </h2>
                <h3 className='text-info-500'>well-organized</h3>
                <span>Let Inventory-Lite hanlde your inventory</span>
                {/* <div className='mt-10'>
                    <img src={invoice} alt="pic" loading='lazy' className='w-[450px]' />
                </div>
                <div className='rekative'>
                    <div className='bg-white shadow-md rounded-md  absolute -translate-y-20 translate-x-72'>
                        <img src={chart} alt="pic" loading='lazy' className='w-[300px]' />

                    </div>

                </div> */}
                <div>
                    <img src={pic} className='w-full'/>
                </div>
            </div>
        </div>
    )
}

export default Info
