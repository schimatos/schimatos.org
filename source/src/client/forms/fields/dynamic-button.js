import React, {useState} from 'react'
import {Icon, Button, Confirm} from 'semantic-ui-react'

const DynamicButton = ({disabled,
    giveWarning,
    warningMessage,
    onSubmit,
    name,
    style,
    keyNo,
    attached,
    compact}) => {
        //console.log('dynamic button')
    const [state, setState] = useState(false)

    //console.log('dynamic button called')


    const buttonClick = () => {
        if (giveWarning) {
            setState(true)
        } else {
            return onSubmit()
        }
    }

    return (
        <>
        <Button key={'button'+keyNo} icon={name} onClick={() => buttonClick()} disabled={disabled} attached={attached} compact={compact} style={style}/>
        <Confirm
            key={'confirm'+keyNo}
            open={state}
            header={warningMessage}
            onCancel={() => setState(false)}
            onConfirm={() => onSubmit()}
            />
        </> 
    )
}

export default DynamicButton