import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from "react-hook-form";
import _ from 'underscore';
import { keepCloning, hash, makeRegexp, testRegexp, useWindowDimensions, getWindowDimensions, strip, stripMany } from '../utils';
import { Form, Grid } from 'semantic-ui-react';

export const MultiWordField = (props) => {
    //console.log('multi-word-field', props)
    const RegexedField = ({ fields, values, registrations, onSubmit, remakeWord, value, name='fooName', emptyFields, pixelsTaken, primaryValidation }) => {

        const [state, dispatch] = useReducer(({focus, changed}, {type, id}) => {
            if (type === 'ADD') {
                return {focus : [...focus, id], changed}
            } else if (type === 'REMOVE') {
                return {focus : [...focus.filter(x => x != id)], changed}
            } else {
                return {focus, changed : true}
            }
        }, {focus : [], changed : false})


        //console.log('regexed field', fields)
        const { handleSubmit, register, errors, setValue, triggerValidation, getValues, ...r } = useForm();




        useWindowDimensions()
        const {width} = getWindowDimensions()

        const submit = e => {
            ////console.log('submit called', state, e, v, r)
            // console.log(getValues())
            setValue(name||'fooName', remakeWord(getValues()))

            handleSubmit(v => {
                //console.log('handle submit called', state)
                const remade = remakeWord(v)
                if (remade !== value) {
                    //console.log(remade)
                    props.onSubmit(remade)
                }
            })(e)
        };

        useEffect(() => {
            //console.log('use effect called')
            state.focus.length === 0 && state.changed && submit()
        }, [state.focus.length])

        useEffect(() => {
            //console.log('registrations', registrations)
            registrations.forEach(x => register(x[0], x[1]));

            register(name||'fooName', primaryValidation)
            
        }, [registrations]);

        useEffect(() => {
            values.forEach(x => setValue(x[0].replace('undefined', 'fooName'), x[1]));
        }, hash(values));

        //console.log(errors)

        return (<Form style={{width : '100%'}} onSubmit={submit}>
            <div style={{margin : '0px', padding : '0px', textAlign : 'center'}}>
            <Grid style={{ padding: '0px', margin: '0px' }}>
                <Grid.Row centered stretched style={{ padding: '0px', margin: '0px' }}>
                    {fields.map((x, i) => <Grid.Column relaxed={false} key={i} verticalAlign={'bottom'} style={typeof (x) === 'string' ? { margin: '0px', padding: '0px'} : {padding: '1px', margin : '0px', width:'175px' }}>

                        {typeof (x) !== 'string' ? 
                            <Form.Input {...x}
                                //fluid
                                onClick={e => e.stopPropagation()}
                                style={{ margin: '0px', padding :" 0px"}}
                                error={errors[`${name||'fooName'}w${i}`] ? { content: errors[`${name||'fooName'}w${i}`].message, pointing: 'below' } : (errors[name||'fooName'] ? (i=== 0 ? { content: errors[name||'fooName'].message, pointing: 'below' } : true) : false)}
                                onFocus={() => dispatch({type :'ADD', id : i})}
                                onBlur={async () => {
                                    dispatch({type :'CHANGED'})
                                    await triggerValidation(`${name||'fooName'}w${i}`)

                                    setTimeout(() => {
                                        dispatch({type :'REMOVE', id : i})
                                        //console.log(state)
                                        //state.length === 0 && 
                                        //submit()
                                    }, 1)
                                }}
                                onChange={async (e) => {
                                    //console.log('onchange called', e.target.value)
                                    setValue(`${name||'fooName'}w${i}`, e.target.value);
                                    if (x.maxchar && e.target.value.length > x.maxchar) {
                                        await triggerValidation(`${name||'fooName'}w${i}`);
                                    } else if (errors[`${name||'fooName'}w${i}`]) {
                                        await triggerValidation(`${name||'fooName'}w${i}`);
                                    }}}
                                onKeyPress={e => e.key === 'Enter' && submit()} /> : <h4 style={{ marginBottom: '13px' }}>{x}</h4>}
                    </Grid.Column>)}
                </Grid.Row>
            </Grid>
            </div>
        </Form>);
    };

    const getDetails = (props, state) => {

        const patternSpecificMessages = (regex) => {
            //console.log('pattern specific, ', regex)

            
            const characters = [
                ['%', '%'],
                ['\.', '.'],
                ['\(', '('],
                ['\)', ')'],
                ['\[', '\]'],
                ['\*', '*'],
                ['\+', '+'],
                ['\?', '?'],
                ['\{', '{'],
                ['\}', '}'],
                ['\\', '\\'],
                ['>', '>'],
                ['<', '<'],
                ['\|', '|'],
                ['"', '"'],
                ["'", "'"],
                [':',':'],
                [';',';'],
                ['!', '!'],
                ['@', '@'],
                ['#', '#'],
                ['\$', '$'],
                ['\^', '^'],
                ['\*', '*'],
                ['-', '-'],
                ['_', '_'],
                ['&', '&'],
                ['&', '&']
            ]


            const {source, flags} = regex
            const mixed = flags.includes('i')
            //console.log('mixed', mixed)

            const expressions = [
                ['A-Z', mixed ? 'letter' : 'uppercase letter'],
                ['a-z', mixed ? 'letter' : 'lowercase letter'],
                ['0-9', 'number'],
                ['\d', 'digit from 0-9'],
                ['\w', 'mixed case word'],
                ['\s', 'whitespace'],
                ['\t', 'tab'],
                ['\r', 'return'],
                ['\n', 'newline'],
                ]


            if (source.includes('(') || source.includes(')')) {
                return 'Must match pattern \n' + '/' + source + '$/'
            } else {
                const pattern = source.split('^').reduce((t, x) => t+(t[t.length-1] === '\\' ? '\^' : '')+x , '')
                const [pattern1, count] = pattern.split(']')

                const [additionalCharacter, pattern2] = pattern1.includes('\.') ? [['.'], stripMany(pattern1, ['\.', '['])] : [[], strip(pattern1, '[')]
                                
                const [additionalExpression, pattern3] = pattern2.includes('\n') && strip(pattern2, '[').includes('.') ? ['Any Character', stripMany(pattern2, [['.'], '\n'])] : [[], strip(pattern2, '[')]

                const [baseExpressions, pattern4] = expressions.reduce(([c, currentPattern],[match, display]) => {
                    if (currentPattern.includes(match)) {
                        return [[...c, display], currentPattern.replace(match, '')]
                    } else {
                        return [c, currentPattern]
                    }
                }, [[],pattern3])

                const [specialCharacters, pattern5] = characters.reduce(([c, currentPattern],[match, display]) => {
                    if (currentPattern.includes(match)) {
                        return [[...c, display], currentPattern.replace(match, '')]
                    } else {
                        return [c, currentPattern]
                    }
                }, [[],pattern4])

                const additionalExpression2 = pattern5.includes('.') ? ['Any character except a new line'] : []


                const allCharacters = [...additionalCharacter, ...specialCharacters]

                const charExpression = allCharacters.length > 0 ? [`the characters ${allCharacters.reduce((t, x) => t+' '+x, '')}`] : []

                const allExpressions = [...baseExpressions, ...additionalExpression, ...additionalExpression2, ...charExpression]

                const expressionStatement = (expression) => {
                    const len = expression.length
                    if (len === 0) {
                        return 'characters'
                    } else if (len ===1 ) {
                        return expression[0]
                    } else {
                        return expression.slice(1).reduce((t, x, i) => t + (i === len - 2 ? ' or ' : ', ') + x,expression[0])
                    }
                }

                const countStatement = count => {
                    if (count) {
                        const components = stripMany(count, ['}', '{', '$'])
                        if (count.includes('*')) {return 'zero or more'}
                        if (count.includes('+')) {return 'one or more'}
                        if (components.includes(',')) {
                            const [min, max] = components.split(',')
                            if (min === '') {return `at most ${max}`}
                            if (max === '') {return `at least ${min}`}
                            return `between ${min} and ${max}`
                        } else {
                            return `exactly ${components ? components : '1'} ${allExpressions.length > 1 ? 'of' : ''}`
                        }
                    } else {
                        return 'any number of'
                    }
                }

                return `Must contain ${countStatement(count)} ${expressionStatement(allExpressions)}`

            }
        }


        //console.log('get details', props, state)
        const {pattern, name, defaultValue} = props
        const [fields1, rawFields1] = getFields(pattern, defaultValue, state.pattern, state.rawFields);

        const stripRep = x => {
            if (x?.[0]?.includes('[[') || x?.[0]?.includes(']]')) {
                return stripRep([x[0].replace('[[', '[').replace(']]', ']'), x.slice(1,)])
            } else {
                return x
            }
        }

        const fields = fields1.map(stripRep)
        const rawFields = rawFields1.map(stripRep)
        //console.log(fields)

        //console.log(fields, rawFields)
        const formValues = fields.reduce((total, x, i) => {
            return x[1] ? [...total, [`${name}w${i}`, x[4]]] : total;
        }, []);
        const getValues = Object.fromEntries(formValues);
        const customProps = i => Object({
            name: `${name}w${i}`,
            style: { margin: '0px', padding: '0px' },
            fluid: true,
            type: 'text',
            defaultValue: getValues[`${name}w${i}`],
            maxchar: fields[i][3]
        });
        const details = keepCloning(fields.map((x, i) => {
            return x[1] ? customProps(i) : x[0];
        }));
        const registrations = fields.reduce((total, field, i) => {
            if (field[1]) {
                //to add flags
                const toTest =  makeRegexp('/'+field[0]+'/')
                const required = !toTest.test('');
                return [...total, [{ name: `${name}w${i}`, type: 'text' }, { required: required ? { value: required, message: props.message || 'Required' } : false, maxLength: { value: fields[i][3], message: `This section can contain at most ${fields[i][3]} characters` }, minLength: { value: fields[i][2], message: `This section must contain at least ${fields[i][2]} characters` }, pattern: { value: toTest, message: patternSpecificMessages(toTest) } }]];
            }
            else {
                return total;
            }
        }, []);
        const remakeWord = v => {
            return fields.reduce((total, field, i) => {
                return total + (field[1] ? (v[`${name}w${i}`] || '') : field[0]);
            }, '');
        };

        const [pixelsTaken, emptyFields] = state.pattern !== pattern ? rawFields.reduce(([taken, empty], x) => {
            //console.log(x, x[1] , [x[0].length*8 + taken, empty] , (x[3] ? [x[3]*8 + taken, empty] : [taken, empty + 1]))
            // Should mek values below less hard  coded, they need to account for padding
            return !x[1] ? [x[0].length*10+ 6 + taken, empty] : (x[3] ? [(x[3]+4)*10 +6 + taken, empty] : [taken, empty + 1])
        }, [0, 0]) : [state.pixelsTaken, state.emptyFields]

        return { fields: keepCloning(details), values: formValues, registrations, remakeWord, name, pattern, rawFields, value : defaultValue, emptyFields, pixelsTaken};
    };

    const [state, setState] = useState({fields : [], registrations : [], values : []})

    useEffect(() => {
        //console.log('props', props)
        setState(getDetails(props, state))
    }, [props.pattern, props.defaultValue])

    return <RegexedField onSubmit={props.onSubmit} {...state} />;
};



