import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import Api from '../../../api/Api'
import Button from '../../../components/inputs/Button'
import Selectedproductslist from './Selectedproductslist'
import { useSnackbar } from 'notistack'
function Salereportproducts({ formData, setFormData, setProductsFromDB, productsFromDB, data, setData, setFullUrl, setnextPageUrl, nextPageUrl, scrollY, setScrollY }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [processing, setProcessing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const scrollingContainer = useRef()

    const updateOrSetProductsFromDb = (newData) =>{
        setProductsFromDB((prevProducts) => {
            const existingProductIds = prevProducts.map((product) => product.id);
            const newProducts = newData.filter((product) => !existingProductIds.includes(product.id));
            return [...prevProducts, ...newProducts];
          });
    }

    const fetchAllProducts = (url) => {
        setIsLoading(true);
        Api.get(url ?? '/product/all')
          .then((res) => {
            const { full_url, products } = res.data;
            setData(products?.data);
            updateOrSetProductsFromDb(products?.data)      
            setFullUrl(full_url);
            setnextPageUrl(products?.next_page_url);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      
      const handleLoadMore = () => {
        if (nextPageUrl) {
          setProcessing(true);
          Api.get(nextPageUrl)
            .then((res) => {
              const { full_url, products } = res.data;
              setData([...data, ...products?.data]);
              updateOrSetProductsFromDb(products?.data)
              setFullUrl(full_url);
              setnextPageUrl(products?.next_page_url);
              setProcessing(false);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      };
      


    const isSelected = (id) => {
        return formData?.product_ids.includes(id)
    }


    const toggleFromSelectedListById = (id) => {
        let prevSelectedList = formData?.product_ids;
        const isSelected = prevSelectedList.includes(id);
        let newList = [...prevSelectedList];
        if (isSelected) {
            newList = prevSelectedList.filter((selectedId) => selectedId !== id);

        } else if (prevSelectedList.length < 10) {
            newList = [...prevSelectedList, id]
        } else {
            enqueueSnackbar('Max List Reached', { variant: 'info' })
        }
        setFormData('product_ids', newList);
    };


    useEffect(() => {
        if (!Boolean(data.length)) { fetchAllProducts() };
    }, [])


    useEffect(() => {
        scrollingContainer.current.scrollTop = scrollY
    }, [scrollY])




    return (
        <div className="!w-full ">
            <nav className=' rounded-md mb-1 py-2 px-5 bg-info-300 text-white'>
                Select from available products to generate report from
            </nav>
            <nav className='flex flex-col md:flex-row !w-full '>
                <Selectedproductslist toggleFromSelectedListById={toggleFromSelectedListById} products={productsFromDB} selectedList={formData?.product_ids} />
                <div className=' grow flex flex-col p-2 bg-white rounded-md shadow-medium relative '>
                    <div className='  sticky top-1 w-full rounded-lg mb-1 border focus-within:ring-2 focus-within:ring-info-200 transition-all duration-500 focus-within:border-none bg-white border-gray-400/70 flex items-center px-2'>
                        <Icon icon="ic:round-search" fontSize={30} className=' text-gray-300' />
                        <input type="search" name="" onChange={(e => fetchAllProducts("/product/all?search=" + e.target.value))} placeholder='Search Product Name' className='bg-white w-full pl-1 pr-5 py-3 rounded-t-lg border-none outline-none focus:outline-none focus:border-none' id="" />
                    </div>
                    <div ref={scrollingContainer} onScroll={(e) => setScrollY(e.target.scrollTop)} className='flex flex-col text-blue-950 h-[30rem] overflow-y-scroll'>
                        {Boolean(data?.length) &&
                            data.map((dt, i) => {
                                return (<abbr onClick={() => toggleFromSelectedListById(dt.id)} key={i} title={`Add ${dt.product_name} to list`} className={`decoration-none p-2 px-4 min-h-max hover:bg-blue-50 cursor-pointer model-item  w-full ${isSelected(dt.id) && 'addleftline !bg-info-100 '}`}> {dt.product_name} </abbr>)
                            })
                        }
                        {nextPageUrl && <Button processing={processing} onClick={() => handleLoadMore()} otherClasses=" text-sm mt-5 capitalize" text='More Products' />}
                    </div>
                    {!Boolean(data?.length) && <div className='absolute inset-0 flex items-center justify-center'>
                        <div>Empty Data</div>
                    </div>}
                </div>
            </nav>
        </div>
    )
}

export default Salereportproducts