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

        this.debug = false;

        this.score = 0;
        this.winningScore = 20;
        this.lives = 0;
        this.gameOver = true;

        this.message1 = "RUN!";
        this.message2 = "Or Get Eaten!";
        this.message3 = `Press "Enter" or Click "R" To Start!`;

        this.enemyTimer = 0;
        this.enemyInterval = 1000;

        this.animationTimer = 0;
        this.animationInterval = 120;
        this.spriteUpdate = false;

        // this.crewImage = document.getElementById("crew");
        this.crewImage = document.getElementById("crewSprite");
        this.crewMembers = [];

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


        // Add event listeners for buttons and start functionality.
        const resetButton = document.getElementById("resetButton");
        const fullScreenButton = document.getElementById("fullScreenButton");

        resetButton.addEventListener("click", event => {
            this.start();
        });

        window.addEventListener("keydown", event => {
            if (event.key.toLowerCase() === 'r' || event.key === "Enter") {
                this.start();
            } else if (event.key === ' ' || event.key.toLowerCase() === 'f') {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            } else if (event.key.toLowerCase() === 'd') {
                this.debug = !this.debug;
            }
        });

        fullScreenButton.addEventListener("click", event => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    }

    // Main methods for handling the game mechanics.
    start() {
        this.score = 0;
        this.lives = 5;
        this.gameOver = false;
        this.generateCrewMembers();

        this.enemies.forEach(enemy => {
            enemy.reset();
            // NOTE: This resets enemies from the previous match.
            // ....  If we skip this, enemies will stay in the same position.
        });

        for (let i = 0; i < 2; i++) {
            const enemy = this.getFreeEnemy();
            if (enemy) {
                enemy.start();
            }
        }
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.width = width;
        this.height = height;

        this.context.font = "30px Bangers";
        this.context.textAlign = "center";  // Aligns text horizontally.
        this.context.textBaseline = "middle"; // Aligns text vertically.
        this.context.fillStyle = "White";
        this.context.strokeStyle = "White";
        this.context.lineWidth = 1;
    }

    render(dt) {
        this.handleAnimationTimer(dt);

        if (!this.gameOver) {
            this.handleEnemies(dt);

            for (let i = this.enemies.length - 1; i >= 0; i--) {
                this.enemies[i].update();
            }

            this.enemies.forEach(enemy => {
                enemy.draw();
            });
        }

        this.drawStatusText();
    }

    drawStatusText() {
        this.context.save();

        this.context.textAlign = "left";
        this.context.fillText(`Score: ${this.score}`, 20, 40);

        for (let i = 0; i < this.lives; i++) {
            // this.context.fillRect(20 + (15 * i), 60, 10, 30);
            // this.context.drawImage(this.crewImage, 20 + (20 * i), 70, 15, 30);
            
            const width = 20;
            const height = 45;

            this.context.drawImage(
                this.crewImage,

                width * this.crewMembers[i].frameX,
                height * this.crewMembers[i].frameY,
                width,
                height,

                20 + (20 * i),
                70,
                width,
                height
            );
        }

        if (this.lives < 1 || this.score >= this.winningScore) {
            this.triggerGameOver();
        }

        if (this.gameOver) {
            this.context.textAlign = "center";
            this.context.font = "80px Bangers";
            
            this.context.fillText(
                this.message1,
                this.width / 2.0,
                this.height / 2.0 - 25
            );

            this.context.font = "20px Bangers";

            this.context.fillText(
                this.message2,
                this.width / 2.0,
                this.height / 2.0 + 25
            );

            this.context.fillText(
                this.message3,
                this.width / 2.0,
                this.height / 2.0 + 50
            );
        }
        
        this.context.restore();
    }


    // Helper methods for better modularity.
    createEnemies() {
        for (let i = 0; i < this.numberOfEnemies; i++) {
            const randomNumber = Math.random();
            if (randomNumber < 0.6) {
                this.enemies.push(new BeetleMorph(this));
            } else {
                this.enemies.push(new LobsterMorph(this));
            }
        }
    }

    handleEnemies(dt) {
        if (this.enemyTimer < this.enemyInterval) {
            this.enemyTimer += dt;
        } else {
            this.enemyTimer = 0;

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

    triggerGameOver() {
        if (!this.gameOver) {
            this.gameOver = true;

            this.message1 = "Aargh!";
            this.message2 = "The crew was eaten!";

            if (this.score >= this.winningScore) {
                this.message1 = "Well done!";
                this.message2 = "You escaped the swarm!";
            }
        }
    }

    handleAnimationTimer(dt) {
        if (this.animationTimer < this.animationInterval) {
            this.animationTimer += dt;
            this.spriteUpdate = false;
        } else {
            this.animationTimer = 0;
            this.spriteUpdate = true;
        }
    }

    generateCrewMembers() {
        this.crewMembers = [];
        for (let i = 0; i < this.lives; i++) {
            this.crewMembers.push({
                frameX: Math.floor(Math.random() * 5),
                frameY: Math.floor(Math.random() * 5)
            });
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