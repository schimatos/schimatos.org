import {eqHash, extendArray, keepCloning} from './utils'

export const stateChange = ([hist, no], {state}) => {
    const newHist = hist.slice(hist.length - no - 50, hist.length - no)
    const isRepeat = newHist.length > 0 && eqHash(newHist.slice(-1), [state])
    return [extendArray(newHist, state && !isRepeat && keepCloning([state])), 1]
}

export const redo = (state, action) => require('./helper/make-change')(1, state, action)
export const undo = (state, action) => require('./helper/make-change')(-1, state, action)