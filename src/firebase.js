// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, set } from "firebase/database";
function FireBase(){
    const firebaseConfig = {
      apiKey: "AIzaSyAxg8A0c7BS-2iACReC07XIrAh6cJm7tAA",
      authDomain: "snacke-7f207.firebaseapp.com",
      projectId: "snacke-7f207",
      storageBucket: "snacke-7f207.appspot.com",
      messagingSenderId: "4042206255",
      appId: "1:4042206255:web:180112e052b5d67d13aada",
      measurementId: "G-NW07VHLBPW",
      databaseURL: "https://snacke-7f207-default-rtdb.firebaseio.com"
    };
    const app = initializeApp(firebaseConfig);

}

FireBase.prototype.writeUserData = function writeUserData(userId, name) {
const db = getDatabase();
set(ref(db, 'users/' + userId), {
    username: name
});
}
module.exports = FireBase;

