import React from 'react'
import {input} from '../../fields/functional-react'
import setOptionsDropdown from '../../fields/set-options-dropdown'
import multiEntryTable from '../../fields/multi-entry-table'
import {hasDuplicates} from '../../../utils'
import { multiOrSingleInput } from '../../fields/multi-or-single-input'
import { intInput } from '../../fields/int-input'
import IRIField from '../../../validated-fields/IRI-field'

export default () => {
    const PathField = IRIField('knowledge')

        const initialState = {
            minCount : '1',
            maxCount : '',
            message : '',
            path : '',//should be list for multiOrSingleInput
            pathType : 'path',
            severity : 'Violation', // Add explanation to side in modal
            other : []
        }
        const conditions = ({path, maxCount, minCount, other}) => {
            return []
            const extraConstraints = other.map(x => x[0])
            const constraintConflict = ['minCount', 'maxCount', 'message', 'path', 'pathType', 'inversePath', 'severity']
            .map(x => !extraConstraints.includes(x))
            return [
            //path !== '',
            maxCount === '' || Number(maxCount) >= Number(minCount),
            ...constraintConflict,
            !hasDuplicates(other.map(x => x[0]))
        ]}
        const submitConditions = () => []
        //console.log('new path modal')
        
        const content = ({pathType, path}) => [
            ['Path Name', [PathField//multiOrSingleInput
                , 'path', {placeholder : 'Path...', additionLabel : `Add path: `, noResultsMessage : `Type the paths you wish to include`, multiple : pathType === 'alternativePath'}]],
            ['PathType', [setOptionsDropdown, 'pathType', {options : ['path', 'inversePath', 'alternativePath', 'zeroOrOnePath', 'oneOrMorePath', 'zeroOrMorePath']}]],
            ['Severity', [setOptionsDropdown, 'severity', {options : ['Info', 'Warning', 'Violation']}]],
            ['Range', [intInput, 'minCount', {}, 'Min'], [intInput, 'maxCount', {placeholder : 'Leave empty if no max', allowEmptyValue : true}, 'Max']],
            ['Message', [input, 'message', {placeholder : 'Message...'}]],
            ['Other Constraints', [multiEntryTable, 'other', {header : ['Constraint Name', 'Constraint Value']}]]
        ]
        return {initialState, conditions, submitConditions, content, header : 'Add Predicate', defaultActiveIndex : [0]}
}


