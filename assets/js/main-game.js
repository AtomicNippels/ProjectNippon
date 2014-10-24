$(function(){
var playerImg = new Image();
var player2Img = new Image();
var floorImg = new Image();
var wallImg = new Image();
playerImg.src = "textures/player1.png";
player2Img.src = "textures/player2.png"
var yourID = prompt("Pick your ID", "Your ID")
var peer = new Peer(yourID, {key: '3bup2xnrqvo39pb9'});
console.log(yourID);
$("body").css('overflow', 'hidden');


var canvas = $('#game'),
		context = canvas.get(0).getContext('2d'),
		canvasWidth = canvas.width,
		canvasHeight = canvas.height,
		fps = 30;

	var player = {
		x: 100,
		y: 450,
		height: 100,
		width: 100,
		score: 0,
		speedUp: 1,
		speedDown: 1,
		speedLeft: 1,
		speedRight: 1,
		draw: function() {

			context.drawImage(playerImg, this.x, this.y);
	
		}
	}

	var opponent = {
		x: 1600,
		y: 450,
		height: 100,
		width: 100,
		score: 0,
		speedUp: 1,
		speedDown: 1,
		speedLeft: 20,
		speedRight: 20,
		draw: function() {

			context.drawImage(player2Img, this.x, this.y);
		
		}
	}

	var line = {
		x: 900,
		y: 10,
		height: 880,
		width: 1,
		draw: function() {

			context.fillStyle = "#000";
			context.fillRect(this.x, this.y, this.width, this.height);

		}
	}

	var ball = {
		x: 900,
		y: Math.floor(Math.random() * 500) + 1,
		height: 10,
		width: 10,
		velocityX: 8,
		velocityY: Math.floor(Math.random() * 3) + 1,
		draw: function() {

			context.fillStyle = "#000";
			context.fillRect(this.x, this.y, this.width, this.height);
		
		},
		reset: function() {

			this.x = 900;
			this.y = Math.floor(Math.random() * 500) + 1;
			this.velocityY = Math.floor(Math.random() * 3) + 1;

		}
	}

	var bullet = {
		x: (player.x + 100),
		y: 500,
		height: 10,
		width: 10,
		draw: function(){

			for(var i = 0; i < ((canvasWidth-10)-player.x); i++){
			context.fillStyle = "#000";
			context.fillRect(this.x, this.y, this.width, this.height);
			this.x += 1;	
			}

		}
	}  

	var resolution = {
	detect: function() {

		if(window.screen.availHeight<=900 && window.screen.availWidth<=1800) {
			floorImg.src = "textures/floor720p.png"; 
			wallImg.src = "textures/wall_background720p.png"; 
			console.log("720p");
			$('.scoreboard').css('left', '240px');
			$('#connect_position').css('top', '602px');
			$('#connect_position').css('left', '38px');
			line.x = 600;
			line.height = 680;
			player.x = 110;
			player.y = 290;
			opponent.x = 990;
			opponent.y = 290;
			context.canvas.height = 600;
			context.canvas.width = 1200;
			canvasHeight = context.canvas.height;
			canvasWidth = context.canvas.width;

			}
		else {
			floorImg.src = "textures/floor.png"; 
			wallImg.src = "textures/wall_background.png";
			console.log("1080p");
			$('.scoreboard').css('left', '560px');
			$('#connect_position').css('top', '915px');
			$('#connect_position').css('left', '60px');
			line.x = 900;
			line.height = 880;
			player.x = 110;
			player.y = 290;
			opponent.x = 990;
			opponent.y = 290;
			context.canvas.height = 900;
			context.canvas.width = 1800;
			canvasHeight = context.canvas.height;
			canvasWidth = context.canvas.width;
			}
		}
	}

	var connection = {
		connectTo: function() {
			var toID = prompt("Enter ID you want to connect to", "ID");
			var conn = peer.connect(toID);
			console.log("Connected to:" + toID);
				conn.on('open', function(){
					conn.send('hi!');
				});
					peer.on('connection', function(conn) {
						conn.on('data', function(data){
    					// Will print 'hi!'
    					console.log(data);
    					});
					});
		}
	}

	$("#connect").click(function(){
		connection.connectTo();
	})

	$("#send").click(function(){
		connection.sendData();
	})

	resolution.detect();

	function draw() {

	context.drawImage(wallImg, 0, 0);
	context.drawImage(floorImg, 10, 10);

		ball.draw();
		opponent.draw();
		player.draw();
		line.draw();

	}

	function collides(a, b) {

		return a.x <= b.x + b.width &&
			   a.x + a.width >= b.x &&
			   a.y <= b.y + b.height &&
			   a.y + a.height >= b.y;

	}

	function handleInput() {

		if(keydown.up) {
			opponent.y -= opponent.speedUp;
		}
		if(keydown.down) {
			opponent.y += opponent.speedDown;
		}
		if(keydown.left) {
			opponent.x -= opponent.speedLeft;
		}
		if(keydown.right) {
			opponent.x += opponent.speedRight;
		}
		if(keydown.w) {
			player.y -= player.speedUp;
		}
		if(keydown.s) {
			player.y += player.speedDown;
		}
		if(keydown.a) {
			player.x -= player.speedLeft;
		}
		if(keydown.d) {
			player.x += player.speedRight;
		}
	}

	function update() {

		// Player scores a point
		if((ball.x + ball.width) >= (canvasWidth-10)) {
			console.log('player 1 wins');
			player.score ++;
			ball.reset();
		}

		// Opponent scores a point
		if(ball.x <= 10) {
			console.log('player 2 wins');
			opponent.score ++;
			ball.reset();
		}

		// Update scoreboard
		$('.challenger').html(player.score);
		$('.opponent').html(opponent.score);

		if (player.score == 10 || opponent.score == 10) {
			$('.gameover').show();
			return;
		}

		// Player strikes ball
		if(collides(ball, player)) {

			ball.velocityX = -8;
			var pl = ball.y - player.y - player.height / 2;
			ball.velocityY = ball.velocityX * Math.sin( Math.PI * Math.sin(pl / player.height, 0.8 ));

			console.log(ball.velocityY);

		}

		// Opponent Strikes ball
		if(collides(ball, opponent)) {

			ball.velocityX = 8;
			var pl = ball.y - opponent.y - opponent.height / 2;
			ball.velocityY = ball.velocityX * Math.sin(Math.PI * Math.sin(pl / opponent.height, 0.8 ));

			console.log(ball.velocityY);

		}

		// Stop ball going out of canvas view
		if(ball.y <= 10) ball.velocityY = -ball.velocityY;
		if((ball.y + ball.height) > (canvasHeight-10)) ball.velocityY = -ball.velocityY;

		// Stop player going out of canvas view
		if(player.y <= 10) player.speedUp = 0;
		else player.speedUp = 20;
		if((player.y + player.height) >= (canvasHeight-10)) player.speedDown = 0;
		else player.speedDown = 20;
		if(player.x <= 10) player.speedLeft = 0;
		else player.speedLeft = 20;
		if((player.x + player.width) >= (canvasWidth-line.x)) player.speedRight = 0;
		else player.speedRight = 20;
		if(opponent.y <= 10) opponent.speedUp = 0;
		else opponent.speedUp = 20;
		if((opponent.y + opponent.height) >= (canvasHeight-10)) opponent.speedDown = 0;
		else opponent.speedDown = 20;
		if(opponent.x <= line.x) opponent.speedLeft = 0;
		else opponent.speedLeft = 20;
		if((opponent.x + opponent.width) >= (canvasWidth-10)) opponent.speedRight = 0;
		else opponent.speedRight = 20;

		// Moving the ball
		ball.x -= ball.velocityX;
		ball.y -= ball.velocityY;

		handleInput();
	}

	var gameloop = setInterval(function() {

		update();
		draw();

	}, 1000/fps);

});