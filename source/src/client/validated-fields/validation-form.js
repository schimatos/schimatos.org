import React, {useState, useEffect} from 'react';
import { Form, Popup, Input } from 'semantic-ui-react';
import {useForm} from 'react-hook-form'

export const PropFieldForm = ({Field, props, ...p}) => {
    const NewField = extraProps => {
        const ppty = props
        const allProps = {...ppty, ...extraProps}
        //console.log("all props and new field", allProps)
        return Field
        return () => <Input />
        return <Field {...allProps} />
    }
    const formProps = {...p, p : props, Field}
    return <DefaultedForm {...formProps} />
}

const DefaultedForm = ({Field, name, onSubmit, validators, value, p}) => {
    //console.log('inside defaulted from')
    const { handleSubmit, register, errors, setValue, triggerValidation, getValues } = useForm()
    const [validating, setValidating] = useState(false)
    const [defaultValue, setDefaultValue] = useState(value)

    const onSubmitCustom = async () => {
        setDefaultValue(getValues()[name])
        setValidating(true)
        await handleSubmit(v => v[name] !== value && onSubmit(v[name]))(e)
        .then(setValidating(false))
    }

    const triggerValidationCustom = async (n) => {
        setValidating(true)
        await triggerValidation({n : name})
        .then(setValidating(false))
    }

    const triggerMainValidation = async () => triggerValidationCustom(name)

    const onChangeCustom = async (n) => {
        return async (e, {value}) => {
            setValue(n, value || e.target.value)
            await triggerValidationCustom(n)
        }
    }

    const onChangeMain = async () => onChangeCustom(name)

    useEffect(() => {
        (async () => {
            register({name}, validators)
            await triggerValidation({name})
        })()
    }, [validators])

    useEffect(() => {
        (async () => {
            setValue(name, value)
            setDefaultValue(value)
            await triggerMainValidation()
        })()
    }, [value])

    const props = {
        ...p,
        onSubmit : onSubmitCustom,
        setValue,
        triggerValidation : triggerValidationCustom,
        register,
        onChangeCustom,
        onChangeMain,
        triggerMainValidation,
        value : defaultValue,
        error : errors[name] ? true : false,
        onKeyPress : e => e.key === 'Enter' && submit() 
    }

    //console.log('details', Field, Form.Input)

    return <ValidationForm error={errors[name]} validating={validating} onSubmit={onSubmitCustom} Field={<Form  style={{width : '100%'}} onSubmit={onSubmit}><Form.Input/><Input /><Field/><Field {...props} /></Form>}/>
}

export const ValidationForm = ({ onSubmit, error, validating, Field, errors }) => {
    //console.log('inside validation form')
    return <PopupError Field={Field} error={error} validating={validating} errors={errors} />;
};
const PopupError = ({ Field, error, validating }) => {
    //console.log('inside popup error')
    //return <Field />
    return <Popup position={'top center'} trigger={Field} content={validating || error ? ({ content: (validating ? 'validating...' : error.message), pointing: 'below' }) : false} disabled={validating || error ? false : true} on={['focus', 'hover']} />;
};
