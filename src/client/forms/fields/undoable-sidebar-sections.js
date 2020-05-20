import undoableSection from './undoable-section'
import setOptionsDropdown from './set-options-dropdown'
import Sidebar from '../components/sidebar'

export default ({value, initialState, reducer, width, direction, contents, onChange, onClose, outside}) => {
    const options = [...Object.keys(contents), 'close']
    const content = contents[value]
    const titleDropdown = () => setOptionsDropdown({value, onChange : value => value === 'close' ? onClose() : onChange(value), options})

    const panels = title => Object.entries(contents).map(([t, c]) => {
        const {initialState, reducer, content} = c
        return [t===title, undoableSection({t, initialState, reducer, content})]
    })

    return undoableSection({title, initialState, reducer, content})
}

import React, {useContext} from 'react'
import {LayoutContext} from '../context'

import ShaclForm from './shacl-form'
import TargetsForm from './targets-form'

export default () => {
    const [{selectionsSidebar, optionsType}, dispatch] = useContext(LayoutContext)
    const panels = [
        [optionsType === 'target', <ShaclForm/>],
        [optionsType === 'property', <TargetsForm/>]]

    return  <Sidebar
            direction={'left'}
            width={'very wide'}
            visible={selectionsSidebar}
            close={() => dispatch({type : 'TOGGLE', panel : 'selectionsSidebar'})}
            panels={panels}/>
}