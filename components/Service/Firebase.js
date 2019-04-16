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
    return database.ref(data.link)
    .push(data.data)
}

export function update(data){
    return database.ref(data.link)
    .update(data.data)
}

export function remove(data){
    return database.ref(data.link)
    .remove()
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
    return auth.createUserWithEmailAndPassword(email,password)
}

export function signInWithEmail(email, password){
    return auth.signInWithEmailAndPassword(email,password)
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

export function deletePicture(data){
    return storage.ref(data.link)
    .child(data.child)
    .delete()

}