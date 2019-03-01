import * as firebase from 'firebase';
let googleServices = require('../../google-services.json');

const config = {
    apiKey: "AIzaSyA81Tv23hyRzQTrexg52Eo34e_2togP6f4",
    authDomain: "sizzle-nsuy.firebaseapp.com",
    databaseURL: "https://sizzle-nsuy.firebaseio.com",
    projectId: "sizzle-nsuy",
    storageBucket: "sizzle-nsuy.appspot.com",
    messagingSenderId: "570830960829"
};

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