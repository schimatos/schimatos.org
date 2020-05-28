import React from 'react'
import {Dropdown, Label, Button, Icon, Grid, Divider, Segment, Input, Table} from 'semantic-ui-react'
import DynamicButton from '../fields/dynamic-button'


const TargetDropdown = props => {
    const parentNo = props.state.targets[props.id].parent
    ////console.log(props.state.targets[props.id])
    ////console.log(parentNo)
    const parent = parentNo > -1 ? props.state.properties[parentNo] : undefined
    ////console.log(parent)

    const property = parent ? props.state.propertyList[parent.property] : {minCount : 1, severity : 'Violation'}
    const minCount = property.minCount ? property.minCount : 1
    ////console.log('minCount', minCount)
    const childrenNo = parentNo != '-1' ? parent.children.length : 1
    const atMin = childrenNo <= minCount
    ////console.log('atMin', atMin)
    const violation = [undefined, 'Violation'].includes(property.severity)
    ////console.log('vioaltion', violation, property.severity)
    
    const remove = () => props.hooks.removeTarget(props.id, parentNo)

    return (
    <>
  {/* <Segment basic textAlign='center'>
    <Input
      action={{ color: 'blue', content: 'Search' }}
      icon='search'
      iconPosition='left'
      placeholder='Order #'
    /> */}

    <Table padded={false} fitted={'true'} style={{padding : '0px'}}>
        <Table.Body fitted={'true'}>
            <Table.Row fitted={'true'}>
                <Table.Cell fitted={'true'} style={{padding : '0px'}}>
                <Dropdown
            options={props.hooks.idOptions(props.id).options}
            loading={props.hooks.idOptions(props.id).loading}
            placeholder='Target...'
            search
            selection
            fluid
            allowAdditions
            noResultsMessage='No suggestions found. Please type your entry.'
            additionLabel='Custom Target: '
            onChange={(e, {value}) => props.hooks.idAddOptions(props.id, value)}/>

                </Table.Cell>
                <Table.Cell width={1} textalign='center' style={{padding : '0px'}}>
                <DynamicButton
                    name='x'
                    disabled={atMin && violation}
                    giveWarning={atMin}
                    warningMessage={`The constraint says that this property has at least ${minCount} target${minCount ==1 ? '' : 's'} and there ${childrenNo == 1 ? 'is' : 'are'} only ${childrenNo} remaining.`}
                    onSubmit={() => remove()}
                />

                </Table.Cell>

            </Table.Row>


        </Table.Body>

    </Table>

    </>
    )
}


export default TargetDropdown