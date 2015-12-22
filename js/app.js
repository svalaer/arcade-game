var tile_width = 101;
var tile_height = 83;
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -15;
    // Use Math.random() to randomly generate 0, 1 or 2.
    // This is used to randomly place enemies on the first, second or third level of the 'street'
    // Since blocks are 83px high, we choose between the three enemy 'levels' with 50 + 83 * (random number)
    var randomY = 50 + tile_height * Math.floor(Math.random() * 3);
    this.y = randomY;
    // Speed is randomly generated between 100 and 400.
    var speed = Math.floor(Math.random() * 300 + 100);
    this.speed = speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    this.reset();

    this.collisionCheck();
};

Enemy.prototype.reset = function() {
    // If the enemy bug is at the right end of the screen
    if (this.x > 500) {
        // Starts all the way from the left again
        this.x = -15;
       // Starts in any one of the three levels of the street randomly
        var randomY = 50 + tile_height * Math.floor(Math.random() * 3);
        this.y = randomY;
       // Sets a random speed between 100 and 400
        var speed = Math.floor(Math.random() * 300 + 100);
        this.speed = speed;
    }
};

// Checks if player has been collided with an enemy. If so player.reset() moves player back to starting position and resets scorecount to zero

Enemy.prototype.collisionCheck = function() {
    if (this.y == player.y && Math.abs(this.x - player.x) < 51) {
        player.reset();
        scorecount.score = 0;
    }
   // Resets the booster if an enemy touches the booster.
     if (booster.visible && this.y == booster.y && booster.x - this.x < 51 && booster.x - this.x > 25) {
        booster.reset();
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 2 * tile_width;
    this.y = 50 + 4 * tile_height;
};
// Renderes player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Resets the player start position
Player.prototype.reset = function() {
    this.x = 2 * tile_width;
    this.y = 50 + 4 * tile_height;
};
Player.prototype.handleInput = function(allowedKeys) {
    // Moves player
    if (allowedKeys == 'left' && this.x > 0) this.x = this.x - 101;
    else if (allowedKeys == 'right' && this.x < 404) this.x = this.x + 101;
    else if (allowedKeys == 'up' && this.y > 0) this.y = this.y - 83;
    else if (allowedKeys == 'down' && this.y < 382) this.y = this.y + 83;
    // If player gets to water their position is reset
    // Scorecount is incremented by 100
    if (this.y < 0) {
        this.reset();
        scorecount.score += 100;
    }
};

// Initializes Scorecount as 0
var Scorecount = function() {
    this.score = 0;
};

// Displays the scorecount
Scorecount.prototype.render = function() {
    ctx.font = "30px Impact";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText("SCORE : " + this.score, 320, 100);
};

// Point boosters (heart, key, star) and can be obtained by both the player and enemies
var Booster = function() {
    // X and Y values are randomly generated for the boosters location using Math.floor()
    var randomX = tile_width * Math.floor(Math.random() * 4);
    var randomY = 50 + tile_height * Math.floor(Math.random() * 3);
    this.x = randomX;
    this.y = randomY;

    this.sprite = {
        'heart' :'images/Heart.png',
        'key' :'images/Key.png',
        'star' :'images/Star.png'
    };
   // Heart booster is first.
    this.booster = 'heart';
   // Extra boosters are not visible all the time. // Boosters initially set to false
    this.visible = false;
   // Wait until a new booster becomes visible is random
    this.wait = Math.floor(Math.random() * 10);
};

// Boosters are rendered here
Booster.prototype.render = function() {
    if (this.visible) {
        ctx.drawImage(Resources.get(this.sprite[this.booster]), this.x, this.y);
    }
};

// update() checks wait time and collisions
Booster.prototype.update = function(dt) {
    // Wait time count down.
    // Booster becomes visable after wait time returns true
    this.wait -= dt;
    if (this.wait < 0) {
        this.visible = true;
    }
    // if booster is set to visable a collision check runs
    if (this.visible) {
        this.collisionCheck();
    }
};

// Check for player getting a booster.
// After getting booster the score is incremented and the booster is reset

Booster.prototype.collisionCheck = function() {
    if (this.y == player.y && this.x == player.x) {
        if (this.booster == 'heart') {
            scorecount.score += 50;
        } else if (this.booster == 'key') {
            scorecount.score += 100;
        } else if (this.booster == 'star') {
            scorecount.score += 150;
        }
        this.reset();
    }
};

// Booster reset when player/enemy gets a booster
Booster.prototype.reset = function() {
    // X and Y values are randomly generated for the boosters location using Math.floor()
    var randomX = tile_width * Math.floor(Math.random() * 4);
    var randomY = 50 + tile_height * Math.floor(Math.random() * 3);
    this.x = randomX;
    this.y = randomY;
    // Boosters are false to begin with and are generated randomly
    this.visible = false;

    var random = Math.random() * 10;
    if (random > 9) {
        this.booster = 'star';
    } else if (random > 7) {
        this.booster = 'key';
    } else {
        this.booster = 'heart';
    }
    // Generate boosters randomly
    this.wait = Math.floor(Math.random() * 10);
};

// Now instantiate your objects. I also instantiate my scorecount and boosters
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player();
var scorecount = new Scorecount();
var booster = new Booster();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
