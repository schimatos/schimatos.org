import React, {useContext, useEffect} from 'react'
import {ShaclContext, TriplestoreContext, ActiveraulContext} from '../context'
import {Form, TextArea, Popup, Button, Input, Select, Icon, Divider, Container, Grid, Loader} from 'semantic-ui-react'
import {optionsFromArray, request, strip, advList} from '../utils'
import setOptionsDropdown from '../forms/fields/set-options-dropdown'
import undoableSection from '../forms/fields/undoable-section'
import editableList from '../forms/fields/editable-list'
import CancelableLoader from '../forms/fields/cancelable-loader'
import {useActiveraul} from '../custom-hooks'
import triplestoreInterface from '../triplestore-interface'
import saveShaclModal from '../forms/modals/save-shacl'
import fieldModal from '../forms/fields/field-modal'

export default ({opts,activeraulContext}) => {
    console.log('at selections form')

    const saveSelection = (selectedShacls) => {
        fieldModal(saveShaclModal())
    }


    const {applyShacls} = useActiveraul()
    const [{focus},dispatchActiveraul] = activeraulContext
    const {type, id} = focus
    const [{selections},dispatchShacl] = useContext(ShaclContext)
    const [{settings, knowledge_graphs, shacl_graphs, schema_prefixes, add_graph_prefixes, hide_graph_prefixes, advanced_features},] = useContext(TriplestoreContext)

    const triplestore = triplestoreInterface()

    // Change to add prefixes on the user side

    const displayAs = (graph, option) => {
        const pref = shacl_graphs[graph].prefix
        return hide_graph_prefixes ? strip(option, pref) : option
    }

    const initialState = () => ({
        selectedShacls : [...(selections[id] ? selections[id] : [])],
        searchBy : 'Class',
        prevSearch : '',
        prevSearchBy : '',
        searchText : '',
        queryText : `SELECT DISTINCT ?shape\nWHERE {?shape ?p ?o}`,
        options : [],
        loading : false
    })

    const reducer = (state, action) => {
        const {selectedShacls, searchBy, loading, prevSearch, prevSearchBy, searchText, queryText} = state
        const {type, value, response, r} = action
     
        const legalQueryChange = query => {
            return query.length > 22 && query.substring(0, 23) === `SELECT DISTINCT ?shape\n`
        }

        const changeOptions = clear => {
            const options = response.reduce((t, [graph, opts]) => {
                return [...t, ...opts.map(o => Object({key : JSON.stringify({graph, shacl : o}), text : displayAs(graph, o), value : JSON.stringify({graph, shacl : o})}))]
            }, clear ? [] : options)
            return (loading && prevSearch === r.search && prevSearchBy === r.searchBy) && {...state, loading : false, options}
        }
        
        switch (type) {
            case 'TEXT_CHANGE':
                return (value !== searchText) && {...state, searchText : value}
            case 'CATEGORY_CHANGE':
                return  {...state, searchBy : value}
            case 'QUERY_CHANGE':
                return (legalQueryChange(value) && value !== queryText) && {...state, queryText : value}
            case 'MAKE_SEARCH':
                return {...state, prevSearch : searchBy === 'Custom' ? queryText : searchText, loading : true, prevSearchBy : searchBy}
            case 'SEARCH_RESPONSE':
                return changeOptions(true)
            case 'EXTEND_OPTIONS':
                return changeOptions(false)
            case 'SEARCH_ERROR':
                return {...state, loading : false}
            case 'ADD_SELECTIONS':
                const ns = {...state, selectedShacls : [...selectedShacls, ...value.map(v => [v, false, true, true, true])]}
                dispatchShacl({type : 'ALTER_SELECTION', id, shacl : [...selectedShacls, ...value.map(v => [v, false, true, true, true])]})
                return ns
            case 'EDIT_SELECTIONS':
                dispatchShacl({type : 'ALTER_SELECTION', id, shacl : [...value]})
                const n = {...state, selectedShacls : [...value]}
                return n
        }
    }

    
    const content = ({selectedShacls, searchBy, loading, options, searchText, queryText, prevSearch, prevSearchBy}, dispatch, valDispatch) => {
        const header = ['Selected Shacls', ...[...[['I', 'Info', 'green'], ['W', 'Warning', 'orange'], ['V', 'Violation', 'red']], ...( advanced_features.manually_select_undefined_severities ? [['U', 'undefined', 'red']] : [])].map(([l,n,c]) => [<Popup content={n} trigger={<div>{l}</div>}/>,c])]
        const eValDispatch = type => (e, {value}) => valDispatch(type)(value)
        const keyPress = e => {
            e.key === 'Enter' && makeSearch()
        }
        useEffect(() => {
            dispatchShacl({type : 'ALTER_SELECTION', id, shacl : [...selectedShacls]})
        }, [selectedShacls])

        const makeSearch = () => {
            const search = searchBy === 'Custom' ? queryText : searchText
            if ((prevSearch !== search || prevSearchBy !== searchBy) && (search !== '' || searchBy === 'All')) {
                const {shacl_graph, additional_shacls, knowledge_graph} = settings
                const graphs = [...additional_shacls, shacl_graph].map(g => Object({...shacl_graphs[g], name : g}))
                triplestore({
                    initFunc : valDispatch('MAKE_SEARCH'),
                    errorFunc : valDispatch('SEARCH_ERROR'),
                    responseFunc : response => dispatch({type : 'SEARCH_RESPONSE', response, r : {search, searchBy}}),
                    query : 'LIST_SHACLS',
                    search, searchBy
                })
            }
        }

        const opts = () => {
            const shaclStrings = selectedShacls.map(x => x[0])
            return options.filter(x => !shaclStrings.includes(x.value))
        }

        // Textarea rows below https://stackoverflow.com/questions/8488729/how-to-count-the-number-of-lines-of-a-string-in-javascript/29607805

        
        const o = advList(['Class', 'Objects Of', 'Subjects Of', 'Name', 'Target', 'All'], ['Custom'], advanced_features.manual_sparql_queries)

        if (!advanced_features.manual_sparql_queries && searchBy === 'Custom') {
            valDispatch('CATEGORY_CHANGE')('Class')
        }

        return (
            <Form>
                <Input type='text' placeholder='Search...' action fluid>
                {searchBy !== 'Custom' && searchBy !== 'All' &&  <input onKeyPress={keyPress} onChange={e => valDispatch('TEXT_CHANGE')(e.target.value)} value={searchText}/>}
                <Select
                    onKeyPress={keyPress}
                    value={searchBy}
                    compact={searchBy !== 'Custom' && searchBy !== 'All'}
                    fluid={searchBy == 'Custom' || searchBy == 'All'}
                    onChange={eValDispatch('CATEGORY_CHANGE')}
                    options={optionsFromArray(o)}/>
                <Button onKeyPress={keyPress} onClick={() => makeSearch()} compact align={'right'}><Icon name='search'/></Button>
                </Input>
                {searchBy === 'Custom' && <TextArea rows={queryText.split(/\r\n|\r|\n/).length} value={queryText} onChange={eValDispatch('QUERY_CHANGE')}/>}
                <Divider />
                {loading ? (
                <CancelableLoader onClick={valDispatch('SEARCH_ERROR')} />
                ) : (
                    opts().length === 0 ? ('No remaning options for this search.') : (
                        setOptionsDropdown({multiple : true,
                            options : opts(),
                            sort : true,
                            placeholder : 'Select shacls to apply...',
                            value : [],
                            onChange : eValDispatch('ADD_SELECTIONS'),
                            customOptions : true})
                ))}
                {selectedShacls.length > 0 &&
                    <>
                    <Divider />
                    <Container>
                    {editableList({header,
                        displayConversion : x => {
                            const {graph, shacl} = JSON.parse(x)
                            const value = <div style={{
                                width: '225px',
                                padding: '0px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            
                            }}>{displayAs(graph, shacl)}</div>
                            return {value, popup : <div>From: {graph}<br/>IRI: <a href={shacl} target="_blank">{shacl}</a></div>}
                        },
                        value : selectedShacls.map(x => {
                            if (x.length < header.length) {
                                return [...x, x[x.length-1]]
                            } else if (x.length > header.length) {
                                return x.filter((a, i) => i < header.length)
                            } else {
                                return x
                            }
                        }), 
                        rotate : true,
                        onChange : (e, {value}) => {
                            console.log('VALUE', value)
                            eValDispatch('EDIT_SELECTIONS')(e, {value})
                        }})}
                    </Container>
                    <Divider />
                    <Button align={'right'} onClick={() => saveSelection(selectedShacls)}><Icon name='save'/>Save As</Button>
                    <Button align={'right'} floated={'right'} onClick={() => applyShacls(selectedShacls)}><Icon name='checkmark'/>Apply</Button>
                    </>}
            </Form>)
    }
    return undoableSection({
        content,
        initialState : initialState(),
        reducer,
        title : opts
    })
}
