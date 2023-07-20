import { useState } from 'react';
import Api from '../../api/Api'

const Formhook = (initialValues) => {
  const [data, newData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const setData = (key, value) => {
    newData((prevData) => ({ ...prevData, [key]: value }));
  };

  const reset = () => {
    const cd = { ...data };
    for (let prop in cd) {
      if (cd.hasOwnProperty(prop)) {
        cd[prop] = '';
      }
    }
    setData(cd);
  };
  const post = async (url, options = {}) => {
    const { onSuccess = () => { }, onError = () => { } } = options;
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
      if (err.response.status === 422) {
        setErrors(err.response?.data?.errors)
      }
      setProcessing(false)
    })
  }
  const put = async (url, options = {}) => {
    const { onSuccess = () => { }, onError = () => { } } = options;
    setProcessing(true)
    setErrors({});

    Api.put(url, data).then(res => {
      if (res) {
        setProcessing(false)
        onSuccess(res);
        setErrors({})
      }
    }).catch(err => {
      console.log(err)
      onError(err)
      if (err.response.status === 422) {
        setErrors(err.response?.data?.errors)
      }
      setProcessing(false)
    })
  }

  const patch = async (url, options = {}) => {
    const { onSuccess = () => { }, onError = () => { } } = options;
    setProcessing(true)
    setErrors({});

    Api.patch(url, data).then(res => {
      if (res) {
        setProcessing(false)
        onSuccess(res);
        setErrors({})
      }
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
