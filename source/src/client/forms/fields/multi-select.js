import React from 'react';

const MultiSelect = props => {
  const {name, options, id, value, onChange} = props
  return(
    <select
      multiple={true}
      name={name}
      value={value}
      onChange={() => onChange()}>
      {options.map(opt => <option id={id} key={opt} value={opt}>{opt}</option>)}
    </select>
  )};

export default MultiSelect;