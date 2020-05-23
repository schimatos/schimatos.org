import React, {useContext, useEffect} from 'react'
import {ShaclContext, TriplestoreContext, ActiveraulContext} from '../context'
import {Popup, Button, Icon, Divider, Container, Grid, Loader} from 'semantic-ui-react'
import editableList from '../forms/fields/editable-list'

import {useActiveraul} from '../custom-hooks'


import saveShaclModal from '../forms/modals/save-shacl'
import fieldModal from '../forms/fields/field-modal'

import conversions from '../custom-hooks/helper-functions/conversions'
import base from './base-search'

export default ({opts}) => {
    console.log('at shacl form')
    const saveSelection = (selectedShacls) => {
        fieldModal(saveShaclModal())
    }

    const {allShaclDisplayIRI} = conversions(1)
    const {applyShacls} = useActiveraul()
    const [{selections},dispatchShacl] = useContext(ShaclContext)
    const [{focus},] = useContext(ActiveraulContext)
    const [{advanced_features},] = useContext(TriplestoreContext)
    const {id, type} = focus

    const reducer = (state, action) => {
        const {selectedShacls} = state
        const {type, value} = action
        switch (type) {
            case 'ADD_SELECTIONS':
                const ns = {...state, selectedShacls : [...selectedShacls, ...value.map(v => [v, false, true, true, true])]}
                dispatchShacl({type : 'ALTER_SELECTION', id, shacl : [...selectedShacls, ...value.map(v => [v, false, true, true, true])]})
                return ns
            case 'EDIT_SELECTIONS':
                dispatchShacl({type : 'ALTER_SELECTION', id, shacl : [...value]})
                const n = {...state, selectedShacls : [...value]}
                return n
            default : return state
    }}
    const content = ({selectedShacls}, dispatch, valDispatch, eValDispatch) => {
        const header = ['Selected Shacls', ...[...[['I', 'Info', 'green'], ['W', 'Warning', 'orange'], ['V', 'Violation', 'red']], ...( advanced_features.manually_select_undefined_severities ? [['U', 'undefined', 'red']] : [])].map(([l,n,c]) => [<Popup content={n} trigger={<div>{l}</div>}/>,c])]
        if(selectedShacls.length > 0) {
            return (
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
                
                }}>{allShaclDisplayIRI(graph)(shacl)}</div>
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
            </>)} else {
            return null
        }}
    
    const responseConversion = ([graph, opts]) => {
        return opts.map(o => {
            const value = JSON.stringify({graph, shacl : o})
            return Object({key : value, text : allShaclDisplayIRI(graph)(o), value})
        })
    }
    const optionsFilter = ({selectedShacls}) => {
        const shaclStrings = selectedShacls.map(x => x[0])
        return value => !shaclStrings.includes(value)
    }
    return base({
        reducer,
        selectVariable : 'shape',
        standardQueries : ['Class', 'Objects Of', 'Subjects Of', 'Name', 'Value', 'Label', 'Target', 'All', 'Any'],
        initialState : {selectedShacls : [...(selections[id] ? selections[id] : [])]},
        query : 'LIST_SHACLS', content, responseConversion, convertionType : 'reduce', optionsFilter, opts,
        placeholder : 'Select shacls to apply...'
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



