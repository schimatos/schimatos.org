import {numberInput, input} from '../../../fields/functional-react'
import setOptionsDropdown from '../../../fields/set-options-dropdown'
import multiEntryTable from '../../../fields/multi-entry-table'
import {hasDuplicates} from '../../../../utils'
import {useActiveraul} from '../../../../custom-hooks'
import newPathModal from '../../../activeraul-form/modals/new-path-modal'

export default () => {
    const {addPath} = useActiveraul()
    // const intInput = p => numberInput({...p, valueType : 'integer', stepAmount : 1, minValue : 0, buttonPlacement : 'leftAndRight'})
    // const modal = () => {
    //     const initialState = {
    //         minCount : '1',
    //         maxCount : '',
    //         message : '',
    //         path : '',
    //         pathType : 'path',
    //         severity : 'Violation', // Add explanation to side in modal
    //         other : []
    //     }
    //     const conditions = ({path, maxCount, minCount, other}) => {
    //         const extraConstraints = other.map(x => x[0])
    //         const constraintConflict = ['minCount', 'maxCount', 'message', 'path', 'pathType', 'inversePath', 'severity']
    //         .map(x => !extraConstraints.includes(x))
    //         return [
    //         path !== '',
    //         maxCount === '' || Number(maxCount) >= Number(minCount),
    //         ...constraintConflict,
    //         !hasDuplicates(other.map(x => x[0]))
    //     ]}
    //     const submitConditions = () => []
    //     const content = () => [
    //         ['Path Name', [input, 'path', {placeholder : 'Path...'}]],
    //         ['PathType', [setOptionsDropdown, 'pathType', {options : ['path', 'inversePath']}]],
    //         ['Severity', [setOptionsDropdown, 'severity', {options : ['Info', 'Warning', 'Violation']}]],
    //         ['Range', [intInput, 'minCount', {}, 'Min'], [intInput, 'maxCount', {placeholder : 'Leave empty if no max', allowEmptyValue : true}, 'Max']],
    //         ['Message', [input, 'message', {placeholder : 'Message...'}]],
    //         ['Other Constraints', [multiEntryTable, 'other', {header : ['Constraint Name', 'Constraint Value']}]]
    //     ]
    //     return {initialState, conditions, submitConditions, content, header : 'Add Predicate'}
    // }
    const preFilter = value => {
        // Add condition to ensure that an empty vlaue is not added
        const {path, pathType} = value
        const newPath = path//pathType === 'alternativePath' ? path : path[0]//will need to fix
        return {...value, path : newPath}
    }

    return {
        modal : newPathModal(),
        icon : 'road',
        popup : 'Add Predicate',
        onClick : value => addPath(preFilter(value))
    }
}


