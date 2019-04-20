import * as firebase from 'firebase';
import { limits, badges, convert } from './secret';

const config = require("./config.json");

firebase.initializeApp(config)

const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

export function insert(data){
    return database.ref(data.link)
    .push(data.data)
}

export function update(data){
    return database.ref(data.link)
    .update(data.data)
}

export function transact(data){
    return database.ref(data)
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

export function searchMultiStartsAt(data){
    return database.ref(data.link)
    .orderByChild(data.child)
    .startAt(data.search)
    .endAt(data.search+"\uf8ff")
}

export function searchSingle(data){
    return database.ref(data.link)
    .orderByChild(data.child)
    .equalTo(data.search)
}

export function retrieveMulti(data){
    return database.ref(data.link)
    .orderByValue()
    .limitToLast(data.limit)
}

export function retrieveByChild(data){
    return database.ref(data.link)
    
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

export function getUser(){
    return firebase.auth().currentUser
}

export function getEmailAuthProvider(){
    return firebase.auth.EmailAuthProvider
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

    let snapshot = undefined;

    try {
        snapshot = await upload({link: data.link, child: data.child, file: blob})
    } catch (error) {
        console.log(error)
    }
    
    blob.close();
    if(snapshot != undefined) return await snapshot.ref.getDownloadURL();
    else return null;
}

export function deletePicture(data){
    return storage.refFromURL(data)
    .delete()
}

export function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

export function validateEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(email);
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function computeDate(date){
    let diff = new Date().getTime() - date.getTime()
    
    diff = diff/1000;
    if(Math.floor(diff) < 60)return Math.floor(diff)+" sec"+(Math.floor(diff) > 1?"s":"")+" ago"
    
    diff = diff/60; 
    if(Math.floor(diff) < 60) return Math.floor(diff)+" min"+(Math.floor(diff) > 1?"s":"")+" ago"
    
    diff = diff/60; 
    if(Math.floor(diff) < 24) return Math.floor(diff)+" hr"+(Math.floor(diff) > 1?"s":"")+" ago"
    
    diff = diff/24;
    return Math.floor(diff)+" day"+(Math.floor(diff) > 1?"s":"")+" ago"
}

export function calculateValues(recipe){
    let totals = { "Energy": 0, "Protein": 0, "Total lipid (fat)": 0, "Fiber, total dietary": 0, "Sugars, total": 0, "Sodium, Na": 0 }
    let toReturn = [];

    recipe.ingredients.forEach((item)=>{
        if(item.ingredient.ndbno > 0 && item.unit != "piece"){
            item.nutrients.forEach((nutrient)=>{         
                totals[nutrient.name]+=(item.qty*convert[item.unit]*nutrient.value*convert[nutrient.unit])/100;
            })
        }
    })
    
    return totals;
}

export function calculateBadges(values, birthday, sex, mode){
    let age = getAge(birthday);

    let toReturn = [];
    let limit = limits.filter(item=>item.age.from <= age && item.age.to >= age)[0]
    


    switch (mode) {
        case "YUMMLY":
            let nutri = values.filter(item=>["Energy", "Protein", "Total lipid (fat)", "Fiber, total dietary", "Sugars, total", "Sodium, Na"].includes(item.description))
            if(nutri.length === 0){
                return []
            }else{
                nutri.forEach((item)=>{
                    if(item.value > limit[sex][item.description].value){
                        toReturn.push(badges.above[item.description])
                    }else{
                        toReturn.push(badges.low[item.description])
                    }
                })
                return toReturn;
            }
        case "USER":
            Object.entries(values).forEach(
                ([key,value])=>{
                    if(value > limit[sex][key].value){
                        toReturn.push(badges.above[key])
                    }else{
                        toReturn.push(badges.low[key])
                    }
                }
            );
            return toReturn;
        default:
            return [];
    }    

}