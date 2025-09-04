// Original script by Anastasia Beasley, modified by Amy Zuell for website

// Grab canvas objects
const canvas = document.getElementById("mouseCanvas");
const ctx = canvas.getContext("2d");

// Make canvas match viewport
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Position and state
let pos = {x: canvas.width - 60, y: canvas.height - 40}; // Start bottom-right-ish
let target = {x: pos.x, y: pos.y};
let state = "run"; // 'run' | 'jump' | 'solder'
let facing = 1;    // 1 = right, -1 = left

// Animation timing
let frameIndex = 0;
let frameTimer = 0;
const frameDuration = {run: 80, jump: 70, solder: 120}; // ms per frame

// Movement and thresholds
const speed = 220;          // px/s when running
const arriveThreshold = 40; // Start jump when this close
const escapeThreshold = 48; // Stop soldering when cursor moves away
const jumpHeight = 40;      // Visual hop height
const jumpLength = 16;      // Visual hop length

// Jump interpolation
let jumpStart = null;
let jumpTarget = null;

// Load images
function loadImages(name, number) {
    return new Promise((resolve, reject) => {
        const imgs = new Array(number);
        for (let i = 0; i < number; i++) {
            const img = new Image();
            img.onerror = () => {
                reject(new Error("Failed to load " + paths[i]));
            };
            img.src = "./assets/mouseme/" + name + (i+1).toString() + ".png";
            imgs[i] = img;
        }
        resolve(imgs);
    });
}

let runFrames, jumpFrames, solderFrames;

// Cursor tracking
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    target.x = e.clientX - rect.left;
    target.y = e.clientY - rect.top;
});

// Update animation state
function setState(next) {
    if (state !== next) {
        state = next;
        frameIndex = 0;
        frameTimer = 0;
        if (next === 'jump') {
            jumpStart = {x: pos.x, y: pos.y};

            facing = (target.x+jumpLength - jumpStart.x) >= 0 ? -1 : 1;
            if (facing == -1) {
                jumpTarget = {x: target.x - jumpLength, y: target.y + jumpLength} // Different landing point if facing right
            } else {
                jumpTarget = {x: target.x + jumpLength, y: target.y + jumpLength}; // Lock landing point
            }
        }
    }
}

function update(now) {
    requestAnimationFrame(update);
    update.lastTime ??= now;
    const dt = Math.min((now - update.lastTime) / 1000, 0.033);
    update.lastTime = now;

    // Movement
    const dx = target.x - pos.x;
    const dy = target.y - pos.y;
    const dist = Math.hypot(dx, dy);

    if (state === 'run') {
        if (dist > 1) {
            facing = dx >= 0 ? -1 : 1;
            pos.x += (dx / dist) * speed * dt;
            pos.y += (dy / dist) * speed * dt;
        }
        if (dist <= arriveThreshold) setState('jump');
    } else if (state === 'jump') {
        const total = Math.max(1, (jumpFrames.length - 1));
        const progress = Math.min(frameIndex / total, 1);
        pos.x = jumpStart.x + (jumpTarget.x - jumpStart.x) * progress;
        pos.y = jumpStart.y + (jumpTarget.y - jumpStart.y) * progress;
        if (frameIndex >= jumpFrames.length - 1) setState('solder');
    } else if (state === 'solder') {
        if (dist > escapeThreshold) setState('run');
    }

    // Advance animation frame
    frameTimer += dt * 1000;
    const frames = state === 'run' ? runFrames : state === 'jump' ? jumpFrames : solderFrames;
    const dur = frameDuration[state];

    while (frameTimer >= dur) {
        frameTimer -= dur;
        frameIndex++;
        if (state === "jump") {
            if (frameIndex >= frames.length) frameIndex = frames.length - 1; // Hold on last frame
        } else {
        if (frameIndex >= frames.length) frameIndex = 0; // Loop run/solder
        }
    }

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = frames[Math.min(frameIndex, frames.length - 1)];
    if (!img) return;

    let yOffset = 0;
    if (state === "jump") {
        const p = (frameIndex) / Math.max(1, (jumpFrames.length - 1));
        yOffset = -Math.sin(p * Math.PI) * jumpHeight;
    }

    ctx.save();
    ctx.translate(pos.x, pos.y + yOffset);
    if (facing === -1) ctx.scale(-1, 1);
    const w = img.width, h = img.height;
    ctx.drawImage(img, -w/2 , -h); // Centre on x, Feet at pos.y
    ctx.restore();
}

// Load assets and start (4 run, 8 jump, 7 solder)
Promise.all([loadImages("run", 4), loadImages("jump", 8), loadImages("solder", 7)]).then(([r, j, s]) => {
    runFrames = r; jumpFrames = j; solderFrames = s;
    requestAnimationFrame(update);
}).catch(err => console.error(err));
