import alternatePath from 'alternate-path'
import inversePath from 'inverse-path'
import oneOrMorePath from 'one-or-more-path'
import path from 'path'
export default () => (
<Grid  relaxed={false}>
<Grid.Row stretched style={{padding : '14px'}}>

<Grid.Column verticalAlign='middle' width={1} style={{padding : '0px'}}>
        {(!prop.hidden || state.properties[no].children.length === 0) && AddField()}
    </Grid.Column>

    <Grid.Column verticalAlign='middle' width={1} style={{padding : '0px'}}>
    {state.properties[no].children.length > 0 && (prop.hidden ?
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
        {NamePopup(property, prefix)}
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
