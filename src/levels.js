function Level(game, num){
    const OBSTACLES = ["fire","ice","log","rock","water","tornado"];
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
            obstacles["fire"].push([game.DIM_X/4,game.DIM_Y/4]);
            obstacles["water"].push([3*game.DIM_X/4,3*game.DIM_Y/4]);
            obstacles["ice"].push([3*game.DIM_X/4,game.DIM_Y/4]);
            obstacles["tornado"].push([game.DIM_X/4,3*game.DIM_Y/4]);
            break;
        case 3:
            for(let i=150;i<=game.DIM_Y-150;i+=25){
                for(let j=300; j<=game.DIM_X-300; j+=25){
                    obstacles["ice"].push([j,i]);
                }
                obstacles["fire"].push([100,i]);
                obstacles["fire"].push([game.DIM_X-100,i]);
                obstacles["water"].push([275,i]);
                obstacles["water"].push([game.DIM_X-275,i]);
            }
    }

    OBSTACLES.forEach( function(ele){
        for(let j = 0; j < obstacles[ele].length; j ++){
            game.makeObstacle(obstacles[ele][j],ele);
        }
    })
}

module.exports = Level;