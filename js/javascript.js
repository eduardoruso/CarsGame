const score = document.querySelector('.score'),
start = document.querySelector('.start'),
gameArea = document.querySelector('.gameArea'),
car = document.createElement('div');

car.classList.add('car');

const watch = document.querySelector('#watch');
let milliseconds = 0;
let timer;

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup',stopRun);

var audio1 = new Audio();
var audio2 = new Audio();


const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArroLeft: false,
};

const setting = {
    start: false,
    score: 0,
    speed: 6,
    traffic: 3
};

function getQuantityElements(heightElement){
    return document.documentElement.clientHeight / heightElement + 1;
}
function startGame()
{

    audio1.preload = 'auto';
    audio1.src = 'motor.mp3';
    audio1.play(); 

    start.classList.add('hide');
    gameArea.innerHTML = ' ';
    for(let i = 0; i < getQuantityElements(100); i++)
    {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    for(let i = 0; i < getQuantityElements(100 * setting.traffic); i++)
    {
        var a = Math.round(Math.random()*1)
        image = new Array();
        image[0] = "image/enemy2.png";
        image[1] = "image/enemy.png";

        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = "transparent url('" + image[a] + "') center / cover no-repeat";
        gameArea.appendChild(enemy);
    }

    clearInterval(timer);
	milliseconds = 0;
	watch.innerHTML = '00:00:00';

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2;
    car.style.top = 'auto';
    car.style.bottom = '10px'; 
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame)
}

function playGame()
{
    if(setting.start){
        

        clearInterval(timer);
	    timer = setInterval(()=>{
		milliseconds += 10;
		let dateTimer = new Date(milliseconds);
		watch.innerHTML = 'ВРЕМЯ: ' + 
			('0'+dateTimer.getUTCMinutes()).slice(-2) + ':' +
			('0'+dateTimer.getUTCSeconds()).slice(-2) + ':' +
			('0'+dateTimer.getUTCMilliseconds()).slice(-3,-1);
	    },10);

        setting.score += setting.speed;
        score.textContent = 'СЧЁТ: ' + setting.score;

        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0){

            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
}

function startRun(event){
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event){
    event.preventDefault();
    keys[event.key] = false;
}
function moveRoad()
{
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line)
    {
        line.y += setting.speed;
        line.style.top = line.y + 'px'; 
        if(line.y >= document.documentElement.clientHeight)
        {
            line.y = -100;
        }
    });
}
function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if(carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) 
        {
            setting.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
            clearInterval(timer);
            audio1.pause();
            audio2.preload = 'auto';
            audio2.src = 'bah.mp3';
            audio2.play(); 
        }
        item.y += setting.speed ;
        item.style.top = item.y + 'px';
        if(item.y >= document.documentElement.clientHeight){
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}
