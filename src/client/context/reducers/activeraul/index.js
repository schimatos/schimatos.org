import setFocus from './set-focus'
import addOptionsField from './add-option-field'
import copyForm from './copy-form'
import removeFocus from './remove-focus'
import addOption from './add-option'
import submissionMade from './submission-made'
import submissionError from './submission-error'
import submissionResponse from './submission-response'
import updatePath from './update-path'
import addPath from './add-path'
import setSubmitted from './set-submitted'
import remove from './remove'
import changeVisibility from './change-visibility'
import allVisibility from './all-visibility'
import displaySubmitted from './display-submitted'
import changeLoadStatus from './change-load-status'
import changeAlternatePath from './change-alternate-path'
import updateTargets from './update-targets'
import { keepCloning } from '../../../utils'

//import {displayComponent} from '../../../custom-hooks'

export default (state, action) => {
    //console.log('activeraul reducer', state, action)
    const  {type, t, id, i, value, loading, targets, no, ttype, prefix, hide, historyDispatch, noHold, startPoint} = action
    //action = {...action, display}
    const newState = {
        'SET_FOCUS' : () => setFocus(state, t, i, noHold, startPoint),
        'ADD_OPTIONS_FIELD' : () => addOptionsField(state, no, value),
        'COPY_FORM' : () => copyForm(state, action),
        'REMOVE' : () => remove(state, action),
        'REMOVE_FOCUS' : () => removeFocus(state),
        'ADD_OPTION' : () => addOption(state, targets, i, value, prefix, hide),
        'SUBMISSION_MADE' : () => submissionMade(state, id, t, loading),
        'SUBMISSION_RESPONSE' : () => submissionResponse(state, action),
        'SUBMISSION_ERROR' : () => submissionError(state, id, t),
        'UPDATE_PATH' : () => updatePath(state, id, value),
        'ADD_PATH' : () => addPath(state, action),
        'UPDATE_PATH' : () => updatePath(state, id, value),
        'SET_SUBMITTED' : () => setSubmitted(state, ttype, id, prefix),
        'COMPLETE_CHANGE' : () => ({...action.state}),
        'COMPLETE_UPDATE' : () => ({...action.state}),
        'CHANGE_VISIBILITY' : () => changeVisibility(state, action),
        'ALL_VISIBILTIY' : () => allVisibility(state, action),
        'DISPLAY_SUBMITTED' : () => displaySubmitted(state, action),
        'CHANGE_LOAD_STATUS' : () => changeLoadStatus(state, action),
        'CHANGE_ALTERNATE_PATH' : () => changeAlternatePath(state, action),
        'UPDATE_TARGETS' : () => updateTargets(state, action)
    }[type]()
    console.log('inside activeraul reducer', keepCloning(state), keepCloning(action), keepCloning(newState))
    //console.log('after before hist', newState, newState.focus, historyDispatch)
    if (type !== 'COMPLETE_UPDATE') {historyDispatch({type : 'FORM_CHANGE', newState})}
    //console.log('after reducer', newState, newState.focus)

    return keepCloning({...newState})
}
