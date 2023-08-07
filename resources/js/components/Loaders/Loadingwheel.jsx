import React from 'react'

function Loadingwheel() {
    return (

        <div className=" fixed  inset-x-0 top-0 h-max  flex items-start z-50  isolate ">
            <div className="loadingwheel ">
                <div className="loadingBar"></div>
            </div>
        </div>

    )
}

export default Loadingwheel