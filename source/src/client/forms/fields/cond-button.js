import React from 'react'

// Button that is only displayed when condition is true

const CondButton = props => {
    return(
        <>
        {props.condition &&
            <button type='button' onChange={() => props.onChange()}>
                {props.name}
            </button>
        }
        </>
    )
}

export default CondButton;