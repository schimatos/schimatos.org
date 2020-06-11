import React, {useContext, useEffect, useState} from 'react'
import {ShaclContext, TriplestoreContext, ActiveraulContext} from '../context'
import {Popup, Button, Icon, Segment, Divider, Container, Grid, Loader} from 'semantic-ui-react'
import editableList from '../forms/fields/editable-list'

import {useActiveraul} from '../custom-hooks'
import Activeraul from '../custom-hooks/activeraul-history'


import saveShaclModal from '../forms/modals/save-shacl'
import fieldModal from '../forms/fields/field-modal'
import triplestoreInterface from '../triplestore-interface'

import conversions from '../custom-hooks/helper-functions/conversions'
import base from './base-search'

import {hash, startMatch, valuesMatch} from '../utils'

export default ({opts}) => {
    //console.log('at target form')
    const triplestore = triplestoreInterface()
    const [{focus, properties, targets, propertyList},] = Activeraul()
    const [{schema_prefixes},] = useContext(TriplestoreContext)
    const {type, id} = focus
    const {displayIRI} = conversions(0)
    //console.log(focus, properties, targets, propertyList)
    const disabled = type === 'targets' ? (targets[id].submitted) : (
        propertyList[properties[id].property].maxCount
        && properties[id].children.length >= propertyList[properties[id].property].maxCount
        && properties[id].children.reduce((t, c) => t && !targets[c].value === '', true)
    )
    const {addOptionFlexible} = useActiveraul()

    const optionsFilter = () => {
        if (type === 'targets') {
            return value => targets[id].value !== value[0]
        } else {
            return value => !properties[id].children.map(x => targets[x].value).includes(value[0])
        }
    }

    const reducer = (state, action) => {
        const {type, value} = action
        switch (type) {
            case 'ADD_SELECTIONS':
                addOptionFlexible(focus.type, id, value[0])
                return state
            default : return state
    }}

    const [details, setDetails] = useState([])

    useEffect(() => {
        triplestore({
            query : 'TARGET_DETAILS',
            initFunc: () => setDetails([]),
            errorFunc: () => setDetails([]),
            responseFunc: x => setDetails(Object.entries(x.reduce((t, [p, o]) => {
                t[p] = [...(t[p] ? t[p] : []), o]
                return t
            }, {}))),
            subject : targets[id].value
        }) 
    }, hash(targets[id].value))

    const makeDetailsPanel = () => {
        
    }

    const unpackSingle = iri => {
        const f = Object.entries(schema_prefixes).find(([k, v]) => iri.includes(v))
        //console.log(f, iri)
        return f ? f[0] + ':' + iri.slice(f[1].length,) : iri
    }
    
    const detailsSection = (header, details) => {
        const [open, setOpen] = useState(false)
    
        const detail = ([name, values], i) => {
            return (<>
            {i > 0 && <Divider/>}
            <Grid.Row key={i}>
                <Grid.Column key={'1a'+i}>
                    <b>{unpackSingle(name)}</b>
                </Grid.Column>
                <Grid.Column  key={'3a'+i} stretched width={14} style={{padding : '0px'}}>
                <br/>
                    {values.map(x => <div style={{margin : '0px', padding : '0px'}} key={i+'div'}>{unpackSingle(x)}</div>)}
                </Grid.Column>
            </Grid.Row>
            </>)
        }
        const nm = details.find(([k,v]) => k == 'http://www.w3.org/2000/01/rdf-schema#label')?.[1]
        return (
            <>
            <div style={{textAlign : 'center', width : '100%'}}>
            <div style={{textAlign : 'center', backgroundColor : '#A9A9A9', margin : '10px', borderRadius : '3px', textAlign : 'center'}}>
                <h5>{`${unpackSingle(header)}  (${nm})`}</h5>
            </div>
            </div>
            <Grid>{details.filter(([k,v]) => k != 'http://www.w3.org/2000/01/rdf-schema#label').map(detail)}</Grid>
            </>
        )
    }

    const content = () => {

        return (
            <>
            <Divider/>
            <Segment style={{backgroundColor : 'light grey'}}>
            <Grid relaxed={false} padded={false} style={{backgroundColor : 'light grey'}}>
            {detailsSection(targets[id].value, details)}
            </Grid>
            </Segment>
            </>

        )
    }

    const FullContent = () => content()

    return base({
        reducer,
        selectVariable : 'target',
        standardQueries : ['Class', 'Objects Of', 'Subjects Of', 'Name', 'Label', 'Value', 'Any'],
        initialState : {searchText: 'sergio'},
        query : 'LIST_OPTIONS',
        disabled,
        optionsFilter,
        content : details.length > 0 && (() => <FullContent key='fullContet'/>),
        opts,
        convertionType : 'map',
        responseConversion : x => Object({key : x, text : displayIRI(x), value :x }),
        placeholder : `Select target${type==='targets' ? '' : 's'}...`
    })
}


