import * as firebase from 'firebase';

const config = require("./config.json");

firebase.initializeApp(config)

const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

/*
    data={
        link,
        data
    }
*/

export function insert(data){
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

export function update(data){
    database.ref(data.link)
    .update(data.data)
    .then(() => {
        console.log(data.link+": UPDATE SUCCESS");
    })
    .catch((error) => {
        console.log(error); return false;
    })
    return true;
}

export function searchMulti(data){
    return database.ref(data.link)
    .orderByChild(data.child)
    .equalTo(data.search)
}

export function searchSingle(data){
    return database.ref(data.link)
    .orderByChild(data.child)
    .equalTo(data.search)
}

export function registerEmail(email, password){
    auth.createUserWithEmailAndPassword(email,password)
    .then(() => {
        console.log("REGISTERED "+email);
    })
    .catch((error) => {console.log(error); return false;})
    return true;
}

export function signInWithEmail(email, password){
    auth.signInWithEmailAndPassword(email,password)
    .then(() => {
        console.log("VALIDATED "+email);        
    })
    .catch((error) => {console.log(error); return false;})
    return true;
}

function upload(data){
    return storage.ref(data.link)
    .child(data.child)
    .put(data.file)
}

export async function exportPicture(data){
    const blob = await new Promise((resolve, reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(xhr.response);
        };
        xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET',data.uri, true);
        xhr.send(null);
    });
    console.log(typeof(blob))
    const snapshot = await upload({link: data.link, child: data.child, file: blob})

    blob.close();
    return await snapshot.ref.getDownloadURL();
}