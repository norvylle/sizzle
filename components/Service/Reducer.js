import { combineReducers } from 'redux';

const LOGIN = 'USER LOGIN';
const LOGOUT = 'USER LOGOUT';
const GUEST_LOGIN = 'GUEST LOGIN'
const ADD = 'MODE ADD';
const EDIT = 'MODE EDIT';
const POST_EDIT = "MODE POST_EDIT"
const NONE = 'MODE NONE';

const initialState = {
    user: null,
    mode: 'NONE'
}

export function login(user){
    return {type: LOGIN, user}
}
export function guestLogin(){
    return {type: GUEST_LOGIN, user: {username: 'guest'}}
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

export function postEdit(){
    return {type: POST_EDIT, mode: "POST_EDIT"}
}

export function none(){
    return {type: NONE, mode: "NONE"}
}

function dispatcher(state, action){
    switch(action.type){
        case LOGIN:
            return Object.assign({}, state, {
                user: action.user
            })
        case GUEST_LOGIN:
            return Object.assign({}, state, {
                user: action.user
            })
        case ADD:
            return Object.assign({}, state, {
                mode: action.mode
            })
        case EDIT:
            return Object.assign({}, state, {
                mode: action.mode
            })
        case POST_EDIT:
        return Object.assign({}, state, {
            mode: action.mode
        })
        case NONE:
            return Object.assign({}, state, {
                mode: action.mode
            })
        case LOGOUT:
        default:
            return initialState;
    }
}


export const reducer = combineReducers({state: dispatcher});
