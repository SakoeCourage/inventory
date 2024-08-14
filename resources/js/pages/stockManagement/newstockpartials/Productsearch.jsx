import React, { useEffect, useState, useCallback } from 'react';
import FormInputsearch from '../../../components/inputs/FormInputsearch';
import { Icon } from '@iconify/react';
import Api from '../../../api/Api';
import { debounce, filter } from 'lodash-es';
import Emptydata from '../../../components/formcomponents/Emptydata';
import Button from '../../../components/inputs/Button';
import ClickAwayListener from 'react-click-away-listener';

function Searchresultitem({ product, handleSelected, isFocused }) {

  useEffect(() => {
    if (isFocused) {
      const handleKeyEvent = (e) => {
        if (e.key == "Enter") {
          handleSelected({ product_id: product.product_id, model_id: product?.model_id })
        }
      };

      window.addEventListener('keypress', handleKeyEvent);

      return () => {
        window.removeEventListener('keypress', handleKeyEvent);
      };
    }
  }, [isFocused]);

  return (
    <li
      className={`flex items-center m-sr-item gap-2 my-1 hover:ring-2 hover:ring-green-600 hover:ring-offset-1 focus:ring-2 focus:ring-green-600 focus:ring-offset-1 focus:outline-none focus:border-none ${isFocused ? 'ring-2 ring-green-600 ring-offset-1' : ''}`}
      onClick={() => handleSelected({ product_id: product.product_id, model_id: product?.model_id })}
      tabIndex={isFocused ? 0 : -1}
    >
      {product.key === 'in_product' ? (
        <nav className='p-2 border grid place-items-center rounded-md border-gray-200'>
          <Icon className='text-gray-400' icon="mdi:tag-outline" fontSize={'1.45rem'} />
        </nav>
      ) : (
        <nav className='p-2 border grid place-items-center rounded-md border-gray-200'>
          <Icon className='text-gray-400' icon="mdi:tag-multiple-outline" fontSize={'1.5rem'} />
        </nav>
      )}
      <nav>
        {product.key === 'in_product' ? (
          <span className='text-gray-500 font-semibold'>
            {product.product_name}
            <span className='font-normal text-sm ml-1'>in </span> <span className='text-sm font-normal'>{product?.category}</span>
          </span>
        ) : (
          <span className='text-gray-500 font-medium'>
            <span className='font-normal text-sm'>{product.product_name} <Icon icon="ion:chevron-forward-sharp" /></span>
            <span className="font-semibold">{product.model_name}</span> <span className='font-normal text-sm'>in</span> <span className='text-sm font-normal'>{product?.category}</span>
          </span>
        )}
      </nav>
    </li>
  );
}

function Productsearch({ setShowProductSearchModal, addToNewStockList, newStockList, AddEmptyRecordToList, emptyListRecord }) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [filteredProducts, setfilteredProducts] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    if (Boolean(products?.data?.length)) {
      // console.log(products?.data);
      let currentEntry = [];
      const regex = new RegExp(filters?.search, 'i');
      products.data.forEach((product, i) => {
        if (product?.models) {
          product.models.forEach((model, i) => {
            currentEntry = [
              ...currentEntry,
              {
                key: 'in_model',
                product_name: product.product_name,
                product_id: product.id,
                model_name: model.model_name,
                model_id: model.id,
                category: product?.category?.category,
              },
            ];
          });
        }
      });

      currentEntry.sort((a, b) => {
        const aMatches = regex.test(a.product_name) || regex.test(a.model_name);
        const bMatches = regex.test(b.product_name) || regex.test(b.model_name);
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });

      setfilteredProducts([...filteredProducts, ...currentEntry]);
    }
  }, [products]);

  const handleSearch = (searchkey) => {
    if (searchkey) {
      setProcessing(true);
      Api.get('product/all/withmodels?search=' + searchkey)
        .then((res) => {
          setfilteredProducts([]);
          const { products, filters, store_id } = res.data;
          console.log(products);
          setProducts(products);
          setFilters(filters);
          setProcessing(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (searchkey == '') {
      setProcessing(false);
    }
  };

  const fetchMoreData = () => {
    Api.get(products.next_page_url)
      .then((res) => {
        setfilteredProducts([]);
        let newproductsdata = [...products.data, ...res.data.products?.data];
        setProducts({ ...products, data: newproductsdata, next_page_url: res.data?.products?.next_page_url });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const searchBar = document.querySelector('#search-bar');
    searchBar.focus();
  }, []);

  const handleSelected = ({ product_id, model_id }) => {
    let newLineProduct = emptyListRecord;
    newLineProduct = { ...newLineProduct, product_id: product_id, model_id: model_id, productsmodel_id: model_id };
    addToNewStockList([...newStockList, newLineProduct]);
    setShowProductSearchModal(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setFocusedIndex((prevIndex) => (prevIndex + 1) % filteredProducts.length);
    } else if (e.key === 'ArrowUp') {
      setFocusedIndex((prevIndex) => (prevIndex - 1 + filteredProducts.length) % filteredProducts.length);
    }
  };

  useEffect(() => {
    const handleKeyEvent = (e) => handleKeyDown(e);
    window.addEventListener('keydown', handleKeyEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyEvent);
    };
  }, [filteredProducts]);

  useEffect(() => {
    if (focusedIndex >= 0 && filteredProducts.length > 0) {
      const focusedElement = document.querySelectorAll('.m-sr-item')[focusedIndex];
      if (focusedElement) {
        focusedElement.focus();
      }
    }
  }, [focusedIndex, filteredProducts]);

  return (
    <ClickAwayListener onClickAway={() => setShowProductSearchModal(false)}>
      <div className='z-40 md:py-8 pb-14 flex flex-col'>
        <div className="p-2 bg-white md:rounded-md">
          <FormInputsearch processing={processing} getSearchKey={(value) => handleSearch(value)} className="" placeholder="Find product name or product model" />
        </div>
        {Boolean(filteredProducts?.length) && (
          <div className='mt-2 text-gray-500 bg-white h-full max-h-[calc(min(44rem,70vh))] overflow-y-scroll px-5 pb-5 rounded-md shadow-md'>
            <nav className="mb-2 py-3 border-b shadow-current bg-white">
              search result
            </nav>
            <ul className='product-search-result'>
              {filteredProducts?.map((product, i) => (
                <Searchresultitem handleSelected={(values) => { AddEmptyRecordToList(); handleSelected(values); }} key={i} product={product} isFocused={i === focusedIndex} />
              ))}
            </ul>
            {products.next_page_url && (
              <Button otherClasses="w-full" text="Load more data" onClick={() => fetchMoreData()} />
            )}
          </div>
        )}
        {!Boolean(filteredProducts?.length) && filters.search && (
          <div className='mt-2 text-gray-500 bg-white h-[calc(min(44rem,70vh))] overflow-y-scroll px-5 pb-5 rounded-md shadow-md flex items-center justify-center'>
            <Emptydata caption="Your search was not found" />
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
}

export default Productsearch;