// export default ({}) => {
//     const reducer = (state, action) => {
//         const {selectedShacls} = state
//         const {type, value} = action
//         switch (type) {
//             case 'ADD_SELECTIONS':
//                 // Activeraul add option
//                 return ns
//             default : return state
//     }}
//     return {
//         reducer,
//         searchVariable : 'target',
//         standardQueries : ['Class', 'Objects Of', 'Subjects Of', 'Name'],
//         initialState : {},
//         query : 'LIST_OPTIONS'
//     }
// }


// export default ({}) => {
//     const reducer = (state, action) => {
//         const {selectedShacls} = state
//         const {type, value} = action
//         switch (type) {
//             case 'ADD_SELECTIONS':
//                 // Activeraul add option
//                 return ns
//             default : return state
//     }}
//     return {
//         reducer,
//         searchVariable : 'target',
//         standardQueries : ['Class', 'Objects Of', 'Subjects Of', 'Name'],
//         initialState : {},
//         query : 'LIST_OPTIONS'
//     }
// }


// export default ({}) => {
//     const reducer = (state, action) => {
//         const {selectedShacls} = state
//         const {type, value} = action
//         switch (type) {
//             case 'ADD_SELECTIONS':
//                 // Activeraul add option
//                 return ns
//             default : return state
//     }}
//     return {
//         reducer,
//         searchVariable : 'target',
//         standardQueries : ['Class', 'Objects Of', 'Subjects Of', 'Name'],
//         initialState : {},
//         query : 'LIST_OPTIONS'
//     }
// }


// export default ({}) => {
//     const reducer = (state, action) => {
//         const {selectedShacls} = state
//         const {type, value} = action
//         switch (type) {
//             case 'ADD_SELECTIONS':
//                 // Activeraul add option
//                 return ns
//             default : return state
//     }}
//     return {
//         reducer,
//         searchVariable : 'target',
//         standardQueries : ['Class', 'Objects Of', 'Subjects Of', 'Name'],
//         initialState : {},
//         query : 'LIST_OPTIONS'
//     }
// }



// export default ({opts}) => {
//     const [{focus},dispatchActiveraul] = Activeraul()
//     const {type, id} = focus
//     const [{selections},dispatchShacl] = useContext(ShaclContext)
//     const [{settings, knowledge_graphs, shacl_graphs, schema_prefixes},] = useContext(TriplestoreContext)

//     const initialState = {
//         selectedShacls : [...(selections[id] ? selections[id] : [])],
//         searchBy : 'Class',
//         prevSearch : '',
//         prevSearchBy : '',
//         searchText : '',
//         queryText : `SELECT DISTINCT ?target\nWHERE {?target ?p ?o}`,
//         options : [],
//         loading : false
//     }

//     const reducer = (state, action) => {
//         const {selectedShacls, searchBy, loading, prevSearch, prevSearchBy, searchText, queryText} = state
//         const {type, value, response} = action
     
//         const legalQueryChange = query => {
//             return query.length > 23 && query.substring(0, 24) === `SELECT DISTINCT ?target\n`
//         }

//         const changeOptions = clear => {
//             const options = response.options.reduce((t, [graph, opts]) => {
//                 return [...t, ...opts.map(o => Object({key : o, text : displayAs(graph, o), value : JSON.stringify({graph, shacl : o})}))]
//             }, clear ? [] : options)
//             return (loading && prevSearch === response.search && prevSearchBy === response.searchBy) && {...state, loading : false, options}
//         }
        
