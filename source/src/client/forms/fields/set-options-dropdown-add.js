import React from 'react'
import {Dropdown} from 'semantic-ui-react'
import {optionsFromArray} from '../../utils'

export default ({key, value, options, onChange}) => (
    <Dropdown fluid
    key={key}
    value={value}
    search
    allowAdditions
    selection
    options={optionsFromArray(options)}
    onChange={onChange}/>
)