import { combineReducers } from 'redux';

export const LOGIN = 'USER LOGIN';
export const LOGOUT = 'USER LOGOUT';
export const GUEST_LOGIN = 'GUEST LOGIN'
export const ADD = 'MODE ADD';
export const EDIT = 'MODE EDIT';

const initialState = {
    username: '',
    mode: ''
}

export function login(username){
    return {type: LOGIN, username}
}
export function guestLogin(){
    return {type: GUEST_LOGIN, username: 'guest'}
}

export function logout(){
    return {type: LOGOUT}
}

export function add(){
    return {type: ADD, mode: "ADD"}
}

export function edit(){
    return {type: EDIT, mode: "EDIT"}
}

function dispatcher(state, action){
    switch(action.type){
        case LOGIN:
            return Object.assign({}, state, {
                username: action.username
            })
        case GUEST_LOGIN:
            return Object.assign({}, state, {
                username: action.username
            })
        case ADD:
            return Object.assign({}, state, {
                mode: action.mode
            })
        case EDIT:
            return Object.assign({}, state, {
                mode: action.mode
            })
        case LOGOUT:
        default:
            return initialState;
    }
}


export const reducer = combineReducers({state: dispatcher});
