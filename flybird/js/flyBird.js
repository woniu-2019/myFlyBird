//游戏页面
var gameFace = document.querySelector('#gameFace');
//标题
var head = document.querySelector('#head');
//开始菜单
var startMenu = document.querySelector('#startMenu');
//开始按钮
var start = document.querySelector('#start');
//结束菜单
var endMenu = document.querySelector('#endMenu');
//当前分数
var currentScore = document.querySelector('#currentScore');
//最高分数
var bestScore = document.querySelector('#bestScore');
//鸟
var bird = document.querySelector('#bird');
//得分
var score = document.querySelector('#score');
//管道
var pipes = document.querySelector('#pipes');
//点击音乐
var bulletMusic = document.querySelector('#bulletMusic');
//背景音乐
var gameMusic = document.querySelector('#gameMusic');
//结束音乐
var gameOverMusic = document.querySelector('#gameOverMusic');

//定义变量
var birdDownTimer, birdUpTimer;
var num = 0; //存储分数
/* 
开始游戏按钮绑定点击事件
*/
start.onclick = function (event) {
	//阻止冒泡事件
	var even = event || window.event
	even.stopPropagation();
	//1.背景音乐开始
	gameMusic.play();
	gameMusic.loop = 'loop';
	//2.开始菜单消失
	startMenu.style.display = 'none';
	//3. 标题消失
	head.style.display = 'none';
	//4. 鸟出现
	bird.style.display = 'block';
	//7. 显示分数
	score.style.display = 'block';
	//5.创建管道
	setInterval(createPipe, 3000);
	//8. 小鸟下落
	birdDownTimer = setInterval(birdDown, 30);
	//6. 碰撞检测
	setInterval(collide, 15);
	//9. 点击页面，小鸟上升 即给gameface关联点击事件
	gameFace.onclick = gameFaceClick;
}

//创建管道
function createPipe() {
	var liM = document.createElement('li');
	liM.className = 'pipe';
	liM.style.left = pipes.clientWidth + 'px';
	pipes.appendChild(liM);
	//变量
	var doorH = 123; //小鸟通过的高度
	//管道随机的范围
	var minH = 60;
	var maxH = liM.clientHeight - doorH - minH;
	//随机上管道的高度
	var topH = Math.floor(Math.random() * (maxH - minH + 1) + minH);
	//随机下管道的高度
	var botH = liM.clientHeight - topH - doorH;

	//上管道
	var topDiv = document.createElement('div');
	topDiv.className = 'pipe_top';
	topDiv.style.height = topH + 'px';
	liM.appendChild(topDiv);
	//下管道
	var botDiv = document.createElement('div');
	botDiv.className = 'pipe_bottom';
	botDiv.style.height = botH + 'px';
	liM.appendChild(botDiv);

	//让管道自己动
	var x = pipes.clientWidth;
	var pipeTimer = setInterval(function () {
		x--;
		liM.style.left = x + 'px';
		//计分
		if (x == 0) {
			//改变分数
			changeScore();
		}
		if (x <= -liM.clientWidth) {
			pipes.removeChild(liM);
			//清楚计时器
			clearInterval(pipeTimer)
		}
	}, 12)
}
//改变分数
function changeScore() {
	num++;
	//删除score里面的img
	score.innerHTML = '';
	//创建img
	if (num < 10) {
		var imgM = document.createElement('img');
		imgM.src = 'img/' + num + '.jpg';
		score.appendChild(imgM);
	} else if (num < 100) {
		var imgM1 = document.createElement('img');
		// 十位
		imgM1.src = 'img/' + Math.floor(num / 10) + '.jpg';
		score.appendChild(imgM1);
		//个位
		var imgM2 = document.createElement('img');
		imgM2.src = 'img/' + Math.floor(num % 10) + '.jpg';
		score.appendChild(imgM2);
	}
}
//小鸟下落
var speed = 0;

function birdDown() {
	bird.src = 'img/down_bird.png';
	speed += 0.5;
	if (speed >= 8) {
		speed = 8;
	}
	bird.style.top = bird.offsetTop + speed + 'px';
	if (bird.offsetTop + bird.offsetHeight >= 423) {
		gameOver();
	}

}
//小球上升
function birdUp() {
	bird.src = 'img/up_bird.png';
	speed -= 0.5;
	if (speed < 0) {
		//不再上升
		clearInterval(birdUpTimer);
		//开始下降
		speed = 0;
		birdDownTimer = setInterval(birdDown, 30);
	}
	bird.style.top = bird.offsetTop - speed + 'px';
	if (bird.offsetTop <= 0) {
		gameOver();
	}
}


//关联点击事件
function gameFaceClick() {
	//播放点击的声音
	bulletMusic.play();
	//清除下降的计时器
	clearInterval(birdDownTimer);
	//清除上升的计时器
	clearInterval(birdUpTimer);
	//设置点击上升
	speed = 8;
	birdUpTimer = setInterval(birdUp, 30);
}

//碰撞检测
function collide() {
	var lis=pipes.getElementsByTagName('li');
	for(var i=0;i<lis.length;i++){
		crashFun(lis[i].firstElementChild);
		crashFun(lis[i].lastElementChild);
	}
}
//碰撞
function crashFun(pipe){
	//比较pipe有没有跟bird撞在一起
	// pipe
	var pipeLeft=pipe.offsetParent.offsetLeft;
	var pipeRight=pipeLeft+pipe.clientWidth;
	var pipeTop=pipe.offsetTop;
	var pipeBot=pipeTop+pipe.clientHeight;

	//bird
	var birdLeft=bird.offsetLeft;
	var birdRight=birdLeft+bird.clientWidth;
	var birdTop=bird.offsetTop;
	var birdBot=birdTop+bird.clientHeight;

	//判断
	if(!(birdLeft>pipeRight||birdRight<pipeLeft||birdTop>pipeBot||birdBot<pipeTop)){
		gameOver();
	}
	

}

function gameOver() {
	//停止背景音乐
	gameMusic.pause();
	//播放结束音乐
	gameOverMusic.play();
	//清除页面所有的定时器
	var end = setInterval(function () {}, 1);
	for (var i = 0; i <= end; i++) {
		clearInterval(i);
	}
	//显示结束菜单
	endMenu.style.display = 'block';
	//分数
	currentScore.innerHTML = num;
	// 最高分
	if (localStorage.best) {
		//存在，则比较
		if (localStorage.best < num) {
			localStorage.best = num;
		} else {
			//不存在则添加
			localStorage.best = num;
		}
		//设置分数
		bestScore.innerHTML = localStorage.best;
	}

	//清除gameFace点击事件
	gameFace.onclick = null;

}