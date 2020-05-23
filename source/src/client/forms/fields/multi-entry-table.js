import React from 'react'
import {nCopies} from '../../utils/utils'
import {Table, Input, Button} from 'semantic-ui-react'
import {isDict} from '../../utils/utils'


export default ({header, value, onChange}) => {
    const isDictionary = isDict(value)
    const v = value ? (isDictionary ? Object.entries(value) : value) : [] // More robust, works with undefined etc

    const cellChange = (row, col, e, data) => {
        const value2 = v.length ===row  ? [...v, nCopies(header.length,'')] : v
        value2[row][col] = data.value
        const newValue = value2.filter(row => row.reduce((t, c) => c!==''||t, false))
        onChange(e, {...data, value : newValue})
    }
    const removeColumn = (e, row) => {
        const n = v.filter((x, i) => i!=row-1)
        onChange(e, {value : isDictionary ? Object.fromEntries(n) : n})
    }
    return (
        <Table compact celled definition padded={false}>
            <Table.Header>
                <Table.Row>
                <Table.HeaderCell />
                    {header.map((x, i) => <Table.HeaderCell key={i+1} textAlign={'center'} collapsing={true}>{x}</Table.HeaderCell>)}
                </Table.Row>
            </Table.Header>
            <Table.Body >
                {[...v, nCopies(header.length,'')].map((row, rowNo) => (
                    <Table.Row key={rowNo}>
                            {rowNo < v.length ? (<Table.Cell width={1}>
                            <Button fluid size={'mini'} compact key={rowNo} icon='x' onClick={e => removeColumn(e, rowNo+1)}/>
                        </Table.Cell>) : <Table.Cell width={1}/>}
                        {row.map((cell, colNo) => (
                            <Table.Cell key={colNo}>
                                <Input fluid transparent
                                    key={colNo}
                                    value={cell}
                                    onChange={(e, data) => cellChange(rowNo, colNo, e, data)}/>
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}            
            </Table.Body>
        </Table>
    )
}