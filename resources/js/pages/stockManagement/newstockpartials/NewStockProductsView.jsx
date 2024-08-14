import React, { useState, useEffect, useContext } from 'react'
import NewStockTab from './NewStockTab'
import ExcelUploadForm from '../../appllicationStep/productformpartials/ExcelUploadForm'
import Newstocklineitem from './Newstocklineitem'
import { NewStockContext } from '../Newstock'
import EmpytCart from '../../saleManagement/productOrder/partials/EmpytCart'
import Productcollection from '../../../components/Productcollection'
import { formatcurrency } from '../../../api/Util'
import IconifyIcon from '../../../components/ui/IconifyIcon'
import { Tooltip } from '@mui/material'
import { useSnackbar } from 'notistack'
import Api from '../../../api/Api'

function UploadProductsView() {
  const [productUploadTemplate, setProductUploadTemplate] = useState(null)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const handleOnProductFileUpload = async () => {
    if (productUploadTemplate == null) {
      enqueueSnackbar("Failed To Upload", { variant: "error" })
      return;
    }
    const formData = new FormData()
    formData.append("template_file", productUploadTemplate)

    try {
      enqueueSnackbar("Uploading Products Please Wait...", { variant: "default" })
      var response = await Api.post('/store-products/import', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      enqueueSnackbar("Product Upload Success", { variant: "success" });
      setProductUploadTemplate(null);
    } catch (error) {
      if (error?.response?.status == 422) {
        enqueueSnackbar(error.response.data ?? "Failed To Upload Store Product - Invalid Template", { variant: "error" });
        return
      }
      enqueueSnackbar(error.response.data ?? "Failed To Upload Store Product - Invalid Template", { variant: "error" });

    }
  }
  return <>
    <ExcelUploadForm
      handleUpload={() => handleOnProductFileUpload()}
      getFile={(file) => setProductUploadTemplate(file)}
      file={productUploadTemplate}
    />
  </>
}
function AddProductsManuallyView(
) {
  return <>
    <Newstocklineitem
    />
  </>
}


const components = {
  UploadProductsView: UploadProductsView,
  AddProductsManuallyView: AddProductsManuallyView
}

function NewStockProductsView() {
  /**
   * @type {[keyof typeof components, React.Dispatch<React.SetStateAction<keyof typeof components>>]}
   */
  const [stockProductView, setStockProductView] = useState("AddProductsManuallyView")
  const CurrentView = components[stockProductView]
  const { productsFromDB, modelsFromDB, errors, stockToDbList } = useContext(NewStockContext)

  useEffect(() => {
    console.log(productsFromDB)
  }, [productsFromDB])


  const getCurrentProductInformation = (product_id, model_id) => {
    if ((product_id && model_id) == null) return
    var product = productsFromDB
      .find(product => product?.id == product_id);

    var model = modelsFromDB.find(model => model?.id == model_id)

    return {
      product_name: product?.product_name,
      basic_quantity: product?.basic_quantity?.symbol,
      model_name: model?.model_name,
      cost_per_collection: model?.cost_per_collection,
      cost_per_unit: model?.cost_per_unit,
      in_collection: model?.in_collection,
      collection_method: model?.collection_type,
      quantity_per_collection: model?.quantity_per_collection,
    }
  }

  return (
    <div className=' grid grid-cols-1 lg:grid-cols-10 !grow  h-full  '>
      <nav className='  lg:col-span-5 !h-full '>
        <div className='min-h-[30rem] h-full lg:h-[30rem] overflow-y-scroll'>
          <div className=' w-full sticky top-0 '>
            <nav className='w-full text-gray-500 grid grid-cols-8 gap-1  bg-white z-20  font-medium py-1 border-b'>
              <nav className='flex items-center !py-1 justify-center col-span-1 text-sm'>#</nav>
              <nav className=' flex items-center !py-1 ml-3 justify-start col-span-2 text-sm'>Product</nav>
              <nav className=' flex items-center !py-1 justify-center col-span-3 text-sm'>Quantity</nav>
              <nav className='flex items-center !py-1 justify-center col-span-2 text-sm'>Cost</nav>
            </nav>
          </div>
          {!Boolean(stockToDbList?.length) ? <EmpytCart /> : <>
            {stockToDbList?.map((item, i) => <nav key={i} className='w-full product-list  grid grid-cols-8 gap-1 s bg-white z-20  font-medium py-1 border-b'>
              <nav className='flex items-center !py-1 justify-center col-span-1 text-sm'>
                <Tooltip content='Delete Line Item' title="Delete Line Item">
                  <IconifyIcon className="text-red-500 !p-0 !h-5 !w-5 cursor-pointer" icon="ic:baseline-delete" />
                </Tooltip>
              </nav>
              <nav className=' grid grid-cols-1 !py-1 ml-3 col-span-2 text-sm'>
                <nav className=''>
                  {getCurrentProductInformation(item?.product_id, item?.model_id)?.product_name}
                </nav>
                <nav className='text-xs'>
                  {getCurrentProductInformation(item?.product_id, item?.model_id)?.model_name}
                </nav>
              </nav>
              <nav className='flex items-center !py-1 justify-center col-span-3 text-sm'>
                <Productcollection
                  in_collections={getCurrentProductInformation(item?.product_id, item?.model_id)?.in_collection}
                  units_per_collection={getCurrentProductInformation(item?.product_id, item?.model_id)?.quantity_per_collection}
                  collection_type={getCurrentProductInformation(item?.product_id, item?.model_id)?.collection_method}
                  quantity={item?.quantity}
                  basic_quantity={getCurrentProductInformation(item?.product_id, item?.model_id)?.basic_quantity}
                />
              </nav>
              <nav className='flex flex-col justify-center items-center !py-1 col-span-2 text-sm'>
                {Boolean(getCurrentProductInformation(item?.product_id, item?.model_id)?.in_collection) && <nav className='  text-xs my-auto'>
                  {`${formatcurrency(item?.cost_per_collection)} per ${getCurrentProductInformation(item?.product_id, item?.model_id)?.collection_method} `}
                </nav>}
                <nav className='text-xs  my-auto'>
                  {`${formatcurrency(item?.cost_per_unit)} per ${getCurrentProductInformation(item?.product_id, item?.model_id)?.basic_quantity} `}
                </nav>
              </nav>
            </nav>
            )}
          </>
          }

        </div>
      </nav>
      <nav className='lg:col-span-5 flex flex-col !h-full bg-gray-50/30 '>
        <nav className='flex items-center border-b'>
          <NewStockTab
            onClick={() => setStockProductView("AddProductsManuallyView")}
            icon="streamline:chat-bubble-square-write-solid"
            active={stockProductView == "AddProductsManuallyView"}
            label='Add Product Manually'
          />
          <NewStockTab
            onClick={() => setStockProductView("UploadProductsView")}
            active={stockProductView == "UploadProductsView"}
            icon="vscode-icons:file-type-excel2"
            label='Upload Product From Template'
          />
        </nav>
        <nav className=' !grow '>
          <CurrentView

          />
        </nav>
      </nav>
    </div>
  )
}

export default NewStockProductsView