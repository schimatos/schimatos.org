import React from 'react';
import {Menu, Icon} from 'semantic-ui-react'



export default props => {
    return (    
        <Menu className='ui menu' fixed={'top'}>>
        {props.icons.map(([name, active, f], i) => (
            <Menu.Item key ={i} name={name} onClick={f} disabled={!active}>
                <Icon name={name} />
            </Menu.Item>
        ))}
        </Menu>
    )
}

export default FieldMenu



<Menu
className='ui menu'
fixed={'top'}>

<Menu.Item
    name='bars'
    active={state.selectionsBar}
    onClick={() => dispatch({type : 'TOGGLE', panel : 'selectionsBar'})}>
    <Icon name='bars' />
</Menu.Item>

<Menu.Item
    name='edit'
    active={state.creationBar}
    onClick={() => dispatch({type : 'TOGGLE', panel : 'creationsBar'})}>
    <Icon name='edit' />
</Menu.Item>

<Menu.Item
    name='basic'>
    Basic
</Menu.Item>

<Menu.Item
    name='customised'>
    Customised
</Menu.Item>

<Menu.Item
    name='submitall'>
    Submit All
</Menu.Item>

<Menu.Menu position='right'>

    {/* <HelpModal/> */}

    {/* <SettingsModal/> */}

</Menu.Menu>


</Menu>