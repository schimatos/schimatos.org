import React, { useReducer, useEffect } from 'react'

import {useForm} from 'react-hook-form'
import {Input, Dropdown, Select, Popup} from 'semantic-ui-react'

import {filterKeyDict, keyDelDict, valuesMatch, array2Dict, dictValuesMap, startMatch, hash, optionsFromArray} from '../utils'
import { useTriplestore } from '../custom-hooks/triplestore'

import { PopupError } from './index'

const makeInput = ({inputs, ...props}) => {
    const {onClose, onFocus, onChange, onKeyPress, isValidating, defaultValue} = useFormCustom(props)
    const singleInput = (input, i) => {
        const CustomInput = input.input
        const p = {
            onClose : onClose(i),
            onFocus : onFocus(i),
            onChange : onChange(i),
            onKeyPress,
            loading : isValidating,
            defaultValue : defautltValue(i),
            ...(CustomInput === Dropdown ? {text : defaultValue} : {value : defaultValue}),
            ...input.props
        }
        return <CustomInput {...p} />
    }
    return <Input>{inputs.map(singleInput)}</Input>
}

export default base_graph => {
    const {graphDetails, schema_prefixes} = useTriplestore()
    const prefixes = {...schema_prefixes, 'prefix' : ''}

    const unpackSingle = iri => {
        
        const p = Object.entries(prefixes).find(([k,v]) => iri.slice(0, v.length) == v)
        //console.log(p)
        return [p[0], iri.slice(p[1].length,)]

    }

    

    const unpackMulti = iris => {
        //console.log('iris at repack multi', iris)
        const commonStart = iris.slice(1).reduce((t, x) => {
            const startCount = Math.min(t.length, x.length)
            const mostCommon = _.range(0, startCount).reverse().find(i => t.slice(0,startCount-i) === x.slice(0,startCount-i))
            return t.slice(0, mostCommon)
        }, iris[0] || '')
        //console.log('commonStart', iris, commonStart)
        const [k, v] = unpackSingle(commonStart)
        //console.log([k, v])
        const cut = iris.map(x => x.slice(prefixes[k].length,))
        //console.log([k, cut])
        return [k, cut]
    }

    const repackSingle = ([namespace, name]) => prefixes[namespace] + name

    const repackMulti = ([k, v]) => {
        //console.log('at repack multi', k, v)
        const repacked = v.map(x => repackSingle([k, x]))
        //console.log('repacked', repacked)
        return repacked
    }

    const options = optionsFromArray(Object.keys(prefixes))

    return ({value, graph, validator, options: ops, labels, ...other}) => {
        //console.log('iri field value',value)
        const {default_namespace} = Object.values(filterKeyDict(graphDetails, k => k.includes(base_graph || graph)))[0]  || {}
        const v = (value && value !== '' && value) || prefixes[default_namespace] || ''
        const [unpack, repack] = Array.isArray(value) ? [unpackMulti, repackMulti] : [unpackSingle, repackSingle]

       // const iri_regex = new RegExp(String.raw`^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?`, 'i')
        //const 

        ////console.log('iri_rreg', iri_regex)
        //validator = {...(validator || {}), pattern : {value : iri_regex, message : 'Invalid IRI'}}

        const {onClose, onFocus, onChange, onKeyPress, isValidating, defaultValue, error} = useFormCustom({...other, validator, unpack, repack, value, prefixes})

        //console.log('unpack', unpackSingle(value))

        // useFormCustom({
        //     onSubmit,
        //     unpack,
        //     repack,
        //     value : v, 
        //     inputs : [{
        //         input : Dropdown,
        //         props : {options : optionsFromArray(Object.keys(prefixes))}
        //     },{
        //         input : Input,
        //         props : {
        //             fluid : true,
        //             type : 'text'
        //         }
        //     }]
        // })

        const field = (
            <div style={{margin : '0px', padding : '0px', width : '100%'}}>
            <Input style={{width : '100%', margin : '0px', padding : '0px'}} error={error ? true : false}>
                <Select
                    style={{height : '100%', margin : '0px'}}
                    defaultValue={defaultValue(0)}
                    onChange={onChange(0)}
                    onKeyPress={onKeyPress}
                    onFocus={onFocus(0)}
                    onClose={onClose(0)}
                    compact
                    error={error ? true : false}
                    attached={'right'}
                    options={options}/>
                {(ops||[]).length < 1 ? <Input
                    style={{width : '100%',height : '100%', margin : '0px', padding : '0px'}}
                    onClick={e => e.stopPropagation()}
                    defaultValue={defaultValue(1)}
                    onChange={onChange(1)}
                    onKeyPress={onKeyPress}
                    onFocus={onFocus(1)}
                    onBlur={onClose(1)}
                    fluid
                    error={error ? true : false}
                    attached={'left'}
                    loading={isValidating}
                    type='text'/>
                    :
                <Dropdown
                    style={{width : '100%',height : '100%', margin : '0px', padding : '0px'}}
                    search
                    allowAdditions
                    multiple
                    selection
                    fluid
                    style={{width : '100%'}}
                    defaultValue={defaultValue(1)}
                    value={defaultValue(1)}
                    options={[...ops.map(({key, text, value}) => {
                        // console.log(labels, value, text, 'dropdown render')
                        return ({key, text: labels[value] || text, value})
                    
                    })
                        , {key : defaultValue(1), text: defaultValue(1), value: defaultValue(1)}]}
                    //onClick={e => e.stopPropagation()}
                    onChange={onChange(1)
                    }
                    onKeyPress={onKeyPress}
                    onFocus={onFocus(1)}
                    onBlur={onClose(1)}/>
                }
            </Input>
            </div>
        )

            //console.log('error', error)

        return <Popup position={'top center'} trigger={field} content={error} on={['focus', 'hover']} disabled={!error} />
    }
}

