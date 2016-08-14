"use strict";

/**
 * Created by ipalopezhentsev on 12/08/16.
 */
function ImageParticleSystem() {
    var NUM_RAW_PARTICLE_PROPERTIES_IMAGE = 10;
    var NUM_PARTICLE_PROPERTIES_IMAGE = 6;
    var IDX_X_IMAGE = 0;
    var IDX_Y_IMAGE = 1;
    var IDX_VX_IMAGE = 2;
    var IDX_VY_IMAGE = 3;
    var IDX_ORIG_X_IMAGE = 4;
    var IDX_ORIG_Y_IMAGE = 5;

    var NUM_COLORS_PER_PARTICLE = 4;
    var IDX_COLOR_R = 0;
    var IDX_COLOR_G = 1;
    var IDX_COLOR_B = 2;
    var IDX_COLOR_A = 3;

    var nParticles = 0;
    var particlesProps = new Float64Array(100);
    var particlesColors = new Uint8ClampedArray(100);

    this.generateParticles = function (filename, brightnessThreshold,
                                       source_origin_x, source_origin_y,
                                       target_origin_x, target_origin_y,
                                       scale_src) {
        var tmpCanvas = document.createElement("canvas");
        var tmpImg = document.createElement("img");
        var parseImgData = function () {
            tmpCanvas.width = tmpImg.width;
            tmpCanvas.height = tmpImg.height;
            var tmpCtx = tmpCanvas.getContext("2d");
            tmpCtx.drawImage(tmpImg, 0, 0, tmpImg.width * scale_src, tmpImg.height * scale_src);


            var particles = [];

            var imgDataObj = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
            var imgData = imgDataObj.data;

            var curX = 0;
            var curY = 0;
            for (var idxSrcData = 0; idxSrcData < imgData.length;) {
                var r = imgData[idxSrcData++];
                var g = imgData[idxSrcData++];
                var b = imgData[idxSrcData++];
                var a = imgData[idxSrcData++];
                var brightness = r + g + b;
                curX++;
                if (curX == imgDataObj.width) {
                    curX = 0;
                    curY++;
                }
                if (brightness > brightnessThreshold) {
                    var orig_x = curX + target_origin_x;
                    var orig_y = curY + target_origin_y;
                    var x = (CANVAS_WIDTH / 2.0) + 2.0 * CANVAS_WIDTH * (Math.random() - 1.0);
                    var y = (CANVAS_HEIGHT / 2.0) + 2.0 * CANVAS_HEIGHT * (Math.random() - 1.0);
                    x += source_origin_x;
                    y += source_origin_y;
                    var dist = Math.sqrt(Math.pow(orig_x - x, 2) + Math.pow(orig_y - y, 2));
                    var vx = 100 * (orig_x - x) / dist;
                    var vy = 100 * (orig_y - y) / dist;
                    particles.push(x, y, vx, vy, orig_x, orig_y, r, g, b, a);
                }
            }


            nParticles = particles.length / NUM_RAW_PARTICLE_PROPERTIES_IMAGE;
            console.log("image particles count: " + nParticles);

            particlesProps = new Float64Array(nParticles * NUM_PARTICLE_PROPERTIES_IMAGE);
            particlesColors = new Uint8ClampedArray(nParticles * NUM_COLORS_PER_PARTICLE);
            for (var idxParticle = 0, idxSrcRaw = 0; idxParticle < nParticles; idxParticle++) {
                var idxPropsRaw = idxParticle * NUM_PARTICLE_PROPERTIES_IMAGE;
                particlesProps[idxPropsRaw + IDX_X_IMAGE] = particles[idxSrcRaw++];
                particlesProps[idxPropsRaw + IDX_Y_IMAGE] = particles[idxSrcRaw++];
                particlesProps[idxPropsRaw + IDX_VX_IMAGE] = particles[idxSrcRaw++];
                particlesProps[idxPropsRaw + IDX_VY_IMAGE] = particles[idxSrcRaw++];
                particlesProps[idxPropsRaw + IDX_ORIG_X_IMAGE] = particles[idxSrcRaw++];
                particlesProps[idxPropsRaw + IDX_ORIG_Y_IMAGE] = particles[idxSrcRaw++];

                var idxColorsRaw = idxParticle * NUM_COLORS_PER_PARTICLE;
                particlesColors[idxColorsRaw + IDX_COLOR_R] = particles[idxSrcRaw++];
                particlesColors[idxColorsRaw + IDX_COLOR_G] = particles[idxSrcRaw++];
                particlesColors[idxColorsRaw + IDX_COLOR_B] = particles[idxSrcRaw++];
                particlesColors[idxColorsRaw + IDX_COLOR_A] = particles[idxSrcRaw++];
            }
        };
        tmpImg.addEventListener("load", parseImgData);
        tmpImg.src = filename;
    };

    this.updateParticles = function (dt) {
        var len = nParticles * NUM_PARTICLE_PROPERTIES_IMAGE;
        for (var idxRaw = 0; idxRaw < len; idxRaw += NUM_PARTICLE_PROPERTIES_IMAGE) {
            var x = particlesProps[idxRaw + IDX_X_IMAGE];
            var y = particlesProps[idxRaw + IDX_Y_IMAGE];
            var vx = particlesProps[idxRaw + IDX_VX_IMAGE];
            var vy = particlesProps[idxRaw + IDX_VY_IMAGE];
            var orig_x = particlesProps[idxRaw + IDX_ORIG_X_IMAGE];
            var orig_y = particlesProps[idxRaw + IDX_ORIG_Y_IMAGE];
            x += dt * vx;
            y += dt * vy;
            if (Math.abs(x - orig_x) + Math.abs(y - orig_y) < EPS_CLOSE) {
                x = orig_x;
                vx = 0.0;
                y = orig_y;
                vy = 0.0;
            }
            particlesProps[idxRaw + IDX_X_IMAGE] = x;
            particlesProps[idxRaw + IDX_Y_IMAGE] = y;
            particlesProps[idxRaw + IDX_VX_IMAGE] = vx;
            particlesProps[idxRaw + IDX_VY_IMAGE] = vy;
        }
    };

    this.drawParticles = function (backBuffer) {
        "use asm";
        var lenPropsRaw = (nParticles * NUM_PARTICLE_PROPERTIES_IMAGE) | 0;
        var outData = backBuffer.data;
        for (var idxPropsRaw = 0|0, idxColorRaw = 0|0; idxPropsRaw < lenPropsRaw;) {
            var x = (particlesProps[idxPropsRaw++])|0;
            var y = (particlesProps[idxPropsRaw])|0;
            idxPropsRaw += 5|0;
            if (x < 0|0 || x >= CANVAS_WIDTH|0 || y < 0|0 || y >= CANVAS_HEIGHT|0) {
                idxColorRaw += NUM_COLORS_PER_PARTICLE|0;
                continue;
            }
            var idxOutBufferRaw = ((CANVAS_WIDTH|0) * y + x) << 2|0;
            outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++]|0;
            outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++]|0;
            outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++]|0;
            outData[idxOutBufferRaw] = particlesColors[idxColorRaw++]|0;
        }
    };
}