import * as firebase from 'firebase';

const config = require("./config.json");

firebase.initializeApp(config)

const database = firebase.database();
const auth = firebase.auth();

/*
    data={
        link,
        data
    }
*/

function insert(data){
    database.ref(data.link)
    .push(data.data)
    .then(() => {
        console.log(data.link+": INSERT SUCCESS");
    })
    .catch((error) => {
        console.log(error); return false;
    })
    return true;
}

function update(data){
    database.ref(data.link)
    .set(data.data)
    .then(() => {
        console.log(data.link+": UPDATE SUCCESS");
    })
    .catch((error) => {
        console.log(error); return false;
    })
    return true;
}

function searchMulti(data){
    return database.ref(data.link)
    .orderByChild(data.child)
    .equalTo(data.search)
}

function searchSingle(data){
    return database.ref(data.link)
    .orderByChild(data.child)
    .equalTo(data.search)
}

function registerEmail(email, password){
    auth.createUserWithEmailAndPassword(email,password)
    .then(() => {
        console.log("REGISTERED "+email);
    })
    .catch((error) => {console.log(error); return false;})
    return true;
}

function signInWithEmail(email, password){
    auth.signInWithEmailAndPassword(email,password)
    .then(() => {
        console.log("VALIDATED "+email);        
    })
    .catch((error) => {console.log(error); return false;})
    return true;
}

export{
    insert,
    update,
    searchMulti,
    searchSingle,
    registerEmail,
    signInWithEmail,
}