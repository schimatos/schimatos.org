export default props => {
    const initialState = {
        name : '',
        targetBy : {
            Node : [],
            Class : [],
            ObjectsOf : [],
            SubjectsOf : []
    }}
    const Content = ({name, targetBy}) => [
        ['Shacl Name :)', ],
        ['Shacl Targets', 
            Object.entries(targetBy).map(([n, selections], i) => {
              return [MultipleDropdown, targetBy[n], 
                {options : selections, key : i, additionLabel : `Add ${n}: `, noResultsMessage : `Type the name of the ${n} you wish to associate with this shacl.`}
              ]})]]
    return FieldModal({...props, initialState, Content})
}