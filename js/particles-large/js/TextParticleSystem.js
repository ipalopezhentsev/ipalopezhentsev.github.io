"use strict";

/**
 * Created by ipalopezhentsev on 12/08/16.
 */
function TextParticleSystem() {
    var NUM_RAW_PARTICLE_PROPERTIES_TEXT = 8;
    var NUM_PARTICLE_PROPERTIES_TEXT = 4;
    var IDX_X_TEXT = 0;
    var IDX_Y_TEXT = 1;
    var IDX_VX_TEXT = 2;
    var IDX_VY_TEXT = 3;
    var NUM_COLORS_PER_PARTICLE = 4;
    var IDX_COLOR_R = 0;
    var IDX_COLOR_G = 1;
    var IDX_COLOR_B = 2;
    var IDX_COLOR_A = 3;

    var nParticles;
    var particlesProps = new Float64Array(100);
    var particlesColors = new Uint8ClampedArray(100);

    this.generateParticles = function (text) {
        var tmpCanvas = document.createElement("canvas");
        var tmpCtx = tmpCanvas.getContext("2d");

        tmpCtx.font = "50px serif";
        //tmpCtx.lineWidth = 2;
        var txtSize = tmpCtx.measureText(text);
        tmpCanvas.width = Math.floor(txtSize.width + 0.5);
        tmpCanvas.height = 150;
        //after resizing canvas, context gets lost...
        tmpCtx = tmpCanvas.getContext("2d");

        tmpCtx.fillStyle = "rgba(0,0,0,1)";
        tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);


        tmpCtx.font = "50px serif";
        tmpCtx.fillStyle = "rgba(255,200,0,1)";
        //tmpCtx.strokeStyle = "rgba(255,200,0,1)";

        tmpCtx.fillText(text, 0, tmpCanvas.height - 5);
        //tmpCtx.beginPath();
        //tmpCtx.strokeText(text, 0, tmpCanvas.height);
        //tmpCtx.closePath();

        var particles = [];
        var imgDataObj = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
        var imgData = imgDataObj.data;

        var x = 0;
        var y = 0;
        for (var idxSrcData = 0; idxSrcData < imgData.length; idxSrcData += 4) {
            var r = imgData[idxSrcData];
            var g = imgData[idxSrcData + 1];
            var b = imgData[idxSrcData + 2];
            var a = imgData[idxSrcData + 3];
            var brightness = r + g + b;
            x++;
            if (x == imgDataObj.width) {
                x = 0;
                y++;
            }
            if (brightness > TEXT_BRIGHTNESS_THRESHOLD) {
                var vx = 50 + Math.random() * 1E-5;
                var vy = 50 + Math.random() * 1E-5;
                particles.push(x, y, vx, vy, r, g, b, a);
            }
        }

        nParticles = particles.length / NUM_RAW_PARTICLE_PROPERTIES_TEXT;
        console.log("Text particles count: " + nParticles);






        particlesProps = new Float64Array(nParticles * NUM_PARTICLE_PROPERTIES_TEXT);
        particlesColors = new Uint8ClampedArray(nParticles * NUM_COLORS_PER_PARTICLE);
        for (var idxParticle = 0, idxSrcRaw=0; idxParticle < nParticles; idxParticle++) {
            var idxPropsRaw = idxParticle * NUM_PARTICLE_PROPERTIES_TEXT;
            particlesProps[idxPropsRaw + IDX_X_TEXT] = particles[idxSrcRaw++];
            particlesProps[idxPropsRaw + IDX_Y_TEXT] = particles[idxSrcRaw++];
            particlesProps[idxPropsRaw + IDX_VX_TEXT] = particles[idxSrcRaw++];
            particlesProps[idxPropsRaw + IDX_VY_TEXT] = particles[idxSrcRaw++];

            var idxColorsRaw = idxParticle * NUM_COLORS_PER_PARTICLE;
            particlesColors[idxColorsRaw + IDX_COLOR_R] = particles[idxSrcRaw++];
            particlesColors[idxColorsRaw + IDX_COLOR_G] = particles[idxSrcRaw++];
            particlesColors[idxColorsRaw + IDX_COLOR_B] = particles[idxSrcRaw++];
            particlesColors[idxColorsRaw + IDX_COLOR_A] = particles[idxSrcRaw++];
        }
    };

    this.updateParticles = function (dt) {
        var len = nParticles * NUM_PARTICLE_PROPERTIES_TEXT;
        for (var idxRaw = 0; idxRaw < len; idxRaw += NUM_PARTICLE_PROPERTIES_TEXT) {
            var x = particlesProps[idxRaw + IDX_X_TEXT];
            var y = particlesProps[idxRaw + IDX_Y_TEXT];
            var vx = particlesProps[idxRaw + IDX_VX_TEXT];
            var vy = particlesProps[idxRaw + IDX_VY_TEXT];
            x += dt * vx;
            y += dt * vy;
            if (x < 0 || x >= CANVAS_WIDTH) {
                vx = -vx;
                x += dt * vx;
                x += dt * vx;
            }
            if (y < 0 || y >= CANVAS_HEIGHT) {
                vy = -vy;
                y += dt * vy;
                y += dt * vy;
            }
            particlesProps[idxRaw + IDX_X_TEXT] = x;
            particlesProps[idxRaw + IDX_Y_TEXT] = y;
            particlesProps[idxRaw + IDX_VX_TEXT] = vx;
            particlesProps[idxRaw + IDX_VY_TEXT] = vy;
        }
    };

    this.drawParticles = function(backBuffer) {
        var lenPropsRaw = nParticles * NUM_PARTICLE_PROPERTIES_TEXT;
        var lenColorsRaw = nParticles * NUM_COLORS_PER_PARTICLE;
        var outData = backBuffer.data;
        for (var idxPropsRaw = 0, idxColorRaw = 0; idxPropsRaw < lenPropsRaw && idxColorRaw < lenColorsRaw;) {
            var x = Math.round(particlesProps[idxPropsRaw++]);
            var y = Math.round(particlesProps[idxPropsRaw++]);
            idxPropsRaw += 2;
            if (x < 0 || x >= CANVAS_WIDTH || y < 0 || y >= CANVAS_HEIGHT) {
                //TODO: i see some particles have negative coords....
                idxColorRaw+=NUM_COLORS_PER_PARTICLE;
                continue;
            }
            var idxOutBufferRaw = (CANVAS_WIDTH * y + x) << 2;
            outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++];
            outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++];
            outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++];
            outData[idxOutBufferRaw] = particlesColors[idxColorRaw++];
        }
    };
}