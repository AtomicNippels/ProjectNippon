$(function(){
var playerImg = new Image();
playerImg.src = "textures/player1.jpg";
var yourID = prompt("Pick your ID", "Your ID")
var peer = new Peer(yourID, debug=1, {key: '3bup2xnrqvo39pb9'})
console.log(yourID);

var canvas = $('#game'),
		context = canvas.get(0).getContext('2d'),
		canvasWidth = canvas.width(),
		canvasHeight = canvas.height(),
		fps = 40;
	
	var player = {
		x: 100,
		y: 500,
		height: 100,
		width: 100,
		score: 0,
		speedUp: 5,
		speedDown: 5,
		speedLeft: 5,
		speedRight: 5,
		draw: function() {

			context.drawImage(playerImg, this.x, this.y);
	
		}
	}

	var opponent = {
		x: 750,
		y: 200,
		height: 80,
		width: 20,
		score: 0,
		draw: function() {

			context.fillStyle = "#fff",
			context.fillRect(this.x, this.y, this.width, this.height);
		
		}
	}

	var ball = {
		x: 390,
		y: Math.floor(Math.random() * 500) + 1,
		height: 10,
		width: 10,
		velocityX: 0,
		velocityY: Math.floor(Math.random() * 3) + 1,
		draw: function() {

			context.fillStyle = "#fff";
			context.fillRect(this.x, this.y, this.width, this.height);
		
		},
		reset: function() {

			this.x = 390;
			this.y = Math.floor(Math.random() * 500) + 1;
			this.velocityY = Math.floor(Math.random() * 3) + 1;

		}
	}

/*	var life = {
		percent: 100
		}  */

	var connection = {
		connectTo: function() {
			var toID = prompt("Enter ID you want to connect to", "ID");
			var conn = peer.connect(toID);
			peer.on('connection', function(conn) {console.log("Connected to " + toID); connection.onConnected();});
			},
		onConnected: function() {
			conn.on('open', function() {
				conn.send('Hello!');
				conn.on('data', function(data) {
					console.log('Received' + data);
				})
			})
		}
	}	


	$("#connect").click(function(){
		connection.connectTo();
	})

	function draw() {

		context.fillStyle = "#000";
		context.fillRect(0, 0, canvasWidth, canvasHeight);

		ball.draw();
		player.draw();
		opponent.draw();

	}

	function collides(a, b) {

		return a.x <= b.x + b.width &&
			   a.x + a.width >= b.x &&
			   a.y <= b.y + b.height &&
			   a.y + a.height >= b.y;

	}

	function handleInput() {

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
		if((ball.x + ball.width) > canvasWidth) {
			console.log('player 1 wins');
			player.score ++;
			ball.reset();
		}

		// Opponent scores a point
		if(ball.x < 0) {
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
		if(ball.y < 0) ball.velocityY = -ball.velocityY;
		if((ball.y + ball.height) > canvasHeight) ball.velocityY = -ball.velocityY;

		if(player.y <= 0) player.speedUp = 0;
		else player.speedUp = 20;
		if((player.y + player.height) >= canvasHeight) player.speedDown = 0;
		else player.speedDown = 20;
		if(player.x <= 0) player.speedLeft = 0;
		else player.speedLeft = 20;
		if((player.x + player.width) >= canvasWidth) player.speedRight = 0;
		else player.speedRight = 20;

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