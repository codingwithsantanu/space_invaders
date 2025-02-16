class Enemy {
    constructor(game) {
        this.game = game;
        
        this.x;
        this.y;

        this.width = 50;
        this.height = 50;

        this.speedX = 0;
        this.speedY = Math.random() * 2 + 0.2;

        this.free = true;
        this.lives;
    }

    // Methods for Object Pool.
    start() {
        this.free = false;
        this.lives = 2;

        this.x = Math.random() * this.game.width;
        this.y = -this.height;
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
        }

        // Check for collisions
        if (this.game.checkCollision(this, this.game.mouse) && this.game.mouse.pressed && !this.game.mouse.fired) {
            this.lives--;
            this.game.mouse.fired = true;
            // this.reset();
        }

        if (!this.isAlive()) {
            this.reset();
        }
    }

    draw() {
        if (this.free)
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
}