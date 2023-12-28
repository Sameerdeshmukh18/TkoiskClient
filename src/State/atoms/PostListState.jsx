import {atom} from 'recoil'

export const PostList = atom({
    key: 'PostList', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});