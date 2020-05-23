import React from 'react'
import {Grid, Icon, Loader} from 'semantic-ui-react'

export default ({onClick}) => (
    <div style={{padding : '0px'}}>
    <Grid>
        <Grid.Row>
            <Grid.Column textAlign={'center'} verticalAlign='middle' >
                <Loader active inline='centered' />
            </Grid.Column>
            <Grid.Column floated={'right'} width={2}  textAlign={'right'} verticalAlign='middle'>

                    <Icon name='x' onClick={onClick}/>
  
            </Grid.Column>
        </Grid.Row>
    </Grid>
    </div>
)
