import React from 'react'
import {nCopies} from '../../utils'
import {Table, Input, Button} from 'semantic-ui-react'
import SetOptionsDropdown from './set-options-dropdown'

export default ({header, value, onChange}) => {
    // Structure of table is defined by header
    // each entry in header is a column. If string
    // it is a free entry column with value as column header. If it is an array
    // first entry is column header, second entry is dropdown options, third entry
    // allows same dropdown option twice (optional).
    const cellChange = (row, col, e, data) => {
        const value2 = value.length ===row  ? [...value, nCopies(header.length,'')] : value
        value2[row][col] = data.value
        const newValue = value2.filter(row => row.reduce((t, c) => c!==''||t, false))
        onChange(e, {...data, value : newValue})
    }
    const removeColumn = (e, row) => {
        onChange(e, {value : value.filter((x, i) => i!=row-1)})
    }

    const isDropdown = x => !(typeof(x) === "string")
    const maxCols = header.reduce((t, x) => isDropdown(x) && !(x.length === 3 && !x[2]) ? (t ? Math.min(x[1].length, t) : x[1].length) : t, undefined)
    const columns = (maxCols === undefined || value.length < maxCols) ? [...value, nCopies(header.length,'')] : value

    const options = (colNo, cell) => {
        const exists = x => !value.map(v => v[colNo]).includes(x) || x === cell
        const mostOne = !(header[colNo].length === 3 && !header[colNo][2])
        return mostOne ? header[colNo][1].filter(exists) : header[colNo][1]
    }

    return (
        <Table compact celled definition padded={false}>
            <Table.Header>
                <Table.Row>
                <Table.HeaderCell />
                    {header.map((x, i) => <Table.HeaderCell key={i+1} textAlign={'center'} collapsing={true}>{isDropdown(x) ? x[0] : x}</Table.HeaderCell>)}
                </Table.Row>
            </Table.Header>
            <Table.Body >
                {columns.map((row, rowNo) => (
                    <Table.Row key={rowNo}>
                        {rowNo < value.length ? (<Table.Cell width={1}>
                            <Button fluid size={'mini'} compact key={rowNo} icon='x' onClick={e => removeColumn(e, rowNo+1)}/>
                        </Table.Cell>) : <Table.Cell width={1}/>}
                        {row.map((cell, colNo) => (
                            <Table.Cell key={colNo}>
                                {!isDropdown(header[colNo]) ? (
                                    <Input fluid transparent
                                        key={colNo}
                                        value={cell}
                                        onChange={(e, data) => cellChange(rowNo, colNo, e, data)}/>                                    
                                ) : (
                                    <SetOptionsDropdown
                                        options={options(colNo, cell)}
                                        value={cell}
                                        onChange={(e, data) => cellChange(rowNo, colNo, e, data)}/>
                                )}
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}            
            </Table.Body>
        </Table>
    )
}