import React from 'react';

const SingleSelect = props => {
  const {name, options, id, value, onChange} = props
  return(
    <select
      multiple={false}
      name={name}
      value={value}
      onChange={e => onChange(e)}>
      {options.map(opt => <option id={id} key={opt} value={opt}>{opt}</option>)}
    </select>
  )};

export default SingleSelect;