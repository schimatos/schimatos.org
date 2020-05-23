import React from 'react'
export default () => {
    const modal = () => {
        const content = () => [
            ['New Users',, 'If you are new to activeraul you may benefit by having descriptions of each form tool given when hovering over the element. This can be activated in our display settings.'],
            ['Useful Links', (<a href='https://www.w3.org/TR/shacl/' target="_blank">Shapes Contraint Language (SHACL)</a>)]
        ]
        return {content, initialState : {foo : 'foo'}, header : 'Help', confirmation : true}
    }

    return {
        modal : modal(),
        icon : 'help',
        popup : 'Help'
    }
}