const getFields = (pattern, value, oldPattern, oldFields) => {
    //console.log('get fields')
    const splitReg = pattern => {
        //console.log('split reg')
        const bracketMap = {
            '{': '}',
            '[': ']',
            '(': ')'
        };
        const bracketMap2 = {
            '}': '{',
            ']': '[',
            ')': '('
        };
        const specialSplit = reg => String.raw`${reg}`
            .split('{')
            .reduce((t, x) => {
                return [...t, ...x.split('}')];
            }, [])
            .reduce((t, x, i) => {
                if (i % 2 === 1 && !x.includes(',')) {
                    const no = parseInt(x);
                    if ([']', ')'].includes(t[t.length - 1])) {
                        const bracket = t[t.length - 1];
                        const toRepeat = _.range(0, t.length).reduce(([value, count], j) => {
                            if (value) {
                                //console.log('value', value, count)
                                return [value, count];
                            }
                            const a = (count === 1) && t[t.length - j - 1] === bracketMap2[bracket];
                            if ((count === 1) && t[t.length - j] === bracketMap2[bracket]) {
                                const toReturn = [t.slice(t.length - j, t.length), 1];
                                //console.log('to return other', toReturn)
                                return toReturn
                            }
                            const toReturn = (value ? [value, count] : (((count === 1) && t[t.length - j -1] === bracketMap2[bracket]) ? [t.slice(t.length - j-1, t.length), 1] : ([false, count + (t[t.length - j - 1] === bracket && (t.length - j - 1 < 1 || t[t.length - j - 2] !== '\\') ? 1 : (t[t.length - j - 1] === bracketMap2[bracket] && (t.length - j - 1 < 1 || t[t.length - j - 2] !== '\\') ? -1 : 0))])));
                            //console.log('to return', toReturn)
                            return toReturn
                        }, [false, 1])[0] || t.slice(1, t.length - 1);
                        //console.log('if', toRepeat)
                        const repeatTerm = [']'].includes(t[t.length - 1]) ? '[' + toRepeat + ']' : toRepeat
                        return _.range(0, no - 1).reduce((total, foo) => total + repeatTerm, t);
                    }
                    else {
                        //console.log('else')
                        return _.range(0, no - 1).reduce((total, foo) => total + t[t.length - 1], t);
                    }
                }
                return t + (i % 2 === 1 ? '{' + x + '}' : x);
            }, '')
            .split('')
            .reduce(([all, bracket, depth, previous], x) => {
                //console.log(all, bracket, depth, previous, x)
                if (['[', '{', '('].includes(x) && previous !== `\\` && bracket === undefined) {
                    if (x === '{') {
                        all[all.length - 1] = all[all.length - 1] + x;
                        return [all, x, 1, x];
                    }
                    else {
                        return [[...all, x], x, 1, x];
                    }
                }
                else if (bracket && bracketMap[bracket] === x) {
                    all[all.length - 1] = all[all.length - 1] + x;
                    return [all, depth - 1 === 0 ? undefined : bracket, depth - 1, x];
                }
                else if (bracket === x) {
                    all[all.length - 1] = all[all.length - 1] + x;
                    return [all, bracket, depth + 1, x];
                }
                else {
                    if ([']', '}', ')'].includes(previous) && depth === 0) {
                        return [[...all, x], bracket, depth, x];
                    }
                    else if (depth === 0 && ((previous !== '\\' && !['|', '+', '*', '?', '^', '$', '.'].includes(x) && all[all.length - 1].length > 0) || (previous === '\\' && ['|', '+', '*', '?', '^', '$', '.'].includes(x) && all[all.length - 1].length > 1))) {
                        return [[...all, x], bracket, depth, x];
                    }
                    else {
                        all[all.length - 1] = all[all.length - 1] + x;
                        return [all, bracket, depth, x];
                    }
                }
            }, [[''], undefined, 0, undefined])[0]
            .filter(x => x !== '')
            .map(x => {
                //console.log(x)
                const canStrip = ['|', '?'].reduce((t, y) => t && !x.includes(y), true) && x.length > 0 && ['('].includes(x[0]) && [')'].includes(x[x.length - 1]);
                return canStrip ? x.slice(1, x.length - 1) : x;
            })
            .reduce((t, x) => t + x, '')
            .split('')
            .reduce(([all, bracket, depth, previous], x) => {
                if (['[', '{', '('].includes(x) && previous !== `\\` && bracket === undefined) {
                    if (x === '{') {
                        all[all.length - 1] = all[all.length - 1] + x;
                        return [all, x, 1, x];
                    }
                    else {
                        return [[...all, x], x, 1, x];
                    }
                }
                else if (bracket && bracketMap[bracket] === x) {
                    all[all.length - 1] = all[all.length - 1] + x;
                    return [all, depth - 1 === 0 ? undefined : bracket, depth - 1, x];
                }
                else if (bracket === x) {
                    all[all.length - 1] = all[all.length - 1] + x;
                    return [all, bracket, depth + 1, x];
                }
                else {
                    if ([']', '}', ')'].includes(previous) && depth === 0) {
                        return [[...all, x], bracket, depth, x];
                    }
                    else if (depth === 0 && ((previous !== '\\' && !['|', '+', '*', '?', '^', '$', '.'].includes(x) && all[all.length - 1].length > 0) || (previous === '\\' && ['|', '+', '*', '?', '^', '$', '.'].includes(x) && all[all.length - 1].length > 1))) {
                        return [[...all, x], bracket, depth, x];
                    }
                    else {
                        all[all.length - 1] = all[all.length - 1] + x;
                        return [all, bracket, depth, x];
                    }
                }
            }, [[''], undefined, 0, undefined])[0]
            .filter(x => x !== '')
            .reduce((t, x) => {
                const special = ['|', '+', '*', '?', '^', '$', '.', '{', '[', '('].includes(String.raw`${x}`[0]) || ['\\d', '\\w', '\\s', '\\D', '\\W', '\\S', '\\1', '\\2', '\\K', '\\Q', '\\E'].includes(String.raw`${x}`);
                const clearEnd = x
                const range = clearEnd.length > 0 && clearEnd[clearEnd.length - 1] === '}' ? clearEnd.split('{')[clearEnd.split('{').length - 1].replace('}', '').split(',') : [undefined, undefined];
                const [min, mx] = [range[0] !== undefined && parseInt(range[0]), range[1] !== undefined && parseInt(range[1])];
                const max = (min > 0 && !mx) ? min : mx;
                if (t.length > 0) {
                    const [previous, prevSpecial, prevMin, prevMax] = t.pop();
                    const toAdd = special ? x : `${x}`.split('').reduce(([t, escaping], x) => (x === '\\' && !escaping) ? [t, x === '\\'] : [t + x, false], ['', false])[0];
                    //console.log('too add', toAdd, x)
                    const updateNo = (a, b) => [a, b].includes(undefined) ? undefined : a + b;
                    return special === prevSpecial ? [...t, [previous + toAdd, prevSpecial, updateNo(prevMin, min), updateNo(prevMax, max)]] : [...t, [previous, prevSpecial, prevMin, prevMax], [toAdd, special, min, max]];
                }
                else {
                    return [[x, special, min, max]];
                }
            }, []).map(x => {
                return x;
            });
        const elements = String.raw`${pattern}`.split('/');
        const flags = elements.pop();
        const actual = elements.slice(1);
        const internalPattern = actual.reduce((t, x) => t + '/' + x, '').slice(1);
        const components = specialSplit(String.raw`${internalPattern.slice(1, internalPattern.length - 1)}`).map(([element, special, min, max]) => {
            return special ? [`/^${element}$/${flags}`.replace('$$/', '$/').replace('/^^', '/^'), special, min > 1 ? min : undefined, max > 1 ? max : undefined] : [element, special];
        });
        //console.log('components', components)
            const components2 = components.map(x => {
                //console.log(x[0][0])
                x[0] = x[0][0] === '\\' ? x[0].slice(1): x[0]
                return [...x]
            })
            //console.log('components2', components2)
        return components;
    };
    const specificValues = (pattern, value) => {
        //console.log('secific values')
        const fields = pattern === oldPattern ? oldFields : splitReg(pattern);
        const varFields = fields.filter(x => x[1]).map(x => x[0]);
        if (['', undefined].includes(value)) {
            return [fields.map(x => x[1] ? [...x, ''] : x), fields]
        }
        else {
            const splitters = fields.reduce((t, x) => !x[1] ? [...t, x[0]] : t, []);
            const splitOptions = splitters.reduce((total, x) => {
                return total.reduce((t, splitting) => {
                    const end = splitting[splitting.length - 1];
                    const splits = end.split(x);
                    const ends = splits.slice(1).map((elt, ind) => {
                        const first = splits.slice(0, ind + 1);
                        const last = splits.slice(ind + 1, splits.length);
                        return [first.slice(1).reduce((a, y) => a + x + y, first[0]), last.slice(1).reduce((a, y) => a + x + y, last[0])];
                    });
                    const newSplits = ends.map(e => [...splitting.slice(0, splitting.length - 1), ...e]);
                    return [...t, ...newSplits];
                }, []);
            }, [[value]])
                .reduce((t, x) => {
                    //console.log('x', x, x.length, varFields.length, t)
                    return [...t, ...(x.length > 0 && x.length === varFields.length + 1 ? [x.slice(0, x.length - 1), x.slice(1)] : []), ...(x.length > 1 && x.length === varFields.length + 2 ? [x.slice(1, x.length - 1)] : []), ...(x.length === varFields.length ? [x] : [])];
                }, []) // This is a hacky fix for enpty string appearing at the ends of the array
                .filter(x => x.length = varFields.length)
                //.filter(x => x.includes(undefined))
                //console.log(splitOptions)
            const option = splitOptions.filter(x => x.length = varFields.length).reduce((t, option) => {
                const isValid = option.reduce((total, opt, i) => {
                    return total && testRegexp(varFields[i], opt);
                }, true);
                return t || (isValid ? option : false);
            }, false);
            //console.log('option', option)

            // const updatedOption = option.map(x => {
            //     //console.log(x[0][0])
            //     x[0] = x[0][0] === '\\' ? x[0].slice(1): x[0]
            //     return [...x]
            // })

            // //console.log('option', updatedOption)

            const mappedFields = fields.map((x, i) => {
                return x[1] ? [...x, option[0.5 * i + (fields[0][1] ? 0 : -0.5)]] : x;
            });
            return [mappedFields, fields];
        }
    };
    return specificValues(pattern, value);
};