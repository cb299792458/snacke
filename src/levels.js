function Level(game, num){
    const OBSTACLES = ["fire","ice","log","rock","water"];
    const obstacles = {};
    OBSTACLES.forEach( ele => obstacles[ele] = [] );

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

    switch(num){
        case 1:
            obstacles["water"].push([game.DIM_X/2,game.DIM_Y/2]);
            break;
        case 2:
            obstacles["fire"].push([game.DIM_X/2,game.DIM_Y/2]);
            break;
    }

    OBSTACLES.forEach( function(ele){
        for(let j = 0; j < obstacles[ele].length; j ++){
            game.makeObstacle(obstacles[ele][j],ele);
        }
    })
}

module.exports = Level;