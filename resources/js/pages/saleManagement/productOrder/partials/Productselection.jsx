import React, { useCallback, useEffect, useMemo, useState } from 'react'
import FormInputText from '../../../../components/inputs/FormInputText'
import FormInputSelect from '../../../../components/inputs/FormInputSelect'
import { Icon } from '@iconify/react'
import { Tooltip } from '@mui/material'
import { formatcurrency } from '../../../../api/Util'
import Button from '../../../../components/inputs/Button'
import Productsearch from '../../../stockManagement/newstockpartials/Productsearch'
import IconifyIcon from '../../../../components/ui/IconifyIcon'
import NextProductsList from './NextProductsList'

const EmptyProductData = { product_id: '', productsmodel_id: '', units: '', unit_price: '', amount: '', price_per_collection: '', collections: '' }

function Productselection({ modelsFromDB, productsFromDB, addNewItem, setShowProductSearchModal, showProductSearchModal, items, checkForImproperPricing, requiredAttention }) {
    const [currentList, setCurrentList] = useState({ ...EmptyProductData })
    const [showModelError, setShowModelError] = useState(false)
    const [selectedProductsList, setSelectedProductsList] = useState([])

    let getProductsModelsfromProductId = (id) => {
        return modelsFromDB.filter((data) => data?.product_id == id)
    }

    const getCurrentProductInformation = useMemo(() => {
        if ((currentList['product_id'] && currentList['productsmodel_id']) == null) return

        var product = productsFromDB
            .find(product => product?.id == currentList['product_id'])
            ?.product_name;

        var model = modelsFromDB.find(model => model?.id == currentList['productsmodel_id'])

        return {
            product: product,
            model: model?.model_name,
            cost_per_collection: model?.cost_per_collection,
            cost_per_unit: model?.cost_per_unit,
        }
    }, [currentList['product_id'], currentList['productsmodel_id'], productsFromDB, modelsFromDB])

    const handleMultiProductSelection = (data) => {
        if (Array.isArray(data) == false) return;
        const [first, ...rest] = data
        setCurrentList(first)
        if (rest?.length > 0) {
            setSelectedProductsList(rest)
        } else {
            setSelectedProductsList([])
        }
    }
    let GetmodelfromId = (id) => {
        return modelsFromDB.find(model => model.id == id)
    }

    let checkIfInCollection = (id) => {
        var in_collection = Boolean(GetmodelfromId(id)?.in_collection)
        return in_collection
    }

    let getCollectionType = (id) => {
        if (id) {
            return GetmodelfromId(id)?.collection_type
        }

    }

    let getBasicQuantity = (id) => {
        if (id) {
            return productsFromDB.find(product => product.id === Number(id))?.basic_quantity?.name
        }
    }

    let Getmaxcollection = useCallback(
        (id) => {
            return (GetmodelfromId(currentList['productsmodel_id'])?.quantity_per_collection - 1)
        },
        [currentList['productsmodel_id']],
    )

    let handleValueChange = (name, data) => {
        let newitems = { ...currentList };
        newitems[name] = data
        setCurrentList(newitems)
    }

    let calculateAmount = useMemo(() => {
        var lineamount = ((Number(currentList?.unit_price ?? 0) * currentList?.units ?? 0) + (Number(currentList?.price_per_collection ?? 0) * Number(currentList?.collections ?? 0))).toFixed(2)
        handleValueChange('amount', Number(lineamount))
        return lineamount
    }, [currentList['price_per_collection'], currentList['collections'], currentList['units'], currentList['unit_price'], currentList['productsmodel_id']])


    let handleProductChange = (data) => {
        let newitems = { ...currentList };
        newitems['product_id'] = data
        newitems['productsmodel_id'] = ''
        newitems['unit_price'] = ''
        newitems['units'] = ''
        newitems['price_per_collection'] = ''
        setCurrentList(newitems)
    }


    useMemo(() => {
        handleValueChange('price_per_collection', GetmodelfromId(currentList['productsmodel_id'])?.price_per_collection)
    }, [currentList['collections']])


    useMemo(() => {
        handleValueChange('unit_price', GetmodelfromId(currentList['productsmodel_id'])?.unit_price)
    }, [currentList['units']])


    const scrollToLast = () => {
        const lineitemsContainer = document.querySelector('#lineitemsContainer')
        lineitemsContainer.scrollBy({
            top: lineitemsContainer.scrollHeight,
            left: 0,
            behavior: 'smooth'
        })
    }


    const CartListConditions = () => {
        return calculateAmount > 0 && showModelError == false && requiredAttention == false
    }

    const addToCart = () => {
        if (CartListConditions()) {
            addNewItem(currentList)
            if (selectedProductsList?.length > 0) {
                handleMultiProductSelection(selectedProductsList)
            } else {
                setCurrentList({ ...EmptyProductData })
            }
            setTimeout(() => {
                scrollToLast()
            }, 200);
        }
    }


    useEffect(() => {
        if (currentList['productsmodel_id']) {
            setShowModelError(Boolean(items.find(item => Number(item?.productsmodel_id) == Number(currentList['productsmodel_id']))))
            setCurrentList({
                ...currentList, collections: '', units: ''
            })
            checkForImproperPricing(GetmodelfromId(currentList['productsmodel_id']))
        } else {
            checkForImproperPricing({})
        }
    }, [currentList['productsmodel_id'], currentList['product_id'], items])


    const handleCtrlF = (event) => {
        if (event.ctrlKey && event.key === 'f') {
            event.preventDefault();
            setShowProductSearchModal(cv => cv = !cv)

        }
    };

    const handleOnUpdateProductSelectionFromSearch = (data) => {
        setCurrentList(data)
        setSelectedProductsList([])
        const quantityInputs = document.querySelectorAll('.product-quantity-input')

        if (Boolean(quantityInputs.length)) {
            quantityInputs.forEach(element => {
                const input = element.querySelector('input');
                input?.focus();
            });
        }
    }

    const handleOnReset = () =>{
        setCurrentList({ ...EmptyProductData })
        setSelectedProductsList([])
    }

    useEffect(() => {
        window.addEventListener('keydown', handleCtrlF);
        return () => {
            window.removeEventListener('keydown', handleCtrlF);
        };
    }, []);


    const focusOnColl = () => {
        const CiUCollection = document.querySelector('.qty-input-coll');
        if (CiUCollection) {
            const firstInput = CiUCollection.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
            return;
        }
    }

    const focusOnBasic = () => {
        const CiUParent = document.querySelector('.qty-input-unit');
        if (CiUParent) {
            const firstInput = CiUParent.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }

    useEffect(() => {
        if (currentList['product_id'] && currentList['productsmodel_id']) {
            const InCollection = checkIfInCollection(currentList['productsmodel_id'])
            if (InCollection == true) {
                setTimeout(() => {
                    focusOnColl()
                }, 200);
            } else {
                setTimeout(() => {
                    focusOnBasic()
                }, 200);
            }
        }
    }, [currentList])



    return <div className='flex  max-w-4xl mx-auto gap-4 w-full p-2 pt-2 '>
        {showProductSearchModal && <div className=' fixed inset-0 bg-black/60 z-[70] isolate flex flex-col'>
            <div className=" max-w-3xl mx-auto w-full">
                <Productsearch
                    getMultiSelectedItems={handleMultiProductSelection}
                    multiSelect={true}
                    setShowProductSearchModal={setShowProductSearchModal}
                    AddEmptyRecordToList={addNewItem}
                    newStockList={[currentList]}
                    addToNewStockList={(data) => handleOnUpdateProductSelectionFromSearch(data[1])}
                    emptyListRecord={{ product_id: '', productsmodel_id: '', units: '', unit_price: '', amount: '', price_per_collection: '', collections: '' }}
                />
            </div>
        </div>}
        <div className='item flex w-full flex-col'>
            <div onClick={() => setShowProductSearchModal(true)} class="flex rounded-full cursor-pointer bg-orange-100 overflow-hidden px-2 w-full max-w-[600px] my-2 focus:ring-1 focus-within:ring-1 ring-info-800">
                <button class="self-center flex text-white p-1 cursor-pointer ">
                    <kbd class="pointer-events-none bg-orange-900/50 text-white rounded-full  select-none items-center gap-1 whitespace-nowrap py-2 px-3 border border-orange-300 bg-muted  font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span class="text-xs">⌘</span>Ctrl + F
                    </kbd>
                </button>
                <nav className='w-full my-auto bg-gray-300 flex bg-transparent pl-2 text-gray-600 outline-0'>
                    Click to search product
                </nav>
                <button type="submit" class="relative p-2 bg-transparent rounded-full">
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0" />

                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                        <g id="SVGRepo_iconCarrier"> <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g>
                    </svg>
                </button>
            </div>
            <NextProductsList
                productsList={selectedProductsList}
                cProduct={getCurrentProductInformation?.product}
                cProductModel={getCurrentProductInformation?.model}
                cProductTotalAmount={calculateAmount}
            />
            <nav className={`flex flex-col lg:flex-row gap-4 mt-4 ${getCurrentProductInformation?.product ? 'opacity-100' : 'opacity-0'}`}>
                {currentList['productsmodel_id'] && checkIfInCollection(currentList['productsmodel_id']) &&
                    <FormInputText autocomplete="off"
                        value={Boolean(currentList['collections']) && currentList['collections']}
                        onChange={(e) => {
                            handleValueChange('collections', Number(e.target.value))
                        }}
                        type='number' inputProps={{ min: 0 }} inputMode='numeric' min="0"
                        className="w-full product-quantity-input qty-input-coll"
                        label={`Number of ${getCollectionType(currentList['productsmodel_id'])}`}
                    />
                }

                <FormInputText inputMode='numeric' autocomplete="off"
                    onChange={(e) => {
                        handleValueChange('units', Number(e.target.value))
                    }
                    }
                    value={Boolean(currentList['units']) && currentList['units']}
                    type='number' inputProps={{
                        min: 0,
                        max: currentList['productsmodel_id'] && checkIfInCollection(currentList['productsmodel_id']) && Getmaxcollection(currentList['productsmodel_id'])
                    }} className="w-full product-quantity-input qty-input-unit" label={currentList['product_id'] ? `Number of ${getBasicQuantity(currentList['product_id'])}` : 'Number of Units'} />
            </nav>

            <nav className={`grid grid-cols-2 mt-2 gap-5 ${getCurrentProductInformation?.product ? 'opacity-100' : 'opacity-0'}`}>
                <Button className="" onClick={() => addToCart()} {...((CartListConditions()) ? { success: true } : { neutral: true })} text="Add to Cart" />
                <Button alert className="" onClick={handleOnReset} text="Reset" />
            </nav>
        </div>
    </div>
}

export default Productselection