class Game {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Handle window resize event.
        this.resize(window.innerWidth, window.innerHeight);
        window.addEventListener("resize", event => {
            this.resize(
                event.target.innerWidth,
                event.target.innerHeight
            );
        });

        this.enemies = [];
        this.numberOfEnemies = 10;
        this.createEnemies();

        this.score;
        this.lives;

        this.timer = 0;
        this.interval = 1000;

        // Add event listeners.
        this.mouse = {
            x: undefined,
            y: undefined,
            width: 1,
            height: 1,
            pressed: false,
            fired: false
        }

        window.addEventListener("mousedown", event => {
            this.mouse.x = event.x;
            this.mouse.y = event.y;
            this.mouse.pressed = true;
            this.mouse.fired = false;
        });

        window.addEventListener("mouseup", event => {
            this.mouse.x = event.x;
            this.mouse.y = event.y;
            this.mouse.pressed = false;
        });


        window.addEventListener('touchstart', event => {
            this.mouse.x = event.changedTouches[0].pageX;
            this.mouse.y = event.changedTouches[0].pageY;
            this.mouse.pressed = true;
            this.mouse.fired = false;
        });

        window.addEventListener('touchend', event => {
            this.mouse.x = event.changedTouches[0].pageX;
            this.mouse.y = event.changedTouches[0].pageY;
            this.mouse.pressed = false;
        });
    }

    // Main methods for handling the game mechanics.
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.width = width;
        this.height = height;

        this.score = 0;
        this.lives = 3;

        this.context.font = "50px Bangers";
        this.context.textAlign = "center";  // Aligns text horizontally.
        this.context.textBaseline = "middle"; // Aligns text vertically.
        this.context.fillStyle = "White";
        this.context.strokeStyle = "White";
        this.context.lineWidth = 1;
    }

    render(dt) {
        // console.log(this.mouse.pressed);

        this.handleEnemies(dt);
        this.enemies.forEach(enemy => {
            enemy.update();
            enemy.draw();
        });
    }


    // Helper methods for better modularity.
    createEnemies() {
        for (let i = 0; i < this.numberOfEnemies; i++) {
            this.enemies.push(new Enemy(this));
        }
    }

    handleEnemies(dt) {
        if (this.timer < this.interval) {
            this.timer += dt;
        } else {
            this.timer = 0;

            const enemy = this.getFreeEnemy();
            if (enemy)
                enemy.start();
            // console.log(enemy);
        }
    }

    getFreeEnemy() {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].free)
                return this.enemies[i];
        }
    }

    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect2.x < rect1.x + rect1.width &&
            rect1.y < rect2.y + rect2.height &&
            rect2.y < rect1.y + rect1.height
        );
    }
}


window.addEventListener("load", function() {
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");

    const game = new Game(canvas, context);
    
    // Main game loop.
    let lastTime = performance.now();
    function animate(currentTime) {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        context.clearRect(0, 0, canvas.width, canvas.height);
        game.render(deltaTime);

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});