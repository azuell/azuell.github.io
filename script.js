

function fadeSplash() {
    $(".splash-h1").fadeOut("slow");

    setTimeout(function() {
        var audio = new Audio("./assets/gameboy_startup_audio.mp3");
        audio.play();
        e = document.querySelector(".gameboy-text");
        e.style.animationPlayState = "running";
        }, 1000);
    

    setTimeout(function() {
        e.style.webkitAnimationName = '';
        e.style.animationPlayState = "paused";
        $(".splash-wrapper").fadeOut("slow");
        }, 4500);

}


