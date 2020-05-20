import { input, dropdown } from './functional-react';
export const multiOrSingleInput = props => {
    const options = props.value;
    const val = options.length > 0 ? options[0] : '';
    const onChange = (e, { value }) => props.onChange(e, { value: [value, ...options.slice(1)] });
    if (props.multiple) {
        return dropdown({ ...props, options, search: true, multiple: true, fluid: true, selection: true, allowAdditions: true });
    }
    else {
        return input({ ...props, value: val, onChange });
    }
};
