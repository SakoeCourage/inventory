import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import Scroll from 'react-scroll'
// var Scroll = require('react-scroll');
dayjs.extend(relativeTime);

export function diffForHumans(date) {
    if (date) {
        return dayjs(date).fromNow();
    }
}




export function formatcurrency(amount) {
    let value = 0;
    if (amount >= 100000000) {
        value = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS', notation: 'compact' }).format(amount)
    } else {
        value = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS' }).format(amount)
    }

    return value
}
export function formatnumber(num) {
    if (typeof(Number(num)) !== 'number') {
        return 0
    }
    let value = 0;
    if (num >= 100000000) {
        value = new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num)
    } else {
        value = new Intl.NumberFormat('en-US').format(num)
    }

    return value
}

export function dateReformat(date) {
    if (date) {
        return (dayjs(date).format('DD/MM/YYYY'))
    }
}

export function removeURLParameter(param, url) {
    url = decodeURI(url).split("?");
    let path = url.length == 1 ? "" : url[1];
    path = path.replace(new RegExp("&?" + param + "\\[\\d*\\]=[\\w]+", "g"), "");
    path = path.replace(new RegExp("&?" + param + "=[\\w]+", "g"), "");
    path = path.replace(/^&/, "");
    return url[0] + (path.length ?
        "?" + path :
        "");
}

export function getUriWithParam(baseUrl, params) {
    const Url = new URL(baseUrl);
    const urlParams = new URLSearchParams(Url.search);
    for (const key in params) {
        if (params[key] !== undefined) {
            urlParams.set(key, params[key]);
        }
    }
    Url.search = urlParams.toString();
    return Url.toString();
};

export  function addOrUpdateUrlParam(uri, paramKey, paramVal) {
    var re = new RegExp("([?&])" + paramKey + "=[^&#]*", "i");
    if (re.test(uri)) {
      uri = uri.replace(re, '$1' + paramKey + "=" + paramVal);
    } else {
      var separator = /\?/.test(uri) ? "&" : "?";
      uri = uri + separator + paramKey + "=" + paramVal;
    }
    return uri;
  }


export function handleValidation(schema, formData) {
    let validationErrors = {}
    return new Promise((resolve, reject) => {
        schema.validate(formData, { abortEarly: false }).then(res => {
            if (res) {
                resolve(res)
            }
        }).catch(err => {
            // console.log(err)
            if (err.name === 'ValidationError') {
                err.inner.map((e) => {
                    validationErrors = {
                        [e.path]: e.errors,
                        ...validationErrors
                    }

                });
                reject(validationErrors)
            }
        })
    })
}


var scroller = Scroll.scroller;

export function handleScrolltoError(element,elementclassname, containerId = null) {
    setTimeout(() => {
        const warnicon = element[0]
        warnicon.classList.remove('u--flash')
        scroller.scrollTo(elementclassname, {
            duration: 500,
            delay: 10,
            smooth: true,
            containerId: containerId ?? 'outlet',
            offset: -70,
        })
        warnicon.classList.add('u--flash')
    }, 50);


}


export const SlideUpAndDownAnimation = {
    initial:{ opacity: 0, translateY: '100vh' },
    animate:{
        opacity: 1,
        translateY: '0',
        transition: {
            type: 'spring',
            mass: 0.1,
            damping: 8
        }
    },
    exit:{ opacity: 0, translateY: '100vh', transition: { duration: 0.2 } }
};


export function updateQueryParam(url, param, value) {
    var urlObj = new URL(url);
    var searchParams = urlObj.searchParams;
    
    if (searchParams.has(param)) {
      searchParams.set(param, value);
    } else {
      searchParams.append(param, value);
    }
    
    return urlObj.toString();
  }