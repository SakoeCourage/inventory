import React from 'react'

function Loadingwheel() {
    return (

        <div className=" fixed max-h-[screen] inset-0  flex items-start z-50  isolate ">
            <div className="loadingwheel ">
                <div className="loadingBar"></div>
            </div>
        </div>

    )
}

export default Loadingwheel