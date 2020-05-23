import React from 'react'

export const CheckBox = props => {
    const onClick = name => props.onClick(name)
    const name = props.name
    return(
        <div className='checkbox'>
        <input
            type='checkbox'
            onChange={name => onClick(name)}
            name={name}
            checked={props.checked}/>
        {name}
        </div>
)};

export const CheckBoxes = props => {
return(
    <fieldset>
        <legend>{props.name}</legend>
        {Object.entries(props.checkBoxes).map(([name, selected], i) => {
            return(
            <CheckBox
                onClick={name => props.onClick(name)}
                name={name}
                checked={selected}
                key={i}/>
            )
        })}
    </fieldset>
)};

export default CheckBox;