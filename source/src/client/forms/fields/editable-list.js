import React from 'react'
import {Popup, Table, Checkbox, Button, Segment} from 'semantic-ui-react'
import {isDict} from '../../utils'

export default ({header, value, onChange, displayConversion}) => {
    const isDictionary = isDict(value)
    const v = value ? (isDictionary ? Object.entries(value) : value) : [] // More robust, works with undefined etc

    const cellChange = (row, col, e, data) => {
        const value2 = value
        value2[row][col] = !value2[row][col]
        const newValue = value2.filter(row => row.reduce((t, c) => c!==''||t, false))
        onChange(e, {...data, value : newValue})
    }
    const removeColumn = (e, row) => {
        const n = v.filter((x, i) => i!=row-1)
        onChange(e, {value : isDictionary ? Object.fromEntries(n) : n})
    }

    const colChange = (i, e, data) => {
        const {checked} = data
        const newValue = v.map(x => {
            x[i] = checked == true
            return [...x]
        })
        onChange(e, {value : [...newValue]})
    }

    const dispCell = (key, cell) => {
        const conversion = displayConversion ? displayConversion(cell) : cell
        const display = typeof(conversion) === 'string' ? conversion : <Popup hoverable on={'hover'} position={'top center'} key={key} trigger={<Segment compact style={{padding : '0px'}} basic>{conversion.value}</Segment>} content={conversion.popup} mouseEnterDelay={500}/>
    return display
    }

    return (
        <Table compact={true} celled definition padded={false}>
            <Table.Header>
                <Table.Row>
                <Table.HeaderCell witdh={1} />
                    {header.map((x, i) => (<Table.HeaderCell key={i+1} textAlign={'center'} collapsing={true} style={{color : typeof(x) === 'string' ? 'black' : x[1]}}>
                        
                        {i > 0 && <Checkbox
                            key={i}
                            checked={value.reduce((t, x1) => t && x1[i], true)}
                            onChange={(e, data) => colChange(i, e, data)}/>}
                            <br/>
                            {typeof(x) ==='string' ? x : x[0]}
                    </Table.HeaderCell>))}
                </Table.Row>
            </Table.Header>
            <Table.Body >
                {v.map((row, rowNo) => (
                    <Table.Row key={rowNo}>
                            {rowNo < v.length ? (<Table.Cell width={1}>
                            <Button fluid size={'mini'} compact key={rowNo} icon='x' onClick={e => removeColumn(e, rowNo+1)}/>
                        </Table.Cell>) : <Table.Cell width={1}/>}
                        {row.map((cell, colNo) => (
                            <Table.Cell key={colNo} textAlign={'center'} verticalAlign={'middle'}>
                                {typeof(cell) !== 'boolean' ? (dispCell(colNo, cell)) : (
                                <Checkbox fitted
                                    key={colNo}
                                    checked={cell}
                                    onChange={(e, data) => cellChange(rowNo, colNo, e, data)}/>)}
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}            
            </Table.Body>
        </Table>
    )
}