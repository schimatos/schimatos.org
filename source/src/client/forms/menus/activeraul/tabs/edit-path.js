import {useContext} from 'react'

import {numberInput, input} from '../../../fields/functional-react'
import setOptionsDropdown from '../../../fields/set-options-dropdown'
import useActiveraul from '../../../../custom-hooks'
import {ActiveraulContext} from '../../../../context'

import Activeraul from '../../../../custom-hooks/activeraul-history'

export default () => {
    const [{focus, properties, propertyList},] = Activeraul()

    const intInput = p => numberInput({...p, valueType : 'integer', stepAmount : 1, minValue : 0, buttonPlacement : 'leftAndRight'})
    const modal = () => {
        const initialState = Object.assign({
            minCount : '0',
            maxCount : '',
            message : '',
            path : '',
            pathType : 'path',
            severity : 'Violation', // Add explanation to side in modal
            other : []
        }, focus.type === 'properties' ? propertyList[properties[focus.id].property] : {})

        const conditions = ({path, maxCount, minCount, other}) => {
            const extraConstraints = other.map(x => x[0])
            const constraintConflict = ['minCount', 'maxCount', 'message', 'path', 'pathType', 'inversePath', 'severity']
            .map(x => !extraConstraints.includes(x))
            return [
            path !== '',
            maxCount === '' || Number(maxCount) >= Number(minCount),
            ...constraintConflict,
            !hasDuplicates(other.map(x => x[0]))
        ]}
        const submitConditions = () => []
        const content = () => [
            //['Path Name', [input, 'path', {placeholder : 'Path...'}]],
            ['PathType', [setOptionsDropdown, 'pathType', {options : ['path', 'inversePath']}]],
            ['Severity', [setOptionsDropdown, 'severity', {options : ['Info', 'Warning', 'Violation']}]],
            ['Range', [intInput, 'minCount', {}, 'Min'], [intInput, 'maxCount', {placeholder : 'Leave empty if no max', allowEmptyValue : true}, 'Max']],
            ['Message', [input, 'message', {placeholder : 'Message...'}]],
            ['Other Constraints', [MultiEntryTable, 'other', {header : ['Constraint Name', 'Constraint Value']}]]
        ]
        return {initialState, conditions, submitConditions, content, header : 'Edit Predicate'}
    }
    return {
        modal : modal(),
        active : focus.type === 'property',
        icon : 'edit',
        popup : 'Add form field',
        onClick : value => Activeraul().updatePath(id, value)
    }
}