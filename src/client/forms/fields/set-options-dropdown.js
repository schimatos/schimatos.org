import React from 'react'
import {Dropdown} from 'semantic-ui-react'
import {optionsFromArray, removeDuplicates, sortDictsByKeyNumericCompare} from '../../utils'

export default ({key, value, options, onChange, loading, placeholder, multiple, customOptions, sort, simple, style}) => {
    const unsorted = customOptions ? options : optionsFromArray(removeDuplicates(options))
    const opts = sort ? sortDictsByKeyNumericCompare(unsorted, 'text') : unsorted
    return (<>
        
        {simple ? <Dropdown fluid text={simple ? value : undefined} button style={simple ? {border : '0px', width : '155px', horizontalAlign : 'centre'} : {}} icon={simple ? false : 'dropdown'}
        multiple={multiple}
        key={key}
        value={value}
        loading={loading}
        placeholder={placeholder}
        selection
        options={opts}
        onChange={onChange}/>
        :
        <Dropdown fluid text={simple ? value : undefined} button style={style}
        multiple={multiple}
        key={key}
        value={value}
        loading={loading}
        placeholder={placeholder}
        selection
        options={opts}
        onChange={onChange}/>}
        </>
        )
}