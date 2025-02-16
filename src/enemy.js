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
    update() {
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


// DIFFERENT ENEMY TYPES.
class BeetleMorph extends Enemy {
    constructor(game) {
        super(game);
        
        this.image = document.getElementById("beetlemorph");

        this.speedX = 0;
        this.speedY = Math.random() * 2 + 0.2;
    }

    start() {
        super.start();

        this.lives = 1;
        this.lastFrame = 3;
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