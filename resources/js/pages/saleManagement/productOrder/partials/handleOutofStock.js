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
                    collection_type: itemsModelfromDb?.collection_type?.type,
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
