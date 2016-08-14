"use strict";
//"use asm";

/**
 * Created by ipalopezhentsev on 06/08/16.
 */
var isRunning = true;
var timerId = 1;

var particles_background;
var particles_image;
var particles_image2;
var particles_image3;
var particles_text;
var flyingText;

window.addEventListener("load", setupDrawing);
var canvas;
var ctx;
var backBuffer;
var prevFrameStart;


function setupDrawing() {
    var btnStartStop = document.getElementById("btnStartStop");
    btnStartStop.addEventListener("click", function () {
        isRunning = !isRunning;
        if (isRunning) {
            timerId = setInterval(drawFrameWithFps, 0);
            btnStartStop.textContent = "Cтоп";
        } else {
            clearInterval(timerId);
            btnStartStop.textContent = "Старт";
        }
    });

    var btnReset = document.getElementById("btnReset");
    btnReset.addEventListener("click", function () {
        document.location.reload(true);
    });


    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    prevFrameStart = Date.now();
    CANVAS_WIDTH = canvas.width;
    CANVAS_HEIGHT = canvas.height;
    backBuffer = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);

    particles_background = new ParticleSystem();
    particles_background.generateParticles_random(NUM_RANDOM_PARTICLES);

    particles_image = new ImageParticleSystem();
    particles_image.generateParticles("images/rose4_mirrored.png", 150, 0, 0, 400, 150, 1.0);

    //particles_image2 = new ImageParticleSystem();
    //particles_image2.generateParticles("images/rose4.png", 50, CANVAS_WIDTH * 2, 0, 0, 150, .5);

    particles_image3 = new ImageParticleSystem();
    particles_image3.generateParticles("images/test string.png", 50, CANVAS_WIDTH*1.5, CANVAS_HEIGHT * 2, 50, 0, 1.0);

    particles_text = new TextParticleSystem();
    particles_text.generateParticles("МАМА И ПАПА");

    //flyingText = new FlyingText("С днём рождения, Настя!!!", 0.0, 100.0, 150.0, 150.0);
    flyingText = new FlyingText("one\ntwo\n", 600.0, 0.0, -150.0, 150.0);

    timerId = setInterval(drawFrameWithFps, 0);
}

function drawFrameWithFps() {
    var frameStart = Date.now();
    var dt = (frameStart - prevFrameStart) / 1000.0;

    drawFrame(dt);

    var fps = Math.round(1.0 / dt);
    drawFps(fps);
    prevFrameStart = frameStart;
}

function drawFps(fps) {
    ctx.font = "bold 14px sans-serif";
    ctx.lineWidth = 2;
    ctx.fillStyle = "orange";
    ctx.fillText("FPS: " + fps, 10, canvas.height - 10);
}

function clearBuffer_slow(backBuffer, r, g, b, a) {
    var data = backBuffer.data;
    var len = data.length | 0;
    for (var idx = 0 | 0; idx < len;) {
        data[idx++] = r;
        data[idx++] = g;
        data[idx++] = b;
        data[idx++] = a;
    }
}

function clearBuffer(backBuffer, r, g, b, a) {
    "use asm";
    var data = new Uint32Array(backBuffer.data, 0 | 0, backBuffer.data.length | 0);
    var rgba = r << 24 | 0 | g << 16 | 0 | b << 8 | 0 | a;
    var len = data.length | 0;
    //data.fill(rgba);
    for (var idx = 0 | 0; idx < len; idx++) {
        data[idx] = rgba;
    }
}



function drawFrame(dt) {
    //clearBuffer(backBuffer, 0|0, 0|0, 0|0, 255|0);
    clearBuffer_slow(backBuffer, 0 | 0, 0 | 0, 0 | 0, 255 | 0);

    if (dt < MAX_DT) {
        particles_background.updateParticles(dt);
        particles_image.updateParticles(dt);
        //particles_image2.updateParticles(dt);
        particles_image3.updateParticles(dt);
        //particles_text.updateParticles(dt);
        flyingText.update(dt);
    }

    particles_background.drawParticles(backBuffer);
    particles_image.drawParticles(backBuffer);
    //particles_image2.drawParticles(backBuffer);
    particles_image3.drawParticles(backBuffer);
    //particles_text.drawParticles(backBuffer);
    ctx.putImageData(backBuffer, 0, 0);
    flyingText.draw(ctx);
}
