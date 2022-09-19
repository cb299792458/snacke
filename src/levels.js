function Level(game, num){
    if(num===1){
        const obstacles = {};
        obstacles["log"] = [];
// [game.DIM_X/2-30,10],[game.DIM_X/2,10],[game.DIM_X/2+30,10],
// [game.DIM_X/2-30,game.DIM_Y-10],[game.DIM_X/2,game.DIM_Y-10],[game.DIM_X/2+30,game.DIM_Y-10]
        obstacles["rock"] = [];
        for(let i=0;i<game.DIM_Y;i+=30){
            obstacles["rock"].push([10,i]);
            obstacles["rock"].push([game.DIM_X-10,i]);
        }
        for(let i=0;i<game.DIM_X;i+=30){
            if(i<game.DIM_X/2-50 || i>game.DIM_X/2+50){
                obstacles["rock"].push([i,10]);
                obstacles["rock"].push([i,game.DIM_Y-10]);
            }
        }
        for(let i=game.DIM_X/2-45;i<game.DIM_X/2+75;i+=30){
            obstacles["log"].push([i,10]);
            obstacles["log"].push([i,game.DIM_Y-10]);
        }

        for(let j = 0; j < obstacles["rock"].length; j ++){
            game.makeObstacle(obstacles["rock"][j],"rock");
        }
        for(let j = 0; j < obstacles["log"].length; j ++){
            game.makeObstacle(obstacles["log"][j],"log");
        }


    }
}

module.exports = Level;