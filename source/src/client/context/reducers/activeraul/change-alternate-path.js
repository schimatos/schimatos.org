import {useContext} from 'react'
import {TriplestoreContext} from '../../contexts/triplestore-context'

import {nextKey, setMinus, keepCloning} from '../../../utils'
import _ from 'underscore'

export default (state, {value, id}) => {
    state.properties[id].pathOpen = value
    return {...state}
}