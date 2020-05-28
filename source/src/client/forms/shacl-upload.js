import React, {useState, useContext} from 'react';
import axios from 'axios';
import '../../../public/styles/shacl-upload.css'

import {TriplestoreContext} from '../context'

import {requester} from '../utils'

const ShaclUpload = () => {

    const [{settings, shacl_graphs, schema_prefixes},] = useContext(TriplestoreContext)
    const graph = shacl_graphs[settings.shacl_graph]

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
                //console.log('error reading file')
            }}
    }

    const fileUpload = e => addFiles(Object.values(e.target.files), '')

    const shUpload = () => requester({
            extension : 'upload/shacl',
            body : {data : state, graph, schema_prefixes},
            responseFunc : () => window.alert('Upload Successful!')
        })

    return (
        <fieldset className="shaclUpload">
            <legend>Shacl Upload</legend>

            <div>
                Upload shacls in turtle (.ttl) format following the W3C reccomendations.
            </div>

            <br/>

            <input 
                type="file" 
                onChange={e => fileUpload(e)}
                accept=".ttl"
                multiple={true}/>

            <br/><br/>

                <textarea 
                    onChange={e => setState(e.target.value)}
                    value={state}
                    type="textarea"
                    className="shaclInput"/>
            <br/>

            <button 
                type="button"
                onClick={() => shUpload()}>
                    Upload
            </button>

            <button
                type="button"
                onClick={() => window.location.reload()}>
                    Clear
            </button>

        </fieldset>
    )
}

export default ShaclUpload;