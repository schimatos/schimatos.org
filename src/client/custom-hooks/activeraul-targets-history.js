import {useContext} from 'react'

import Activeraul from './activeraul-history'
import {TargetsContext, HistoryContext} from '../context'

export default () => {
    //console.log('at activeraul targets history')
    const [,activeraulDispatch] = Activeraul()
    const [,targetsDispatch] = useContext(TargetsContext)
    const [,historyDispatch] = useContext(HistoryContext)
    return {activeraulDispatch, targetsDispatch, historyDispatch}
}