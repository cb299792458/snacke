const Snake = require("./snake.js");
const Game = require("./game.js");
const GameView = require("./game_view.js");

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDocs, getFirestore, query } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxg8A0c7BS-2iACReC07XIrAh6cJm7tAA",
  authDomain: "snacke-7f207.firebaseapp.com",
  projectId: "snacke-7f207",
  storageBucket: "snacke-7f207.appspot.com",
  messagingSenderId: "4042206255",
  appId: "1:4042206255:web:180112e052b5d67d13aada",
  measurementId: "G-NW07VHLBPW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);


const sendScore = async function(highscore) {
  // let that = this;
  await addDoc(collection(db, "scores"),{
    data: highscore
  })
}

const getScore = async function(){
  let ref = collection(db,"scores");
  const querySnapshot = await getDocs(ref);
  let arr = [];
  querySnapshot.forEach( (ele) => {
    arr.push(ele.data());
  })
  // console.log(arr);
  return arr;
}


window.addEventListener("keydown", (e) => { // Prevent Arrow Key Scroll
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)){
        e.preventDefault();
      }
    },
    false
  );

document.addEventListener("DOMContentLoaded", () => {
    const canvasEl = document.getElementById('game-canvas');
    const WIDTH = 1000;
    const HEIGHT = 600;
    canvasEl.width = WIDTH;
    canvasEl.height = HEIGHT;
    
    const ctx = canvasEl.getContext('2d');

    const canvasInfo = document.getElementById('info-canvas');
    canvasInfo.width = 400;
    canvasInfo.height = HEIGHT;
    const info = canvasInfo.getContext('2d');

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.2; 

    let game = new Game(WIDTH,HEIGHT);
    game.sendScore = sendScore;
    game.getScore = getScore;
    let gv = new GameView(game,ctx,info);
    game.makeHighScoreTable();
    gv.start();
    
})