import React, { useEffect, useRef, useState } from 'react'

function Productspopup({ children, Caption, className }) {
    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const popup = useRef(null)

    const handleHover = (e) => {
        const { clientX, clientY } = e;
        const windowHeight = window.innerHeight;
        const popupHeight = 200;
        const spaceBelow = windowHeight - clientY;
        const spaceAbove = clientY;


        let topPosition = clientY;
        if (spaceBelow < popupHeight && spaceAbove > popupHeight) {
            topPosition = clientY - popupHeight;
        }

        setPopupPosition({ x: clientX, y: topPosition });
        setShowPopup(true);
    };


    const handleMouseLeave = () => {
        setShowPopup(false);
    };



    return (
        <div onMouseLeave={handleMouseLeave}>
            <div className=' w-max'
                onMouseEnter={handleHover}>
                {Caption}
            </div>
            {showPopup && (
                <div className={` bg-white shadow-medium  rounded-md hidescroll w-max ${className}`} ref={popup}
                    style={{
                        position: 'fixed',
                        top: popupPosition.y + 5,
                        left: popupPosition.x + 5,
                        backgroundColor: 'white',
                        maxHeight: '200px',
                        overflowY: 'scroll'
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}


export default Productspopup