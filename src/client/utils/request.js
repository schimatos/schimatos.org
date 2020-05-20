
import axios from 'axios'

export const request = data => {
    const {extension, body, responseFunc, errorFunc, priorFunc} = data
    priorFunc && priorFunc()
    axios.post(`http://localhost:5000/api/${extension}`, {...body})
        .then(
            response => {
                if (response.statusText !== 'OK') {
                    console.log(response, 'not ok')
                    errorFunc()
                    throw Error(response.statusText)
                }
                console.log('response')
                console.log(response)
                return response.data
            })
        .then(responseFunc)
        .catch(error => {
            console.log(error)
            errorFunc()
        })
}