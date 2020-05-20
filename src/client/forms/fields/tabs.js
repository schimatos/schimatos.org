import React from 'react';

const Tabs = props => {
    if(props.hidden){return(<></>)}

    const names = props.names
    const onToggle = name => props.onToggle(name)
    
    return(
        <fieldset class='tabsWindow'>

        <legend>{props.legend}</legend>

            <div class='tabsButtons'>
                {names.map(name => {
                    return (
                        <button
                            type='button'
                            class='tabButton'
                            name={name}
                            onClick={() => onToggle(name)}>
                                {name}
                        </button>
                    )})}
            </div><br/>
            {props.children}
        </fieldset>
    )
}

export default Tabs