import React, {useState} from 'react'
import {Confirm} from 'semantic-ui-react'
import FieldMenu from '../fields/field-menu'

// Warned menu accepts an optional message as the 4th entry in the icons list
// if propogated, a warning will be displayed with the message before action is executed

const WarnedMenu = props => {
    const [state, setState] = useState(false)
    
    const [icons, warn] = props.icons.reduce((total, icon) => {
        if (icon.length === 4) {
            const [name, disabled, action, message] = icon
            const newIcons = [...total[0], [name, disabled, () => setState(name)]]
            const newWarn = {...total[1], [name] : {...{message, action : () => action()}}}
            return [newIcons, newWarn]
        } else {
            return [[...total[0], icon], total[1]]
        }
    }, [[], Object({})])

    const getDetails = () => {
        return(state ? warn[state] : {})
    }

    const onConfirm = () => {
        close()
        getDetails().action()
    }

    const close = () => setState(false)

    return (
        <>
        <FieldMenu icons={icons}/>

        <Confirm
        open={state ? true : false}
        header={getDetails().message}
        onCancel={() => setState(false)}
        onConfirm={() => onConfirm()}
        />
        </>
    )
}

export default WarnedMenu