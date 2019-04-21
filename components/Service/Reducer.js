import { combineReducers } from 'redux';

const LOGIN = 'USER LOGIN';
const LOGOUT = 'USER LOGOUT';
const GUEST_LOGIN = 'GUEST LOGIN';
const ADD = 'MODE ADD';
const EDIT = 'MODE EDIT';
const POST_EDIT = "MODE POST_EDIT"
const NONE = 'MODE NONE';
const VIEW_YUMMLY = "RECIPE YUMMLY"
const VIEW_YUMMLY_MEAL = "RECIPE YUMMLY_MEAL"
const VIEW_EDAMAM = "RECIPE EDAMAM"
const VIEW = "RECIPE DB"
const ADD_KEY = "DOWNLOAD"
const REMOVE_KEY = "REMOVE"

const initialState = {
    user: null,
    mode: 'NONE',
    view: null,
    downloadedKeys: []
}

export function login(user){
    return {type: LOGIN, user}
}
export function guestLogin(){
    return {type: GUEST_LOGIN, user: {username: null, starred: []}}
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

export function viewYummly(){
    return {type: VIEW_YUMMLY, view: "YUMMLY"}
}

export function viewYummlyMeal(){
    return {type: VIEW_YUMMLY_MEAL, view: "YUMMLY_MEAL"}
}

export function addKey(key){
    return {type: ADD_KEY, key}
}

export function removeKey(key){
    return {type: REMOVE_KEY, key}
}

export function viewEdamam(){
    return {type: VIEW_EDAMAM, view: "EDAMAM"}
}

export function view(){
    return {type: VIEW, view: null}
}

function dispatcher(state, action){
    switch(action.type){
        case LOGIN:
        case GUEST_LOGIN:
            return Object.assign({}, state, {
                user: action.user
            })
        case ADD:
        case EDIT:
        case POST_EDIT:
        case NONE:
            return Object.assign({}, state, {
                mode: action.mode
            })
        case VIEW_YUMMLY:
        case VIEW_YUMMLY_MEAL:
        case VIEW_EDAMAM:
        case VIEW:
            return Object.assign({}, state, {
                view: action.view
            })
        case ADD_KEY:
            return { 
                ...state,
                downloadedKeys: [...state.downloadedKeys, action.key]
            }
        case REMOVE_KEY:
            return { 
                ...state,
                downloadedKeys: state.downloadedKeys.filter((key)=> key !== action.key)
            }
        case LOGOUT:
        default:
            return initialState;
    }
}


export const reducer = combineReducers({state: dispatcher});
