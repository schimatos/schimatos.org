import React from 'react'
import {Grid, Button} from 'semantic-ui-react'
// import alternatePath from 'alternate-path'
// import inversePath from 'inverse-path'
// import oneOrMorePath from 'one-or-more-path'
// import path from 'path'
import {propertyDisplay, SeverityPopup, pathTypePopup, NamePopup} from '../property-helpers'
import DynamicButton from '../../fields/dynamic-button'
export default ({prop, property, children, dispatch, no}) => {

    const targetsNo = children.length

    const AddField = () => {

        const maxCount = property.maxCount
        const atMax = maxCount && (maxCount <= targetsNo)
        const violation = !property.severity || property.severity === 'Violation'
    
        return (
            <DynamicButton
                name='plus'
                disabled={atMax && violation}
                compact={true}
                giveWarning={atMax }
                warningMessage={`Are you sure? The constraint says that this property has at most ${maxCount} targets and there are already ${targetsNo}.`}
                onSubmit={() => dispatch({type : 'ADD_OPTIONS_FIELD', no})}
            />
        )
    }

    return (
<Grid  relaxed={false}>
<Grid.Row stretched style={{padding : '14px'}}>

<Grid.Column verticalAlign='middle' width={1} style={{padding : '0px'}}>
        {(!prop.hidden || targetsNo === 0) && AddField()}
    </Grid.Column>

    <Grid.Column verticalAlign='middle' width={1} style={{padding : '0px'}}>
    {targetsNo > 0 && (prop.hidden ?
    <Button compact icon='unordered list' onClick={() => dispatch({type : 'CHANGE_VISIBILITY', id : no, ttype : 'properties', hidden : false})}/>
    :
    <Button compact icon='minus' onClick={() => dispatch({type : 'CHANGE_VISIBILITY', id : no, ttype : 'properties', hidden : true})}/>
    )}
    </Grid.Column>


    <Grid.Column verticalAlign='middle' width={2}>
        {SeverityPopup(property.severity)}
    </Grid.Column>
        
        {pathTypePopup(property.pathType)}
        
    <Grid.Column verticalAlign='middle' textAlign='center'>
        {NamePopup(property)}
    </Grid.Column>
{/* 
    <Grid.Column floated='right' style={{margin : '0px', padded : '0px'}}>
    <DynamicButton
name='plus'
// importdisabled={atMax && violation}
compact={true}
//style={{background : 'transparent'}}
//giveWarning={atMax }
warningMessage={`This will remove the property from the form but no edits will be made to the graph`}
onSubmit={() => dispatch({type : 'ADD_OPTIONS_FIELD', no})}
/>
    </Grid.Column> */}

    
        
</Grid.Row>
</Grid>
)
}