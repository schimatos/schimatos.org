import {useContext} from 'react'
import {LayoutContext, TriplestoreContext, HistoryContext, ActiveraulContext} from '../../../context'
import {useActiveraul} from '../../../custom-hooks'

import newPath from './tabs/new-path'
import saveShacl from './tabs/save-shacl'
import editPath from './tabs/edit-path'
import Activeraul from '../../../custom-hooks/activeraul-history'

import customMenu from '../../fields/custom-menu'

import {requester} from '../../../utils'


export default () => {
    console.log('at start of menu')
    const [{warnings, info, startPoint}, dispatchLayout] = useContext(LayoutContext)
    console.log(1)
    const [{focus, properties, propertyList, targets},dispatch] = Activeraul()
    console.log(2)
    const [state,] = useContext(ActiveraulContext)
    console.log(3)
    console.log(HistoryContext)
    const [[history, histno],] = useContext(HistoryContext)
    console.log(4)
    const {type, id} = focus
    const isProperty = focus.type === 'properties'
    console.log(5)
    const {copyForm, remove, submission, undoForm, redoForm} = useActiveraul()
    console.log('activeraul menut', targets, properties, focus, propertyList, state)

    const name = focus.type === 'properties' ? (
        propertyList[properties[id].property].name ? propertyList[properties[id].property].name : propertyList[properties[id].property].path
    ) : (
        targets[id].value
    )

    // Make this another path attribute
    // Long term have each of these refer to different path attribute and the path attributes themselves produced based on the onThology

    const submitable = isProperty ? (
      // No empty fields

      // First part of this line is specific to alternate aopths
        propertyList[properties[id].property].pathType === 'alternativePath' ? properties[id].children[0].length > 0 :  (properties[id].children.reduce((t, x) => t && (targets[x].value !== ''), properties[id].children.length>0))
        &&
      // At least one fields that has not yet been submitteed
        (properties[id].children.reduce((t, x) => t || !targets[x].submitted, false))
      ):(
      // Field is non-empty and has not yet been submitted
        targets[id].value !== '' && !targets[id].submitted
      )

    const copyFormB = () => ({
        active : !isProperty && targets[id].children.length > 0,
        icon : 'copy',
        popup : 'Copy Section',
        onClick : () => copyForm(),
        warning : `This action will copy the shacl structure for ${name}.`
    })

    const del = () => ({
        active : isProperty && propertyList[properties[id].property].severity!=='Violation' && id !== startPoint.id,
        icon : 'delete',
        popup : 'Delete property path',
        onClick : () => remove('properties', id),
        warning : `This action will delete ${name} from the form but changes made to the database will NOT be reversed.`
    })

    const submit = () => ({
        active : submitable,
        icon : isProperty ? 'check circle outline' : 'checkmark',
        onClick : () => submission(false),
        popup : 'Submit Selection'
    })

    const submitAndShacl = () => ({
        active : submitable || (type === 'targets' && !targets[id].shacled),
        icon : isProperty ? 'anchor' : 'linkify',
        onClick : () => submission(true),
        popup : 'Submit Selection and automatically apply shacls'
    })

    const undo = () => {
        const active = !(history.length  < histno + 1)
        const {toInsert, toDelete} = active ? history[history.length - (histno)] : {toInsert : undefined, toDelete : undefined}
        return ({
        active,
        popup : 'Undo',
        icon : 'undo',
        onClick : () => undoForm({toDelete : toInsert, toInsert : toDelete}),
        warning : (toInsert || toDelete) && `Edits will be made to the triplestore`
    })}

    const redo = () => {
        const active = histno !== 1
        const {toInsert, toDelete} = active ? history[history.length - (histno-1)] : {}
        return ({
        active,
        popup : 'Redo',
        icon : 'redo',
        onClick : () => redoForm({toInsert, toDelete}),
        warning : (toInsert || toDelete) && `Edits will be made to the triplestore`
    })}

    const [{settings, knowledge_graphs, shacl_graphs},] = useContext(TriplestoreContext)
    const sgraph = shacl_graphs[settings.shacl_graph]

    // const clear1 = () => ({
    //     active : true,
    //     text : 'clear knowledge graph',
    //     warning : 'this be dangerous',
    //     onClick : () => requester({
    //         extension : 'clear',
    //         body : {graph : knowledge_graphs[settings.knowledge_graph]},
    //         responseFunc : () => {},
    //         errorFunc : () => {},
    //         priorFunc : () => {}
    //     })
    // })

    // const clear2 = () => ({
    //     active : true,
    //     text : 'clear shacl graph',
    //     warning : 'this be dangerous',
    //     onClick : () => requester({
    //         extension : 'clear',
    //         body : {graph : sgraph},
    //         responseFunc : () => {},
    //         errorFunc : () => {},
    //         priorFunc : () => {}
    //     })
    // })

    const focusForm = () => ({
        active : true,
        icon : 'eye',
        warning : 'Focus on target',
        onClick : () => dispatchLayout({type : 'CHANGE_START', startPoint : focus})
    })

    const expandAll = () => ({
        active : true,
        icon : 'unordered list',
        popup : 'Expand All',
        onClick : () => dispatch({type : 'ALL_VISIBILTIY', hidden : false})
    })

    const hideAll = () => ({
        active : true,
        icon : 'minus',
        popup : 'Collapse All',
        onClick : () => dispatch({type : 'ALL_VISIBILTIY', hidden : true})
    })

    // To add property based constraints with 'save shacl'
    const targIcons = [newPath(), copyFormB(), saveShacl()]
    const propIcons = [editPath()]
    const icons = [undo(), redo(), del(), submit(), submitAndShacl(), focusForm(), ...(isProperty ? propIcons : targIcons), expandAll(), hideAll()]

    return customMenu({
        warnings, popups : info, icons, fixed :'bottom'
    })
}