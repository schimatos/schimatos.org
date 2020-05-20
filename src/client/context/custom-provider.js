import React, {createContext, useReducer} from 'react'

export default (reducer, initialState, name) => {
    const Context = createContext([{}, () => {}])
    const Provider = props => {
        const [state, dispatch] = useReducer(reducer, name === 'HistoryContext' ? initialState : {...initialState, name})
        return (
            <Context.Provider value={[state, dispatch]}>
                {props.children}
            </Context.Provider>        
        )
    }
    return [Context, Provider]
}