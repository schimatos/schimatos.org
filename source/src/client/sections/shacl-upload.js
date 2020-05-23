import React, {useState, useContext} from 'react';
import { Form, TextArea, Button, Input, Select, Icon, Divider, Segment } from 'semantic-ui-react';
import axios from 'axios';
//import '../../../public/styles/shacl-upload.css'
import undoableSection from '../forms/fields/undoable-section';
import {TriplestoreContext} from '../context'

import triplestoreInterface from '../triplestore-interface'

export default ({opts}) => {
    console.log('at shacl uplaod')
    const triplestore = triplestoreInterface()
    
    const [state, setState] = useState('')

    const addFiles = (files, text) => {

        const file = files.pop()

        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        if (file) {
            reader.onload = function (evt) {
                files.length > 0 ? addFiles(files, evt.target.result + text) : setState(evt.target.result + text)
            } 
            reader.onerror = function (evt) {
                console.log('error reading file')
            }}
    }

    const fileUpload = e => addFiles(Object.values(e.target.files), '')

    const shUpload = () => triplestore({
            ttl : state,
            graph : 's',
            query : 'INSERT_TTL',
            responseFunc : () => window.alert('Upload Successful!'),
            errorFunc : () => window.alert('Upload Failed')
        })

    const content = () => (
        <Segment basic style={{margin : '0px', padding : '0px'}}>
        <Form>
            <Input 
                type="file" 
                onChange={e => fileUpload(e)}
                accept=".ttl"
                multiple={true}/>
            <Divider/>
            <TextArea 
                onChange={e => setState(e.target.value)}
                value={state}
                type="textarea"
                className="shaclInput"/>
            <Divider/>
            <Button 
            align={'right'}
            floated={'right'}
                type="button"
                onClick={() => shUpload()}>
                    <Icon name='upload'/>Upload
            </Button>
        </Form>
        </Segment>
    )
    return undoableSection({
        content,
        title: opts
    });
}
