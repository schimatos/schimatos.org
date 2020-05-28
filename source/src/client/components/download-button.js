import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

export default ({filename, text, state}) => {
    ////console.log('filename', filename, 'text', text, 'state', state)
    //return <div>hi</div>
    return (<Button
        as={'a'}
        style={{align : 'right'}}
        href={'data:text/plain;charset=utf-8,' + encodeURIComponent(text)}
        download={filename}
        ><Icon name='download' />Download</Button>)
}