//         switch (type) {
//             case 'TEXT_CHANGE':
//                 return (value !== searchText) && {...state, searchText : value}
//             case 'CATEGORY_CHANGE':
//                 return  {...state, searchBy : value}
//             case 'QUERY_CHANGE':
//                 return (legalQueryChange(value) && value !== queryText) && {...state, queryText : value}
//             case 'MAKE_SEARCH':
//                 return {...state, prevSearch : searchBy === 'Custom' ? queryText : searchText, loading : true, prevSearchBy : searchBy}
//             case 'SEARCH_RESPONSE':
//                 return changeOptions(true)
//             case 'EXTEND_OPTIONS':
//                 return changeOptions(false)
//             case 'SEARCH_ERROR':
//                 return {...state, loading : false}
//             case 'ADD_SELECTIONS':
//                 const ns = {...state, selectedShacls : [...selectedShacls, ...value.map(v => [v, false, true, true])]}
//                 dispatchShacl({type : 'ALTER_SELECTION', id, shacl : [...selectedShacls, ...value.map(v => [v, false, true, true])]})
//                 return ns
//             case 'EDIT_SELECTIONS':
//                 dispatchShacl({type : 'ALTER_SELECTION', id, shacl : [...value]})
//                 const n = {...state, selectedShacls : [...value]}
//                 return n
//         }
//     }

    
//     const content = ({selectedShacls, searchBy, loading, options, searchText, queryText, prevSearch, prevSearchBy}, dispatch, valDispatch) => {
//         const header = ['Selected Shacls', ...[['I', 'Info', 'green'], ['W', 'Warning', 'orange'], ['V', 'Violation', 'red']].map(([l,n,c]) => [<Popup content={n} trigger={<div>{l}</div>}/>,c])]
//         const availableOptions = options
//         const eValDispatch = type => (e, {value}) => valDispatch(type)(value)
//         const keyPress = e => {
//             e.key === 'Enter' && makeSearch()
//         }
//         useEffect(() => {
//             dispatchShacl({type : 'ALTER_SELECTION', id, shacl : [...selectedShacls]})
//         }, [selectedShacls])
//         const makeSearch = () => {
//             const search = searchBy === 'Custom' ? queryText : searchText
//             if ((prevSearch !== search || prevSearchBy !== searchBy) && (search !== '' || searchBy === 'All')) {
//                 const {shacl_graph, additional_shacls, knowledge_graph} = settings
//                 const graphs = [...additional_shacls, shacl_graph].map(g => Object({...shacl_graphs[g], name : g}))
//                 request({
//                     priorFunc : valDispatch('MAKE_SEARCH'),
//                     errorFunc : valDispatch('SEARCH_ERROR'),
//                     responseFunc : response => dispatch({type : 'SEARCH_RESPONSE', response}),
//                     body : {search, searchBy, graphs, schema_prefixes, knowledge_graph : knowledge_graphs[knowledge_graph]},
//                     extension : 'shacls'
//                 })
//             }
//         }

//         const opts = () => {
//             const shaclStrings = selectedShacls.map(x => x[0])
//             return options.filter(x => !shaclStrings.includes(x.value))
//         }

//         // Textarea rows below https://stackoverflow.com/questions/8488729/how-to-count-the-number-of-lines-of-a-string-in-javascript/29607805
    
//         return (
//             <Form onClose={() => //console.log('closing')}>
//                 <Input type='text' placeholder='Search...' action fluid>
//                 {searchBy !== 'Custom' && searchBy !== 'All' &&  <input onKeyPress={keyPress} onChange={e => valDispatch('TEXT_CHANGE')(e.target.value)} value={searchText}/>}
//                 <Select
//                     onKeyPress={keyPress}
//                     value={searchBy}
//                     compact={searchBy !== 'Custom' && searchBy !== 'All'}
//                     fluid={searchBy == 'Custom' || searchBy == 'All'}
//                     onChange={eValDispatch('CATEGORY_CHANGE')}
//                     options={optionsFromArray(['Class', 'Targets Of', 'Subjects Of', 'Name', 'Target', 'Custom', 'All'])}/>
//                 <Button onKeyPress={keyPress} onClick={() => makeSearch()} compact align={'right'}><Icon name='search'/></Button>
//                 </Input>
//                 {searchBy === 'Custom' && <TextArea rows={queryText.split(/\r\n|\r|\n/).length} value={queryText} onChange={eValDispatch('QUERY_CHANGE')}/>}
//                 <Divider />
//                 {loading ? (
//                 <Grid>
//                     <Grid.Row>
//                         <Grid.Column textAlign={'center'}>
//                             <Loader active inline='centered' />
//                         </Grid.Column>
//                         <Grid.Column floated={'right'} width={2}>

//                                 <Icon name='x' onClick={valDispatch('SEARCH_ERROR')}/>
  
//                         </Grid.Column>
//                     </Grid.Row>
//                 </Grid>
//                 ) : (
//                     opts().length === 0 ? ('No remaning options for this search.') : (
//                         setOptionsDropdown({multiple : true,
//                             options : opts(),
//                             placeholder : 'Select targets...',
//                             value : [],
//                             onChange : eValDispatch('SET_SELECTIONS'),
//                             customOptions : true})
//                 ))}
//                 {selectedShacls.length > 0 &&
//                     <>
//                     <Divider />
//                     <Button align={'right'}><Icon name='checkmark'/>Submit</Button>
//                     <br/><br/>
//                     </>}
//             </Form>)
//     }
//     return undoableSection({
//         content,
//         initialState,
//         reducer,
//         title : opts
//     })
// }