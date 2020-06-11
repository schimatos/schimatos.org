import React, {useState, useContext} from 'react';
import { Form, TextArea, Button, Input, Select, Icon, Divider, Segment } from 'semantic-ui-react';
import axios from 'axios';
//import '../../../public/styles/shacl-upload.css'
import undoableSection from '../forms/fields/undoable-section';
import {TriplestoreContext} from '../context'

import triplestoreInterface from '../triplestore-interface'

export default ({opts}) => {
    //console.log('at shacl uplaod')
    const triplestore = triplestoreInterface()
    
    const [state, setState] = useState(`ex:humanWikidataShape0
    a sh:NodeShape ;	
    sh:label "Shape of human instances in Wikidata" ;
	sh:property [
		sh:class <http://www.wikidata.org/entity/Q5> ;
		sh:minCount '1' ;
		sh:name 'children' ;
		sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
		sh:path <http://www.wikidata.org/prop/direct/P40> ;
	] ;
	sh:property [
		sh:class <http://www.wikidata.org/entity/Q5> ;
		sh:minCount '1' ;
		sh:name 'father' ;
		sh:node <http://example.org/humanWikidataShape> ;
		sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
		sh:path <http://www.wikidata.org/prop/direct/P22> ;
	] ;
	sh:property [
		sh:class <http://www.wikidata.org/entity/Q5> ;
		sh:minCount '1' ;
		sh:name 'mother' ;
		sh:node <http://example.org/humanWikidataShape> ;
		sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
		sh:path <http://www.wikidata.org/prop/direct/P25> ;
	] ;
	sh:property [
		sh:class <http://www.wikidata.org/entity/Q5> ;
		sh:minCount '1' ;
		sh:name 'sibling' ;
		sh:node <http://example.org/humanWikidataShape> ;
		sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
		sh:path <http://www.wikidata.org/prop/direct/P3373> ;
	] ;
	sh:property [
		sh:datatype <http://www.shacl.kg/type/name> ;
		sh:minCount '1' ;
		sh:name 'given name' ;
		sh:path <http://www.wikidata.org/prop/direct/P735> ;
	] ;
	sh:property [
		sh:in (
			<http://www.wikidata.org/entity/Q6581097>
			<http://www.wikidata.org/entity/Q6581072>
			<http://www.wikidata.org/entity/Q1097630>
			<http://www.wikidata.org/entity/Q1052281>
			<http://www.wikidata.org/entity/Q2449503>
			<http://www.wikidata.org/entity/Q48270>
		) ;
		sh:maxCount '1' ;
		sh:minCount '1' ;
		sh:name 'gender' ;
		sh:path <http://www.wikidata.org/prop/direct/P21> ;
	] ;
	sh:property [
		sh:maxCount '1' ;
		sh:minCount '1' ;
		sh:name 'date of birth' ;
		sh:pattern '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' ;
		sh:path <http://www.wikidata.org/prop/direct/P569> ;
	] ;
	sh:property [
		sh:maxCount '1' ;
		sh:minCount '1' ;
		sh:name 'place of birth' ;
		sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
		sh:path <http://www.wikidata.org/prop/direct/P19> ;
		sh:property [
			sh:maxCount '1' ;
			sh:minCount '1' ;
			sh:name 'country' ;
			sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
			sh:path <http://www.wikidata.org/prop/direct/P17> ;
		] ;
	] ;
	sh:property [
		sh:minCount '1' ;
		sh:name 'country of citizenship' ;
		sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
		sh:path <http://www.wikidata.org/prop/direct/P27> ;
	] ;
	sh:property [
		sh:minCount '1' ;
		sh:name 'family name' ;
		sh:path <http://www.wikidata.org/prop/direct/P734> ;
	] ;
	sh:property [
		sh:minCount '1' ;
		sh:name 'husband/wife' ;
		sh:node <http://example.org/humanWikidataShape> ;
		sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
		sh:path <http://www.wikidata.org/prop/direct/P26> ;
	] ;
	sh:property [
		sh:minCount '1' ;
		sh:name 'native language' ;
		sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
		sh:path <http://www.wikidata.org/prop/direct/P103> ;
	] ;
	sh:property [
		sh:minCount '1' ;
		sh:name 'occupation' ;
		sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
		sh:path <http://www.wikidata.org/prop/direct/P106> ;
	] ;
	sh:property [
		sh:minCount '1' ;
		sh:name 'publishing language(s)' ;
		sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
		sh:path <http://www.wikidata.org/prop/direct/P6886> ;
	] ;
	sh:property [
		sh:minCount '1' ;
		sh:name 'written/spoken language(s)' ;
		sh:nodeKind <http://www.w3.org/ns/shacl#IRI> ;
		sh:path <http://www.wikidata.org/prop/direct/P1412> ;
	] .`)

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
                key = "uploader"
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
