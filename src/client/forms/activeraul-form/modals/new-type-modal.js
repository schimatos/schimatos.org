import {input} from '../../fields/functional-react'
import setOptionsDropdown from '../../fields/set-options-dropdown'
import multiEntryTable from '../../fields/multi-entry-table'
import {hasDuplicates, validRegexp, stringRegexp} from '../../../utils'
import { multiOrSingleInput } from '../../fields/multi-or-single-input'
import { intInput } from '../../fields/int-input'

export default ({name, baseType}) => {

    const types = {
        'numeric' : ['integer',
            'decimal',
            'positiveInteger',
            'negativeInteger',
            'nonPositiveInteger',
            'nonNegativeInteger'
        ],
        'other numeric' : [
            'float',
            'double',
            'long',
            'int',
            'short',
            'unsignedLong',
            'unsignedInt',
            'unsignedShort',
            'unsignedLong'
        ],
        'string/word/phrase' : ['string'],
        'date' : ['dateTime'],
        'other' : ['byte', 'unsignedByte'],
        'extend existing' : []
    }

    const infoForUsers = {
        'integer' : 'postive or negative whole number',
        'float' : 'decimal with 7 digit accuracy (32 bit)',
        'positiveInteger' : 'whole number greater than or equal to 1',
        'nonNegativeInteger' : 'whole number greater than or equal to 0',
        'negativeIntegar' : 'whole number less than or equal to -1',
        'nonPositiveInteger' : 'whole number less than or equal to 0'
    }

    const flagMapping = {
        'Case Insensitive' : 'i',
        'Multiple Lines' : 'm',
        'Enable dotall' : 's',
        'Enable full unicode support' : 'u'
    }

    const makeFlags = flags => {
        return flags.reduce((t, x) => t + flagMapping[x], '')
    }

    const 


    const initialState = {
        name : name ? '' : name,
        extendComplex : false,
        complexBase : undefined, // Be written in when the other base is checked
        baseType : baseType ? baseType :  'string',
        typeGroup : 'string/word/pharse',
        pattern : '',
        flags : ['Case Insensitive'],
        min : undefined,
        isMinInclusive : true,
        max : undefined,
        isMaxInclusive : true,
        minLength : 0,
        maxLength : undefined,
        message : ''
    }



    const content= (state) => {
        const {extendComplex, complexBase, baseType} = state
        const xsdBase = extendComplex ? complexBase : baseType
        const pattern = ['Pattern', [Input, 'pattern'], [setOptionsDropdown, 'flags', {options : ['Case Insensitive', 'Multiple Lines', 'Enable dotall', 'Enable full unicode support']}]]
        const valueRange = ['Value Range', [props => Input({...props, type : xsdBase}), 'min'], [CheckBox, 'isMinInclusive'], [props => Input({...props, type : xsdBase}), 'max'], [CheckBox, 'isMaxInclusive']]
        return [
            ['Type Name', [Input,  'name', {placeholder : 'Name...'}]],
            ['Base Type', [setOptionsDropdown, 'typeGroup', {options : Object.keys(types)}], [setOptionsDropdown, 'baseType', {options : types[state.baseType]}]],
            ['Pattern', [Input, 'pattern'], [setOptionsDropdown, 'flags', {options : ['Case Insensitive', 'Multiple Lines', 'Enable dotall', 'Enable full unicode support']}]],
            xsdBase === 'string' ? pattern : valueRange,
            ['message', [Input, 'message']]
        ]
    }


        const toDetails = state => {
            const output = { 'sh:severity' : 'Violation'}

            if (state.min != undefined) {
                if (state.isMinInclusive) {
                    output['sh:minInclusive'] = state.min
                } else {
                    output['sh:minExclusive'] = state.min
                }
            }

            if (state.max != undefined) {
                if (state.isMaxInclusive) {
                    output['sh:maxInclusive'] = state.max
                } else {
                    output['sh:maxExclusive'] = state.max
                }
            }

            if (state.minLength > 0) {
                output['sh:minLength'] = state.minLength
            }

            if (state.maxLength > 0) {
                output['sh:maxLength'] = state.maxLength
            }

            if (state.pattern != '') {
                output['sh:pattern'] = stringRegexp(state.pattern, state.flags)
            }

            if (state.typeGroup = 'extend existing') {
                output['sh:datatype'] = state.baseType
            } else {
                output['sh:datatype'] = 'xsd:' + state.baseType
            }

            if (state.message != '') {
                output['sh:message'] = state.message
            }
        }   


        // const testPattern = (pattern, flags) => {
        //     if (validRegexp(pattern, flags) === true) {

        //     }
        // }
        // try {
        //     const re = new RegExp()
        // }


        return {initialState, conditions, submitConditions, content, header : 'Add Predicate'}
}


