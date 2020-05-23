import axios from 'axios'

export default data => {
    const [{settings, knowledge_graphs, shacl_graphs},] = useContext(TriplestoreContext)
    const {knowledge_graph, shacl_graph, additional_shacl} = settings
    const [kgraph, sgraph, sgraphs] = [knowledge_graphs[knowledge_graph], shacl_graphs[shacl_graph], additional_shacl.map(x => shacl_graphs[x])]
    const {extension, body, responseFunc, errorFunc, priorFunc} = data
    priorFunc && priorFunc()
    axios.post(`http://localhost:5000/api/${extension}`, {...body, kgraph, sgraph, sgraphs})
        .then(
            response => {
                if (!response.ok) {
                    errorFunc()
                    throw Error(response.statusText)
                }
                return response
            })
        .then(responseFunc)
        .catch(error => {
            console.log(error)
            errorFunc()
        })
}