import React, {useEffect, useState} from 'react'
import {Form, Popup} from 'semantic-ui-react'
import {useForm} from 'react-hook-form'
import {MultiWordField} from './multi-word-field-2'
import {extendDict} from '../utils'

import {PropFieldForm} from './validation-form'

export default (details) => {

    const mapping = {
        anyURI : 'dropdown',
        string : 'text',
        boolean : 'checkbox',
        decimal : 'number',
        double : 'number',
        float : 'number',
        date : 'date',
        dateTime : 'datetime-local',
        time : 'time',
        gDay : 'dropdown',
        gMonth : 'dropdown',
        gYear : 'number',
        duration : 'number',
        hexBinary : 'text'
    }

    const input = details => {
        const keys = Object.keys(details)
        const isIn = x => keys.includes(x)
        if (isIn('in')) {
            return Form.Dropdown
        } else if (isIn('pattern')) {
            return Form.Input//MultiWordField
        } else {
            return Form.Input
        }
    }

    const fieldMapping = {
        'dropdown' : Form.Dropdown,
        'text' : input(details),
        'checkbox' : Form.Checkbox,
        'date' : input(details),
        'datetime-local' : input(details),
        'time' : input(details),
        'number' : input(details)
    }

    const typeDisplayPriorityList = [
        'checkbox',
        'dropdown',
        'time',
        'date',
        'datetime-local',
        'number',
        'text'
    ]

    const inputPriorityList = [
        Form.Checkbox,
        Form.Dropdown,
        MultiWordField,
        Form.Input
    ]

    //console.log('premade props at validator field', details)

    const simplfiedTypes = (details.types ? details.types : []).reduce((total, type) => {
        //console.log('simplgied types', total, type)
        if (Object.keys(mapping).includes(type)) {
            return [...total, mapping[type]]
        } else {
            return total
        }
    }, [])

    const optimalType = typeDisplayPriorityList.reduce((total, type) => {
        //console.log('optimal type', total, type, simplfiedTypes)
        if (total || !simplfiedTypes.includes(type)) {
            return total
        } else {
            return type
        }
    }, false)

    const typeToUse = optimalType ? optimalType : 'text'

    const Field = fieldMapping[typeToUse]

    //console.log('type to use', typeToUse, Field)

    const getField = (type, details) => {
        if (Object.keys(details).includes('pattern')) {
            return MultiWordField
        } else if (type === 'boolean') {
            return Form.Checkbox
        } else if (type === 'dropdown') {
            return Form.Dropdown
        } else {
            return Form.Input
        }
    }

    const convertType = (type) => {
        if (Object.keys(mapping).includes(type)) {
            return mapping[type]
        } else {
            return 'text'
        }
    }

    const FieldRenderer = [Form.Input, Form.Dropdown, Form.Select, Form.TextArea, Form.Field, Form.Button, Form.Radio, Form.Checkbox].includes(Field) ? NormalField : Field
    const fluid = [Form.Input, Form.Dropdown, Form.Select, Form.TextArea, Form.Field].includes(Field)

    return ({value, onSubmit, name='fooName', options, makeIRI, displayIRI}) => {
        //console.log('displayIRI', displayIRI, makeIRI)
        //console.log('optimal type', optimalType, simplfiedTypes)
        const props = {type : typeToUse, value : details.types && details.types.includes('anyURI') ? displayIRI(value) : value, onSubmit : v => onSubmit(v, details.types), fluid, Field, name, fieldSpecificOptions : options, ...details}
        return {field : <FieldRenderer {...props} />, check : <CheckSubmitted {...props}/>}
    }
}

const CheckSubmitted = ({value, name='fooName', validators}) => {
    const { handleSubmit, register, errors, setValue, triggerValidation } = useForm()
       
    const [isValidating, setValidating] = useState(false)

    const [valid, setValid] = useState(false)

    const triggerValidationCustom = async () => {
        setValidating(true)
        await triggerValidation({name}).then(setValidating(false))
    }

    const submit = e => {
        setValid(errors)
        handleSubmit(v => setValid(true))(e)
    }

    useEffect(() => {
        register({name}, validators)
        setValue(value)
        triggerValidationCustom()
        submit()
    }, [value])

    return valid
}

