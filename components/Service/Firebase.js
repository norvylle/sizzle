import * as firebase from 'firebase';
let googleServices = require('../../google-services.json');

const config = require("config.json");

firebase.initializeApp(config)

const database = firebase.database();
const auth = firebase.auth();

function insert(data){
    database.ref(data.link)
    .set(data.data)
    .then(() => {
        console.log(data.link+": INSERT SUCCESS");
        return true;
    })
    .catch((error) => {
        console.log(error); return false;
    })
}

function registerEmail(email, password){
    auth.createUserWithEmailAndPassword(email,password)
    .then(() => {
        console.log("REGISTERED "+email);
        return true;
    })
    .catch((error) => {console.log(error); return false;})
}

function signInWithEmail(email, password){
    auth.signInWithEmailAndPassword(email,password)
    .then(() => {
        console.log("VALIDATED "+email);
        return true;
    })
    .catch((error) => {console.log(error); return false;})
}

export{
    insert,
    registerEmail,
    signInWithEmail,
}