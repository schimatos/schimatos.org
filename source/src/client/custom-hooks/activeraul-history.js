import {useContext} from 'react'
import {ActiveraulContext, HistoryContext} from '../context'

export const useActiveraulHistory = () => {
    ////console.log('at activeraul history')
    const [state, dispatch] = useContext(ActiveraulContext)
    const [,historyDispatch] = useContext(HistoryContext)
    return [state, action => dispatch({...action, historyDispatch})]
}

export default useActiveraulHistory