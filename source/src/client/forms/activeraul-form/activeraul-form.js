import React, {useContext, useEffect, useState} from 'react';
import {Segment, Grid, Dropdown, Popup, Input, Button, Icon, Confirm, Select} from 'semantic-ui-react'
import {TargetsContext, LayoutContext, TriplestoreContext, ActiveraulContext, HistoryContext} from '../../context'
import {useActiveraul} from '../../custom-hooks'
import DynamicButton from '../fields/dynamic-button'
import CancelableLoader from '../fields/cancelable-loader'
import {keepCloning, hashDict, fromCamel, camelToSnake, contentReduce, extendDict, extendArray, hyperlink, eqHash, hash, optionsFromArray} from '../../utils'
import endpointFunc from '../../custom-hooks/helper-functions/endpoint'
import Activeraul from '../../custom-hooks/activeraul-history'
import Conversions from '../../custom-hooks/helper-functions/conversions'
import setOptionsDropdown from '../fields/set-options-dropdown'
import {MultiWordField} from '../../validated-fields/multi-word-field-2'
import IRIField from '../../validated-fields/IRI-field'
import {onFormLoad} from '../../effects'
import triplestoreInterface from '../../triplestore-interface'

//import MultiWordField from 'multi-word-field'

// const customEffects = () => {
//     const endpoint = endpointFunc()
//     const [state, dispatch] = Activeraul()
//     const [targets,] = useContext(TargetsContext)
//     const {displayIRI, makeIRI} = Conversions(0)

//     console.log('state at start of activeraul form', state)
    

//     const fetchData = async () => {

//         console.log('fetch data called')

//         const getOptions = (k, parent, property) => {
//             //console.log('inside for each',state.targets, pare)
//             if (k > -1 && state.targets[parent].submitted) {
//                 return () => {
//                     const {requested, loading} = targets.property[k]
//                     const {path, pathType} = state.propertyList[property]
//                     // Ignoring alternate paths for now
//                     return (!requested && !loading && pathType !== 'alternativePath') ? endpoint({
//                         query : 'OPTIONS', context : 'targets',
//                         init : {type : 'SET_LOAD_STATUS', category : 'property', ids : [k], loading : true},
//                         error : {type : 'SET_LOAD_STATUS', category : 'property', ids : [k], loading : false},
//                         response : {type : 'SEARCH_RESPONSE', category : 'property', id : k, displayIRI, makeIRI},
//                         other : {subject : state.targets[parent].value, predicate : path, inverse : pathType === 'inversePath'}
//                 }) : {} }
//             } else {
//                 return () => []
//             }
//         }

//         Object.entries(state.properties).forEach(([k, {parent, property}]) => {
//             console.log('inside for each', k, parent, property)
//             getOptions(k, parent, property)()
//         })
//     }

//     const updateFields = async () => {
//         dispatch({type : 'DISPLAY_SUBMITTED', property : keepCloning(targets.property)})
//     }

//     return {
//         fetchData,
//         updateFields
//     }
// }

