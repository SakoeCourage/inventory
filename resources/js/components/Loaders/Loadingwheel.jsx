import React from 'react'

function Loadingwheel() {
    return (

        <div className=" fixed max-h-[screen] inset-0  flex items-start z-50 bg-gray-100/10 isolate backdrop-blur-[1px]">
            <div className="loadingwheel ">
                <div className="loadingBar"></div>
            </div>
        </div>

    )
}

export default Loadingwheel