const useFormCustom = ({onSubmit, unpack, repack, value, validator, onChange, prefixes={}, ...otherProps}) => {
    const [u, r] = unpack ? [unpack, repack] : [x => [x], ([x]) => x]
    const values = u(value)

    const [state, dispatch] = useReducer(
        ({focus, changed}, {type, id}) => ({
            'ADD' : {focus : [...focus, id], changed},
            'REMOVE' : {focus : [...focus.filter(x => x != id)], changed},
            'CHANGED' : {focus, changed : true}
        })[type], {focus : [], changed : false})

    const { handleSubmit, register, errors, setValue, triggerValidation, getValues } = useForm()

    const submit = () => {
        let newValue = r(Object.values(keyDelDict(getValues(), 'value')))
        if (newValue.includes(':')) {
            const [prefix, v] = newValue.split(':') // this is being deon in the wrong spot, to fix at lter date
            if (prefix in prefixes) {
                newValue = prefixes[prefix] + v
            } else {
                const [prefix2, v2] = newValue.replace(/[^]*[/#]/, '').split(':') // this is being deon in the wrong spot, to fix at lter date
                if (prefix2 in prefixes) {
                    newValue = prefixes[prefix2] + v2
            }
        }}
        if (value !== newValue) {
            setValue('value', newValue)
            handleSubmit(v => {
                //console.log('value inside handle submit')
                onChange({target : {value : v.value}},  {value : v.value})
            })()
        }
    }

    useEffect(() => {
        values.forEach((X, i) => {
            register(`${i}`, {})
        })
        register('value', validator || {})
    }, hash(validator))

    useEffect(() => {
        values.forEach((x, i) => {
            return setValue(`${i}`, x)
        })
        setValue('value', value)
    }, [value])

    useEffect(() => {
        state.focus.length === 0 && state.changed && submit()
    }, [state.focus.length])

    const onClose = id => e => {
        //console.log(e.target.value)
        dispatch({type :'CHANGED'})
        dispatch({type :'REMOVE', id})
        // setTimeout(() => {
        //     dispatch({type :'REMOVE', id})
        // }, 1)
    }

    const onChangeInternal = id => async (e, {value}) => {
        //console.log(e, value)
        setValue(`${id}`, e.target.value || value)
        // Handle the case of multi input dropdown wher onchange constitutes new entry net new char
        Array.isArray(value) && submit()
    }
    
    return {
        onChange : onChangeInternal,
        onClose,
        onFocus : id => () => dispatch({type :'ADD', id}),
        onKeyPress : e => {
            //console.log(e.value, e, e.target.value)
            e.key === 'Enter' && !Array.isArray(value) && submit()
        },
        defaultValue : id => values[id],
        error : errors?.value?.message || errors?.value,
        onSubmit : submit
    }
}

//     const onFocus = i => dispatch({type :'ADD', id : i})



//     //console.log('regexed field', fields)
//     const { handleSubmit, register, errors, setValue, triggerValidation } = useForm();




//     useWindowDimensions()
//     const {width} = getWindowDimensions()

//     const submit = e => {
//         //console.log('submit called', state)
//         setValue(name, remakeWord(v))

//         handleSubmit(v => {
//             //console.log('handle submit called', state)
//             const remade = remakeWord(v)
//             if (remade !== value) {
//                 onSubmit(remade)
//             }
//         })(e)
//     };

//     useEffect(() => {
//         //console.log('use effect called')
//         state.focus.length === 0 && state.changed && submit()
//     }, [state.focus.length])

//     useEffect(() => {
//         //console.log('registrations', registrations)
//         registrations.forEach(x => register(x[0], x[1]));

//         register(name, primaryValidation)
        
//     }, [registrations]);

//     useEffect(() => {
//         values.forEach(x => setValue(x[0], x[1]));
//     }, hash(values));

//     //console.log(errors)



//     async () => {
//         dispatch({type :'CHANGED'})
//         await triggerValidation(`${name}w${i}`)

//         setTimeout(() => {
//             dispatch({type :'REMOVE', id : i})
//             //console.log(state)
//             //state.length === 0 && 
//             //submit()
//         }, 1)
//     }




//     const { handleSubmit, register, errors, setValue, triggerValidation, getValues } = useForm()

//     const [isValidating, setValidating] = useState(false)
//     const [defaultValue, setDefaultValue] = useState(value)

//     const name = 'name'

//     const onChange = async (e, {value}) => {
//         setValue(name, value || e.target.value)
//         await triggerValidation({name})
//     }

//     const submit = async e => {
//         setDefaultValue(getValues()[name])
//         triggerValidation({name})
//         handleSubmit(v => {
//             v[name] !== value && onSubmit(v[name])
//         })() 
//     }










//     const baseprops = {
//         fluid,
//         type,
//         //defaultValue : value,
//         loading : isValidating,
//         error : isValidating || errors[name] ? true : false,
//         onBlur : () => submit(),
//         //onKeyPress : e => e.key === 'Enter' && submit(),
//         onChange : async (e, {value}) => {
//             //console.log('on change triggered', e, value)
//             if (!changeRestrictions || changeRestrictions(value)) {
//                 setValue(name, value || e.target.value)
//                 await triggerValidation({name})
//             }
//         }
//     }

//     return {
//         onClose,
//         onChange,
//         onKeyPress,
//         isValidating,
//         defaultValue
//     }

    
//     //console.log('inside normal field', value, options, Field)

//     const triggerValidationCustom = async (e, {value}) => {
//         //console.log('at trigger validation', name, value, e.target.value, e, e.target.option)
//         setValue(name, value || e.target.value)
//         setValidating(true)
//         await triggerValidation({name}).then(setValidating(false))
//     }

//     const submit = async e => {
//         setDefaultValue(getValues()[name])
//         //console.log('default value', defaultValue, getValues()[name])
//         triggerValidation({name})
//         //console.log('after trigger validation')
//         //handleSubmit(v => v[name] !== value && onSubmit(v[name]))
//         handleSubmit(v => { 
//             //console.log('inside handle submit', v, name, onSubmit)
//             v[name] !== value && onSubmit(v[name])
//         })()
        
//     }

//     useEffect(() => {
//         (async () => {
//             register({name}, validators)
//             await triggerValidation({name})
//         })()
//     }, [validators])

//     useEffect(() => {
//         (async () => {
//             setValue(name, value)
//             await triggerValidation({name})
//         })()
//     }, [value])

//     const baseprops = {
//         fluid,
//         type,
//         //defaultValue : value,
//         loading : isValidating,
//         error : isValidating || errors[name] ? true : false,
//         onBlur : () => submit(),
//         //onKeyPress : e => e.key === 'Enter' && submit(),
//         onChange : async (e, {value}) => {
//             //console.log('on change triggered', e, value)
//             if (!changeRestrictions || changeRestrictions(value)) {
//                 setValue(name, value || e.target.value)
//                 await triggerValidation({name})
//             }
//         }
//     }
// }




// import React, { useEffect, useReducer, useState } from 'react';
// import { useForm } from "react-hook-form";
// import _ from 'underscore';
// import { keepCloning, hash, makeRegexp, testRegexp, useWindowDimensions, getWindowDimensions, strip, stripMany } from '../utils';
// import { Form, Grid } from 'semantic-ui-react';





// export const MultiWordField = (props) => {
