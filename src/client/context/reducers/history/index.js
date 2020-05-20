import {useContext} from 'react'
import {ActiveraulContext} from '../../contexts/activeraul-context'

import triplestore from '../../../triplestore-interface'

import {filterDict, keepCloning, hash} from '../../../utils'

export default ([hist, no], {type, newState, actions, activeraulDispatch}) => {
    console.log('history called', type, newState, actions, activeraulDispatch)

    const makeChange = change => {
        const {toInsert, toDelete, ...state} = hist[hist.length-(no + change)]
        console.log('history called', keepCloning( state))
        activeraulDispatch({type : 'COMPLETE_UPDATE', state: keepCloning( state) })
        return keepCloning([hist, no + change])
    }

    const nState = () => {
        
        const stringedNoFocus = dict => JSON.stringify(filterDict(dict, ([k, v]) => k!='focus' ))
        
        const newHistory = hist.filter((x, i) => i + no - 1  < hist.length)
        const nstate = newState
        const len = newHistory.length
        const isRepeat = len > 0 && hash(newHistory[len-1]) === hash(nstate)
        //console.log('is re[eat', isRepeat)
        const ret = (nstate && !isRepeat) ? [[...newHistory, keepCloning(nstate)], 1] : [[...newHistory], 1]   
        //console.log('tp returnmn', newHistory, ret)
        console.log('history called', keepCloning( ret))
        return ret
    }

    switch (type) {
        case 'UNDO':
            return makeChange(1)
        case 'REDO':
            return makeChange(-1)
        case 'FORM_CHANGE':
            return keepCloning(nState(newState))
        case 'GRAPH_UPDATE':
            // Check the .pop
            const state = {...hist.pop()}
            const toReturn = keepCloning([[...hist, {...state, ...actions}], no])
            return keepCloning(toReturn)
        case 'REFRESH_STATE':
            const hi = hist[hist.length-no]
            const s = keepCloning(hist[hist.length-(no)].state)
            console.log(hist, hi, s)
            activeraulDispatch({type : 'COMPLETE_UPDATE', state: keepCloning(hi) })
            return keepCloning([hist, no])
        default : return keepCloning([hist, no])
    }
}