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
        this.numberOfEnemies = 50;
        this.createEnemies();

        this.timer = 0;
        this.interval = 1000;
    }

    // Main methods for handling the game mechanics.
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.width = width;
        this.height = height;
    }

    render(dt) {
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
            console.log(enemy);
        }
    }

    getFreeEnemy() {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].free)
                return this.enemies[i];
        }
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