import React, {useContext, useState} from 'react'
import {LayoutContext, TriplestoreContext} from '../context'
import Sidebar from '../components/sidebar2'
import ShaclForm from './shacl-form'
import TargetsForm from './targets-form'
import NavigateForm from './navigate-form'
import setOptionsDropdown from '../forms/fields/set-options-dropdown'
import ShaclUpload from './shacl-upload'

import Activeraul from '../custom-hooks/activeraul-history'

export default ({outside, windowDimensions}) => {
    console.log('at left sidebar')
    const [{selectionsSidebar},] = useContext(LayoutContext)
    const [panel, setPanel] = useState('SHACL Selections')

    const activeraulContext = Activeraul()

    const opts = setOptionsDropdown({value :panel, onChange : (e, {value}) => setPanel(value), options : ['SHACL Selections', 'Target Selections', 'Navigate Form', 'upload/edit .ttl'], style :{width:'160px', margin:'0px', textAlign:'left', verticalAlign:'left'}})

    return Sidebar({
        windowDimensions : windowDimensions,
        panel : {'SHACL Selections' : <ShaclForm opts={opts} activeraulContext={activeraulContext}/>, 'Target Selections' : <TargetsForm opts={opts}/>, 'Navigate Form' : <NavigateForm opts={opts}/>, 'upload/edit .ttl' : <ShaclUpload opts={opts}/>}[panel],
        title : panel,
        direction : 'left',
        width : 'very wide',
        visible : selectionsSidebar,
        onChange : () => {},
        outside
    })
}