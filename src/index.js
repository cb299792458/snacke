const Snake = require("./snake.js");
const Game = require("./game.js")
const GameView = require("./game_view.js")

import { initializeApp } from 'firebase/app';
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

import { getDatabase, ref, set } from "firebase/database";

function writeUserData(userId, name) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name
  });
}

writeUserData(1,'b');

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

    let game = new Game(WIDTH,HEIGHT);
    let gv = new GameView(game,ctx,info);
    gv.start();
    
})