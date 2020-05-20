import { numberInput } from './functional-react';
export const intInput = p => numberInput({ ...p, valueType: 'integer', stepAmount: 1, minValue: 0, buttonPlacement: 'leftAndRight' });