export default () => {
    const IField = IRIField('knowledge')
    const triplestore = triplestoreInterface()
   onFormLoad()

   const [,hDisp] = useContext(HistoryContext)

   const [a,activeraulDispatch] = useContext(ActiveraulContext)
   const hist =  useContext(HistoryContext)[0][0]
   const h = hist.length > 0 ? hist.slice(-1) : hist

   setTimeout(() => {
     
    !eqHash(h[0], a) && hist.length > 3 && hDisp({type : 'REFRESH_STATE', activeraulDispatch})
   }, 1000)

   const [targets,] = useContext(TargetsContext)


    const [state, dispatch] = Activeraul()
    const {focus, propertyList, properties, targets: actualTargets} = state
    const {addOption, addOptionOnly, remove, cancelLoad, submitAll, getLabels} = useActiveraul()
    
    useEffect(() => {
        const toGet = [Object.values(propertyList).map(target => target.in|| []).flat(), Object.values(actualTargets).map(target => target.value).filter(x => x!= '')].flat()
        const optionsToGet = Object.values(targets.property).map(x => x.options).flat().map(x => x.value).filter(x => x.includes('http://'))
        // console.log('labvels to get', toGet)
        // console.log(toGet, targets, state)
        // console.log(optionsToGet)
        getLabels([toGet, optionsToGet].flat())
    }, hash([actualTargets, propertyList, Object.values(targets.property)]))

    // console.log('targets', targets, state.labels)

    const [{startPoint},] = useContext(LayoutContext)
    const {displayIRI, displayIRIMulti, makeIRI} = Conversions(0)
    //const {fetchData, updateFields} = customEffects()
    const [{advanced_features, schema_prefixes},] = useContext(TriplestoreContext)
    const [{typeConstraints},] = useContext(TargetsContext)

    const {display_path_instead_of_name} = advanced_features

//    console.log(state, targets)


    // state.propertyList = {
    //     ...state.propertyList,
    //     '-1' : {
    //         path : 'Full Form',
    //         pathType : 'path',
    //         severity : 'none'
    //     }
    // }
    
    // useEffect(() => {updateFields()}, hashDict(targets.property))
    // useEffect(() => {fetchData()})
    // const v = start
    // const [detailsForEntity, setDetails] = useState([])

    // useEffect(() => {
    //     triplestore({
    //         query : 'TARGET_DETAILS',
    //         initFunc: () => setDetails([]),
    //         errorFunc: () => setDetails([]),
    //         responseFunc: x => setDetails(Object.entries(x.reduce((t, [p, o]) => {
    //             t[p] = [...(t[p] ? t[p] : []), o]
    //             return t
    //         }, {}))),
    //         subject : value
    //     }) 
    // }, hash(value))
 
    // const unpackSingle = iri => {
    //     const f = Object.entries(schema_prefixes).find(([k, v]) => iri.includes(v))
    //     return f ? f[0] + ':' + iri.slice(f[1].length,) : iri
    // }
    
    // const nm = detailsForEntity.find(([k,v]) => k == 'http://www.w3.org/2000/01/rdf-schema#label')?.[1]
    // const typeDetails = detailsForEntity.find(([k,v]) => k == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type')?.[1]
    

    const PropertySegment = ({children, id, pathOpen}) => {
        const {property, loading, hidden} = properties[id]
        const {path, pathType, severity, maxCount, message, minCount, name, description, class:cl,in:ins} = propertyList[property]
        const displayProperties = Object.keys(propertyList[property]).filter(x => !['path', 'pathType', 'message', 'severity'].includes(x))
        // console.log(property)
        children = pathType === 'alternativePath' ? [...children[0], ...children[pathOpen]] : children
        const targetsNo = children.length
        const atMax = maxCount && (maxCount <= targetsNo)
        const atMin = minCount >= targetsNo
        const violation = !severity || severity === 'Violation'
        // console.log(actualTargets)
        const numberOfActualValues = children.reduce((count, id) => actualTargets[id].value && actualTargets[id].value != '' ? count+1 : count,0)
        const constraintSatisfied = (numberOfActualValues >= minCount) && (!maxCount || (maxCount >= targetsNo))

        const {color : tempColour, sevIcon, altName} = {
            'Info' : {color : 'white',  sevIcon : 'info circle', altName : 'Possible Field'},
            'Warning' : {color : 'yellow', sevIcon : 'alarm', altName : 'Likely Field'},
            'Violation' : {color : 'red',    sevIcon : `warning sign`, altName : 'Definite Field'},
            'none' : {}
        }[severity ? severity : 'Violation']

        const color = constraintSatisfied ? 'green' : tempColour
    
        const {pathIcon, pathText, pathDescription} = {
            path : {},
            inversePath : {pathIcon : 'pointing up', pathDescription : 'The options you select in this field are subjects'},
            alternativePath : {pathIcon : 'move', pathDescription : 'The options you select in this field are subjects'},
            zeroOrMorePath : {pathText : '0+', pathDescription :  'This is satisfied by any entity which is connected to the target via zero or more steps along this path. Hence the target is included in the constraint'},
            zeroOrMorePath : {pathText : '1+', pathDescription :  'This is satisfied by any entity which is connected to the target via one or more steps along this path'},
            zeroOrMorePath : {pathText : '0|1', pathDescription :  'This is satisfied by any entity which is connected to the target via zero or one steps along this path. This can be teated as a normal property path with the addition of the target itself being included in the constraint'}
        }[pathType]

        const header = {
            left : {
                icons : [{
                    name : sevIcon,
                    popup : {
                        header : `Severity level: ${severity ? severity : 'undefined'}`,
                        content : <>{!severity && <>Shacls with undefined severity default to a <i>violation</i>. </>}For more information see the <a href="https://www.w3.org/TR/shacl/#severity" target="_blank">official W3C documentation.</a></>
                    }
                },{
                    name : pathIcon ? pathIcon : undefined,
                    text : pathText,
                    popup : {
                        header : fromCamel(pathType),
                        content : <>{pathDescription}. For more information see <a href={`https://www.w3.org/TR/shacl/#${camelToSnake(pathType.replace('Path',''))}`} target="_blank">official W3C documentation.</a></>
                    }
                }],
                buttons : [
                    {
                    name : 'x',
                    popup : {
                        header : 'Remove Field',
                        content : 'This will remove the field from the form without making further edits to the triplestore'
                    },
                    giveWarning : true,
                    warningMessage : 'This will remove the field from the form without making further edits to the triplestore',
                    onClick : {type : 'REMOVE', t : 'properties', id}
                }
            ]
            
            
            },
            right : {
                buttons : [{
                    name : 'plus',
                    popup : {content : 'Add options field'},
                    disabled : atMax && violation,
                    giveWarning : atMax,
                    warningMessage : `Are you sure? The constraint says that this property has at most ${maxCount} targets and there are already ${targetsNo}.`,
                    onClick : {type : 'ADD_OPTIONS_FIELD', no : id}
                }]
            },
            title : {
                content : (display_path_instead_of_name || !name) ? _.entries(schema_prefixes).reduce((t, [k, v]) => t.replace(v, k+':'), path||'') : _.entries(schema_prefixes).reduce((t, [k, v]) => t.replace(v, k+':'), name||''),
                
                
                // pathType === ('alternativePath' ? (
                //     setOptionsDropdown({value : displayIRI(_.entries(schema_prefixes).reduce((t, k, v) => t.replace(v, k), pathOpen||'')||''),
                //                     options : _.isArray(path) ? displayIRIMulti(path) : [],
                //                     onChange : (e, {value}) => dispatch({ type : 'CHANGE_ALTERNATE_PATH', id, value : makeIRI(value)})})
                // ) : (
                //         ((display_path_instead_of_name || !name) ? displayIRI(path.replace('http://example.org/', 'ex:').replace(`http://www.w3.org/2000/01/rdf-schema#`, 'rdfs:').replace(`http://linked.data.gov.au/def/agrif#`, 'agrif:')) : name.replace('http://example.org/', 'ex:').replace(`http://linked.data.gov.au/def/agrif#`, 'agrif:').replace(`http://linked.data.gov.au/dataset/environment/assessment#`, 'doee_asm:'))
                // )) + (cl && ' (a ' + cl + ')')
                
                
                popup : path!=='Full Form' && ({
                    header : <a href={path} color='black' target="_blank">{path}</a>,
                    content : <>{message&&message}<br/>{displayProperties.map((x,i) => <div key={i}>{fromCamel(x)}: {propertyList[property][x]}</div>)} </>,
                    path
                })
            }
        }

        const childValues = children.map(x => state.targets[x].value)
        const [options, childOptions] = targets.property[id].options.reduce(([o, c], opt) => childValues.includes(opt.value) ? [o, [...c, opt]] : [[...o, opt], c], [[],[]])
        // console.log(options, childOptions, state)
        const childOptionsDict = Object.fromEntries(childOptions.map(x => [x.value, x]))
        // console.log(options, childOptions, childOptionsDict)
        // getLabels(ins||[])
        const TargetDropdown = (i, value, c) => {
            //console.log('at dropdown generate')
            const currentOpt = (value === '' || !childOptionsDict[value]) ? {text:'',key:'',value:''} : childOptionsDict[value]
            const opts = value !== '' ? [...options, currentOpt] : options
            const {field, check} = targets.renderedValidators[id] ? targets.renderedValidators[id]({value, onSubmit : (v) => addOption(i, id, v, undefined)
                , name : `${i}`, options : opts, makeIRI, displayIRI}) : {field : <div></div>, check : false}
                
                
                // console.log('children', children)
                const chilrenFlattened = children.map(c => (actualTargets[c]?.children || [])).flat()
            const IRINodekind = ((!!propertyList[property].nodeKind && propertyList[property].nodeKind.includes('IRI') && !propertyList[property].nodeKind.includes('Or')) || chilrenFlattened.length > 0)
                //const Field = field
            // need to update shape
            //console.log(value, optionsFromArray(ins||[]))
            //console.log(propertyList[property].nodeKind ,propertyList[property].nodeKind && propertyList[property].nodeKind.includes('IRI') ,propertyList[property].nodeKind && !propertyList[property].nodeKind.includes('Or'))
            return (
                <div onClick={() => dispatch({type : 'SET_FOCUS', t : 'targets', i, noHold : true, startPoint})}>
              {/* <Dropdown options={options}/> */}
              <Input onSubmit={() => {}} type='text' action fluid style={{padding : '0px', margin : '0px', width : '100%'}} >
                
                {!ins ? !IRINodekind &&!(propertyList[property].pattern || typeConstraints[propertyList[property].datatype]?.pattern) && field : <Select key='selfield' placeholder={'-- Select a value --'} onChange={(v, {value}) => addOption(i, id, value, undefined)} value={value} options={ins.map(x => ({key : x, text : state.labels[x] || x, value : x}))} fluid/>}
                {(propertyList[property].pattern || typeConstraints[propertyList[property].datatype]?.pattern) && [<MultiWordField key='multiword' {...{...propertyList[property], value, onSubmit : (v) => addOption(i, id, v, undefined), pattern : '/'+(propertyList[property].pattern||typeConstraints[propertyList[property].datatype]?.pattern)+'/'
                }}/>, value && 'Currently Submitted: ' + value]}
                {IRINodekind && [<IField key='ifielf' value={value} labels={state.labels} onChange={(t, {value})=> addOption(i, id, value, undefined)} onSubmit={console.log} options={options}/>]}
                {i > 0 && !atMin && <Button icon='x' onClick={() => remove('targets', i)}/>}
                </Input>
                {/* {value} */}
                {/* The below field is depricated and simply displays the input in the background state of activeraul at a given time. Do not use it to make inputs as it does not perform validations.
                <Input key={'input'+i+"depricated"} type='text' action fluid style={{padding : '0px', margin : '0px'}} >
                <Dropdown
                    key={'key'+i+"depricated"}
                    options={opts}
                    loading={loading}
                    placeholder='Target...'
                    value={value}
                    search
                    selection
                    onClick={() => dispatch({type : 'SET_FOCUS', t : 'targets', i, noHold : true, startPoint})}
                    style={{margin : '0px'}}
                    fluid
                    allowAdditions
                    noResultsMessage='No suggestions found. Please type your entry.'
                    additionLabel='Custom Target: '
                    onClose={(e, {value}) => addOptionOnly(i, id, value)}
                    onChange={(e, {value}) =>  addOption(i, id, value)}/>
                <DynamicButton
                    key={'button' + i}
                    style={{margin : '0px', padding : '11px'}}
                    name='x'
                    attached='right'
                    disabled={atMin && violation}
                    giveWarning={atMin}
                    warningMessage={`The constraint says that this property has at least ${minCount} target${minCount == 1 ? '' : 's'} and there ${targetsNo == 1 ? 'is' : 'are'} only ${targetsNo} remaining.`}
                    onSubmit={() => dispatch({type : 'REMOVE', t : 'targets', id : i})}/>
                </Input> */}
                </div>
            )
        }

        return {color, header, children, hidden, TargetDropdown, bottom : description}
    }

    //const groups = target.groups

    

    const TargetSegment = ({value, submitted, children, id, TargetDropdown}) => {
        const parentId = state.targets[id].parent
        const dbRemove = parentId > -1
        TargetDropdown = TargetDropdown ? TargetDropdown : PropertySegment({id : parentId, ...state.properties[parentId]}).TargetDropdown
        
        return {header : submitted &&
        {title : {content : children.length > 0 ? <h2>{state.labels[value] || displayIRI(value)}</h2> :(state.labels[value]  || displayIRI(value)), popup :  hyperlink(value)},
            right : {
                buttons :
                dbRemove ? [
                ({name : 'x',
                popup : {content : dbRemove ? 'Remove Target' : 'Close section'},
                disabled : false,
                giveWarning : true,
                warningMessage : dbRemove ? 'This will make changes to the triplestore' : 'This will remove this field from the form but no changes will be made to the triplestore',
                onClick : () => remove('targets', id, dbRemove)
                })
            ] : []
            }
            },
            children,
            content : !submitted && TargetDropdown(id, value, children), hidden : state.targets[id].hidden,
            }     
        }
    
    const nextRender = (type, oldDetails, length) => (id, index) => {

            const det = state[type][id]
            const {header, children, color, content, bottom, ...details} = (type === 'targets' ? TargetSegment : PropertySegment)({...det, id, ...oldDetails})
            return anySegment({...det, header, children, id, bottom, type, color, content, details, isFirst : index ===0, isLast : index === length-1 })
        }
    
    const anySegment = ({children, hidden, header, type, id, loading, color, content, details, isFirst, isLast, bottom}) => {
        // Cancel load isnt really going to work well an any update actions currently...
        if (loading) {return <Segment style={{padding : '5px', margin : '0px'}}><CancelableLoader onClick={() => cancelLoad(type, id)}/></Segment>}
        const pad = children.length > 0 && !hidden
        const isPrimary = type === focus.type && id === focus.id
        const isMainShown = startPoint.id === id && startPoint.type === type

        return (
            <Segment key={type + id}
            onClick={() => dispatch({type : 'SET_FOCUS', t : type, i : id, startPoint})}
            //style={{marginBottom : pad ? '10px' : '0px', marginTop : pad ? '10px' : '0px', marginRight : '0px', marginLeft : '0px', padding : '0px'}}
            style={{padding : pad ? '10px' : '0px', marginLeft : '0px', marginRight : '0px', marginTop : children.length > 0 && !isFirst && !isMainShown ? '10px' : '0px', marginBottom : children.length > 0 && !isLast && !isMainShown ? '10px' : '0px', scrollable : true
        
        }}
            secondary={isPrimary}
            color={color}
            >
                <header style={{position: 'sticky'}}>{header && (ActiveraulSegmentHeader(type, children, hidden, id, header))}</header>
            
                <div style={{maxHeight : type === 'targets' && id !== 0 && '60vh', overflow: type === 'targets' && children.length > 0 ? 'auto' : 'visible'}}>
                {!hidden && content}
                {!hidden && contentReduce(children.map(nextRender(type === 'targets' ? 'properties' : 'targets', details, children.length)))}
                </div>
                {bottom && <><br/>{bottom}</>}
            </Segment>
            )
        }
      
    const ActiveraulSegmentHeader = (type, children, hidden, id, {left, right, title}) => {

        const compact = {margin : '0px', padding : '0px'}
     
        const Column = (align, width, content) =>{
            const col = <Grid.Column key={align + `${id}`} textAlign={align} verticalAlign={'middle'} floated={align !=='center' ? align : undefined} width={width} style={compact}>{content}</Grid.Column>
            return col
        }
        const sideColumn = (sideString, side) => Column(sideString, 4, side ? sideConvert(sideString, side) : <></> )

        const sideConvert = (align, side) => {

            const {icons, buttons} = side ? side : {}
            return contentReduce([...(icons ? icons : []).map(props => <DynamicButtonPopup align={align} iconOnly={true} dispatch={dispatch} other={props} />),
                            ...(buttons ? buttons : []).map(props => <DynamicButtonPopup align={align} iconOnly={false} dispatch={dispatch} other={props} />)])
            }

        

                return  (
                    <Segment basic style={compact} scrollable={true}>
                        <Grid style={compact}>
                            <Grid.Row style={{marginLeft : '0px',marginTop : '0px',marginRight : '0px',marginBottom : hidden || children.length === 0 ? '0px' : '10px', padding : '0px'}}>
                                {sideColumn('left', children.length === 0 ? left : extendDict(left, {buttons : extendArray(left && left.buttons, [{name : hidden ? 'expand' : 'compress', popup : {content : hidden ? 'Expand' : 'Minimize'}, onClick : {type : 'CHANGE_VISIBILITY', id, ttype : type, hidden : !hidden}}])}))}
                                {Column('center', 8, <ActiveraulPopup align={'center'} trigger={title && (title.content !== undefined) ? title.content : title} popup={title.popup} key={'centre'}/>)}
                                {sideColumn('right', right)}
                            </Grid.Row>
                        </Grid>
                    </Segment>
                )
            }
            return [nextRender(startPoint.type)(startPoint.id), state[startPoint.type][startPoint.id].children.length > 0 && <div style={{paddingTop : '5px', textAlign : 'right'}}><Button onClick={submitAll}>Submit</Button></div>]
        }


