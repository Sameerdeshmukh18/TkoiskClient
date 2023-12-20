import {atom} from 'recoil'

export const seedState = atom({
    key: 'seedState', // unique ID (with respect to other atoms/selectors)
    default: 0, // default value (aka initial value)
});