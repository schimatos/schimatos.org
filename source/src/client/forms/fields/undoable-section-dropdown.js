import React, {useState, useEffect} from 'react'
import UndoableSection from './undoable-section'
import setOptionsDropdown from './set-options-dropdown'
import Sidebar from '../../components/sidebar'
//import 
import {Button, Grid} from 'semantic-ui-react'

export default ({panels, title, direction, width, visible, onClose, onChange, outside}) => {
    const options = [...Object.keys(panels)]
    const [value, setPanel] = useState(options[0])

    const titleDropdown = (
        <Grid>
            <Grid.Row style={{margin : '0px', padding : '0px'}}>
                <Grid.Column width={4}>
                <Button icon='x' circular onClick={onClose}/>   
                </Grid.Column>
                <Grid.Column>
                {setOptionsDropdown({value, onChange : (e, {value}) => setPanel(value), options, simple : true, style :{width:'160px', margin:'0px', textAlign:'left', verticalAlign:'left'}})}                    
                </Grid.Column>
            </Grid.Row>
       
        </Grid>)

    const newPanels = tt => Object.entries(panels).map(([t, c]) => {
        return [t===tt, c]
    })

    const pnls = newPanels(value)
    return (<Sidebar
            direction={direction}
            width={width}
            visible={visible}
            close={onClose}
            panels={pnls}
            outside={outside}/>)
}