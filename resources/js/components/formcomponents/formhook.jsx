import { useEffect, useState } from 'react';
import Api from '../../api/Api'


/**
* Represents the keys of the `initialValues` object.
* @typedef {string} FormKey
*/

/**
 * Callback function to be executed on successful response of the HTTP request.
 * @callback SuccessCallback
 * @param {any} response - The response data from the successful request.
 * @returns {any} - The response data from the successful request
 */


/**
 * Callback function to be executed on error response of the HTTP request.
 * @callback ErrorCallback
 * @param {any} error - The error object from the failed request.
 * @returns {any} - The error object from the failed request
 */

/**
 * Sets new data in the form data object.
 *
 * @callback setDataFunction
 * @param {FormKey|Object} keyorobj - Either a string representing the key to update (one of the keys from `initialValues`) or an object containing multiple key-value pairs to update.
 * @param {*} [value] - The value to set for the specified key. This parameter is required when `keyorobj` is a string.
 * @returns {void}
 */

/**
 * Function to perform an HTTP PUT request.
 * @callback PutFunction
 * @param {string} url - The URL for the PUT request.
 * @param {Object} options - Additional options for the PUT request.
 * @param {SuccessCallback} [options.onSuccess] - Callback function to be executed on successful response.
 * @param {ErrorCallback} [options.onError] - Callback function to be executed on error response.
 * @returns {void}
 */


/**
 * Function to perform an HTTP PATCH request.
 * @callback PatchFunction
 * @param {string} url - The URL for the PATCH request.
 * @param {Object} options - Additional options for the PATCH request.
 * @param {SuccessCallback} [options.onSuccess] - Callback function to be executed on successful response.
 * @param {ErrorCallback} [options.onError] - Callback function to be executed on error response.
 * @returns {void}
 */

/**
 * Function to perform an HTTP POST request.
 * @callback PostFunction
 * @param {string} url - The URL for the POST request.
 * @param {Object} options - Additional options for the POST request.
 * @param {SuccessCallback} [options.onSuccess] - Callback function to be executed on successful response.
 * @param {ErrorCallback} [options.onError] - Callback function to be executed on error response.
 * @returns {void}
 */


/**
 * @typedef {Object} FormhookResult
 * @property {Object} data - The form data.
 * @property {Object} errors - Errors related to form validation.
 * @property {boolean} processing - Indicates if the form is being processed.
 * @property {setDataFunction} setData - Function to update form data.
 * @property {PutFunction} put - Function to perform an HTTP PUT request.
 * @property {PatchFunction} patch - Function to perform an HTTP PATCH request.
 * @property {PostFunction} post - Function to perform an HTTP POST request.
 */

/**
 * Create a form hook.
 * @param {Object} initialValues - The initial values for the form.
 * @returns {FormhookResult} An object containing form data and utility functions.
 */

const Formhook = (initialValues) => {

    /**
   * @returns {Array<FormKey>}
   */
    const entriesKeyEntries = Object.keys(initialValues);

  const [data, newData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);


  /**
   * Sets new data in the form data object.
   *
   * @param {FormKey|Object} keyorobj - Either a string representing the key to update (one of the keys from `initialValues`) or an object containing multiple key-value pairs to update.
   * @param {*} [value] - The value to set for the specified key. This parameter is required when `keyorobj` is a string.
   * @returns {void}
   */
  const setData = (keyorobj, value) => {
    if (typeof keyorobj === 'object') {
      for (const [key, newValue] of Object.entries(keyorobj)) {
        newData((prevData) => ({ ...prevData, [key]: newValue }));
      }
    }

    if (typeof keyorobj === 'string') {
      newData((prevData) => ({ ...prevData, [keyorobj]: value }));
    }
  };



  const reset = () => {
    setData(initialValues);
  };





  /**
 * Performs an HTTP POST request.
 *
 * @param {string} url - The URL to send the POST request to.
 * @param {Object} options - Additional options for the POST request.
 * @param {SuccessCallback} [options.onSuccess]  - Callback function to be executed on successful response.
 * @param {ErrorCallback} [options.onError] - Callback function to be executed on error response.
 */

  const post = (url, options = {}) => {
    const { onSuccess = () => { }, onError = () => { } } = options;
    setProcessing(true)
    setErrors({});

    Api.post(url, data).then(res => {
      setProcessing(false)
      reset()
      setErrors({})
      console.log(initialValues)
      onSuccess(res);
    }).catch(err => {
      console.log(err)
      onError(err)
      if (err.response.status === 422) {
        setErrors(err.response?.data?.errors)
      }
      setProcessing(false)
    })
  }


  /**
 * Performs an HTTP PUT request.
 *
 * @param {string} url - The URL to send the PUT request to.
 * @param {Object} options - Additional options for the PUT request.
 * @param {SuccessCallback} [options.onSuccess]  - Callback function to be executed on successful response.
 * @param {ErrorCallback} [options.onError] - Callback function to be executed on error response.
 */
  const put = (url, options = {}) => {
    const { onSuccess = () => { }, onError = () => { } } = options;
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
      if (err.response.status === 422) {
        setErrors(err.response?.data?.errors)
      }
      setProcessing(false)
    })
  }

  /**
 * Performs an HTTP PATCH request.
 *
 * @param {string} url - The URL to send the PATCH request to.
 * @param {Object} options - Additional options for the PATCH request.
 * @param {SuccessCallback} [options.onSuccess]  - Callback function to be executed on successful response.
 * @param {ErrorCallback} [options.onError] - Callback function to be executed on error response.
 */

  const patch = (url, options = {}) => {
    const { onSuccess = () => { }, onError = () => { } } = options;
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
      if (err.response.status === 422) {
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
    post
  };
};

export default Formhook;
