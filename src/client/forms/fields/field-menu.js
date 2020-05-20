import React from 'react';
import {Menu, Icon} from 'semantic-ui-react'

const FieldMenu = props => {
    return (    
        <Menu icon relaxed='false'>
        {props.icons.map(([name, active, f], i) => (
            <Menu.Item key ={i} name={name} onClick={f} disabled={!active}>
                <Icon name={name} />
            </Menu.Item>
        ))}
        </Menu>
    )
}

export default FieldMenu