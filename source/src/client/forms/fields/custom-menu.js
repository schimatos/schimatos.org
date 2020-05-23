import React, {useState} from 'react'
import {Icon, Menu, Popup, Confirm, Segment} from 'semantic-ui-react'
import FieldModal from './field-modal'

export default ({className, fixed, warnings, popups, icons}) => {
    console.log('at custom menu')
    const [state, setState] = useState(false)
    const [modalState, setModal] = useState(false)

    const reduceDetails = (ic, d, idn) => ic.reduce(([i, w, ix], icon) => {
        const {warning, onClick, modal, ...extra} = icon
        const {initialState, content, header, conditions, advanced, confirmation, defaultActiveIndex} = modal ? modal : {}
        const iconClick = () => (warning && (warnings !== false)) ? setState(ix) : (modal ? setModal(ix) : (onClick ? onClick() : undefined))
        const warnClick = () => modal ? setModal(ix) : onClick()
        const newIcons = [...i, {...extra, onClick : iconClick}]
        const newWarns = {...w, [ix] : {warning, onClick, initialState, content, header, conditions, warnClick, advanced, confirmation, defaultActiveIndex}}
        return [[...newIcons], {...newWarns}, ix + 1]
    }, [[], d, idn])
    
    const isArray = (icons instanceof Array)
    const [processedIconsLeft, det, idn] = reduceDetails(isArray ? icons : icons.left, Object({}), 0)
    const [processedIconsRight, details,] = isArray ? [[], det,] : reduceDetails(icons.right, det, idn)

    const menuItem = pos => (item, key) => {
        const {icon, text, popup, selected, active, onClick, image, link, activated} = item
        const disabled = active !==undefined ? !active : false
        const click = onClick ? onClick : <a key={`link${pos}${key}`} href={link} target="_blank"></a>
        const contenta = <Menu.Item style={{color : 'white'}} key={`${pos}${key}`} as={link && Segment} basic={link&&true} active={activated} disabled={disabled} onClick={click}>{icon&&<Icon key={`ic${pos}${key}`} name={icon} style={{color : 'white'}} inverted={selected}/>}{image&&<img key={`img${pos}${key}`} style={{width : '25px', height : '22px'}} src={`../../../../public/${image}`} alt={(!icon && !text) ? image.split('.')[0] : ''}/>}{text}</Menu.Item>
        const content = link ? <a key={`link${pos}${key}`} href={link} target="_blank">{contenta}</a> : contenta
        return (popup && popups !== false) ? <Popup key={`pop${pos}${key}`} content={popup} position={`bottom ${pos}`} trigger={content} hoverable={typeof(popup) !== 'string'} on={'hover'} mouseEnterDelay={750}/> : content
    }

    const getDetails = s => {
        const d = s !== false ? details[s] : {}
        return d
    }

    const warnConfirm = () => {
        getDetails(state).warnClick()
        setState(false)
    }

    const onConfirm = value => {
        getDetails(modalState).onClick(value)
        setModal(false)
    }

    const menu = (
        <Menu className={className} attached={fixed} style={{margin : '0px', backgroundColor : 'black', borderColor : 'black', borderRadius : '0px'}}>
            {processedIconsLeft.length > 0 && <Menu.Menu position='left'>{processedIconsLeft.map(menuItem('left'))}</Menu.Menu>}
            {processedIconsRight.length > 0 && <Menu.Menu position='right'>{processedIconsRight.map(menuItem('right'))}</Menu.Menu>}
        </Menu>
    )

    console.log('default active index', getDetails(modalState).defaultActiveIndex)

    return (
        <>
        {menu}
        {state !== false && <Confirm
            open={state !== false}
            header={getDetails(state).warning}
            onCancel={() => setState(false)}
            onConfirm={() => warnConfirm()}/>}
        {modalState !== false && <FieldModal
            submitButton={getDetails(modalState).onClick}
            submit={onConfirm}
            close={() => setModal(false)}
            open={modalState !== false}
            initialState={getDetails(modalState).initialState}
            content={getDetails(modalState).content}
            header={getDetails(modalState).header}
            conditions={getDetails(modalState).conditions}
            advanced={getDetails(modalState).advanced}
            confirmation={getDetails(modalState).confirmation}
            defaultActiveIndex={getDetails(modalState).defaultActiveIndex} />}
        </>
    )
}
