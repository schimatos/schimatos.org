import React from 'react'
import {Popup, Header, Icon, Grid} from 'semantic-ui-react'
import {fromCamel, camelToSnake} from '../../utils'
import {strip} from '../../utils'

export const propertyDisplay = severity => {
    switch (severity) {
        case 'Info'   : return {color : 'green',  icon : 'info circle'};
        case 'Warning': return {color : 'yellow', icon : 'alarm'};
        default       : return {color : 'red',    icon : 'warning sign'};
    }
}

export const NamePopup = (property) => {
    const prefix = ''
    const path = property.path
    const message = property.message
    const name = property.name ? property.name : strip(path, prefix)
    const displayProperties = Object.keys(property).filter(x => !['path', 'pathType', 'message', 'severity'].includes(x))

    return (
    <Popup hoverable
        trigger={<Header as='h4'>{name}</Header>}>
        <Popup.Header><a href={path} color='black' target="_blank">{path}</a></Popup.Header>
        <Popup.Content>
            <>
        {message && message} <br/>
        {displayProperties.map((x,i) => {
            return(
            <div key={i}>{fromCamel(x)}: {property[x]}</div>
            )
        })}
        </>
        </Popup.Content>
    </Popup>
    )
}

export const SeverityPopup = severity => (
    <Popup hoverable
        trigger={<Icon name={propertyDisplay(severity).icon}/>}>
        <Popup.Header>Severity level: <i>{severity ? severity : 'undefined'}</i></Popup.Header>
        <Popup.Content>
        {!severity && <>Shacls with undefined severity default to a <i>violation</i>. </>}
        For more information see the <a href="https://www.w3.org/TR/shacl/#severity" target="_blank">official W3C documentation.</a>
        </Popup.Content>
    </Popup>
)

export const pathTypePopup = property => {
    const details = {
        path : undefined,
        inversePath : ['pointing up',, 'The options you select in this field are subjects'],
        alternativePath : ['move',, 'There are several properties/paths which satisfy this constraint. Use the dropdown to select which path you wish to work with'],
        zeroOrMorePath : [,'0+', 'This is satisfied by any entity which is connected to the target via zero or more steps along this path. Hence the target is included in the constraint'],
        oneOrMorePath : [,'1+', 'This is satisfied by any entity which is connected to the target via one or more steps along this path'],
        zeroOrOnePath : [,'0|1', 'This is satisfied by any entity which is connected to the target via zero or one steps along this path. This can be teated as a normal property path with the addition of the target itself being included in the constraint']
    }

    if (!details[property]) {
        return
    } else {
        const [icon, text, content] = details[property]
        const trigger = icon ? <Icon name={icon}/> : <b>{text}</b>
        const popupContent = <>{content}. 
        For more information see <a href={`https://www.w3.org/TR/shacl/#${camelToSnake(property.replace('Path',''))}`} target="_blank">official W3C documentation.</a>
        </>
        return (
        <Grid.Column>
            <Popup hoverable
                 trigger={trigger}>
            <Popup.Header>{fromCamel(property)}</Popup.Header>
            <Popup.Content>
                {content} 
                . For more information see <a href={`https://www.w3.org/TR/shacl/#${camelToSnake(property.replace('Path',''))}`} target="_blank">official W3C documentation.</a>
            </Popup.Content>
        </Popup>
        </Grid.Column>
        )
    }
}