import React, {useContext, useEffect} from 'react'
import {ShaclContext, TriplestoreContext, ActiveraulContext, LayoutContext} from '../context'
import {Form, TextArea, Popup, Button, Input, Select, Icon, Divider, Container, Grid, Loader, Accordion, AccordionPanel} from 'semantic-ui-react'
import {optionsFromArray, request, strip} from '../utils'
import setOptionsDropdown from '../forms/fields/set-options-dropdown'
import undoableSection from '../forms/fields/undoable-section'
import editableList from '../forms/fields/editable-list'

import CancelableLoader from '../forms/fields/cancelable-loader'
import {displayComponent} from '../custom-hooks'

import faker from 'faker'
import lodash from 'lodash'
import Activeraul from '../custom-hooks/activeraul-history'

export default ({opts}) => {

    const [state,] = Activeraul()
    const {type, id} = state.focus
    const [{settings, knowledge_graphs},] = useContext(TriplestoreContext)

    const [,dispatchLayout] = useContext(LayoutContext)

    //console.log(displayComponent)

    const {componentString, allChildren} = displayComponent()

    const content = () => {
        const panels = (t, i) => allChildren(t,i).map(x => {
            const next = t === 'targets' ? 'properties' : 'targets'
            const title = componentString(next, x)
            const npanels = panels(next, x)
        return {key : `${t}${x}`, title, content : {content : <div style={{marginTop : '0px', marginBottom : '0px', marginLeft : '22px', padding : '0px'}}><Button fluid icon='eye' onClick={() => dispatchLayout({type : 'CHANGE_START', startPoint : {type : next, id : x}})}/><Accordion.Accordion style={{margin : '0px', padding : '0px'}} panels={npanels}/></div>}}
        })

          const internalAccordion = (t, i) => <>{allChildren(t,i).reduce((total, x) => {
                const next = t === 'targets' ? 'properties' : 'targets'
                const title = componentString(next, x)
                return (<>{total}
                <Accordion>
                <Accordion.Title>{title}hi{type}{id}{2}</Accordion.Title>
                <Accordion.Content>{internalAccordion(next, x)}hi2</Accordion.Content>
                </Accordion>
                </>
                )}, <></>)}</>

        return (<>
            <Button onClick={() => dispatchLayout({type : 'CHANGE_START', startPoint : {type : 'properties', id : -1}})} fluid>
            <Icon name='eye'/> Show all
            </Button>
            <Accordion
            panels={panels('properties', -1)}
            exclusive={false}
            fluid
          />
          </>
            )
    }
    return undoableSection({
        initialState : {},
        reducer : (state, action) => state,
        content,
        title : opts
    })
}