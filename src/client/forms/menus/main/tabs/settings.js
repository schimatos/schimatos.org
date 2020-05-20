import React, {useContext} from 'react'
import {LayoutContext, TriplestoreContext} from '../../../../context'
import {input, checkbox, dropdown, button} from '../../../fields/functional-react'
import multiEntryTable from '../../../fields/multi-entry-table'
import setOptionsDropdown from '../../../fields/set-options-dropdown'
import setOptionsDropdownAdd from '../../../fields/set-options-dropdown-add'


import {toSentence, filterDict} from '../../../../utils'

export default () => {
    const [olayout, layoutDispatch] = useContext(LayoutContext)
    const [otriplestore, triplestoreDispatch] = useContext(TriplestoreContext)
    const modal = () => {
        const initialState = {
            layout : {...olayout}, triplestore : {...otriplestore}, advanced_input : true, shacl_local : false, knowledge_local : false, remove_button : true
        }

        const st = x => typeof(x)==='string'
        const detail = (s, f) => st(f) ? s[f] : f.reduce((t, x) => t===undefined ? undefined : t[st(x) ? x : detail(s, x)], s)

        const emptyDetails = () => ({
            location : 'http://',
            sparql_endpoint : 'http://',
            prefix : '',
            authentication : {
                username : '',
                password : ''
            },
            endpoint_extension : 'sparql-auth',
            request_type : "POST",
            custom_headers : [],
            visible : true
        })

        const emptyLocal = () => ({local_location : '', write_location : '', read_encoding : 'utf-8', write_encoding : 'utf-8'})

        const newNameRoutine = path => (state, value) => {
            const localPath = (path === 'knowledge_graphs' && state['knowledge_local']) || (path === 'shacl_graphs' && state['shacl_local'])
            const newState =  Object.keys(state.triplestore[path]).includes(value) ? state : (
                {...state, triplestore : {...state.triplestore, [path] : {...state.triplestore[path], [value] : localPath ? emptyLocal() : emptyDetails()}}}
            )
            return newState
        }

        const removeEndpoint = path => (state, value) => {
            const state2 = {...state}
            state2.triplestore[path[1]] = {...filterDict(state.triplestore[path[1]], ([k,v]) => k!=state2.triplestore.settings[path[2][2]])}
            state2.triplestore.settings[path[2][2]] = ''
            return {...state2}
        }




        const paddedCheckbox = p => <>{checkbox(p)}<br/></>
        const delDropdown = p => setOptionsDropdownAdd({...p, clearable : true})
        const conditions = () => []
        const submitConditions = () => []
        const content = ms => {
            const storeInputs = path => {
                const cond = p => state => {
                    const vis = detail(state, [...path, 'visible'])
                    return vis === true || (vis ? vis.includes(p) : true)
                }
                const isPost = state =>  detail(state, [...path, 'request_type']) === 'POST'
                const singleInputs = ["local_location", "write_location", "read_encoding", "write_encoding", "location", "sparql_endpoint", "prefix", ["authentication", "username"], ["authentication", "password"], "endpoint_extension"]
                .map(x => {
                    const [prefixCheck, remainderPath, name] = typeof(x) === "string" ? [x, [x], x] : [x[1], x, x[x.length-1]]
                    const full_path = [...path, ...remainderPath]
                    return [input, full_path, {name, placeholder : x === "write_location" ? "Leave blank to write to original file" : toSentence(name)}, toSentence(name), {condition : cond(prefixCheck), advanced : ['endpoint_extension', "write_location", "read_encoding", "write_encoding"].includes(name)}]
                })
                const advancedInputs = [
                    [setOptionsDropdown, [...path, 'request_type'], {options : ['GET', 'POST']}, 'Request Type',{condition : cond('requestType'), advanced : true}],
                    [multiEntryTable, [...path, 'custom_headers'], {header : ['Key', 'Value']}, 'Custom Headers',{condition : state => isPost(state) && cond('custom_headers')(state), advanced : true}]
                ]
                const nameDropdown = [delDropdown, path[2], {name:"name", options: Object.keys(ms.triplestore[path[1]])}, , {routine : newNameRoutine(path[1]) }]
                const remove = [button, 'remove_button', {icon : 'x', content : 'Remove'},,{routine : removeEndpoint(path), advanced : true}]
                return [nameDropdown, ...singleInputs, ...advancedInputs, remove]
            }
            const localInit = path => [paddedCheckbox, path, {label : 'Initiate local file as triplestore (the next triplestore you initiate will be a local file)'},,{advanced : true}]
            return [
            ['Display Settings', [checkbox, ['layout', 'info'], {label : 'Form tool descriptions'}], [checkbox, ['layout','warnings'], {label : 'Warnings'}], [checkbox, ['layout','propertyDetails'], {label : 'Property details popup'}]],
            ['Triplestore Settings', localInit('knowledge_local'), ...storeInputs(['triplestore', 'knowledge_graphs', ['triplestore', 'settings', 'knowledge_graph']])],
            ['Shaclstore Settings', localInit('shacl_local'), ...storeInputs(['triplestore', 'shacl_graphs', ['triplestore', 'settings', 'shacl_graph']]), 'This is the Shacl store to which edits will be made'],
            ['Additional Shacl Sources', [dropdown, ['triplestore', 'settings', 'additional_shacls'], {options: Object.keys(ms.triplestore.shacl_graphs), multiple : true, fluid : true, selection : true}],`Extra sources of shacl constraints. Edits will not be made to these databases. Edits can be made to these stores settings in 'Shaclstore Settings'`],
            ['Typestore Settings', localInit('type_local'), ...storeInputs(['triplestore', 'type_graphs', ['triplestore', 'settings', 'type_graph']]), 'This is the Type store to which edits will be made'],
            ['Additional Type Sources', [dropdown, ['triplestore', 'settings', 'additional_types'], {options: Object.keys(ms.triplestore.type_graphs), multiple : true, fluid : true, selection : true}],`Extra sources of type constraints. Edits will not be made to these databases. Edits can be made to these stores settings in 'Typestore Settings'`],
            ['Schema Prefixes', [multiEntryTable, ['triplestore', 'schema_prefixes'], {header : ['Prefix', 'IRI']},, {advanced : true}]],
            ['Advanced Features', ...Object.keys(otriplestore.advanced_features).map(nm => [checkbox, ['triplestore', 'advanced_features', nm], {label : toSentence(nm)},,{advanced : true}])]
            
            ]}
        return {initialState, conditions, submitConditions, content, header : 'Settings', advanced : true, confirmation : true}
    }

    const onClick = ({layout, triplestore}) => {
        layoutDispatch({type : 'COMPLETE_UPDATE', layout})
        triplestoreDispatch({type : 'COMPLETE_UPDATE', triplestore})
    }

    return {
        modal : modal(),
        icon : 'setting',
        popup : 'Settings',
        onClick
    }
}