import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';

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