const NormalField2 = ({value, onSubmit, validators, options, type, fluid, name, Field, fieldSpecificOptions, makeIRI}) => {

    const baseprops = {
        value,
        fluid
    }

    const dropdownProps = {
        options : fieldSpecificOptions,
        value : fieldSpecificOptions.map(x => x.value).includes(value) ? value : makeIRI(value),
        search : true,
        selection : true,
        allowAdditions : true,
        noResultsMessage : 'No suggestions found. Please type your entry.',
        additionLabel : 'Custom Target: '
    }

    const props = {
        Field : ({error, onKeyPress}) => {
            const p = {...extendDict(baseprops, Field === Form.Dropdown ? dropdownProps : {value}), error, value, onKeyPress}
            return <Field {...p} />
        },
        validators,
        onSubmit
    }

    //return <Field {...dropdownProps} />

    return <PropFieldForm {...props} />

}

const NormalField = ({value, onSubmit, validators, options, type, fluid, name, Field, fieldSpecificOptions, changeRestrictions}) => {
    const { handleSubmit, register, errors, setValue, triggerValidation, getValues } = useForm()
    const [isValidating, setValidating] = useState(false)
    const [defaultValue, setDefaultValue] = useState(value)

    
    //console.log('inside normal field', value, options, Field)

    const triggerValidationCustom = async (e, {value}) => {
        //console.log('at trigger validation', name, value, e.target.value, e, e.target.option)
        setValue(name, value || e.target.value)
        setValidating(true)
        await triggerValidation({name}).then(setValidating(false))
    }

    const submit = async e => {
        setDefaultValue(getValues()[name])
        //console.log('default value', defaultValue, getValues()[name])
        triggerValidation({name})
        //console.log('after trigger validation')
        //handleSubmit(v => v[name] !== value && onSubmit(v[name]))
        handleSubmit(v => { 
            //console.log('inside handle submit', v, name, onSubmit)
            v[name] !== value && onSubmit(v[name])
        })()
        
    }

    useEffect(() => {
        (async () => {
            register({name}, validators)
            await triggerValidation({name})
        })()
    }, [validators])

    useEffect(() => {
        (async () => {
            setValue(name, value)
            await triggerValidation({name})
        })()
    }, [value])

    const baseprops = {
        fluid,
        type,
        //defaultValue : value,
        loading : isValidating,
        error : isValidating || errors[name] ? true : false,
        onBlur : () => submit(),
        //onKeyPress : e => e.key === 'Enter' && submit(),
        onChange : async (e, {value}) => {
            //console.log('on change triggered', e, value)
            if (!changeRestrictions || changeRestrictions(value)) {
                setValue(name, value || e.target.value)
                await triggerValidation({name})
            }
        }
    }

    //console.log('options details', fieldSpecificOptions, value)

    const dropdownProps = {
        options : fieldSpecificOptions,
        text : value,
        //value : value,
        //key : defaultValue,
        onKeyPress : e => {
            if (e.key === 'Enter') {
                //console.log(e)
                //console.log('on enter press', e.target.value)
                submit()
                //setValue(name, e.target.value)
                //handleSubmit(v => v[name] !== value && onSubmit(v[name]))
            }
        },
        search : true,
        selection : true,
        allowAdditions : true,
        noResultsMessage : 'No suggestions found. Please type your entry.',
        additionLabel : 'Custom Target: ',
        onClose : submit
    }

    const props = extendDict(baseprops, Field === Form.Dropdown ? dropdownProps : {defaultValue, onKeyPress : e => e.key === 'Enter' && submit()})

    //console.log('props', props)

return <Popup style={{width : '100%'}} position={'top center'} trigger={<Form style={{width : '100%'}} onSubmit={submit}><Field {...props}/></Form>} content={isValidating || errors[name] ? ({content : (isValidating ? 'validating...' : errors[name].message), pointing : 'below'}) : false} disabled={isValidating || errors[name] ? false : true} on={['focus', 'hover']}/>
}

export const PopupError = (field, error, validating) => {
    return <Popup position={'top center'} trigger={field} content={validating || error ? ({content : (validating ? 'validating...' : error.message), pointing : 'below'}) : false} disabled={validating || errors[name] ? false : true} on={['focus', 'hover']}/>
}

