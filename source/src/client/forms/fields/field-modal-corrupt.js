import React, {useState, useReducer} from 'react'
import {Modal, Button, Icon, Segment, Checkbox, Accordion, Popup, Confirm} from 'semantic-ui-react'
import {isDict} from '../../utils'


export default ({submit, open, close, initialState, content, header, conditions, advanced, submitButton, confirmation}) => {
    const st = x => typeof(x)==='string'
    const detail = (s, f) => {
        return f ? (st(f) ? s[f] : f.reduce((t, x) => t===undefined ? undefined : t[st(x) ? x : detail(s, x)], s)) : undefined
    }

    const newSubstate = (s, substate, path, value) => {
        const currentKey = typeof(path[0]) === 'string' ? path[0] : detail(s, path[0])

        const remainderPath = path.filter((x, i) => i !== 0)

        return {...substate, [currentKey] : (remainderPath.length === 0 ? value : newSubstate(s, substate[currentKey], remainderPath, value))}
    }

    const reducer = (s, a) => {
        const path = typeof(a.name) === 'string' ? [a.name] : a.name
        const newState = a.routine(newSubstate(s, s, path, a.value), a.value)
        return (!conditions || conditions(newState).reduce((t, x) => t && x, true)) ? newState : s
    }

    const [state, dispatch] = useReducer(reducer, initialState)
    const [advancedOptions, setAdvanced] = useState(false)

    const panels = ((content && state && Object.keys(state).length>0) ? content(state) : []).reduce((t, section, key) => {
        const content = section.filter((x,i) => i!=0).reduce((total, field, i) => {
            const noPath = () => typeof(field[1]) === 'object' && !(state !==undefined && detail(state, field[1]) !== undefined)
            const fcondition = () => (field.length > 4 && ((field[4].advanced ===true && !advancedOptions) || !(field[4].condition ? field[4].condition(state) : true)))
            const notInput = (typeof(field) === 'string' || (isDict(field) && field.type))
            if (noPath() || fcondition()) {return total}
            //console.log('field',field)
            return [...total,
                <>
                {notInput ? field : field.length > 3 && field[3]}
                {!notInput && field[0]({...field[2], value : state ? detail(state, field[1]) : undefined, key : i, onChange : (e, {value}) => dispatch({name : field[1], value, routine : (field.length > 4 && field[4].routine) ? field[4].routine : s => s})})}
                </>]
        }, [])
    return content.length > 0 ? [...t, {title : section[0], key, content : content.map((x, i) => <div key={i}>{x}{i<content.length-1 && <br/>}</div>)}] : t
    }, [])

    const [warning, setWarning] = useState(false)
    const onClick = () => confirmation ? setWarning(true) : submit(state)
    const onConfirm = () => {
        setWarning(false)
        submit(state)
    }

    return (
        <>
        <Modal
        open={open}
        onClose={() => close()}>
        <Modal.Header style={{padding : '0px'}}>

        <div style={{marginTop : '14px', marginLeft : '14px', marginRight : '14px', marginBottom : advanced ? '28px' : '14px'}}>
        {header}
        
        {advanced && 

        <Segment basic floated={'right'} style={{margin : '0px', padding : '0px'}} compact padded={false}>
        <Popup content={'Advanced Options'} trigger={<Checkbox slider={true} fitted onClick={() => setAdvanced(!advancedOptions)} />}/>
        <br/>
        Advanced
        
        </Segment>
}

        </div>

        </Modal.Header>

        <Modal.Content><Accordion exclusive={false} fluid defaultActiveIndex={[]} panels={panels} styled/></Modal.Content>
            <Modal.Actions>
                <Button onClick={() => close()}>
                <Icon name='x'/>Close
                </Button>



                {submitButton && <Button onClick={onClick}>
                    <Icon name='check'/>Submit
                </Button>}
            </Modal.Actions>
        </Modal>
        {state !== false && <Confirm
            open={warning !== false}
            onCancel={() => setWarning(false)}
            onConfirm={onConfirm}/>}
        </>
    )
}