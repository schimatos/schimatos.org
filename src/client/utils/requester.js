import {useContext} from 'react'
import {TriplestoreContext} from '../context'

import axios from 'axios'

export const requester = data => {
    const {extension, body, responseFunc, errorFunc, priorFunc} = data
    priorFunc && priorFunc()
    axios.post(`http://localhost:5000/api/${extension}`, {...body})
        .then(
            response => {
                console.log('response', response)
                if (response.statusText !== 'OK') {
                    errorFunc && errorFunc()
                    throw Error(response.statusText)
                }
                return response
            })
        .then(responseFunc)
}