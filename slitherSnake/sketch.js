var food;
var foodDiameter = 24;
var ghost;
var s;
var tailLength = 50;
var snakeSize = 32;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  s = new Snake(0, height/2);
  // snake will chase an invisible ghost to steer
  ghost = new Ghost();
  pickLocation();
}

function draw() {
  background(51);
  textSize(16);
  text("use the arrow keys to move the snake", width/3, 30);
  text("(make sure the game window is in focus to use arrow keys)", width/3, 60);
  text("tail length: " + tailLength, width/8, 30);

  ghost.update();
  ghost.show();

  var ghostVect = createVector(ghost.x, ghost.y);

  if (s.eat(food)) {
    pickLocation();
  }

  // snake follows the ghost to steer
  s.seek(ghostVect);
  s.update();
  s.death();
  s.display();

  fill(255, 0, 100);
  ellipse(food.x, food.y, foodDiameter, foodDiameter);

}

function pickLocation() {
  var offset = 40;
  food = createVector(random(offset, width - offset), random(offset, height - offset));
}

function keyPressed() {
  var ghostX = ghost.xspeed;
  var ghostY = ghost.yspeed;
  if (keyCode === UP_ARROW) {
    if (ghostY < 1) {
      ghost.dir(0, -1);
    }
  } else if (keyCode === DOWN_ARROW) {
    if (ghostY > -1) {
      ghost.dir(0, 1);
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (ghostX > -1) {
      ghost.dir(1, 0);
    }
  } else if (keyCode === LEFT_ARROW) {
    if (ghostX < 1) {
      ghost.dir(-1, 0);
    }
  }
}

function Snake(x,y) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(0,0);
  this.position = createVector(x,y);
  this.r = snakeSize;
  this.maxspeed = 3;
  this.maxforce = 0.2;
  this.history = [];

  // Method to update location
  this.update = function() {
        var v = createVector(this.position.x,this.position.y);
    this.history.push(v);

    if (this.history.length > tailLength) {
        this.history.splice(0,1);
    }
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  };

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  };

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function(target) {

    var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force

    this.applyForce(steer);
  };

  this.reset = function() {
     tailLength = 50;
     this.history = [];
     this.position = createVector(width/2, height/2);
  }

  this.death = function() {
    var outOfBoundsX = this.position.x < 0 || this.position.x > width;
    var outOfBoundsY = this.position.y < 0 || this.position.y > height;
    if (outOfBoundsX || outOfBoundsY) {
      this.reset();
    } else {
      for (var i = 0; i < this.history.length - 10; i++) {
        var pos = this.history[i];
        var d = dist(this.position.x, this.position.y, pos.x, pos.y);
        if (d < 2) {
            this.reset();
        }
      }
    }
  }

  this.eat = function(pos) {
    var d = dist(this.position.x, this.position.y, pos.x, pos.y);
    if (d < foodDiameter) {
      tailLength += 20;
      return true;
    } else {
      return false;
    }
  }

  this.display = function() {
    // Draw a snake rotated in the direction of velocity
    var theta = this.velocity.heading() + PI/2;
    fill(0,150,150);
    noStroke();
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      var size = map(i,0,this.history.length,5,this.r);
      ellipse(pos.x, pos.y, size, size);
    }
    fill(0,150,150);
    ellipse(this.x,this.y,this.r,this.r);
    push();
    translate(this.position.x,this.position.y);
    rotate(theta);
    ellipse(0, 0, this.r, this.r);
    fill(255);
    ellipse(-this.r/5, 0, 12, 12);
    ellipse(this.r/5, 0, 12, 12);
    fill(98);
    ellipse(-this.r/5, 0, 6, 6);
    ellipse(this.r/5, 0, 6, 6);
    pop();
  };
}

function Ghost() {
  this.x = 0;
  this.y = width/2;
  this.xspeed = 5;
  this.yspeed = 0;

  this.dir = function(x, y) {
    this.xspeed = x * 5;
    this.yspeed = y * 5;
  }

  this.update = function() {

    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;

    this.x = constrain(this.x, 0, width - 20);
    this.y = constrain(this.y, 0, height - 20);
  }

  this.show = function() {
    fill(255, 0);
    noStroke();
    rect(this.x, this.y, 20, 20);
  }
}
