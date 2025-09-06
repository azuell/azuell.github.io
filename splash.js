// Amy Zuell 2025
// Fades out the intro splash screen "Tap to Enter" and Gameboy inspired loading screen

var displaySplash = true;

function fadeSplash() {
    
    if (displaySplash) {
        $(".splash-text").fadeOut("slow");

        setTimeout(function() {
            var audio = new Audio("./assets/audio/gameboy_startup_audio.mp3");
            audio.play();
            document.querySelector(".gb-wrapper").style.display = "flex";
            document.querySelector(".gameboy-text").style.animationPlayState = "running";
        }, 1000);
        

        setTimeout(function() {
            document.querySelector(".gameboy-text").style.webkitAnimationName = '';
            document.querySelector(".gameboy-text").style.animationPlayState = "paused";
            $(".splash-wrapper").fadeOut("slow");
            document.querySelector(".splash-wrapper").style.zIndex = 0;
        }, 4500);
        
        displaySplash = false;
    }
}