const DynamicButtonPopup = ({align, iconOnly, other, dispatch}) => {
    const {popup, key, text, name, onClick, warningMessage, giveWarning, disabled} = other
    const [state, setState] = useState(false)
    if (!name && !text) {return<></>}
    //console.log('button popup called', name)
    
    const style = {height : '40px', width : '40px', marginTop : '0px',  marginBottom : '0px', marginLeft : align === 'right' ? '2.5px' : '0px', marginRight : align === 'left' ? '2.5px' : '0px' , backgroundColor : iconOnly ? 'transparent' : 'light grey'}
    const buttonClick = () => {
    if (giveWarning) {setState(true)} else if (!iconOnly) {return dispatch(onClick)}}
    const onConfirm = () => {
        setState(false)

        onClick.type ? dispatch(onClick) : onClick()
    }
    return (<>
    <ActiveraulPopup disabled={disabled} popup={popup} align={align} key={key} trigger={<Button disabled={disabled} style={style} align={align ? 'top'+align : undefined} text={text} icon={name} onClick={buttonClick}/>}/>
    <Confirm key={'confirm'+key} open={state} header={warningMessage} onCancel={() => setState(false)} onConfirm={onConfirm}/></>)
}
const ActiveraulPopup = ({trigger, popup, align, disabled}) => {

    return trigger ? <Popup hideOnScroll position={`top ${align}`} positionFixed={true} header={(popup && popup.header) || (!popup.content && popup)} disabled={disabled || !popup} content={popup && popup.content} mouseEnterDelay={500} hoverable on={['hover']} trigger={typeof(trigger)==='string' ? <h3>{trigger}</h3> : trigger}/> : null

}