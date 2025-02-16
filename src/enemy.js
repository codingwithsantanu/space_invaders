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
    }

    // Methods for Object Pool.
    start() {
        this.free = false;

        this.x = Math.random() * this.game.width;
        this.y = -this.height;
    }

    reset() { this.free = true;  }

    
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

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y > this.game.height) {
            this.reset();
        }
    }

    draw() {
        if (this.free)
            return;
        
        this.game.context.fillStyle = "Red";
        this.game.context.fillRect(
            this.x, this.y,
            this.width, this.height
        );
    }
}