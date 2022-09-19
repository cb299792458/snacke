const Snake = require("./snake.js");
const Game = require("./game.js")
const GameView = require("./game_view.js")

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