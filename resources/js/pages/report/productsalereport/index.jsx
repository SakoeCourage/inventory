import React, { useEffect, useState } from 'react'
import Salereportparameter from './Salereportparameter'
import Collationmethod from './Collationmethod'

const components = {
    Salereportparameter: Salereportparameter,
    Collationmethod: Collationmethod
}
function index({ setCurrentComponent: setParentComponent }) {
    const [currentComponent, setCurrentComponent] = useState('Salereportparameter')
    const [fullUrl, setFullUrl] = useState(null)
    const [data, setData] = useState([])
    const [nextPageUrl, setnextPageUrl] = useState(null)
    const [productsFromDB, setProductsFromDB] = useState([])
    const [scrollY, setScrollY] = useState(0)
    const [formData, setFormData] = useState({
        range: 'day',
        start_date: null,
        end_date: null,
        product_ids: [],
        collation_method: ''
    })

    const handleOnValueChange = (k, v) => {
        if (Array.isArray(k) && typeof v === 'undefined') {
            const updatedFormData = { ...formData };
            k.forEach((keyValuePair) => {
                const [key, value] = Object.entries(keyValuePair)[0];
                updatedFormData[key] = value;
            });
            setFormData(updatedFormData);
        } else {
            setFormData({ ...formData, [k]: v });
        }
    };

 

    const Component = components[currentComponent]

    return (
        <div className=' max-w-6xl mx-auto'>
            <Component
                data={data}
                setData={setData}
                nextPageUrl={nextPageUrl}
                setProductsFromDB={setProductsFromDB}
                productsFromDB={productsFromDB}
                setnextPageUrl={setnextPageUrl}
                setFullUrl={setFullUrl}
                fullUrl={fullUrl}
                scrollY={scrollY}
                setScrollY={setScrollY}
                formData={formData}
                setFormData={handleOnValueChange}
                setParentComponent={setParentComponent}
                setCurrentComponent={setCurrentComponent}
            />
        </div>
    )
}

export default index