class Enemy {
    constructor(game) {
        this.game = game;
        
        this.x;
        this.y;

        const sizeModifier = Math.random() * 0.6 + 0.7;

        this.spriteWidth = 100;
        this.spriteHeight = 100;
        this.width = this.spriteWidth * sizeModifier;
        this.height = this.spriteHeight * sizeModifier;

        this.speedX = 0;
        this.speedY = Math.random() * 2 + 0.2;

        this.free = true;
        this.lives;

        this.image = null;
        this.frameX;
        this.frameY;
        this.lastFrame;
        this.minFrame;
        this.maxFrame;
    }

    // Methods for Object Pool.
    start() {
        this.free = false;
        this.lives = 2;

        this.x = Math.random() * this.game.width;
        this.y = -this.height;

        this.frameX = 0
        this.frameY = Math.floor(Math.random() * 4);
    }

    reset() {
        this.free = true;
    }

    
    // Main methods for managing enemies.
    update(dt) {
        if (this.free)
            return;

        // Add floating entry animation.
        if (this.y < 0)
            this.y += 5;

        // Make sure the enemy is always visible.
        if (this.x > this.game.width - this.width)
            this.x = this.game.width - this.width;

        // Update game variables.
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y > this.game.height) {
            this.reset();
            if (!this.game.gameOver)
                this.game.lives--;
        }

        if (!this.isAlive() && this.game.spriteUpdate) {
            this.frameX++;
            if (this.frameX > this.lastFrame) {
                this.reset();
                if (!this.game.gameOver)
                    this.game.score++;
            }
        }
    }

    draw() {
        if (this.free)
            return;

        if (this.image !== null) {
            this.game.context.drawImage(
                this.image,

                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
        
        if (!this.game.debug)
            return;

        // this.game.context.fillStyle = "Red";
        this.game.context.strokeRect(
            this.x, this.y,
            this.width, this.height
        );
 
        // this.game.context.fillStyle = "Blue";
        this.game.context.fillText(
            this.lives,
            this.x + this.width / 2,
            this.y + this.height / 2
        );
    }


    // Helper methods for better modularity.
    isAlive() {
        return this.lives >= 1;
    }

    checkCollision() {
        if (this.game.checkCollision(this, this.game.mouse) && this.game.mouse.pressed && !this.game.mouse.fired) {
            this.lives--;
            this.game.mouse.fired = true;
            // this.reset();
        }
    }
}


// DIFFERENT ENEMY STATES.
class EnemyState {
    constructor(game, enemy) {
        this.game = game;
        this.enemy = enemy;
    }
}

class Flying extends EnemyState {
    start() {
        this.enemy.minFrame = 0;
        this.enemy.maxFrame = 2;
        this.enemy.frameX = this.enemy.minFrame;

        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.enemy.checkCollision();
        this.enemy.handleAnimation();
    }
}

class Plasing extends EnemyState {
    start() {
        this.enemy.minFrame = 3;
        this.enemy.maxFrame = 5;
        this.enemy.frameX = this.enemy.minFrame;

        this.speedX = 0;
        this.speedY = 2;
    }

    update() {
        this.enemy.handleAnimation();
        if (this.game.checkCollision(this.enemy, this.game.mouse) && this.game.mouse.pressed) {
            this.enemy.y += 25;
        }
    }
}

class Imploding extends EnemyState {
    start() {
        this.enemy.minFrame = 6;
        this.enemy.maxFrame = this.enemy.lastFrame;
        this.enemy.frameX = this.enemy.minFrame;
    }

    update() {}
    // NOTE: When it is destroyed, the frames are handled
    // ....  directly though generic Enemy class and there
    // ....  is no need for detecting collisions.
}


// DIFFERENT ENEMY TYPES.
class BeetleMorph extends Enemy {
    constructor(game) {
        super(game);
        
        this.image = document.getElementById("beetlemorph");
        this.lastFrame = 3;

        this.speedX = 0;
        this.speedY = Math.random() * 2 + 0.2;
    }

    start() {
        super.start();

        this.lives = 1;
    }

    update() {
        super.update();

        if (this.free)
            return;

        if (this.isAlive()) {
            this.checkCollision();
        }
    }
}


class LobsterMorph extends Enemy {
    constructor(game) {
        super(game);
        
        this.image = document.getElementById("lobstermorph");
        this.lastFrame = 14;

        this.speedX = 0;
        this.speedY = Math.random() * 0.5 + 0.2;
    }

    start() {
        super.start();

        this.lives = 3;
    }

    update() {
        super.update();

        if (this.free)
            return;

        if (this.lives >= 3) {
            this.maxFrame = 0;
        } else if (this.lives >= 2) {
            this.maxFrame = 3;
        } else if (this.lives === 1) {
            this.maxFrame = 7;
        }

        if (this.isAlive()) {
            this.checkCollision();

            if (this.frameX < this.maxFrame && this.game.spriteUpdate) {
                this.frameX++;
            }
        }
    }
}


class PhantomMorph extends Enemy {
    constructor(game) {
        super(game);

        this.image = document.getElementById("phantommorph");
        
        this.lastFrame = 14;

        this.currentState;
        this.states = [
            new Flying(game, this),
            new Plasing(game, this),
            new Imploding(game, this)
        ];

        this.switchTimer = 0;
        this.switchInterval = Math.random() * 2000 + 1000;
    }
    
    start() {
        super.start();
        
        this.lives = 1;
        
        const randomState = Math.floor(Math.random() * 2);
        this.setState(randomState);
    }

    update(dt) {
        super.update(dt);

        if (this.free)
            return;
        
        this.currentState.update();

        if (this.x <= 0 || this.x >= this.game.width - this.width) {
            this.speedX *= -1;
        }

        if (this.isAlive()) {
            if (this.switchTimer < this.switchInterval) {
                this.switchTimer += dt;
            } else {
                this.switchTimer = 0;
                this.switch();
            }
        }
    }

    checkCollision() {
        super.checkCollision();
        if (!this.isAlive())
            this.setState(2);
    }

    handleAnimation() {
        if (this.game.spriteUpdate) {
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = this.minFrame;
            }
        }
    }

    setState(stateIndex) {
        this.currentState = this.states[stateIndex];
        this.currentState.start();
    }

    switch() {
        if (this.currentState === this.states[0]) {
            this.setState(1);
        } else if (this.currentState === this.states[1]) {
            this.setState(0);
        }
    }
}