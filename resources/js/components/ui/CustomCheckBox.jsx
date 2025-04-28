import React from 'react'



const CustomCheckBox = ({ checked = false, onClick }) => {
    return (
        <div onClick={onClick} role='botton' className="checkbox-wrapper-46">
            <input   checked={checked} type="checkbox" id="cbx-46" className="inp-cbx" />
            <label for="cbx-46" className="cbx"
            ><span>
                    <svg viewBox="0 0 12 10" height="10px" width="12px">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span>
            </label>
        </div>

    )
}

export default CustomCheckBox