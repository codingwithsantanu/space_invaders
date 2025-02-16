class AudioControl {
    constructor() {
        this.newgame = document.getElementById("newgame");
        this.boom1 = document.getElementById("boom1");
        this.boom2 = document.getElementById("boom2");
        this.boom3 = document.getElementById("boom3");
        this.boom4 = document.getElementById("boom4");
        this.win = document.getElementById("win");
        this.lose = document.getElementById("lose");
        this.scream = document.getElementById("scream");
        this.slide = document.getElementById("slide");

        this.boomSounds = [
            this.boom1,
            this.boom2,
            this.boom3,
            this.boom4
        ]
    }

    play(audio) {
        audio.currentTime = 0;
        audio.play();
    }
}