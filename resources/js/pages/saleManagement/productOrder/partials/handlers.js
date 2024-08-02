export const handleOutOfStock = async (formData,modelsFromDB,getProductfromId) => {
    var items_out_of_stock = []
    formData.items.forEach(item => {
        if (item?.productsmodel_id && item?.product_id && item?.quantity) {
            var itemsModelfromDb = modelsFromDB.find(model => model.id == item?.productsmodel_id)
            if (itemsModelfromDb.quantity_in_stock < item.quantity) {
                let product = getProductfromId(itemsModelfromDb?.product_id)
                items_out_of_stock = [...items_out_of_stock, {
                    product_name: product?.product_name,
                    product_id: product?.id,
                    model_id: itemsModelfromDb?.id,
                    basic_selling_quantity: product?.basic_quantity?.name,
                    quantity_in_stock: itemsModelfromDb?.quantity_in_stock,
                    quantity_required: item?.quantity,
                    in_collection: itemsModelfromDb?.in_collection,
                    collection_type: itemsModelfromDb?.collection_type,
                    quantity_per_collection: itemsModelfromDb?.quantity_per_collection,
                    model_name: itemsModelfromDb?.model_name
                }]
            }
        }
    })
    
    if (items_out_of_stock.length > 0) {
        return Promise.reject(items_out_of_stock)
    } else {
        return Promise.resolve('none out of stock')
    }
}




export const  checkForInterruptedSale = (setInterruptedSaleAvailable) => {
    const i_s = localStorage.getItem('interrupted_sale');
    if (i_s) {
        setInterruptedSaleAvailable(true)
    } else {
        setInterruptedSaleAvailable(false)
    }
}



export const ini_sale = {
    discount_rate: '',
    customer_fullname: '',
    customer_contact: '',
    sub_total: 0,
    payment_method: '',
    amount_paid: '',
    total: 0,
    balance: 0,
    sale_type: "regular",
    items: []
}

export const ini_sale_items = {
    product_id: '',
    productsmodel_id: '',
    units: '',
    unit_price: '',
    amount: '',
    price_per_collection: '',
    collections: ''
}