// Produces a field into which users may either freely
// enter their selection or select from a dropdown of
// input options

import React from 'react';
import CheckBox from './fields/checkbox.js';
import SingleSelect from './fields/single-select.js';

export const FreeOrSelect = props => {

    const {options, onSubmit, requestOptions} = props

    const [state, setState] = useState({
        checked : false,
        free : '',
        selection : null
    })

    const toggleChecked = () => {
        prop.options = null && requestOptions()       
        setState({...state, checked : !state.checked})
    }

    const toggleSelect = e => {
        setState({...state, selection : e.target.value })
    }

    const updateFree = e => {
        setState({...state, free : e.target.value})
    }

    const submission = () => {
        onSubmit(state.checked ? state.selection : state.free)
    }

    return(
        <div className='freeOrSelect'>
        
        {!(options !== []) &&
            // Checkbox to select free or dropdown
            <CheckBox
                onClick={toggleChecked}
                checked={state.checked}/>}

        {state.checked ? (
            // Displays loading instead of dropdown
            options === 'loading' ? (
                <img src='loading.gif' alt='Loading...'/>
            ) : (
                <SingleSelect
                onChange={toggleSelect}
                options={props.options}
                value={state.checked}/>)

        ) : (
            <input
                type='free'
                onChange={updateFree}
                value={state.free}/>
        )}

        <button
            type='button'
            onClick={submission}>
            Submit
        </button>

        </div>
)};

export default FreeOrSelect;