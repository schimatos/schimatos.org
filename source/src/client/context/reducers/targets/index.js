import addOption from './add-option'
import addSelection from './add-selection'
import removeSelection from './remove-selection'
import addNew from './add-new'
import searchResponse from './search-response'
import setSubmitted from './set-submitted'
import setLoadStatus from './set-load-status'
import copyOptions from './copy-options'
import typesLoaded from './types-loaded'
import propertyTypesLoaded from './property-types-loaded'
import setValidators from './set-validators'
import renderValidators from './render-validators'
import updatePathState from './update-path-state'
import predicateOptionsAdd from './predicate-options-add'

export default (state, action) => {
    //console.log('targets reducer', state, action)
    const {type, i, value, category, response, requested, loading, no, prefix, hide, ids} = action
    switch (type) {
        case 'ADD_OPTION':
            return addOption(state, no, value, prefix, hide)
        case 'ADD_SELECTION':
            return addSelection(state, i, value)
        case 'REMOVE_SELECTION':
            return removeSelection(state, i, value)
        case 'ADD_NEW':
            return addNew(state, category, ids, requested, loading)
        case 'SEARCH_RESPONSE':
            return searchResponse(state, action)
        case 'SHACL_RESPONSE':
            return searchResponse(state, category, i, response)
        case 'SET_SUBMITTED':
            return setSubmitted(state, type, i)
        case 'SET_LOAD_STATUS':
            return setLoadStatus(state, action)
        case 'COPY_OPTIONS':
            return copyOptions(state, action)
        case 'TYPES_LOADED':
            return typesLoaded(state, action)
        case 'PROPERTY_TYPES_LOADED':
            return propertyTypesLoaded(state, action)
        case 'SET_VALIDATORS':
            return setValidators(state, action)
        case 'RENDER_VALIDATORS':
            return renderValidators(state, action)
        case 'UPDATE_PATH_STATE':
            return updatePathState(state, action)
        case 'PREDICATE_OPTIONS_ADD':
            return predicateOptionsAdd(state, action)
        default : return state
    }
}