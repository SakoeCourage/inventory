import { useEffect, useState } from 'react';
import Api from '../api/Api';
import { AxiosError } from 'axios';


/**
 * @author Sakoe Courage
 * @description - This hook was inspired by inertias formHook and hence 
 * tries to mimic some of those features
 */

/**
 * Represents the structure of an Axios response.
 *
 * @typedef {Object} AxiosResponse
 * @template T
 * @template D
 * @property {T} data - The response data.
 * @property {number} status - The HTTP status code of the response.
 * @property {string} statusText - The status message corresponding to the HTTP status code.
 * @property {RawAxiosResponseHeaders | AxiosResponseHeaders} headers - The headers of the response.
 * @property {AxiosRequestConfig<D>} config - The configuration settings used to make the request.
 * @property {any} [request] - The original request object, if available.
 */


/**
 * @template T
 * @typedef {Object} callbackParams
 * @property {string} url
 * @property {RequestOptions<T>} [options]
 */


/**
 * @template T
 * @typedef {Object} RequestOptions
 * @property {(res:AxiosResponse<T>) => void} [onSuccess] - Callback function to be executed on successful response.
 * @property {(err:AxiosError<T>) => void} [onError] - Callback function to be executed on error response.
 */

/**
 * @template {Record<string, any>}  T  
 * @typedef {Object} useFormUtils
 * @property {Record<keyof T, any>} data - The form data.
 * @property {Record<keyof T, string>}  errors - Errors related to form validation.
 * @property {boolean} processing - Indicates if the form is being processed.
 * @property {(key: keyof T, value?: any) => void} setData - Function to update form data.
 * @property {(url: string, options?: RequestOptions<T>) => void} put - Function to perform an HTTP PUT request.
 * @property {(url: string, options?: RequestOptions<T>) => void} patch - Function to perform an HTTP PATCH request.
 * @property {(url: string, options?: RequestOptions<T>) => void} post - Function to perform an HTTP POST request.
 * @property {(url: string, options?: RequestOptions<T>) => void} delete - Function to perform an HTTP POST request.
 * @property {() => void} reset - Function to reset form data.
 */

/**
 * Creating form hook.
 * @template T
 * @param {T} initialValues - The initial values for the form.
 * @returns {useFormUtils<T>} An object containing form data and utility functions.
 */

const useForm = (initialValues) => {


  const [data, newData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const setData = (key, value) => {
    newData((prevData) => prevData = { ...prevData, [key]: value });
  };


  const reset = () => {
    newData(initialValues);
  };



  /**
   * 
   * @param {callbackParams}
   */
  const post = (url, options = {}) => {
    const { onSuccess = (res) => { }, onError = (err) => { } } = options;
    setProcessing(true)
    setErrors({});

    Api.post(url, data).then(res => {
      setProcessing(false)
      reset()
      setErrors({})
      onSuccess(res);
    }).catch(err => {
      console.log(err)
      onError(err)
      if (err?.response?.status === 422) {
        setErrors(err.response?.data?.errors)
      }
      setProcessing(false)
    })
  }

  const put = (url, options = {}) => {
    const { onSuccess = (res) => { }, onError = (err) => { } } = options;
    setProcessing(true)
    setErrors({});

    Api.put(url, data).then(res => {
      setProcessing(false)
      reset()
      setErrors({})
      onSuccess(res);
    }).catch(err => {
      console.log(err)
      onError(err)
      if (err?.response?.status === 422) {
        setErrors(err.response?.data?.errors)
      }
      setProcessing(false)
    })
  }




  const patch = (url, options = {}) => {
    const { onSuccess = (res) => { }, onError = (err) => { } } = options;
    setProcessing(true)
    setErrors({});
    Api.patch(url, data).then(res => {
      setProcessing(false)
      reset()
      setErrors({})
      onSuccess(res);
    }).catch(err => {
      console.log(err)
      onError(err)
      if (err?.response?.status === 422) {
        setErrors(err.response?.data?.errors)
      }
      setProcessing(false)
    })
  }



  const del = (url, options = {}) => {
    const { onSuccess = (res) => { }, onError = (err) => { } } = options;
    setProcessing(true)
    setErrors({});

    Api.delete(url, data).then(res => {
      setProcessing(false)
      reset()
      setErrors({})
      onSuccess(res);
    }).catch(err => {
      console.log(err)
      onError(err)
      if (err?.response?.status === 422) {
        setErrors(err.response?.data?.errors)
      }
      setProcessing(false)
    })
  }

  return {
    data,
    errors,
    processing,
    setData,
    put,
    patch,
    post,
    delete: del,
    reset
  };
};

export default useForm;