// azuell 
// Fades out the intro splash screen "Tap to Enter" and Gameboy inspired loading screen
// r2.20260404 - addressed scrollbar issues


var displaySplash = true;

function preventScroll(e) {
    e.preventDefault();
}

if (sessionStorage.getItem("splash-seen")) {
    document.querySelector(".splash-wrapper").style.display = "none";
    document.body.classList.remove("no-scroll");
    setTimeout(() => window.dispatchEvent(new Event("splash-done")), 100);
} else {
    document.body.classList.add("no-scroll");
    window.addEventListener("wheel", preventScroll, {passive: false});
    window.addEventListener("touchmove", preventScroll, { assive: false});
}


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
            document.body.classList.remove("no-scroll");
            window.removeEventListener("wheel", preventScroll);
            window.removeEventListener("touchmove", preventScroll);
            
            sessionStorage.setItem("splash-seen", "true");
            
            window.dispatchEvent(new Event("splash-done"));

        }, 4500);
        
        displaySplash = false;
    }
}