//variáveis do game


// canvas - usa para desenhar
// ctx - contexto


var canvas,
ctx,
height,
width,
frames = 0,
maxJumps = 3,
speed = 6,
actualState,
record,
image,

//var myGif = GIF();
//myGif.load("./IMAGES/CAPIVARA");

states = {
    play: 0,
    playing: 1,
    gameOver: 2
},
ground = {
    y: 550,
    height: 50,
    color: "#4a4a4a",

    draw: function () {
        ctx.fillStyle = this.color
        ctx.fillRect(0, this.y, width, this.height);
    }
},
character = {
    x: 50,
    y: 0,
    height: 50,
    width: 50,
    color: "#000",
    gravity: 1.6,
    speed: 0,
    jumpStrenght: 25,
    qtdJumps: 0,
    score: 0,    

    refresh: function() {
        this.speed += this.gravity;
        this.y += this.speed;

        if (this.y > ground.y - this.height && actualState != states.gameOver) {
            this.y = ground.y - this.height;
            this.qtdJumps = 0;
            this.speed = 0;   
        }
    },

    jump: function() {
        if (this.qtdJumps < maxJumps) {
        this.speed = - this.jumpStrenght;
        this.qtdJumps++;
        }
    }, 

    reset: function() {
        this.speed = 0;
        this.y = 0;

        if(this.score > record) {
            localStorage.setItem("record", this.score);
            record = this.score;
        }

        this.score = 0;
    },

    draw: function() {
        //ctx.drawImage(myGif.image,0,0);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
},
obstacle = {
    _obs: [],
    colors: ["#ff1994","#ff1919","#23b516","#bd1919","#8e119c"],
    insertTime: 0,

    insert: function() {
        this._obs.push({
            x: width,
            //width: 30 + Math.floor(21 * Math.random()),
            width: 50,
            height: 30 + Math.floor(120 * Math.random()),
            color: this.colors[Math.floor(5 * Math.random())]
        });

        this.insertTime = 30 + Math.floor(40 * Math.random())
    },

    refresh: function() {
        if (this.insertTime == 0) {
            this.insert();
        } else {
            this.insertTime--;
        }

        for (var i = 0, size = this._obs.length; i < size; i++) {
            var obs = this._obs[i];

            obs.x -= speed;

            if (character.x < obs.x + obs.width && character.x + character.width >= obs.x && character.y + character.height >= ground.y - obs.height)
                actualState = states.gameOver;
            
                else if (obs.x == 0)
                    character.score++;
            
            else if (obs.x <= -obs.width) {
                this._obs.splice(i, 1);
                size--;
                i--;
            }

        }
    },

    clean: function () {
        this._obs = [];
    },

    draw: function() {
        for (var i = 0, size = this._obs.length; i < size; i++) {
            var obs = this._obs[i];
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, ground.y - obs.height, obs.width, obs.height);           
        }      
    },
};

function click (event) {
    if (actualState == states.play){
        actualState = states.playing;        
    } else if (actualState == states.gameOver && character.y >= 2 * height) {
        actualState = states.play;
        obstacle.clean();      
        character.reset();
    }
}

function jump(event) {
    if (event.keyCode == 32) {
        character.jump();
    } 
}

function main() {
    
    height = window.innerHeight;
    width = window.innerWidth;

    if (height >= 500) {
        height = 600;
        width = 600;
    }

    canvas = document.createElement("canvas")
    canvas.width = width;
    canvas.height = height
    canvas.style.border = "3px solid #000"

    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    document.addEventListener('mousedown', click);
    document.addEventListener('keyup', jump);


    actualState = states.play;
    record = localStorage.getItem("record");

    if (record == null) {
        record == 0;
    }

    img = new Image();
    img.src = "./IMAGES/FUNDO PNG"

    run();

}

function run() {
    refresh();
    draw();

    window.requestAnimationFrame(run);
}

function refresh() {
    frames++;

    character.refresh();

    if (actualState == states.playing){        
        obstacle.refresh();
    }   
    
}

function draw() {
    ctx.fillStyle = "rgb(150,150,200)"
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#000";
    ctx.font = "25px VT323"
    ctx.fillText('Your Record: ' + record, 430, 68);

    if(record == null) {
        record = 0;
    }

    ctx.fillStyle = "#000";
    ctx.font = "50px VT323"
    ctx.fillText(character.score, 30, 68);    

    if (actualState == states.play) {
        ctx.fillStyle = "green";
        ctx.fillRect(width / 2 - 50, height / 2 - 50, 100, 100);
    }
    
    else if (actualState == states.gameOver) {
        if (character.score > record) {
            ctx.fillStyle = "#f5cf11";
            ctx.fillRect(width / 2 - 50, height / 2 - 50, 100, 100);            
        } else {    
            ctx.fillStyle = "red";
            ctx.fillRect(width / 2 - 50, height / 2 - 50, 100, 100);
        }
        
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.fillStyle = "#000"        

        if (character.score > record) {    
            ctx.fillStyle = "#000"
            ctx.fillText("New Record!", -105, -65);
        } else {
            ctx.fillText("Wasted", -60, -65);              
        }

        if (character.score < 10)
            ctx.fillText(character.score, -8, 14);
            
        else if (character.score >= 10 && character.score < 100)
            ctx.fillText(character.score, -20, 14);

        else
            ctx.fillText(character.score, -30, 14);


        ctx.restore();

    }

    else if (actualState == states.playing) {
        obstacle.draw();
    }
    

    ground.draw();
    
    character.draw();
} 


// para iniciar o jogo

main();