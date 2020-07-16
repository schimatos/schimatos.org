import React, {useContext, useState} from 'react'
import {LayoutContext, TriplestoreContext, ActiveraulContext} from '../context'
import Sidebar from '../components/sidebar2'
import ShaclForm from './shacl-form'
import TargetsForm from './targets-form'
import NavigateForm from './navigate-form'
import setOptionsDropdown from '../forms/fields/set-options-dropdown'
import ShaclUpload from './shacl-upload'
import { Popup } from 'semantic-ui-react'


import Activeraul from '../custom-hooks/activeraul-history'

export default ({outside, windowDimensions}) => {
    //console.log('at left sidebar')
    const [{selectionsSidebar},] = useContext(LayoutContext)
    const [panel, setPanel] = useState('Target Selections')
    // const [state, ] = useContext()

    const [popup, setPopup] = useState(true)
    const [activeraulContext] = Activeraul(ActiveraulContext)
    const {type, id} = activeraulContext.focus

    const opts = setOptionsDropdown({value :panel, onClick : () => {
        if (panel != 'SHACL Selections' && type === 'targets' && activeraulContext[type][id].children.length === 0 && activeraulContext[type][id].value !== '') {
            // console.log('setting popup to false')
            // setPopup(false)
            setPanel('SHACL Selections')
            setPopup(false)
        }},
        
        
        onChange : (e, {value}) => {setPanel(value); setPopup(true)}, options : ['SHACL Selections', 'Target Selections', 'Navigate Form', 'upload/edit .ttl'], style :{width:'160px', margin:'0px', textAlign:'left', verticalAlign:'left'}})

    return Sidebar({
        windowDimensions : windowDimensions,
        panel : {'SHACL Selections' : <ShaclForm opts={
            // // () =>

            // <Popup open={panel != 'SHACL Selections' && type === 'targets' && activeraulContext[type][id].children.length === 0 && activeraulContext[type][id].value !== ''} content='You can move the the SHACL selection panel here'>
            //     {opts}
            //     {/* {opts()} */}
            opts
            // </Popup>
                   
        } activeraulContext={activeraulContext}/>, 'Target Selections' : <TargetsForm opts={
            <Popup trigger={
                <div onClick={() => {
                    if (panel != 'SHACL Selections' && type === 'targets' && activeraulContext[type][id].children.length === 0 && activeraulContext[type][id].value !== '') {
                        // console.log('setting popup to false')
                        setPopup(false)
                    }
    
    
                }}>
                    {opts}
                </div>
            //    opts
            
            } open={panel != 'SHACL Selections' && type === 'targets' && activeraulContext[type][id].children.length === 0 && activeraulContext[type][id].value !== '' && popup}
                style={{width: '25%'}}
            content={
                // <div style={{width: '25%'}}>
                `You should now move to the SHACL selection panel here`
                // </div>
                
            
            } 
            //position='left top' 
            size='mini'
            onClick={() => {
                if (panel != 'SHACL Selections' && type === 'targets' && activeraulContext[type][id].children.length === 0 && activeraulContext[type][id].value !== '') {
                    setPopup(false)
                }


            }}
            />
        
        }/>, 'Navigate Form' : <NavigateForm opts={opts}/>, 'upload/edit .ttl' : <ShaclUpload opts={opts}/>}[panel],
        title : panel,
        direction : 'left',
        width : 'very wide',
        visible : selectionsSidebar,
        onChange : () => {},
        outside
    })
}